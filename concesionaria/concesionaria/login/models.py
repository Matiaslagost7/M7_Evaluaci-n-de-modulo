from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    class Meta:
        permissions = [
            ("InventarioView", "Permiso para ver el inventario"),
            ("CrearAutomovilView", "Permiso para crear automóviles"),
            ("EditarAutomovilView", "Permiso para editar automóviles"),
            ("EliminarAutomovilView", "Permiso para eliminar automóviles"),
            ("DetalleAutomovilView", "Permiso para ver el detalle de automóviles"),
            ("PanelAdminView", "Permiso para ver el panel de administración"),
            ("CrearUsuario", "Permiso para crear usuarios desde panel admin"),
            ("EditarUsuario", "Permiso para editar usuarios desde panel admin"),
            ("EliminarUsuario", "Permiso para eliminar usuarios desde panel admin"),
        ]
