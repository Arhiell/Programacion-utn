import csv
import json
from validar_productos import validar_datos  # Importa la función de validación

# ────────────────────────────────────────────────
# 🧩 Bloque 1: Datos en memoria y estadísticas
# ────────────────────────────────────────────────

productos = [
    {"nombre": "laptop", "precio": 1200, "stock": 15},
    {"nombre": "lapiz", "precio": 300, "stock": 20},
    {"nombre": "celular", "precio": 250000, "stock": 30},
    {"nombre": "bicicleta", "precio": 200000, "stock": 25},
    {"nombre": "auriculares", "precio": 20000, "stock": 5},
    {"nombre": "teclado", "precio": 15000, "stock": 3}
]

productos_bajo_stock = []

for producto in productos:
    print(f"Producto: {producto['nombre']}, Precio: ${producto['precio']}")
    if producto['stock'] < 10:
        productos_bajo_stock.append(producto)

print("\nProductos con bajo stock:")
print(productos_bajo_stock)

def calcular_promedio_precio(lista):
    if not lista:
        return 0
    total_precio = sum(p['precio'] for p in lista)
    return total_precio / len(lista)

precio_promedio = calcular_promedio_precio(productos)
print(f"\nEl precio promedio de los productos es: ${precio_promedio:.2f}")

# ────────────────────────────────────────────────
# 🧩 Bloque 2: Lectura de productos desde archivo CSV
# ────────────────────────────────────────────────

productos_desde_csv = []

try:
    with open('datos.csv', mode='r', encoding='utf-8') as archivo_csv:
        lector_diccionario = csv.DictReader(archivo_csv)

        for fila in lector_diccionario:
            fila['id'] = int(fila['id'])
            fila['precio'] = int(fila['precio'])
            fila['stock'] = int(fila['stock'])
            productos_desde_csv.append(fila)

except FileNotFoundError:
    print(" Error: El archivo 'datos.csv' no se encontró.")

print("\nLista de productos desde el archivo CSV:")
print(productos_desde_csv)

# ────────────────────────────────────────────────
# 🧩 Bloque 3: Conversión a JSON y validación
# ────────────────────────────────────────────────

if productos_desde_csv:
    datos_json = json.dumps(productos_desde_csv, indent=4)

    with open('salida.json', mode='w', encoding='utf-8') as archivo_salida:
        archivo_salida.write(datos_json)
        print("\nArchivo 'salida.json' creado con éxito.")

    print("\n--- Ejecutando el módulo de validación ---")
    datos_validados = validar_datos('salida2.json')

    if datos_validados:
        print(" Datos validados correctamente:", datos_validados)
