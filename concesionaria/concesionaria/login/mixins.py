from django.shortcuts import redirect
from django.contrib import messages

def verificar_login_y_permisos(request, permiso_necesario):
    """
    Función simple que verifica login y permisos
    
    ¿Cómo usarla?
    1. Llama esta función al inicio de tu vista
    2. Si devuelve algo (redirect), retorna eso
    3. Si devuelve None, continúa con tu vista normal
    
    Ejemplo:
    def mi_vista(request):
        # Verificar antes de hacer cualquier cosa
        resultado = verificar_login_y_permisos(request, 'mi_permiso')
        if resultado:  # Si hay problema, redirigir
            return resultado
        
        # Aquí ya sabemos que el usuario puede estar aquí
        # ... resto de tu código ...
    """
    # ¿Está logueado?
    if not request.user.is_authenticated:
        messages.error(request, 'Debes iniciar sesión para acceder a esta página.')
        return redirect('panel:login')
    
    # ¿Tiene permisos?
    if not request.user.has_perm(permiso_necesario):
        messages.error(request, 'No posees los permisos necesarios para acceder a esta sección.')
        return redirect('public:index')
    
    # Todo bien, puede continuar
    return None

def solo_login_requerido(view_func):
    """
    Decorador simple: solo necesita estar logueado
    
    Uso:
    @solo_login_requerido
    def mi_vista(request):
        # Solo usuarios logueados llegan aquí
    """
    def nueva_vista(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, 'Debes iniciar sesión para acceder a esta página.')
            return redirect('panel:login')
        
        return view_func(request, *args, **kwargs)
    
    return nueva_vista
