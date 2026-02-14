from django.contrib import admin
from .models import Plan, ClassSession

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "get_price_display", "created_at")
    
    def get_price_display(self, obj):
        return obj.price
    get_price_display.short_description = "Valor"

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ("professor", "student", "start_time", "end_time")
    list_filter = ("professor", "start_time")
    search_fields = ("professor__username", "student__name")

# Unregister other models if they were automatically registered (or don't register them)
# Since we are redefining the file, we just don't register Course, Module, Lesson, Material.
