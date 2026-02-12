const collisions = [
  // Borde superior
  { x: 0, y: -260, width: 800, height: 40 },
  { x: 50, y: -150, width: 150, height: 150 },
  
  // Borde inferior
  { x: 0, y: 250, width: 800, height: 40 },

  // Borde izquierdo
  { x: -320, y: 0, width: 40, height: 500 },
  { x: -300, y: 180, width: 100, height: 100 },


  // Borde derecho
  { x: 420, y: 0, width: 20, height: 520 },
  { x: 350, y: 78, width: 80, height: 100 },
  { x: 320, y: -208, width: 70, height: 90 },

  // Obstáculo interior (ejemplo)
  { x: 250, y: 180, width: 100, height: 100 },


  
];

// Zonas interactivas (no bloquean movimiento, solo detectan presencia)
const interactiveZones = [
  { id: 'red', x: -240, y: -170, width: 300, height: 300 },
  { id: 'green', x: 50, y: -170, width: 300, height:200}
];

// Crear elementos visuales para las zonas (debug/visible)
const world = document.getElementById('world');
interactiveZones.forEach(zone => {
  const el = document.createElement('div');
  el.id = `zone-${zone.id}`;
  el.style.position = 'absolute';
  el.style.width = zone.width + 'px';
  el.style.height = zone.height + 'px';
  el.style.left = `calc(50% + ${zone.x}px)`;
  el.style.top = `calc(50% + ${zone.y}px)`;
  el.style.backgroundColor = zone.color;
  el.style.opacity = '0.3';
  el.style.zIndex = '15';
  el.style.border = '2px solid ' + zone.color;
  el.style.pointerEvents = 'none';
  world.appendChild(el);
});
