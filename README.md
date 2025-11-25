# Concesionaria AutoVentas

Este proyecto es una aplicación web desarrollada con Django para la gestión de una concesionaria de automóviles.

## Requisitos previos

- Python 3.10 o superior
- pip
- Git (opcional, para clonar el repositorio)

## Instalación y ejecución local

1. **Clona el repositorio (opcional):**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd M7_Evaluación de modulo
   ```

2. **Crea y activa un entorno virtual:**
   ```powershell
   python -m venv env
   .\env\Scripts\Activate.ps1
   ```
   O en CMD:
   ```cmd
   .\env\Scripts\activate.bat
   ```

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```
   Si no tienes un archivo `requirements.txt`, instala manualmente:
   ```bash
   pip install django pillow psycopg2
   ```

4. **Aplica las migraciones:**
   ```powershell
   cd concesionaria
   python manage.py migrate
   ```

5. **Crea un superusuario (opcional, para acceder al admin):**
   ```powershell
   python manage.py createsuperuser
   ```

6. **Ejecuta el servidor de desarrollo:**
   ```powershell
   python manage.py runserver
   ```

7. **Accede a la aplicación:**
   Abre tu navegador y ve a: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Estructura principal del proyecto

- `concesionaria/` - Proyecto Django principal
- `autos/` - Aplicación para gestión de automóviles
- `login/` - Aplicación para autenticación y administración de usuarios
- `static/` y `media/` - Archivos estáticos y multimedia

## Notas
- Si necesitas poblar la base de datos con datos de ejemplo, revisa si existe un script como `poblar_atributos.py` en la app `autos`.
- Para cualquier duda, revisa la documentación de Django: https://docs.djangoproject.com/

---

¡Listo! Ahora puedes trabajar y probar la aplicación localmente.