from django.http import JsonResponse
import csv
import json
# Create your views here.
def saludar(request):
    """
    Esta vista devuelve un saludo en formato JSON.
    """
    data = {
        'mensaje': '¡Hola, mundo desde la API de Django!',
        'curso': 'Programación IV'
    }
    return JsonResponse(data)

# Segundo Parte del Ejercicio
def saludo_personalizado(request, nombre):
    """
    Esta vista devuelve un saludo personalizado usando un parámetro de la URL.
    """
    # Capitalizamos el nombre para que se vea mejor
    data = {
        'mensaje': f'¡Hola, {nombre.capitalize()}! Bienvenido a Programación IV.'
    }
    return JsonResponse(data)

# Tercer Parte del Ejercicio
def procesar_lista_productos(request, nombre_lista):
    productos_procesados = []
    ruta_csv = './api/productos.csv'
    try:
        with open(ruta_csv, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for fila in csv_reader:
                fila['lista'] = nombre_lista
                productos_procesados.append(fila)
        ruta_json = f'./api/{nombre_lista}.json'
        with open(ruta_json, mode='w', encoding='utf-8') as json_file:
            json.dump(productos_procesados, json_file, indent=4)
        return JsonResponse(productos_procesados, safe=False, status=200)
    except FileNotFoundError:
        return JsonResponse(
            {'error': 'El archivo no existe. Llame al Administrador (Codigo (505))'},
            status=404
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
