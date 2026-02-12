const player = {
  x: 0,
  y: 0,
  size: 64,
  speed: 4,
  isMoving: false,
  direction: "down",
  frameIndex: 0,
  frameTimer: 0,
  frameSpeed: 5
};

// Sprites organizados por dirección
const sprites = {
  down: ['source/player/Estatico.png'],
  up: ['source/player/Arriba2.png', 'source/player/Arriba1.png'],
  left: ['source/player/Izq1.png', 'source/player/Izq3.png', 'source/player/Izq2.png'],
  right: ['source/player/Der1.png', 'source/player/Der3.png', 'source/player/Der2.png']
};

const playerEl = document.createElement("div");
playerEl.id = "player";

playerEl.style.position = "absolute";
playerEl.style.width = player.size + "px";
playerEl.style.height = player.size + "px";
playerEl.style.backgroundImage = "url('source/player/Estatico.png')";
playerEl.style.backgroundSize = "contain";
playerEl.style.backgroundPosition = "center";
playerEl.style.backgroundRepeat = "no-repeat";
playerEl.style.imageRendering = "pixelated";

document.getElementById("world").appendChild(playerEl);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

window.addEventListener("keydown", e => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
    player.isMoving = true;
  }
});

window.addEventListener("keyup", e => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
    // Solo si ninguna tecla está presionada
    if (!Object.values(keys).some(v => v)) {
      player.isMoving = false;
      player.frameIndex = 0;
    }
  }
});

function isColliding(nx, ny) {
  return collisions.some(col => {
    return (
      nx < col.x + col.width / 2 &&
      nx + player.size > col.x - col.width / 2 &&
      ny < col.y + col.height / 2 &&
      ny + player.size > col.y - col.height / 2
    );
  });
}

function updatePlayer() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys.ArrowUp) {
    nextY -= player.speed;
    player.direction = "up";
  }
  if (keys.ArrowDown) {
    nextY += player.speed;
    player.direction = "down";
  }
  if (keys.ArrowLeft) {
    nextX -= player.speed;
    player.direction = "left";
  }
  if (keys.ArrowRight) {
    nextX += player.speed;
    player.direction = "right";
  }

  if (!isColliding(nextX, player.y)) {
    player.x = nextX;
  }

  if (!isColliding(player.x, nextY)) {
    player.y = nextY;
  }

  playerEl.style.left = `calc(50% + ${player.x}px)`;
  playerEl.style.top  = `calc(50% + ${player.y}px)`;

  updateAnimation();
  checkInteractiveZone();

  requestAnimationFrame(updatePlayer);
}

function updateAnimation() {
  const directionSprites = sprites[player.direction];
  
  if (player.isMoving && directionSprites.length > 1) {
    // Cambiar entre frames de caminata
    player.frameTimer++;
    if (player.frameTimer >= player.frameSpeed) {
      player.frameIndex = (player.frameIndex + 1) % directionSprites.length;
      player.frameTimer = 0;
    }
  } else {
    // Sprite estático o si solo hay una imagen
    player.frameIndex = 0;
  }
  
  playerEl.style.backgroundImage = `url('${directionSprites[player.frameIndex]}')`;
}

// ===== BOTONES E INDEPENDIENTES (ESTÁTICOS EN EL MAPA) =====
const eButtonRed = document.createElement('div');
eButtonRed.id = 'e-button-red';
eButtonRed.style.position = 'absolute';
eButtonRed.style.width = '32px';
eButtonRed.style.height = '32px';
eButtonRed.style.backgroundImage = "url('source/E.png')";
eButtonRed.style.backgroundSize = 'contain';
eButtonRed.style.backgroundPosition = 'center';
eButtonRed.style.backgroundRepeat = 'no-repeat';
eButtonRed.style.zIndex = '25';
eButtonRed.style.display = 'none';
eButtonRed.style.pointerEvents = 'none';
// POSICIÓN DEL BOTÓN ROJO (edita x, y aquí)
eButtonRed.style.left = `calc(50% + -180px)`;  // x = -240
eButtonRed.style.top  = `calc(50% + -220px)`;  // y = -220
document.getElementById('world').appendChild(eButtonRed);

const eButtonGreen = document.createElement('div');
eButtonGreen.id = 'e-button-green';
eButtonGreen.style.position = 'absolute';
eButtonGreen.style.width = '32px';
eButtonGreen.style.height = '32px';
eButtonGreen.style.backgroundImage = "url('source/E.png')";
eButtonGreen.style.backgroundSize = 'contain';
eButtonGreen.style.backgroundPosition = 'center';
eButtonGreen.style.backgroundRepeat = 'no-repeat';
eButtonGreen.style.zIndex = '25';
eButtonGreen.style.display = 'none';
eButtonGreen.style.pointerEvents = 'none';
// POSICIÓN DEL BOTÓN VERDE (edita x, y aquí)
eButtonGreen.style.left = `calc(50% + 170px)`;   // x = 50
eButtonGreen.style.top  = `calc(50% + -250px)`; // y = -220
document.getElementById('world').appendChild(eButtonGreen);

// ===== ZONAS INTERACTIVAS =====
let currentZone = null;

function checkInteractiveZone() {
  currentZone = null;
  
  // Detectar si el player está en alguna zona interactiva
  for (let zone of interactiveZones) {
    if (
      player.x < zone.x + zone.width / 2 &&
      player.x + player.size > zone.x - zone.width / 2 &&
      player.y < zone.y + zone.height / 2 &&
      player.y + player.size > zone.y - zone.height / 2
    ) {
      currentZone = zone.id;
      break;
    }
  }
  
  // Mostrar/ocultar botón E según zona
  updateEButtonVisibility();
}

function updateEButtonVisibility() {
  const eButtonRed = document.getElementById('e-button-red');
  const eButtonGreen = document.getElementById('e-button-green');
  
  if (currentZone === 'red') {
    eButtonRed.style.display = 'block';
    eButtonGreen.style.display = 'none';
  } else if (currentZone === 'green') {
    eButtonRed.style.display = 'none';
    eButtonGreen.style.display = 'block';
  } else {
    eButtonRed.style.display = 'none';
    eButtonGreen.style.display = 'none';
  }
}

// Detector de tecla E
window.addEventListener('keydown', e => {
  if (e.key === 'E' || e.key === 'e') {
    if (currentZone === 'red') {
      triggerRedZone();
    } else if (currentZone === 'green') {
      triggerGreenZone();
    }
  }
});

function triggerRedZone() {
  console.log('Red zone triggered!');
  // El overlay en showCupones() se encarga del blur
  // Mostrar cupones
  showCupones();
}

function triggerGreenZone() {
  console.log('Green zone triggered!');
  // Animar zorrito con flores (últimas 3 imágenes: image_0008, image_0009, image_0010)
  const zFloresSprites = [
    'source/zorrito/zorrito flores/image_0008.png',
    'source/zorrito/zorrito flores/image_0009.png',
    'source/zorrito/zorrito flores/image_0010.png'
  ];
  
  // Cambiar sprite del zorrito a animación flores
  window.zorrito.data.florMode = true;
  window.zorrito.data.florSprites = zFloresSprites;
  window.zorrito.data.florFrameIndex = 0;
  window.zorrito.data.florFrameTimer = 0;
}

updatePlayer();
