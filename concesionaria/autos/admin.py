from django.contrib import admin
from .models import Marca, Condicion, Vehiculo, Categoria, Atributo, DetalleVehiculo

# Register your models here.

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Condicion)
class CondicionAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)



@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'anio', 'precio', 'color', 'disponible', 'fecha_ingreso')
    list_filter = ('marca', 'anio', 'disponible', 'condicion')
    search_fields = ('modelo', 'marca__nombre', 'descripcion')
    filter_horizontal = ('condicion',)
    readonly_fields = ('fecha_ingreso', 'fecha_actualizacion')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('marca', 'modelo', 'anio', 'precio', 'condicion', 'disponible')
        }),
        ('Detalles del Vehículo', {
            'fields': ('detalles', 'color', 'kilometraje', 'num_puertas', 'num_pasajeros')
        }),
        ('Descripción e Imagen', {
            'fields': ('descripcion', 'imagen')
        }),
        ('Control', {
            'fields': ('fecha_ingreso', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

# Registro de modelos adicionales para el admin
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Atributo)
class AtributoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(DetalleVehiculo)
class DetalleVehiculoAdmin(admin.ModelAdmin):
    list_display = ('id', 'dimensiones', 'peso')
    search_fields = ('dimensiones',)
