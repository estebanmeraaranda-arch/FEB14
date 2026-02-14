// Zorrito NPC estático con animación de reposo
const zorrito = {
  x: 190, // desplazamiento en px relativo al centro (ajustable)
  y: -180,
  size: 130,
  frameIndex: 0,
  frameTimer: 0,
  frameSpeed: 30,
  florMode: false,
  florSprites: [],
  florFrameIndex: 0,
  florFrameTimer: 0,
  // Ajusta aquí la velocidad de la animación de las flores (frames por actualización)
  // Valor más bajo = animación más rápida. Por ejemplo `florFrameSpeed = 5`.
  florFrameSpeed: 5,
  // Fase de la animación: 'idle' | 'full' (recorre toda la secuencia) | 'tail' (bucle 15a-16a)
  florPhase: 'idle',
  tailIndex: 0
};

// Caché de imágenes para evitar frames vacíos mientras cargan
zorrito.cache = {};

function preloadZorritoSprites() {
  const all = zorritoSprites.concat(zorritoFlorSprites);
  let loaded = 0;
  all.forEach(url => {
    if (zorrito.cache[url]) {
      loaded++;
      return;
    }
    const img = new Image();
    img.src = url;
    zorrito.cache[url] = img;
    img.onload = () => { loaded++; };
    img.onerror = () => { console.warn('Failed to load', url); loaded++; };
  });
}

// Sprites de reposo (usa las imágenes en la carpeta "zorrito reposo")
// Reposo: ahora hay 2 frames nuevos en la carpeta `zorrito reposo`
const zorritoSprites = [
  'source/zorrito/zorrito reposo/1.png',
  'source/zorrito/zorrito reposo/2.png'
];

// Frames específicos para bucle final (15 y 16)
const zorritoTailFrames = [
  'source/zorrito/zorrito flores/15.png',
  'source/zorrito/zorrito flores/16.png'
];

// Secuencia completa de flores (usar nombres reales en disco). Si se agregan
// imágenes, actualizar esta lista con los nuevos nombres.
const zorritoFlorSprites = [
  'source/zorrito/zorrito flores/3.png',
  'source/zorrito/zorrito flores/4.png',
  'source/zorrito/zorrito flores/5.png',
  'source/zorrito/zorrito flores/6.png',
  'source/zorrito/zorrito flores/7.png',
  'source/zorrito/zorrito flores/8.png',
  'source/zorrito/zorrito flores/9.png',
  'source/zorrito/zorrito flores/10.png',
  'source/zorrito/zorrito flores/11.png',
  'source/zorrito/zorrito flores/12.png',
  'source/zorrito/zorrito flores/13.png',
  'source/zorrito/zorrito flores/14.png',
  'source/zorrito/zorrito flores/15.png',
  'source/zorrito/zorrito flores/16.png',
  'source/zorrito/zorrito flores/17.png'
];

const zorritoEl = document.createElement('div');
zorritoEl.id = 'zorrito';
zorritoEl.style.position = 'absolute';
zorritoEl.style.width = zorrito.size + 'px';
zorritoEl.style.height = zorrito.size + 'px';
zorritoEl.style.backgroundImage = `url('${zorritoSprites[0]}')`;
zorritoEl.style.backgroundSize = 'contain';
zorritoEl.style.backgroundPosition = 'center';
zorritoEl.style.backgroundRepeat = 'no-repeat';
zorritoEl.style.imageRendering = 'pixelated';
zorritoEl.style.zIndex = '20';
zorritoEl.style.pointerEvents = 'none';
// Mismo movimiento que la isla para mantenerse sincronizado
zorritoEl.style.animation = 'islandFloat 4s ease-in-out infinite';

// Posición inicial relativa al centro del mundo (usa calc(50% + x))
zorritoEl.style.left = `calc(50% + ${zorrito.x}px)`;
zorritoEl.style.top  = `calc(50% + ${zorrito.y}px)`;

document.getElementById('world').appendChild(zorritoEl);

function updateZorrito() {
  // Si está en modo flores, animar con las flores
  if (zorrito.florMode) {
    // Usar los sprites asignados o el conjunto por defecto
    const base = (zorrito.florSprites && zorrito.florSprites.length > 0) ? zorrito.florSprites : zorritoFlorSprites;

    // Si no se ha inicializado la fase, arrancar en 'full'
    if (!zorrito.florPhase || zorrito.florPhase === 'idle') {
      zorrito.florPhase = 'full';
      zorrito.florFrameIndex = 0;
      zorrito.florFrameTimer = 0;
      zorrito.tailIndex = 0;
    }

    // Avanzar según la fase
    if (zorrito.florPhase === 'full') {
      zorrito.florFrameTimer++;
      if (zorrito.florFrameTimer >= zorrito.florFrameSpeed) {
        zorrito.florFrameIndex++;
        zorrito.florFrameTimer = 0;
      }

      // Si superamos el último frame, entrar en la fase 'tail'
      if (zorrito.florFrameIndex >= base.length) {
        zorrito.florPhase = 'tail';
        zorrito.tailIndex = 0;
        zorrito.florFrameTimer = 0;
      }
    } else if (zorrito.florPhase === 'tail') {
      // En fase tail, alternar entre los dos frames del bucle (15a-16a)
      zorrito.florFrameTimer++;
      if (zorrito.florFrameTimer >= zorrito.florFrameSpeed) {
        zorrito.tailIndex = (zorrito.tailIndex === 0) ? 1 : 0;
        zorrito.florFrameTimer = 0;
      }
    }

    // Elegir la URL a mostrar según la fase
    let url;
    if (zorrito.florPhase === 'tail') {
      // Mostrar uno de los dos frames del tail (15a.png o 16a.png)
      url = zorritoTailFrames[zorrito.tailIndex];
    } else {
      // En fase full, mostrar por índice de la secuencia base
      if (zorrito.florFrameIndex < base.length) {
        url = base[zorrito.florFrameIndex];
      } else {
        url = base[base.length - 1];
      }
    }

    // Si no está cargada, buscar la siguiente cargada o fallback
    if (!(zorrito.cache[url] && zorrito.cache[url].complete)) {
      const found = (zorrito.florPhase === 'tail') 
        ? zorritoTailFrames.find(u => zorrito.cache[u] && zorrito.cache[u].complete)
        : base.find(u => zorrito.cache[u] && zorrito.cache[u].complete);
      if (found) url = found;
      else url = zorritoSprites[0];
    }

    zorritoEl.style.backgroundImage = `url('${url}')`;
    zorrito.lastDisplayed = url;
  } else {
    // Animación de reposo normal
    zorrito.frameTimer++;
    if (zorrito.frameTimer >= zorrito.frameSpeed) {
      zorrito.frameIndex = (zorrito.frameIndex + 1) % zorritoSprites.length;
      zorrito.frameTimer = 0;
    }
    zorritoEl.style.backgroundImage = `url('${zorritoSprites[zorrito.frameIndex]}')`;
  }
  
  requestAnimationFrame(updateZorrito);
}

// Iniciar precarga de sprites para evitar frames vacíos
preloadZorritoSprites();

// API simple para ajustar desde la consola o desde otros scripts
window.zorrito = {
  data: zorrito,
  el: zorritoEl,
  setPosition(x, y) {
    zorrito.x = x;
    zorrito.y = y;
    zorritoEl.style.left = `calc(50% + ${zorrito.x}px)`;
    zorritoEl.style.top  = `calc(50% + ${zorrito.y}px)`;
  },
  setSize(size) {
    zorrito.size = size;
    zorritoEl.style.width = size + 'px';
    zorritoEl.style.height = size + 'px';
  }
};

updateZorrito();
