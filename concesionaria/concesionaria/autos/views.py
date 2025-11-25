from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Automovil
from .forms import ContactoForm

# Vista para la página de inicio
def index(request):
    """
    Vista para la página de inicio.
    """
    return render(request, 'index.html')

# Vista para el formulario de contacto
def contacto(request):
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            # Procesar el formulario
            nombre = form.cleaned_data['nombre']
            # En una implementación real, aquí enviarías un correo electrónico
            # o guardarías el mensaje en la base de datos usando:
            # correo = form.cleaned_data['correo']
            # mensaje = form.cleaned_data['mensaje']
            return render(request, 'contacto_exito.html', {'nombre': nombre})
    else:
        form = ContactoForm()
    return render(request, 'contacto.html', {'form': form})

# Vista para mostrar el catálogo de automóviles
def catalogo(request):
    # Mostrar todos los automóviles en el catálogo público
    automoviles = Automovil.objects.all()
    if not automoviles:
        mensaje = "No hay automóviles disponibles en el catálogo."
        return render(request, 'catalogo.html', {'mensaje': mensaje})
    
    return render(request, 'catalogo.html', {'automoviles': automoviles})

# Vista pública para mostrar el detalle de un automóvil
def detalle_automovil(request, automovil_id):
    """
    Vista pública para mostrar los detalles de un automóvil específico.
    Esta es la vista pública del catálogo, sin requerir autenticación.
    """
    try:
        # Mostrar cualquier automóvil, independientemente de su disponibilidad
        automovil = Automovil.objects.get(id=automovil_id)
        return render(request, 'detalle_auto.html', {'auto': automovil})
    except Automovil.DoesNotExist:
        # Si el automóvil no existe, redirigir al catálogo
        messages.warning(request, 'El automóvil solicitado no existe.')
        return redirect('public:catalogo')

# Vista para buscar automóviles en el catálogo público
def buscar_automovil(request):
    """
    Vista pública para buscar automóviles en el catálogo.
    """
    query = request.GET.get('q', '')
    resultados = []
    
    if query:
        # Buscar en marca y modelo por separado y combinar resultados
        # Solo mostrar autos con stock > 0
        resultados_marca = Automovil.objects.filter(marca__icontains=query, stock__gt=0)
        resultados_modelo = Automovil.objects.filter(modelo__icontains=query, stock__gt=0)
        # Combinar y eliminar duplicados usando distinct()
        resultados = (resultados_marca | resultados_modelo).distinct()
    
    return render(request, 'buscar_automovil.html', {
        'resultados': resultados, 
        'query': query
    })