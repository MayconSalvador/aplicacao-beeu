from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ContentItem
from .serializers import ContentItemSerializer
from django.db.models import Q
from django.utils import timezone
from enrollments.models import Enrollment


class ContentItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContentItemSerializer
    # Permite listar conteúdos publicamente; o serializer esconde URL para não autenticados
    permission_classes = [AllowAny]
    
    class ContentItemPagination(PageNumberPagination):
        page_size = 12
        page_size_query_param = "page_size"
        max_page_size = 50

    pagination_class = ContentItemPagination

    def get_queryset(self):
        qs = ContentItem.objects.filter(is_active=True).order_by("-published_at", "-created_at")
        req = getattr(self, "request", None)
        if req:
            # Visibilidade por publicação: alunos veem somente publicados (<= now) ou sem data; professores/staff/superuser veem todos
            user = getattr(req, "user", None)
            if not user or getattr(user, "role", "ALUNO") == "ALUNO":
                now = timezone.now()
                qs = qs.filter(
                    Q(published_at__isnull=True) | Q(published_at__lte=now),
                    audience__in=["ALL", "ALUNO"],
                )
            else:
                # Professores/Staff/Superusers: ver conteúdos ativos, audiência ALL ou PROFESSOR
                qs = qs.filter(audience__in=["ALL", "PROFESSOR"])

            type_param = req.query_params.get("type")
            q_param = req.query_params.get("q")
            course_param = req.query_params.get("course")
            if type_param in {"VIDEO", "TEXTO", "LINK"}:
                qs = qs.filter(type=type_param)
            if q_param:
                qs = qs.filter(Q(title__icontains=q_param) | Q(description__icontains=q_param))
            if course_param:
                qs = qs.filter(course__slug=course_param)
        return qs

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my(self, request):
        # Conteúdos de cursos nos quais o usuário possui matrícula ativa
        active_course_ids = Enrollment.objects.filter(
            student=request.user,
            status=Enrollment.Status.ATIVA,
        ).values_list("course_id", flat=True)
        qs = self.get_queryset().filter(course_id__in=list(active_course_ids))
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)