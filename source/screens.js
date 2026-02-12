// ===== GESTOR DE SCREENS =====
// Controla el cambio entre Screen 1 (Menú) y Screen 2 (Juego)

const screenManager = {
  currentScreen: 'screen1',
  
  goToScreen(screenName) {
    // Limpiar elementos de la screen actual
    this.cleanupCurrentScreen();
    
    // Remover clase active de todas
    document.getElementById('screen1').classList.remove('active');
    document.getElementById('screen2').classList.remove('active');
    
    // Agregar clase active a la nueva screen
    document.getElementById(screenName).classList.add('active');
    this.currentScreen = screenName;
    
    console.log('✓ Cambié a ' + screenName);
    
    // Si vamos a screen 2, iniciar el juego
    if (screenName === 'screen2') {
      initializeGame();
    }
  },
  
  cleanupCurrentScreen() {
    if (this.currentScreen === 'screen2') {
      // Limpiar diálogos
      const dialogBox = document.querySelector('.stardew-box');
      if (dialogBox) {
        dialogBox.classList.remove('active');
        document.body.classList.remove('dialog-active');
      }
      
      // Limpiar imágenes de diálogo
      const imageContainer = document.getElementById('dialog-image-container');
      if (imageContainer) {
        imageContainer.remove();
      }
      
      // Limpiar cupones
      const cuponesContainer = document.getElementById('cupones-container');
      if (cuponesContainer) {
        cuponesContainer.remove();
      }
      
      // Limpiar overlay
      const overlay = document.getElementById('cupones-overlay');
      if (overlay) {
        overlay.remove();
      }
      
      // Pausar música
      if (audioManager && audioManager.currentAudio) {
        audioManager.stopMusic();
      }
      
      // Resetear variables de diálogo
      if (typeof currentLine !== 'undefined') {
        currentLine = 0;
        musicStarted = false;
        dialogInitialized = false;
      }
    }
  }
};

// Botón "Inicial" - inicia el juego con mejor música
function startGame() {
  console.log('🎮 Iniciando juego...');
  
  // Reproducir música de intro/inicio
  audioManager.playMusic('source/Musica/chachacha.mp3', true);
  audioManager.currentAudio.volume = 1;
  
  // Cambiar a screen 2 después de un pequeño delay
  setTimeout(() => {
    screenManager.goToScreen('screen2');
  }, 300);
}
