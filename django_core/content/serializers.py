from rest_framework import serializers
from .models import ContentItem
from enrollments.models import Enrollment


class ContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = [
            "id",
            "title",
            "description",
            "type",
            "url",
            "is_active",
            "published_at",
            "audience",
            "course",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        try:
            is_auth = bool(getattr(getattr(request, "user", None), "is_authenticated", False))
        except Exception:
            is_auth = False
        # Anexa informações mínimas do curso (id, slug, title) se disponível
        if getattr(instance, "course", None):
            try:
                data["course"] = {
                    "id": instance.course.id,
                    "slug": instance.course.slug,
                    "title": instance.course.title,
                }
            except Exception:
                data["course"] = None

        # Gate de acesso: autenticação e matrícula ativa exigidas para expor URL
        if not is_auth:
            # Esconde a URL do conteúdo para usuários não autenticados
            data.pop("url", None)
        else:
            try:
                user = getattr(request, "user", None)
                # Se conteúdo está vinculado a um curso específico, exige matrícula ativa nesse curso
                if getattr(instance, "course", None):
                    has_active_enrollment = Enrollment.objects.filter(
                        student=user,
                        course=instance.course,
                        status=Enrollment.Status.ATIVA,
                    ).exists()
                else:
                    # Conteúdos sem curso específico exigem qualquer matrícula ativa
                    has_active_enrollment = Enrollment.objects.filter(
                        student=user,
                        status=Enrollment.Status.ATIVA,
                    ).exists()
                if not has_active_enrollment:
                    # Usuário autenticado porém sem matrícula ativa: esconder URL
                    data.pop("url", None)
            except Exception:
                # Em caso de erro ao consultar matrículas, não expor URL
                data.pop("url", None)
        return data