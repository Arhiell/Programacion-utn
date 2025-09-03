import json

def validar_datos(nombre_archivo):
    try:
        with open(nombre_archivo, 'r', encoding='utf-8') as archivo_json:
            datos = json.load(archivo_json)

        if not isinstance(datos, list):
            raise ValueError("El archivo no contiene una lista de datos.")

        for item in datos:
            if not isinstance(item.get('precio'), (int, float)):
                raise TypeError(f"El precio del producto '{item.get('nombre')}' no es un número.")

        print("Validación Exitosa.")
        return datos

    except FileNotFoundError:
        print(f"Error: El archivo '{nombre_archivo}' no fue encontrado.")
        return None
    except json.JSONDecodeError:
        print(" Error: El archivo no tiene un formato JSON válido.")
        return None
    except (ValueError, TypeError) as e:
        print(f" Error en la validación de datos: {e}")
        return None
