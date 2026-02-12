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
  florFrameSpeed: 5,
};

// Sprites de reposo (usa las imágenes en la carpeta "zorrito reposo")
const zorritoSprites = [
  'source/zorrito/zorrito reposo/image_0001.png',
  'source/zorrito/zorrito reposo/image_0002.png',
  'source/zorrito/zorrito reposo/image_0003.png',
  'source/zorrito/zorrito reposo/image_0004.png'
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
  if (zorrito.florMode && zorrito.florSprites.length > 0) {
    zorrito.florFrameTimer++;
    if (zorrito.florFrameTimer >= zorrito.florFrameSpeed) {
      zorrito.florFrameIndex = (zorrito.florFrameIndex + 1) % zorrito.florSprites.length;
      zorrito.florFrameTimer = 0;
    }
    zorritoEl.style.backgroundImage = `url('${zorrito.florSprites[zorrito.florFrameIndex]}')`;
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
