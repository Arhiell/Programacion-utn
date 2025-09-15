from django.shortcuts import render 
from firebase_admin import db # ¡Importamos el módulo de base de datos de Firebase! 
# ... (otras importaciones y vistas) ... 
 
def listar_productos_firebase(request): 
    """ 
    Esta vista extrae todos los productos de un nodo en Firebase Realtime Database 
    y los muestra en una página web. 
    """ 
    # 1. Obtenemos una referencia al nodo 'productos' en nuestra base de datos 
    ref = db.reference('productos') 
 
    # 2. Obtenemos los datos. .get() lee los datos una vez. 
    firebase_productos = ref.get() 
 
    # 3. Firebase devuelve un diccionario. Lo convertimos a una lista 
    #    para que sea más fácil de usar en la plantilla. 
    lista_productos = [] 
    if firebase_productos: 
        for key, value in firebase_productos.items(): 
            producto = value 
            producto['id'] = key # Agregamos el ID único de Firebase al diccionario 
            lista_productos.append(producto) 
 
    contexto = { 
        'productos': lista_productos, 
        'fuente': 'Firebase Realtime Database' 
    } 
 
    return render(request, 'api/productos_firebase.html', contexto)