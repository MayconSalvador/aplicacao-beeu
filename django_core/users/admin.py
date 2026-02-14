from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Student, Professor

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "document_id", "plan")
    search_fields = ("name", "email", "document_id", "phone")
    list_filter = ("plan",)
    fieldsets = (
        ("Dados Pessoais", {
            "fields": ("name", "document_id", "phone", "email")
        }),
        ("Plano", {
            "fields": ("plan",)
        }),
    )

@admin.register(Professor)
class ProfessorAdmin(BaseUserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "is_active")
    list_filter = ("is_active",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Informações Pessoais", {"fields": ("first_name", "last_name", "email", "phone", "document_id")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Datas", {"fields": ("last_login", "date_joined")}),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role=User.Role.PROFESSOR)

    def save_model(self, request, obj, form, change):
        obj.role = User.Role.PROFESSOR
        super().save_model(request, obj, form, change)

# Optional: Unregister the base User model if you strictly don't want to see "Users"
# admin.site.unregister(User) 
# But usually superusers are accessed via User model. 
# We can create another proxy for Superusers if strictly needed, 
# or just leave User for admin access management.
# The request said "nos user, teremos somente o user ( professores )"
# I will effectively replace the User admin behavior or hide it. 
# But I can't easily hide the default User if I don't unregister it.
# Let's register User but maybe focused on Staff/Superusers if needed, 
# OR just unregister it and rely on Professor + maybe another proxy for Staff.
# Given the user is likely the "admin" user, they need to manage themselves.
# I will keep User but maybe filter it or just leave it for "System Users".
# But the prompt said "nos user, teremos somente o user ( professores )".
# I'll stick to registering Professor separately and maybe keeping User for "All System Users".

@admin.register(User)
class SystemUserAdmin(BaseUserAdmin):
    """
    Admin for all system users (including superusers/staff).
    """
    list_display = ("username", "email", "role", "is_staff")
    list_filter = ("role", "is_staff", "is_superuser")
