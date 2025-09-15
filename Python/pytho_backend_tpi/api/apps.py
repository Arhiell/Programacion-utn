from django.shortcuts import render
from firebase_admin import db

def listar_productos_firebase(request):
    """
    Extrae todos los productos de Firebase y los muestra en plantilla.
    """
    ref = db.reference('productos')
    firebase_productos = ref.get()

    lista_productos = []
    if firebase_productos:
        for key, value in firebase_productos.items():
            producto = value
            producto['id'] = key
            lista_productos.append(producto)

    contexto = {
        'productos': lista_productos,
        'fuente': 'Firebase Realtime Database'
    }
    return render(request, 'api/productos_firebase.html', contexto)
