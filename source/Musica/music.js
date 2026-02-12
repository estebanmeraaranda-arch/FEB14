// ===== GESTOR DE MÚSICA =====
// Este archivo controla la reproducción de música en el juego

const audioManager = {
  currentAudio: null,
  
  playMusic(filePath, loop = true) {
    try {
      // Detener música anterior si existe
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      
      // Crear nuevo elemento de audio
      this.currentAudio = new Audio(filePath);
      this.currentAudio.loop = loop;
      this.currentAudio.volume = 0.8;
      
      // Intentar reproducir
      const playPromise = this.currentAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Música iniciada: ' + filePath);
          })
          .catch(error => {
            console.error('❌ Error al reproducir música:', error);
            console.warn('Intenta interactuar con la página (presiona una tecla)');
          });
      }
    } catch (error) {
      console.error('Error al crear audio:', error);
    }
  },
  
  stopMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      console.log('Música detenida');
    }
  }
};
