// Controller independiente para animación de flores del zorrito
(function(){
  const cache = {};
  let sprites = [];
  // Configuración de mapeo de la escala 1..100 a ticks por frame
  // ticks: menor = más rápido. Definir rango razonable de ticks.
  const MIN_TICKS = 1; // más rápido
  const MAX_TICKS = 10000; // más lento (ticks)
  let frameSpeed = 5; // ticks por frame (inicial)
  let frameTimerMs = 0; // acumulador en ms
  let lastTimestamp = 0;
  let frameIndex = 0;
  let tailFrameSpeed = MAX_TICKS; // por defecto en ticks
  let tailFrameMs = 10000; // duración en ms entre frames en el loop final (8s)
  let rafId = null;
  let playing = false;
  let inTail = false;
  let tailIndices = [0,1]; // indices relativos a sprites array; will be reset
  let tailPos = 0;

  function preload(list, cb){
    let loaded = 0;
    if (!list || list.length === 0) return cb && cb();
    console.log('flowerController: preload start', list.length);
    list.forEach(url => {
      if (cache[url]) { loaded++; if (loaded===list.length) cb && cb(); return; }
      const img = new Image();
      img.src = url;
      cache[url] = img;
      img.onload = () => { loaded++; console.log('flowerController: loaded', url); if (loaded===list.length) { console.log('flowerController: preload complete'); cb && cb(); } };
      img.onerror = () => { loaded++; console.warn('flowerController: failed to load', url); if (loaded===list.length) { console.log('flowerController: preload complete (with errors)'); cb && cb(); } };
    });
  }

  function getZorritoEl(){
    return document.getElementById('zorrito');
  }

  function step(timestamp){
    const el = getZorritoEl();
    if (!el) return stop();
    // timestamp provided by requestAnimationFrame (ms)
    if (!timestamp) timestamp = performance.now();
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    frameTimerMs += elapsed;

    // usar duración en ms: en fase tail usamos tailFrameMs, en fase normal usar frameSpeed -> ms
    const normalFrameMs = Math.max(16, Math.round(frameSpeed * 16));
    const currentIntervalMs = inTail ? tailFrameMs : normalFrameMs;

    if (frameTimerMs >= currentIntervalMs) {
      frameTimerMs = 0;
      if (!inTail) {
        frameIndex++;
        if (frameIndex >= sprites.length) {
          // enter tail: default last two frames
          inTail = true;
          tailIndices = [Math.max(0, sprites.length-2), Math.max(0, sprites.length-1)];
          tailPos = 0;
        }
      } else {
        tailPos = tailPos === 0 ? 1 : 0;
      }
    }

    let url;
    if (inTail) {
      url = sprites[ tailIndices[tailPos] ];
    } else {
      url = sprites[ Math.min(frameIndex, sprites.length-1) ];
    }

    // fallback if not loaded
    if (!(cache[url] && cache[url].complete)) {
      const found = sprites.find(u => cache[u] && cache[u].complete);
      if (found) url = found;
    }

    // show frame and log (minimal)
    el.style.backgroundImage = `url('${url}')`;
    // debug log current frame
    if (window.__flowerDebug) console.log('flowerController: show', url, 'inTail=', inTail, 'idx=', inTail ? tailIndices[tailPos] : frameIndex);
    rafId = requestAnimationFrame(step);
  }

  function play(list, opts){
    if (!list || !list.length) return console.warn('flowerController.play requires sprite list');
    stop();
    sprites = list.slice();
    // Si el llamador pasa una escala de velocidad 1..100 (100 = más rápido), mapearla a ticks
    if (opts && typeof opts.speedScale === 'number') {
      const s = Math.max(1, Math.min(100, Math.round(opts.speedScale)));
      // mapear: 1 -> MAX_TICKS (más lento), 100 -> MIN_TICKS (más rápido)
      frameSpeed = Math.round(MIN_TICKS + ((100 - s) / 99) * (MAX_TICKS - MIN_TICKS));
    } else if (opts && typeof opts.frameSpeed === 'number') {
      frameSpeed = opts.frameSpeed;
    } else {
      frameSpeed = 5;
    }

    // tailSpeed puede pasarse directo (ticks), o usar tailSpeedScale (1..100),
    // o usar tailSlowPercent (por compatibilidad), o pasar tailFrameMs (ms) directamente.
    if (opts && typeof opts.tailSpeed === 'number') {
      tailFrameSpeed = opts.tailSpeed;
    } else if (opts && typeof opts.tailSpeedScale === 'number') {
      const ts = Math.max(1, Math.min(100, Math.round(opts.tailSpeedScale)));
      tailFrameSpeed = Math.round(MIN_TICKS + ((100 - ts) / 99) * (MAX_TICKS - MIN_TICKS));
    } else if (opts && typeof opts.tailSlowPercent === 'number') {
      tailFrameSpeed = Math.ceil(frameSpeed * (1 + opts.tailSlowPercent));
    } else {
      tailFrameSpeed = MAX_TICKS; // por defecto lo más lento posible en ticks
    }

    // tailFrameMs: si se pasa explícitamente, usarlo; si no, derivar de tailFrameSpeed
    if (opts && typeof opts.tailFrameMs === 'number') {
      tailFrameMs = Math.max(0, Math.round(opts.tailFrameMs));
    } else {
      tailFrameMs = Math.max(16, Math.round(tailFrameSpeed * 16));
    }
    frameTimerMs = 0;
    lastTimestamp = 0;
    frameIndex = 0;
    inTail = false;
    tailPos = 0;
    // preload all
    preload(sprites, () => {
      playing = true;
      rafId = requestAnimationFrame(step);
    });
  }

  function stop(){
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    playing = false;
  }

  window.zorritoFlowers = {
    play,
    stop,
    isPlaying(){ return playing; },
    cache
  };
})();
