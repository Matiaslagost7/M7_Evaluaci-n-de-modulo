from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import Group
from django.contrib import messages
from autos.models import Vehiculo
from autos.forms import VehiculoForm
from .mixins import verificar_login_y_permisos
from django.contrib.auth import get_user_model
from .forms import UserEditForm, AdminUserCreationForm, CustomUserCreationForm

# VISTAS DE AUTENTICACIÓN - Registro, Login y Logout
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Iniciar sesión después del registro
            return redirect('index')  # Redirigir a una página de éxito.
    else:
        # En GET, si el usuario que accede tiene permiso para crear usuarios como admin, mostrar el formulario admin
        if request.user.is_authenticated and request.user.has_perm('login.CrearUsuario'):
            form = AdminUserCreationForm()
        else:
            form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return render(request, 'logout.html')

# VISTAS ADMINISTRATIVAS - Requieren autenticación y permisos específicos
def inventario_view(request):
    """
    Vista administrativa para mostrar el inventario completo de vehículos.
    Permite ver todos los vehículos (disponibles y no disponibles).
    Requiere: autenticación + permiso InventarioView (usando mixin)
    """
    # PASO 1: Verificar login y permisos
    resultado = verificar_login_y_permisos(request, 'login.InventarioView')
    if resultado:  # Si hay problema, redirigir
        return resultado
    
    # PASO 2: Si llegamos aquí, todo está bien, hacer el trabajo normal
    vehiculos = Vehiculo.objects.all().select_related('marca').order_by('-fecha_ingreso')
    total_vehiculos = vehiculos.count()
    disponibles = vehiculos.filter(disponible=True).count()
    if total_vehiculos > 0:
        valor_promedio = sum([v.precio for v in vehiculos]) / total_vehiculos
    else:
        valor_promedio = 0
    context = {
        'vehiculos': vehiculos,
        'total_vehiculos': total_vehiculos,
        'disponibles': disponibles,
        'valor_promedio': valor_promedio,
    }
    return render(request, 'inventario.html', context)

def crear_automovil_view(request):
    """
    Vista administrativa para crear un nuevo vehículo usando el formulario público (con detalles).
    """
    resultado = verificar_login_y_permisos(request, 'login.CrearAutomovilView')
    if resultado:
        return resultado
    from autos.forms import DetalleVehiculoForm
    if request.method == 'POST':
        form = VehiculoForm(request.POST, request.FILES)
        detalles_form = DetalleVehiculoForm(request.POST)
        if form.is_valid() and detalles_form.is_valid():
            detalles = detalles_form.save()
            vehiculo = form.save(commit=False)
            vehiculo.detalles = detalles
            vehiculo.save()
            form.save_m2m()
            messages.success(request, f'Vehículo {vehiculo.marca.nombre} {vehiculo.modelo} creado exitosamente.')
            return redirect('panel:inventario')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = VehiculoForm()
        from autos.forms import DetalleVehiculoForm
        detalles_form = DetalleVehiculoForm()
    return render(request, 'crear_producto.html', {'form': form, 'detalles_form': detalles_form})

def detalle_automovil_view(request, automovil_id):
    """
    Vista administrativa para mostrar detalles completos de un vehículo.
    Incluye información administrativa no visible en la vista pública.
    """
    # PASO 1: Verificar login y permisos
    resultado = verificar_login_y_permisos(request, 'login.DetalleAutomovilView')
    if resultado:  # Si hay problema, redirigir
        return resultado
    
    # PASO 2: Si llegamos aqui, todo está bien, hacer el trabajo normal
    vehiculo = get_object_or_404(Vehiculo.objects.select_related('marca'), id=automovil_id)
    return render(request, 'detalle_auto.html', {'vehiculo': vehiculo})


def editar_automovil_view(request, automovil_id):
    """
    Vista administrativa para editar un vehículo existente.
    Requiere: autenticación + permiso change_auto
    """
    # PASO 1: Verificar login y permisos
    resultado = verificar_login_y_permisos(request, 'login.EditarAutomovilView')
    if resultado:  # Si hay problema, redirigir
        return resultado
    
    # PASO 2: Si llegamos aqui, todo está bien, hacer el trabajo normal
    from autos.forms import DetalleVehiculoForm
    vehiculo = get_object_or_404(Vehiculo, id=automovil_id)
    detalles_instance = vehiculo.detalles if hasattr(vehiculo, 'detalles') else None
    if request.method == 'POST':
        form = VehiculoForm(request.POST, request.FILES, instance=vehiculo)
        detalles_form = DetalleVehiculoForm(request.POST, instance=detalles_instance)
        if form.is_valid() and detalles_form.is_valid():
            detalles = detalles_form.save()
            vehiculo = form.save(commit=False)
            vehiculo.detalles = detalles
            vehiculo.save()
            form.save_m2m()
            messages.success(request, f'Vehículo {vehiculo.marca.nombre} {vehiculo.modelo} actualizado exitosamente.')
            return redirect('panel:inventario')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = VehiculoForm(instance=vehiculo)
        detalles_form = DetalleVehiculoForm(instance=detalles_instance)
    return render(request, 'editar_producto.html', {'form': form, 'detalles_form': detalles_form, 'object': vehiculo})

def eliminar_automovil_view(request, automovil_id):
    """
    Vista administrativa para eliminar un vehículo existente.
    Requiere: autenticación + permiso delete_auto
    """
    # PASO 1: Verificar login y permisos
    resultado = verificar_login_y_permisos(request, 'login.EliminarAutomovilView')
    if resultado:  # Si hay problema, redirigir
        return resultado
    
    # PASO 2: Si llegamos aqui, todo está bien, hacer el trabajo normal
    vehiculo = get_object_or_404(Vehiculo, id=automovil_id)
    
    if request.method == 'POST':
        nombre_completo = f'{vehiculo.marca.nombre} {vehiculo.modelo}'
        vehiculo.delete()
        messages.success(request, f'Vehículo {nombre_completo} eliminado exitosamente.')
        return redirect('panel:inventario')
    
    return render(request, 'eliminar_producto.html', {'vehiculo': vehiculo, 'object': vehiculo})

# PANEL ADMINISTRATIVO - Gestión de usuarios
def panel_admin_view(request):
    """Muestra el panel administrativo con lista de usuarios y grupos"""
    # Verificar que el usuario esté autenticado y tenga permiso
    resultado = verificar_login_y_permisos(request, 'login.PanelAdminView')
    if resultado:
        return resultado

    User = get_user_model()
    usuarios = User.objects.all().order_by('username')
    groups = Group.objects.all().order_by('name')
    
    context = {
        'usuarios': usuarios,
        'groups': groups,
        'can_create_user': request.user.has_perm('login.CrearUsuario') or request.user.is_superuser,
    }
    return render(request, 'panel_admin.html', context)


def usuarios_list(request):
    """Vista de compatibilidad - redirige al panel admin"""
    return redirect('panel:panel_admin')

def crear_usuario(request):
    """Crea un nuevo usuario desde el panel administrativo"""
    # Verificar permiso
    resultado = verificar_login_y_permisos(request, 'login.CrearUsuario')
    if resultado:
        return resultado
    
    if request.method == 'POST':
        form = AdminUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Usuario {user.username} creado correctamente.')
            return redirect('panel:panel_admin')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = AdminUserCreationForm()

    return render(request, 'register.html', {'form': form})


def editar_usuario(request, user_id):
    """Permite editar un usuario existente"""
    User = get_user_model()
    usuario = get_object_or_404(User, id=user_id)

    # Verificar permiso
    resultado = verificar_login_y_permisos(request, 'login.EditarUsuario')
    if resultado:
        return resultado
    
    # Procesar formulario
    if request.method == 'POST':
        form = UserEditForm(request.POST, instance=usuario)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Usuario {user.username} actualizado correctamente.')
            return redirect('panel:panel_admin')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = UserEditForm(instance=usuario)

    return render(request, 'editar_usuario.html', {'form': form, 'usuario': usuario})


def eliminar_usuario(request, user_id):
    """Permite eliminar un usuario"""
    User = get_user_model()
    usuario = get_object_or_404(User, id=user_id)

    # Verificar permiso
    resultado = verificar_login_y_permisos(request, 'login.EliminarUsuario')
    if resultado:
        return resultado

    if request.method == 'POST':
        username = usuario.username
        usuario.delete()
        messages.success(request, f'Usuario {username} eliminado correctamente.')
        return redirect('panel:panel_admin')

    return render(request, 'eliminar_usuario.html', {'usuario': usuario})
