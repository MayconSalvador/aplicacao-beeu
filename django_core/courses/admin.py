from django.contrib import admin
from .models import Course, Module, Lesson, Material

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "level", "price_br", "is_active")
    prepopulated_fields = {"slug": ("title",)}

admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Material)