// ===== GESTOR DE CUPONES =====
// Mostrar 3 cupones con animación hover y overlay selectivo

let cuponesAbiertos = false;

function showCupones() {
  if (cuponesAbiertos) return;
  cuponesAbiertos = true;
  
  console.log('showCupones called');
  
  const screen2 = document.getElementById('screen2');
  if (!screen2) {
    console.warn('screen2 no encontrado');
    return;
  }
  
  // Crear overlay dentro de screen2
  const overlay = document.createElement('div');
  overlay.id = 'cupones-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.zIndex = '9995';
  overlay.style.pointerEvents = 'auto';
  overlay.style.cursor = 'pointer';
  screen2.appendChild(overlay);
  
  overlay.addEventListener('click', hideCupones);
  
  // Preparar datos de sprites
  const sprites = [
    'source/cupones/1.png',
    'source/cupones/2.png',
    'source/cupones/3.png'
  ];

  // Centrados absolutamente y tamaño aumentado
  const cuponW = 320; // width en px
  const cuponH = 320; // height en px
  const gap = 20;
  const totalW = cuponW * 3 + gap * 2;
  const startX = Math.max(8, Math.round(window.innerWidth / 2 - totalW / 2));
  const startY = Math.max(8, Math.round(window.innerHeight / 2 - cuponH / 2));

  sprites.forEach((src, idx) => {
    const cuponEl = document.createElement('div');
    const id = 'cupon-' + (idx + 1);
    cuponEl.id = id;
    cuponEl.style.position = 'fixed';
    cuponEl.style.width = cuponW + 'px';
    cuponEl.style.height = cuponH + 'px';
    cuponEl.style.left = (startX + idx * (cuponW + gap)) + 'px';
    cuponEl.style.top = startY + 'px';
    cuponEl.style.backgroundImage = `url('${src}')`;
    cuponEl.style.backgroundSize = 'contain';
    cuponEl.style.backgroundPosition = 'center';
    cuponEl.style.backgroundRepeat = 'no-repeat';
    cuponEl.style.cursor = 'pointer';
    cuponEl.style.zIndex = '9999';
    cuponEl.style.transition = 'transform 0.2s, filter 0.2s';
    cuponEl.style.pointerEvents = 'auto';

    cuponEl.addEventListener('mouseenter', () => {
      cuponEl.style.transform = 'scale(1.08) rotate(3deg)';
      cuponEl.style.filter = 'drop-shadow(0 0 20px rgba(255,200,0,0.85))';
    });

    cuponEl.addEventListener('mouseleave', () => {
      cuponEl.style.transform = 'scale(1) rotate(0)';
      cuponEl.style.filter = 'none';
    });

    cuponEl.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(`Cupón ${id} seleccionado`);
      hideCupones();
    });

    screen2.appendChild(cuponEl);
  });
  
  // Listener para ESC
  const closeOnEsc = (e) => {
    if (e.key === 'Escape') hideCupones();
  };
  window.addEventListener('keydown', closeOnEsc);
  window._closeOnEsc = closeOnEsc;
}

function hideCupones() {
  // Remover overlay
  const overlay = document.getElementById('cupones-overlay');
  if (overlay) overlay.remove();
  
  // Remover cupones
  ['cupon-1', 'cupon-2', 'cupon-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  
  cuponesAbiertos = false;
  
  // Remover listener ESC
  if (window._closeOnEsc) {
    window.removeEventListener('keydown', window._closeOnEsc);
    window._closeOnEsc = null;
  }
}

// Exponer en window para poder abrir cupones desde consola u otros scripts
window.showCupones = showCupones;
