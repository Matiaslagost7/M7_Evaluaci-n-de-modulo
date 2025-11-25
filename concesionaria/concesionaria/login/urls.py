from django.urls import path
from . import views

# Namespace para las URLs administrativas
app_name = 'panel'

urlpatterns = [
    # AUTENTICACIÓN - Login, Register, Logout
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'), 
    path('logout/', views.logout_view, name='logout'),
    
    # GESTIÓN DE INVENTARIO - Requiere permisos específicos
    path('inventario/', views.inventario_view, name='inventario'),
    
    # CRUD DE AUTOMÓVILES - Operaciones administrativas
    path('crear/', views.crear_automovil_view, name='crear_automovil'),
    path('editar/<int:automovil_id>/', views.editar_automovil_view, name='editar_automovil'),
    path('eliminar/<int:automovil_id>/', views.eliminar_automovil_view, name='eliminar_automovil'),
    path('detalle/<int:automovil_id>/', views.detalle_automovil_view, name='detalle_automovil'),
    
    # Panel administrativo
    path('panel/', views.panel_admin_view, name='panel_admin'),
    path('panel/usuarios/', views.usuarios_list, name='usuarios_list'),
    path('panel/usuarios/<int:user_id>/editar/', views.editar_usuario, name='editar_usuario'),
    path('panel/usuarios/<int:user_id>/eliminar/', views.eliminar_usuario, name='eliminar_usuario'),
    path('panel/usuarios/crear/', views.crear_usuario, name='crear_usuario'),
]