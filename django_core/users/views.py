from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import re
from .models import Profile


@api_view(["GET", "PATCH"]) 
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    if request.method == "GET":
        return Response(UserSerializer(user).data)

    # PATCH: atualizar dados básicos do usuário
    data = request.data or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    document_id = (data.get("document_id") or "").strip()
    address = (data.get("address") or "").strip()
    preferences = data.get("preferences") or None

    User = get_user_model()
    # Garantir unicidade de username/email se foram enviados
    if username and username != user.username and User.objects.filter(username=username).exists():
        return Response({"detail": "username já existe"}, status=status.HTTP_400_BAD_REQUEST)
    if email and email != (user.email or "") and User.objects.filter(email=email).exists():
        return Response({"detail": "email já existe"}, status=status.HTTP_400_BAD_REQUEST)

    if username:
        user.username = username
    if email:
        user.email = email
    if phone is not None:
        user.phone = phone or None
    if document_id is not None:
        user.document_id = document_id or None
    user.save()

    # Atualizar endereço nas preferências do perfil (campo JSON)
    profile, _ = Profile.objects.get_or_create(user=user)
    prefs = dict(profile.preferences or {})
    if address is not None:
        prefs["address"] = address
    if isinstance(preferences, dict):
        prefs.update(preferences)
    profile.preferences = prefs
    profile.save()

    return Response(UserSerializer(user).data)


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


@api_view(["POST"]) 
@permission_classes([IsAuthenticated])
def change_password(request):
    data = request.data or {}
    old_password = data.get("old_password") or ""
    new_password = data.get("new_password") or ""

    if not old_password or not new_password:
        return Response({"detail": "old_password e new_password são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not user.check_password(old_password):
        return Response({"detail": "Senha atual incorreta"}, status=status.HTTP_400_BAD_REQUEST)

    # Política de senha semelhante ao register
    if len(new_password) < 8 or not re.search(r"\d", new_password) or not re.search(r"[^A-Za-z0-9]", new_password):
        return Response({
            "detail": "Senha deve ter pelo menos 8 caracteres, incluir número e caractere especial."
        }, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"detail": "Senha alterada com sucesso"}, status=status.HTTP_200_OK)