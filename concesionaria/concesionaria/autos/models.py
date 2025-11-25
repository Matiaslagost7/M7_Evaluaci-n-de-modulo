from django.db import models

# Create your models here.
class Automovil(models.Model):
    marca = models.CharField(max_length=50, verbose_name='Marca')
    modelo = models.CharField(max_length=50, verbose_name='Modelo')
    anio = models.IntegerField(verbose_name='Año')
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    stock = models.IntegerField(default=1, verbose_name='Stock disponible')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')
    imagen = models.ImageField(upload_to='autos/', blank=True, null=True, verbose_name='Imagen')

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.anio})"
