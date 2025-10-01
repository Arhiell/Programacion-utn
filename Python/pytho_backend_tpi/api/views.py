from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Producto, Categoria

import csv
import json

from django.shortcuts import render

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

def saludo_personalizado(request, nombre):
    """
    Esta vista devuelve un saludo personalizado usando un parámetro de la URL.
    """
    # Capitalizamos el nombre para que se vea mejor
    data = {
        'mensaje': f'¡Hola, {nombre.capitalize()}! Bienvenido a Programación IV.'
    }
    return JsonResponse(data)


def procesar_lista_productos(request, nombre_lista):
    """
    Lee productos de un CSV, les añade el nombre de la lista,
    guarda el resultado en un JSON y MUESTRA UNA PÁGINA WEB HTML.
    """
    productos_procesados = []
    ruta_csv = './api/archivos/productos.csv'

    try:
        # La lógica de leer el CSV se mantiene igual
        with open(ruta_csv, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for fila in csv_reader:
                fila['lista'] = nombre_lista
                productos_procesados.append(fila)

        # La lógica de escribir el JSON también se mantiene
        ruta_json = f'./api/archivos/{nombre_lista}.json'
        with open(ruta_json, mode='w', encoding='utf-8') as json_file:
            json.dump(productos_procesados, json_file, indent=4)
        
        # --- ¡AQUÍ ESTÁ EL CAMBIO! ---
        
        # 1. Creamos un diccionario de 'contexto' para pasar datos a la plantilla
        contexto = {
            'productos': productos_procesados,
            'nombre_lista': nombre_lista,
        }

        # 2. Usamos la función render() para generar el HTML
        # Parámetros: el request, la ruta a la plantilla, y el contexto.
        return render(request, 'api/lista_productos.html', contexto)

    except FileNotFoundError:
        # Puedes crear una plantilla de error o devolver un JsonResponse
        return JsonResponse(
            {'error': 'El archivo productos.csv no fue encontrado.'},
            status=404
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def error_funcion(request):
    return JsonResponse({'error': "No existe esa función"})



def crear_producto(request):
    if request.method == 'POST':
        # Capturar datos del formulario
        nombre = request.POST.get('nombre_producto')
        precio = request.POST.get('precio_producto')
        stock = request.POST.get('stock_producto')

        # Buscar o crear una categoría por defecto (id=1)
        categoria, _ = Categoria.objects.get_or_create(
            id=1,
            defaults={'nombre': 'Electrónica'}
        )

        # Crear un nuevo producto
        Producto.objects.create(
            nombre=nombre,
            precio=precio,
            stock=stock,
            categoria=categoria
        )

        # Redirigir a la lista de productos
        return redirect('lista_producto_db')

    # Si es GET, mostrar el formulario vacío
    return render(request, 'api/crear_producto.html')



def listar_productos_db(request):
    ordenar = request.GET.get('ordenar', 'nombre')

    if ordenar == 'precio':
        productos = Producto.objects.all().order_by('precio')  
    elif ordenar == 'stock':
        productos = Producto.objects.all().order_by('stock') 
    elif ordenar == 'categoria':
        productos = Producto.objects.all().order_by('stock')  
    else:
        productos = Producto.objects.all().order_by('nombre')   

    contexto = {
        'productos': productos,
        'ordenar': ordenar
    }

    return render(request, 'api/lista_producto_db.html', contexto)