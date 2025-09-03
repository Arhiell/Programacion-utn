# 🍏🍎 Emulación de Campo de Manzanas con Dron Cosechador

Este proyecto simula un **campo de manzanas** en un tablero de tamaño **Alto x Ancho**, donde un **dron cosechador** recorre los árboles recolectando únicamente las manzanas **maduras**.

El objetivo principal es calcular:

- ✅ Cuántas manzanas maduras logra cosechar el dron.
- ❌ Cuántas manzanas podridas hay en el campo.
- 🍏 Cuántas manzanas inmaduras hay en el campo.
- ⚡ El tiempo total necesario para completar el recorrido, considerando la energía disponible del dron.

---

## 🎮 Reglas de la simulación

1. Cada árbol en el tablero puede contener un número **R de manzanas**.
2. Las manzanas pueden ser de **3 tipos**:
   - 🍎 **Maduras** → El dron puede cosecharlas.
   - ❌ **Podridas** → No se pueden cosechar.
   - 🍏 **Inmaduras** → No se pueden cosechar.
3. El dron:
   - Pierde **energía** al atravesar cada árbol.
   - Si se queda sin energía, debe **volver a cargar** antes de continuar.
   - El tiempo total del recorrido debe considerar tanto el desplazamiento como las recargas necesarias.

---

## ⚙️ Requisitos

- Tener instalado [Node.js](https://nodejs.org/) o [Python](https://www.python.org/) (según implementación).
- Un editor de texto o IDE (ejemplo: Visual Studio Code).
- Ejecutar el programa en terminal (cmd, PowerShell, Git Bash o Linux).

---

## ▶️ Ejecución

1. Clonar este repositorio o descargar la carpeta.
2. Entrar a la carpeta del proyecto:

   ```bash
   cd campo-manzanas
   ```
