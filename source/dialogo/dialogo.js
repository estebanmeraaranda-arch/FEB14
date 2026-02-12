const dialogs = [
  {
    text: "Hola lindo, preparado para la sorpresa en la que llevo trabajando hace mucho :3 (preciona z para continuar)" ,
    image: "source/dialogo/personaje dialogo/5.png"
  },
  {
    text: "Aunque tecnicamente podria ser mejor, es lo mejor pude hacer con tan poco tiempo.",
    image: "source/dialogo/personaje dialogo/4.png"
  },
  {
    text: "De igual manera es un trabajo honesto y hecho con el cocoro y speed max c:",
    image: "source/dialogo/personaje dialogo/3.png"
  },
  {
    text: "Espero que no te decepcione y que te guste mucho, es primera vez que hago algo así.",
    image: "source/dialogo/personaje dialogo/2.png"
  },
  {
    text: "Que lo disfrutes, porque lo hice pensando en ti <3",
    image: "source/dialogo/personaje dialogo/1.png"
  }
];

let currentLine = 0;
let isTyping = false;
let musicStarted = false;
let dialogBox = null;
let dialogInitialized = false;

async function typeSentence(sentence) {
  isTyping = true;
  const arrow = document.getElementById('next-arrow');
  const textElement = document.getElementById('text-content');
  
  if (arrow) arrow.classList.add('hidden');
  textElement.textContent = "";
  
  // Mostrar imagen del diálogo
  const currentDialog = dialogs[currentLine];
  showDialogImage(currentDialog.image);
  
  for (const char of sentence) {
    textElement.textContent += char;
    // Pequeño delay para el efecto máquina de escribir
    await new Promise(resolve => setTimeout(resolve, 40));
  }
  
  isTyping = false;
  if (arrow) arrow.classList.remove('hidden');
}

// Mostrar imagen del personaje
function showDialogImage(imagePath) {
  let imageContainer = document.getElementById('dialog-image-container');
  
  // Crear contenedor si no existe
  if (!imageContainer) {
    imageContainer = document.createElement('div');
    imageContainer.id = 'dialog-image-container';
    document.body.appendChild(imageContainer);
  }
  
  // Crear o actualizar imagen
  let image = imageContainer.querySelector('img');
  if (!image) {
    image = document.createElement('img');
    imageContainer.appendChild(image);
  }
  
  // Solo actualizar el src - CSS maneja la visibilidad
  image.src = imagePath;
}

function hideDialogImage() {
  const imageContainer = document.getElementById('dialog-image-container');
  if (imageContainer) {
    // No hacer nada - el CSS controla la visibilidad basado en body.dialog-active
  }
}

// Escuchar la tecla Z
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'z') {
    if (isTyping) return; // Evita saltar mientras escribe
    
    const textElement = document.getElementById('text-content');
    
    currentLine++;
    if (currentLine < dialogs.length) {
      typeSentence(dialogs[currentLine].text);
    } else {
      // Cerrar el diálogo
      if (!dialogBox) dialogBox = document.querySelector('.stardew-box');
      if (dialogBox) {
        dialogBox.classList.remove('active');
        document.body.classList.remove('dialog-active');
        textElement.textContent = "";
      }
      // IMPORTANTE: Aquí NO mostramos imágenes
      // Las imágenes solo se muestran mientras hay diálogo activo
      hideDialogImage();
      currentLine = 0;
    }
  }
});

// Iniciar primer diálogo cuando el juego comienza
function initializeDialogs() {
  if (dialogInitialized) return; // Evitar inicializar dos veces
  dialogInitialized = true;
  
  dialogBox = document.querySelector('.stardew-box');
  if (dialogBox) {
    dialogBox.classList.add('active');
    document.body.classList.add('dialog-active');
    typeSentence(dialogs[0].text);
  }
}

// Esta función será llamada desde screens.js cuando Screen 2 inicia
function initializeGame() {
  console.log('🎮 Preparando el juego...');
  
  // Inicializar el resto del juego
  initializeDialogs();
}