//////////////////// CONFIG ////////////////////
// Objeto de configuración global del juego
const CONFIG = {
  // Dimensiones del tablero de juego (columnas x filas)
  ANCHO: 20, // Número de columnas (horizontal)
  ALTO: 10, // Número de filas (vertical)

  // Velocidad del juego: intervalo de actualización en milisegundos
  TICK_MS: 250, // Cada 250ms se actualiza el estado del juego (movimiento, energía).

  // Movimiento por "tick" o actualización del bucle principal
  GATO_PASOS_POR_TICK: 5, // El gato puede moverse hasta 5 casillas por tick
  RATON_PASOS_POR_TICK: 3, // Cada ratón se mueve hasta 3 casillas por tick

  // Cantidad inicial de ratones en el tablero
  N_RATONES: 10,

  // Energía del gato
  ENERGIA_INICIAL: 60, // Energía inicial al comenzar la partida
  ENERGIA_MAX: 100, // Energía máxima que puede tener el gato
  ENERGIA_POR_CELDA: 1, // Energía consumida por cada celda recorrida

  // Energía que otorgan los ratones al ser atrapados (valor aleatorio entre mínimo y máximo)
  ENERGIA_RATON_MIN: 5,
  ENERGIA_RATON_MAX: 20,

  // Estética: si se usan emojis para representar los personajes en consola
  USE_EMOJI: true, // Si es true, se mostrarán emojis, si es false, se usarán caracteres como G y R
};

//////////////////// ESTADO ////////////////////
// Configura si se usarán emojis en el juego según la opción establecida en CONFIG
let useEmoji = CONFIG.USE_EMOJI;

// Variable para mostrar mensajes en pantalla (por ejemplo: "¡Ganaste!" o "¡Te quedaste sin energía!")
let mensaje = "";

// Controla si el juego está pausado (por ejemplo, al presionar una tecla)
let paused = false;

// Dirección actual del gato. Se actualizará según las teclas presionadas.
let direccionActual = null;

// ID del bucle principal (setInterval), útil para poder detener el juego cuando sea necesario
let loopId = null;

// Objeto que representa **el estado general del juego**
let state = {
  tick: 0, // Contador de "ticks" o ciclos que lleva el juego desde que empezó
  fin: false, // ¿El juego terminó? (true/false)
  victoria: false, // ¿El juego terminó? (true/false)

  // Estado del gato: posición X/Y y su energía actual
  gato: {
    x: Math.floor(Math.random() * CONFIG.ANCHO), // Posición aleatoria en el ancho del tablero
    y: Math.floor(Math.random() * CONFIG.ALTO), // Posición aleatoria en el alto del tablero
    energia: CONFIG.ENERGIA_INICIAL, // Energía inicial del gato
  },

  // Lista de ratones activos en el tablero (se irán agregando luego)
  ratones: [],
};

//////////////////// UTILES CONSOLA ////////////////////

// Oculta el cursor en la consola para una mejor presentación visual del juego
function hideCursor() {
  process.stdout.write("\x1b[?25l"); // Código ANSI para ocultar el cursor
}

// Muestra el cursor nuevamente (cuando termina el juego, por ejemplo)
function showCursor() {
  process.stdout.write("\x1b[?25h"); // Código ANSI para mostrar el cursor
}

// Limpia la pantalla de la consola y reposiciona el cursor en la parte superior
function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H"); // Limpia la pantalla y mueve el cursor a la esquina superior izquierda
}

// Limita (clamp) la energía entre 0 y el valor máximo permitido
function clampEnergia(e) {
  return Math.max(0, Math.min(CONFIG.ENERGIA_MAX, e)); // Se asegura de que la energía del gato no sea menor a 0 ni mayor al máximo permitido.
}

//////////////////// DIRECCIONES ////////////////////
// Diccionario con todas las direcciones posibles que pueden tomar el gato o los ratones
const DIRS = {
  UP: { dx: 0, dy: -1 }, // Arriba
  DOWN: { dx: 0, dy: 1 }, // Abajo
  LEFT: { dx: -1, dy: 0 }, // Izquierda
  RIGHT: { dx: 1, dy: 0 }, // Derecha
  UPLEFT: { dx: -1, dy: -1 }, // Diagonal arriba-izquierda
  UPRIGHT: { dx: 1, dy: -1 }, // Diagonal arriba-derecha
  DOWNLEFT: { dx: -1, dy: 1 }, // Diagonal abajo-izquierda
  DOWNRIGHT: { dx: 1, dy: 1 }, // Diagonal abajo-derecha
};

// Array de todas las direcciones posibles (útil para elegir una aleatoria)
const DIRS_ARRAY = Object.values(DIRS); //direcciones aleatorias (ideal para los movimientos de los ratones).

// Verifica si una coordenada (x, y) está dentro del tablero
function dentro(x, y) {
  return x >= 0 && x < CONFIG.ANCHO && y >= 0 && y < CONFIG.ALTO;
}

//////////////////// MOVIMIENTO ////////////////////

// Función genérica para mover cualquier personaje del juego (gato o ratón),
function mover(dx, dy, actor) {
  const nx = actor.x + dx; // Calcula nueva posición X
  const ny = actor.y + dy;
  if (dentro(nx, ny)) {
    // Verifica si la nueva posición está dentro del tablero
    actor.x = nx; // Actualiza posición del personaje
    actor.y = ny;
    return true; // Retorna true si se pudo mover
  }
  return false; // Movimiento inválido (fuera de límites)
}

// ---- GATO ----
function moverGato() {
  if (!direccionActual || state.fin) return; // Si no hay dirección o el juego terminó, no hace nada.
  const gato = state.gato;

  // Mueve al gato en la dirección actual, hasta CONFIG.GATO_PASOS_POR_TICK veces
  for (let i = 0; i < CONFIG.GATO_PASOS_POR_TICK; i++) {
    // Puede moverse varias veces por tick

    const moved = mover(direccionActual.dx, direccionActual.dy, gato); // Intenta mover en la dirección actual

    // Si se movió, reduce la energía del gato y verifica si comio un ratón
    // Si no se pudo mover (fuera de límites), sale del bucle
    if (moved) {
      gato.energia -= CONFIG.ENERGIA_POR_CELDA; // Consume energía por moverse
      gato.energia = clampEnergia(gato.energia); // Asegura que no se pase del máximo/mínimo de energía
      comerRatones(); // Después de moverse, verificar si comio un ratón

      if (gato.energia <= 0) break; // Si se quedó sin energía, termina bucle
    } else {
      break; // Si no pudo moverse (pared), sale del bucle
    }
  }
}

// ---- RATONES ----
function moverRatones() {
  if (state.fin) return; // Si el juego ya terminó (fin = true), no se hace nada

  // Recorremos todos los ratones que existen en el estado actual
  for (const raton of state.ratones) {
    // Cada ratón puede moverse varias veces por "tick" (según configuración)
    for (let i = 0; i < CONFIG.RATON_PASOS_POR_TICK; i++) {
      // Elige una dirección aleatoria de las posibles
      const dir = DIRS_ARRAY[Math.floor(Math.random() * DIRS_ARRAY.length)];

      // Intentamos mover al ratón en esa dirección
      // mover() devuelve true si se movió con éxito, false si no pudo (pared o borde)
      mover(dir.dx, dir.dy, raton);
    }
  }
}

//////////////////// COLISIONES ////////////////////
function comerRatones() {
  // Se obtienen referencias al gato y la lista de ratones desde el estado global
  const { gato, ratones } = state;

  let comidos = 0; // Contador de ratones atrapados en este tick
  let energiaGanada = 0; // Energía acumulada por comer ratones

  for (let i = ratones.length - 1; i >= 0; i--) {
    // Recorremos los ratones de atrás hacia adelante
    const r = ratones[i];

    // Verifica si la posición del ratón coincide con la del gato
    if (r.x === gato.x && r.y === gato.y) {
      energiaGanada += r.energia; // Suma la energía que da el ratón
      ratones.splice(i, 1); // Elimina el ratón del array (lo "saca del tablero")
      comidos++; // Incrementa contador de ratones comidos
    }
  }

  // Si el gato comió al menos un ratón:
  if (comidos > 0) {
    // Aumenta la energía del gato (con límite máximo gracias a clampEnergia)
    gato.energia = clampEnergia(gato.energia + energiaGanada);

    // Genera un mensaje para mostrar al jugador
    mensaje = `🐭 Comiste ${comidos} ratón(es) y ganaste +${energiaGanada} energía`;
  }
}

//////////////////// RENDER ////////////////////
const ICONS = {
  gatoEmoji: "🐱", // Representación del gato en modo emoji
  ratonEmoji: "🐭", // Representación del ratón en modo emoji
  gatoTxt: "G", // Representación del gato en modo texto
  ratonTxt: "R", // Representación del ratón en modo texto
  vacio: "·", // Representación de una celda vacía
};

// Barra de progreso textual para mostrar energía (0–100) con un ancho configurable
function progressBar(pct, width = 20) {
  const clamped = Math.max(0, Math.min(100, pct | 0)); // Asegura 0–100 y trunca a entero (|0)
  const filled = Math.round((clamped / 100) * width); // Cantidad de bloques “llenos”
  return `[${"#".repeat(filled)}${"-".repeat(width - filled)}] ${clamped}%`;
}

// Construye un marco superior e inferior con caracteres de caja.
function draw() {
  // Extraemos  variables del estado actual para usarlas más fácilmente
  const { gato, ratones, fin, victoria } = state;

  // Crea la parte superior e inferior, derecha e izquierda del tablero con caracteres especiales
  const top = "┌" + "─".repeat(CONFIG.ANCHO) + "┐";
  const bot = "└" + "─".repeat(CONFIG.ANCHO) + "┘";

  let out = ""; // Variable acumuladora que contendrá todo el tablero en formato de texto

  out += top + "\n"; // Empieza con la parte superior + salto de línea

  // ---Dibuja el contenido del tablero--
  // Recorremos cada fila (y) del tablero
  for (let y = 0; y < CONFIG.ALTO; y++) {
    // Se recorre de arriba hacia abajo (y = 0 es la primera fila).
    let row = "│"; // Cada fila empieza con la "pared" izquierda

    // Recorremos cada columna (x) de la fila actual
    for (let x = 0; x < CONFIG.ANCHO; x++) {
      // Si el gato está en esta celda, lo dibujamos
      if (gato.x === x && gato.y === y) {
        row += useEmoji ? ICONS.gatoEmoji : ICONS.gatoTxt;
      } else if (ratones.some((r) => r.x === x && r.y === y)) {
        // Si algún ratón está en esta celda, lo dibujamos
        row += useEmoji ? ICONS.ratonEmoji : ICONS.ratonTxt;
      } else {
        // Si la celda está vacía, se dibuja el carácter de "vacío"
        row += ICONS.vacio;
      }
    }
    row += "│\n"; // Cierra la fila con la "pared" derecha y un salto de línea
    out += row; // Agrega la fila completa al tablero
  }
  out += bot + "\n"; // Al final se agrega la parte inferior del tablero

  // HUD: datos de juego que se muestran debajo del tablero
  const hud = [
    `Tick: ${state.tick}`, // número de ciclos transcurridos
    `Energía del gato: ${progressBar(gato.energia)}`, // barra de energía
    `Dirección: ${direccionActual ? JSON.stringify(direccionActual) : "—"}`, // dirección actual o "—"
    `Ratones: ${ratones.length}`, // cuántos ratones quedan en juego
    `Controles: WASD/QEZC o flechas | P=pause | T=emoji/texto | R=reiniciar | X=salir`,
    `Estado: ${paused ? "⏸️ Pausado" : "▶️ Jugando"} | Mensaje: ${
      mensaje || "—" // estado y mensaje
    }`,
  ].join("\n");

  clearScreen(); // Limpia la pantalla
  console.log(out + hud); // Muestra tablero + HUD en consola

  // Si el juego terminó, muestra mensaje final
  if (fin) {
    console.log(victoria ? "\n🎉 ¡GANASTE!" : "\n💀 GAME OVER");
    console.log("Presioná R para reiniciar o X para salir.");
  }
}

//////////////////// CICLO DE TICK ////////////////////
function chequearFin() {
  // Verifica si el gato se quedó sin energía o si alcanzó el objetivo
  const { gato, ratones } = state; // Extraemos gato y ratones del estado

  // Caso 1: El gato se quedó sin energía
  if (gato.energia <= 0) {
    state.fin = true; // Marcamos que el juego terminó
    state.victoria = false; // El jugador perdió
    mensaje = "Energía agotada"; //Texto que se muestra en pantalla
    stopLoop(); // Detenemos el ciclo
  }
  // Caso 2: El gato alcanza energía máxima o ya no quedan ratones → Victoria
  else if (gato.energia >= CONFIG.ENERGIA_MAX || ratones.length === 0) {
    state.fin = true; // El juego terminó
    state.victoria = true; // El jugador ganó
    mensaje = "¡Objetivo alcanzado!";
    stopLoop(); // Detenemos el ciclo
  }
}

function tick() {
  if (paused) return draw(); // Si está en pausa, solo vuelve a dibujar la pantalla
  if (state.fin) return; // Si ya terminó, no hace nada

  state.tick++; // Incrementa el contador de ticks (ciclos de juego)
  mensaje = ""; // Limpia mensaje temporal

  // --- Llamando las Funciones de Moviemientos ---
  moverGato(); // Actualiza la posición del gato
  moverRatones(); // Actualiza la posición de los ratones
  chequearFin(); // Verifica si el juego ha terminado
  draw(); // Redibuja tablero + HUD (Pantalla de Visualización)
}

// Arranca el bucle principal llamando a tick()
function startLoop() {
  loopId = setInterval(tick, CONFIG.TICK_MS);
}

// Detiene el bucle eliminando el intervalo, cuando termina el juego o se necesita parar.
function stopLoop() {
  if (loopId) clearInterval(loopId);
}

//////////////////// CREAR RATONES ////////////////////
function crearRatones() {
  const ratones = []; // Se crea un array vacío que almacenará los ratones generados

  // Genera N (EN LA CONSTANTE COLOCAMOS LA CANTIDAD) ratones en posiciones aleatorias
  for (let i = 0; i < CONFIG.N_RATONES; i++) {
    // Posición aleatoria en el tablero
    const x = Math.floor(Math.random() * CONFIG.ANCHO);
    const y = Math.floor(Math.random() * CONFIG.ALTO);

    // Energía aleatoria que otorga el ratón (entre min y max configurados)
    const energia =
      Math.floor(
        Math.random() *
          (CONFIG.ENERGIA_RATON_MAX - CONFIG.ENERGIA_RATON_MIN + 1)
      ) + CONFIG.ENERGIA_RATON_MIN;
    ratones.push({ x, y, energia }); // Agrega el ratón al array con su posición y energía
  }
  return ratones; // Devuelve la lista completa de ratones generados
}

//////////////////// ENTRADA TECLADO ////////////////////
// Cambia la dirección del gato y actualiza el mensaje
function setDireccion(dir) {
  direccionActual = dir;
  mensaje = `Dirección cambiada`;
}

// Maneja la entrada de teclado del usuario
function handleInput(data) {
  if (data === "\u0003") return salir(); //salir del juego

  // --- Manejo de flechas (códigos ANSI) ---
  switch (data) {
    case "\u001b[A":
      return setDireccion(DIRS.UP); // Flecha ↑
    case "\u001b[B":
      return setDireccion(DIRS.DOWN); // Flecha ↓
    case "\u001b[D":
      return setDireccion(DIRS.LEFT); // Flecha ←
    case "\u001b[C":
      return setDireccion(DIRS.RIGHT); // Flecha →
  }

  // --- Si se presionó una sola tecla (letra), la convertimos a minúscula ---
  if (data.length === 1) {
    const ch = data.toLowerCase(); // Normaliza la letra a minúscula para evitar errores
    switch (ch) {
      // --- Movimiento con WASD ---
      case "w":
        return setDireccion(DIRS.UP);
      case "s":
        return setDireccion(DIRS.DOWN);
      case "a":
        return setDireccion(DIRS.LEFT);
      case "d":
        return setDireccion(DIRS.RIGHT);

      // --- Movimiento diagonal con QEZC ---
      case "q":
        return setDireccion(DIRS.UPLEFT);
      case "e":
        return setDireccion(DIRS.UPRIGHT);
      case "z":
        return setDireccion(DIRS.DOWNLEFT);
      case "c":
        return setDireccion(DIRS.DOWNRIGHT);

      // --- Pausar o reanudar el juego ---
      case "p":
        paused = !paused;
        mensaje = paused ? "⏸️ Pausado" : "▶️ Reanuda";
        draw(); // Redibuja el tablero con el nuevo estado
        break;

      // ---Alternar entre modo texto y emoji ---
      case "t":
        useEmoji = !useEmoji;
        mensaje = `Modo ${useEmoji ? "emoji" : "texto"}`;
        draw(); // Redibuja el tablero con los nuevos íconos
        break;

      // --- Reiniciar el juego ---
      case "r":
        reiniciar(); // Llama a la función que reinicia todo el estado
        break;

      // --- Salir del juego ---
      case "x":
        salir(); // Llama a la función que cierra el programa
        break;

      // --- Cualquier otra tecla: mensaje de error ---
      default:
        mensaje = `Tecla no válida: ${ch}`;
        draw(); // Muestra el mensaje en pantalla
    }
  }
}

// --- Prepara el sistema para leer teclas del usuario en tiempo real ---
function prepararStdin() {
  process.stdin.setRawMode(true); // Permite leer las teclas directamente (sin Enter)
  process.stdin.resume(); // Activa la entrada estándar
  process.stdin.setEncoding("utf8"); // Decodifica los caracteres correctamente
  process.stdin.on("data", handleInput); // Llama a handleInput() cuando se presiona una tecla
}

// --- Limpia la configuración de stdin (se usa al salir del juego) ---
function limpiarStdin() {
  try {
    process.stdin.setRawMode(false); // Sale del modo "raw"
    process.stdin.pause(); // Pausa la entrada
    process.stdin.removeListener("data", handleInput); // Quita el listener de teclas
  } catch {}
}

// --- Reinicia el juego desde cero ---
function reiniciar() {
  state = {
    tick: 0, // Reinicia el contador de ciclos
    fin: false, // El juego ya no está terminado
    victoria: false, // No hay victoria aún
    gato: {
      x: Math.floor(Math.random() * CONFIG.ANCHO), // Nueva posición aleatoria del gato
      y: Math.floor(Math.random() * CONFIG.ALTO),
      energia: CONFIG.ENERGIA_INICIAL, // Energía inicial
    },
    ratones: crearRatones(), // Crea nuevos ratones
  };

  direccionActual = null; // Sin dirección al inicio
  mensaje = "🔄 Reiniciado";
  startLoop(); // Comienza de nuevo el ciclo del juego
  draw(); // Dibuja el tablero inicial
}

// --- Sale del juego limpiamente ---
function salir() {
  stopLoop(); // Detiene el bucle de juego
  limpiarStdin(); // Limpia la entrada de teclas
  showCursor(); // Vuelve a mostrar el cursor de la consola
  clearScreen(); // Limpia la pantalla
  console.log("¡Gracias por jugar! 👋");
  process.exit(0); // Termina el programa
}

//////////////////// MAIN ////////////////////
function main() {
  // --- Inicializa el juego ---
  // -- Funciones invocadas ---
  hideCursor(); // Oculta el cursor para que el tablero se vea más limpio
  prepararStdin(); // Prepara la consola para leer teclas sin presionar Enter
  state.ratones = crearRatones(); // Genera los ratones y los guarda en el estado global
  draw(); // Dibuja por primera vez el tablero con el gato y los ratones
  startLoop(); // Inicia el ciclo del juego (setInterval que llama a tick())
}

//////////////////// EVENTOS DEL SISTEMA ////////////////////
// Captura Ctrl+C (SIGINT) para salir del juego limpiamente
process.on("SIGINT", salir);
// Asegura que al salir del programa, se muestre el cursor de nuevo
process.on("exit", showCursor);

///// INICIO DEL JUEGO /////
main();

// COMANDO PARA HACER CORRER EN NODE.JS //
// node D:\PythonPruebas\JavaScritp\GatoRaton\GatoRaton.js
