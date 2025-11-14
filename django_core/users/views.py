from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import re


@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(["POST"]) 
@permission_classes([AllowAny])
def register(request):
    data = request.data or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return Response({"detail": "username e password são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

    # Política de senha: mínimo 8 caracteres, pelo menos 1 número e 1 caractere especial
    if len(password) < 8 or not re.search(r"\d", password) or not re.search(r"[^A-Za-z0-9]", password):
        return Response({
            "detail": "Senha deve ter pelo menos 8 caracteres, incluir número e caractere especial."
        }, status=status.HTTP_400_BAD_REQUEST)

    User = get_user_model()
    if User.objects.filter(username=username).exists():
        return Response({"detail": "username já existe"}, status=status.HTTP_400_BAD_REQUEST)
    if email and User.objects.filter(email=email).exists():
        return Response({"detail": "email já existe"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(username=username, email=email, role="ALUNO")
    user.set_password(password)
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserSerializer(user).data,
    }, status=status.HTTP_201_CREATED)