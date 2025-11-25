
def run():
	from autos.models import Atributo
	atributos = ["Mecánico", "Automático", "Bencina", "Petróleo"]
	for nombre in atributos:
		Atributo.objects.get_or_create(nombre=nombre)

