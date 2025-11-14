from django.contrib import admin
from .models import User, Profile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role")
    list_filter = ("role",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "timezone")