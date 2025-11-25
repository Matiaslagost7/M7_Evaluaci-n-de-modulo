from django import forms
from .models import Vehiculo, DetalleVehiculo



class DetalleVehiculoForm(forms.ModelForm):
    class Meta:
        model = DetalleVehiculo
        fields = ['dimensiones', 'peso']
        widgets = {
            'dimensiones': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ej: 4.5m x 1.8m x 1.6m'
            }),
            'peso': forms.NumberInput(attrs={
                'class': 'form-control',
                'step': '0.01',
                'min': '0',
                'placeholder': 'Peso en kg'
            }),
        }
        labels = {
            'dimensiones': 'Dimensiones',
            'peso': 'Peso (kg)',
        }

class VehiculoForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Eliminado campo categoría

    class Meta:
        model = Vehiculo
        fields = ['marca', 'modelo', 'anio', 'precio', 'condicion',
              'color', 'kilometraje', 'num_puertas', 'num_pasajeros',
              'descripcion', 'imagen', 'disponible']
        widgets = {
            'marca': forms.Select(attrs={'class': 'form-select'}),
            'modelo': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ej: Corolla, Mustang, Serie 3'
            }),
            'anio': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '1950',
                'max': '2026',
                'placeholder': '2024'
            }),
            'precio': forms.NumberInput(attrs={
                'class': 'form-control',
                'step': '0.01',
                'min': '0',
                'placeholder': '0.00'
            }),
            'condicion': forms.SelectMultiple(attrs={
                'class': 'form-select',
                'size': '3'
            }),
            'color': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ej: Negro, Blanco, Rojo'
            }),
            'kilometraje': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0',
                'placeholder': '0'
            }),
            'num_puertas': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '2',
                'max': '5',
                'placeholder': '4'
            }),
            'num_pasajeros': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '2',
                'max': '9',
                'placeholder': '5'
            }),
            'descripcion': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Describa las características y condiciones del vehículo...'
            }),
            'imagen': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/jpeg,image/png,image/webp'
            }),
            'disponible': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'marca': 'Marca',
            'modelo': 'Modelo',
            'anio': 'Año',
            'precio': 'Precio',
            # 'categoria': 'Categoría',
            'condicion': 'Condición',
            'etiquetas': 'Etiquetas',
            'color': 'Color',
            'kilometraje': 'Kilometraje',
            'num_puertas': 'Número de Puertas',
            'num_pasajeros': 'Capacidad de Pasajeros',
            'descripcion': 'Descripción',
            'imagen': 'Imagen del Vehículo',
            'disponible': 'Disponible para venta',
        }

class ContactoForm(forms.Form):
    nombre = forms.CharField(
        max_length=100, 
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Su nombre completo'
        }),
        label='Nombre'
    )
    correo = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'su@email.com'
        }),
        label='Correo Electrónico'
    )
    telefono = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+56 9 1234 5678'
        }),
        label='Teléfono (opcional)'
    )
    mensaje = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 5,
            'placeholder': 'Escriba su consulta sobre vehículos disponibles...'
        }),
        label='Mensaje'
    )
