# 📦 Gestión de Productos con Python

Este proyecto es una práctica de **Programación IV (UTN)** donde se trabajan conceptos de **manejo de archivos, estructuras de datos, validación y conversión de formatos (CSV y JSON)** en Python.

---

## 📂 Archivos del proyecto

- **ari.py** → Script principal que integra todo el flujo:

  - Manejo de productos en memoria.
  - Lectura de productos desde un archivo CSV.
  - Conversión de datos a formato JSON.
  - Validación de datos utilizando un módulo externo.

- **datos.csv** → Archivo con datos de productos (id, nombre, precio, stock) cargados desde un CSV.

- **salida.json** → Archivo generado automáticamente con los productos en formato JSON. :contentReference[oaicite:0]{index=0}

- **salida2.json** → Archivo JSON de prueba utilizado para validar los datos (contiene valores correctos y con errores, por ejemplo precios en string):contentReference[oaicite:1]{index=1}.

- **validar_productos.py** → Módulo externo con la función `validar_datos()`, que:
  - Abre y lee un archivo JSON.
  - Verifica que los datos sean una lista.
  - Valida que el campo `precio` sea numérico.
  - Muestra errores en caso de datos inválidos:contentReference[oaicite:2]{index=2}.

---

## 🔄 Flujo del programa (`ari.py`)

1. **Productos en memoria**

   - Se define una lista inicial de productos con `nombre`, `precio` y `stock`.
   - Se imprimen en consola.
   - Se identifican productos con **bajo stock** (menor a 10 unidades).
   - Se calcula el **precio promedio** de todos los productos:contentReference[oaicite:3]{index=3}.

2. **Lectura de productos desde CSV**

   - Se abre el archivo `datos.csv`.
   - Se convierten los valores de `id`, `precio` y `stock` a enteros.
   - Los datos se cargan en una lista de diccionarios.

3. **Conversión a JSON**

   - Los productos del CSV se guardan en `salida.json`.

4. **Validación de datos**
   - Se ejecuta la función `validar_datos()` sobre `salida2.json`.
   - Si hay errores (ejemplo: precio como string), el programa los detecta.
   - Si los datos son correctos, se imprime “Validación Exitosa”.

---
