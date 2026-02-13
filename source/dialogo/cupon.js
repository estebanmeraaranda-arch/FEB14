// ===== GESTOR DE CUPONES =====
// Mostrar 3 cupones con animación hover y overlay selectivo

let cuponesAbiertos = false;

function showCupones() {
  if (cuponesAbiertos) return; // Evitar abrir múltiples veces
  cuponesAbiertos = true;
  
  // Crear overlay de desenfoque (borra TODO excepto cupones)
  const overlay = document.createElement('div');
  overlay.id = 'cupones-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.zIndex = '998';
  overlay.style.pointerEvents = 'auto';
  overlay.style.cursor = 'pointer';
  document.body.appendChild(overlay);
  
  // Cerrar cupones si clikeas el overlay
  overlay.addEventListener('click', () => {
    hideCupones();
  });
  
  // Crear contenedor de cupones
  const cuponesContainer = document.createElement('div');
  cuponesContainer.id = 'cupones-container';
  cuponesContainer.style.position = 'fixed';
  cuponesContainer.style.zIndex = '1001';
  cuponesContainer.style.cursor = 'pointer';
  document.body.appendChild(cuponesContainer);
  
  // Arreglo de cupones
  const cuponesData = [
    {
      id: 'cupon-1',
      src: 'source/cupón/1.png',
      left: '18%',
      top: '30%',
      width: '300px',
      height: '300px'
    },
    {
      id: 'cupon-2',
      src: 'source/cupón/2.png',
      left: '38%',
      top: '14%',
      width: '300px',
      height: '300px'
    },
    {
      id: 'cupon-3',
      src: 'source/cupón/3.png',
      left: '57%',
      top: '30%',
      width: '300px',
      height: '300px'
    }
  ];
  
  // Crear cada cupón
  cuponesData.forEach(cupon => {
    const cuponEl = document.createElement('div');
    cuponEl.id = cupon.id;
    cuponEl.className = 'cupon';
    cuponEl.style.position = 'fixed';
    cuponEl.style.backgroundImage = `url('${cupon.src}')`;
    cuponEl.style.backgroundSize = 'contain';
    cuponEl.style.backgroundPosition = 'center';
    cuponEl.style.backgroundRepeat = 'no-repeat';
    cuponEl.style.width = cupon.width;
    cuponEl.style.height = cupon.height;
    cuponEl.style.left = cupon.left;
    cuponEl.style.top = cupon.top;
    cuponEl.style.cursor = 'pointer';
    cuponEl.style.transition = 'transform 0.3s ease, filter 0.3s ease';
    cuponEl.style.pointerEvents = 'auto'; // Cupones sí responden a clicks
    
    // Animación hover
    cuponEl.addEventListener('mouseenter', () => {
      cuponEl.style.transform = 'scale(1.15) rotate(5deg)';
      cuponEl.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))';
    });
    
    cuponEl.addEventListener('mouseleave', () => {
      cuponEl.style.transform = 'scale(1) rotate(0deg)';
      cuponEl.style.filter = 'drop-shadow(0 0 0px rgba(255, 215, 0, 0))';
    });
    
    // Click en cupón
    cuponEl.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar que se active el overlay click
      console.log(`Cupón ${cupon.id} seleccionado`);
      hideCupones();
    });
    
    cuponesContainer.appendChild(cuponEl);
  });
  
  // Cerrar cupones con ESC
  window.addEventListener('keydown', closeCuponesOnEsc);
}

function closeCuponesOnEsc(event) {
  if (event.key === 'Escape') {
    hideCupones();
  }
}

function hideCupones() {
  const container = document.getElementById('cupones-container');
  const overlay = document.getElementById('cupones-overlay');
  
  if (container) {
    container.remove();
  }
  
  if (overlay) {
    overlay.remove();
  }
  
  cuponesAbiertos = false;
  
  // Remover listener
  window.removeEventListener('keydown', closeCuponesOnEsc);
}

// Exponer en window para poder abrir cupones desde consola u otros scripts
window.showCupones = showCupones;
