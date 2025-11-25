from django.db import models

class Marca(models.Model):
    """Marca del vehículo (Toyota, Ford, BMW, etc.)"""
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.nombre

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ['nombre']

class Condicion(models.Model):
    """Condición del vehículo (Nuevo, Usado, Seminuevo)"""
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.nombre

    class Meta:
        verbose_name = "Condición"
        verbose_name_plural = "Condiciones"
        ordering = ['nombre']


# (Eliminado EspecificacionesTecnicas: no se usa en el modelo ni en formularios)

# =====================
# NUEVOS MODELOS PARA PRODUCTO/CATEGORÍA/ETIQUETA/DETALLE
# =====================

class Categoria(models.Model):
    """Categoría de vehículo (SUV, Sedán, Camioneta, etc.)"""
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre


# Nuevo modelo Atributo para reemplazar Etiqueta
class Atributo(models.Model):
    """Atributo para describir características del vehículo (Bluetooth, 4x4, Automático, etc.)"""
    nombre = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.nombre

class DetalleVehiculo(models.Model):
    """Detalles únicos de cada vehículo (dimensiones, peso, etc.)"""
    dimensiones = models.CharField(max_length=100, blank=True)
    peso = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True, help_text="Peso en kg")

    def __str__(self):
        if hasattr(self, 'vehiculo') and self.vehiculo:
            return f"Detalles de {self.vehiculo.marca.nombre if self.vehiculo.marca else ''} {self.vehiculo.modelo if self.vehiculo.modelo else ''}"
        return f"Detalles #{self.pk if self.pk else 'nuevo'}"

    class Meta:
        verbose_name = "Detalles del Vehículo"
        verbose_name_plural = "Detalles del Vehículo"


class Vehiculo(models.Model):
    """Modelo principal de vehículos en la concesionaria (adaptado como Producto)"""
    # Información básica
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name='vehiculos')
    modelo = models.CharField(max_length=100, help_text="Ej: Corolla, Mustang, Serie 3")
    anio = models.IntegerField(help_text="Año de fabricación")
    precio = models.DecimalField(max_digits=12, decimal_places=2)

    # Alias para compatibilidad con plantillas: nombre = modelo
    @property
    def nombre(self):
        return self.modelo

    # Relación muchos a uno con Categoría
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehiculos')

    # Relaciones
    condicion = models.ManyToManyField(Condicion, related_name='vehiculos', help_text="Nuevo, Usado, Seminuevo, etc.")

    # Relación muchos a muchos con Atributo
    atributos = models.ManyToManyField(Atributo, blank=True, related_name='vehiculos')

    # Relación uno a uno con DetalleVehiculo
    detalles = models.OneToOneField(DetalleVehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='vehiculo')

    # Detalles adicionales
    color = models.CharField(max_length=50, blank=True)
    kilometraje = models.IntegerField(blank=True, null=True, help_text="Kilometraje actual")
    num_puertas = models.IntegerField(blank=True, null=True, help_text="Número de puertas")
    num_pasajeros = models.IntegerField(blank=True, null=True, help_text="Capacidad de pasajeros")
    descripcion = models.TextField(blank=True, help_text="Descripción detallada del vehículo")

    # Multimedia
    imagen = models.ImageField(upload_to='vehiculos/', blank=True, null=True)

    # Control
    disponible = models.BooleanField(default=True)
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        marca = self.marca.nombre if self.marca else ''
        return f"{marca} {self.modelo} ({self.anio})"

    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
        ordering = ['-fecha_ingreso']
