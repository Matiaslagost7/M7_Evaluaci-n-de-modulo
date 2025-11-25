from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.forms import UserCreationForm

User = get_user_model()

# Codename de permisos personalizados del inventario
INVENTARIO_PERM_CODENAMES = [
    'InventarioView',
    'CrearAutomovilView',
    'EditarAutomovilView',
    'EliminarAutomovilView',
    'DetalleAutomovilView',
]

class CustomUserCreationForm(UserCreationForm):
    """Formulario simple de registro para usuarios públicos"""
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class UserEditForm(forms.ModelForm):
    groups = forms.ModelMultipleChoiceField(
        queryset=Group.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label='Grupos'
    )

    user_permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.filter(codename__in=INVENTARIO_PERM_CODENAMES),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label='Permisos (Inventario)'
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'is_staff', 'is_superuser', 'groups', 'user_permissions']


class AdminUserCreationForm(UserCreationForm):
    groups = forms.ModelMultipleChoiceField(
        queryset=Group.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label='Grupos'
    )

    user_permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.filter(codename__in=INVENTARIO_PERM_CODENAMES),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label='Permisos (Inventario)'
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'groups', 'user_permissions')
