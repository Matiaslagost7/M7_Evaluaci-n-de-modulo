from django.contrib import admin
from .models import Automovil

# Register your models here.
class AutomovilAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'anio', 'precio', 'stock', 'disponible_display')
    search_fields = ('marca', 'modelo')
    list_filter = ('anio', 'marca')
    
    def disponible_display(self, obj):
        return obj.stock > 0
    disponible_display.boolean = True
    disponible_display.short_description = 'Disponible'

admin.site.register(Automovil, AutomovilAdmin)
