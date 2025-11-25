from django.shortcuts import render, get_object_or_404, redirect
from .models import Vehiculo, Marca
from .forms import VehiculoForm, ContactoForm, DetalleVehiculoForm
from django.db.models import Q
from django.contrib.auth.decorators import login_required

def index(request):
    """Página de inicio con vehículos destacados"""
    vehiculos_destacados = Vehiculo.objects.filter(disponible=True).order_by('-fecha_ingreso')[:6]
    return render(request, 'index.html', {'vehiculos_destacados': vehiculos_destacados})

def catalogo(request):
    """Catálogo de vehículos con filtros de búsqueda"""
    vehiculos = Vehiculo.objects.filter(disponible=True).select_related('marca').prefetch_related('condicion')
    marcas = Marca.objects.all()
    
    # Filtrado por marca
    marca_id = request.GET.get('marca')
    if marca_id:
        vehiculos = vehiculos.filter(marca_id=marca_id)
    
    # Filtrado por año
    anio_min = request.GET.get('anio_min')
    anio_max = request.GET.get('anio_max')
    if anio_min:
        vehiculos = vehiculos.filter(anio__gte=anio_min)
    if anio_max:
        vehiculos = vehiculos.filter(anio__lte=anio_max)
    
    # Filtrado por precio
    precio_min = request.GET.get('precio_min')
    precio_max = request.GET.get('precio_max')
    if precio_min:
        vehiculos = vehiculos.filter(precio__gte=precio_min)
    if precio_max:
        vehiculos = vehiculos.filter(precio__lte=precio_max)

    # Búsqueda por texto (marca, modelo, descripción)
    query = request.GET.get('q')
    if query:
        vehiculos = vehiculos.filter(
            Q(modelo__icontains=query) | 
            Q(descripcion__icontains=query) |
            Q(marca__nombre__icontains=query)
        )

    return render(request, 'catalogo.html', {
        'vehiculos': vehiculos,
        'marcas': marcas,
        'query': query,
        'marca_seleccionada': int(marca_id) if marca_id else None,
        'anio_min': anio_min,
        'anio_max': anio_max,
        'precio_min': precio_min,
        'precio_max': precio_max,
    })

def detalle_vehiculo(request, vehiculo_id):
    """Detalle de un vehículo específico"""
    vehiculo = get_object_or_404(
        Vehiculo.objects.select_related('marca').prefetch_related('condicion'),
        id=vehiculo_id
    )
    return render(request, 'detalle_auto.html', {'vehiculo': vehiculo})

def contacto(request):
    """Formulario de contacto"""
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            nombre = form.cleaned_data['nombre']
            return render(request, 'contacto_exito.html', {'nombre': nombre})
    else:
        form = ContactoForm()
    return render(request, 'contacto.html', {'form': form})

# Vistas CRUD protegidas con login

@login_required
def crear_vehiculo(request):
    """Crear un nuevo vehículo (con detalles)"""
    if request.method == 'POST':
        form = VehiculoForm(request.POST, request.FILES)
        detalles_form = DetalleVehiculoForm(request.POST)
        if form.is_valid() and detalles_form.is_valid():
            detalles = detalles_form.save()
            vehiculo = form.save(commit=False)
            vehiculo.detalles = detalles
            vehiculo.save()
            form.save_m2m()
            return redirect('catalogo')
    else:
        form = VehiculoForm()
        detalles_form = DetalleVehiculoForm()
    return render(request, 'crear_producto.html', {'form': form, 'detalles_form': detalles_form})

@login_required
def editar_vehiculo(request, vehiculo_id):
    """Editar un vehículo existente (con detalles)"""
    vehiculo = get_object_or_404(Vehiculo, id=vehiculo_id)
    detalles_instance = vehiculo.detalles if vehiculo.detalles else None
    if request.method == 'POST':
        form = VehiculoForm(request.POST, request.FILES, instance=vehiculo)
        detalles_form = DetalleVehiculoForm(request.POST, instance=detalles_instance)
        if form.is_valid() and detalles_form.is_valid():
            detalles = detalles_form.save()
            vehiculo = form.save(commit=False)
            vehiculo.detalles = detalles
            vehiculo.save()
            form.save_m2m()
            return redirect('catalogo')
    else:
        form = VehiculoForm(instance=vehiculo)
        detalles_form = DetalleVehiculoForm(instance=detalles_instance)
    return render(request, 'editar_producto.html', {'form': form, 'detalles_form': detalles_form, 'object': vehiculo})

@login_required
def eliminar_vehiculo(request, vehiculo_id):
    """Eliminar un vehículo"""
    vehiculo = get_object_or_404(Vehiculo, id=vehiculo_id)
    if request.method == 'POST':
        vehiculo.delete()
        return redirect('catalogo')
    return render(request, 'eliminar_producto.html', {'vehiculo': vehiculo, 'object': vehiculo})
