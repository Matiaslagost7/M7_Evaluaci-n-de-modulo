from django.urls import path
from . import views

app_name = 'public'

urlpatterns = [
    path('', views.index, name='index'),
    path('contacto/', views.contacto, name='contacto'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('automovil/<int:automovil_id>/', views.detalle_automovil, name='detalle_auto'),
    path('buscar/', views.buscar_automovil, name='buscar_automovil'),
]