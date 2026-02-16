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
    text: "Que lo disfrutes, porque lo hice pensando en ti, te quiero <3",
    image: "source/dialogo/personaje dialogo/1.png"
  },
  {
    text: "te presento a tu personaje en un intento de pixel art, te mueves con las flechas y encuentra el mensaje en la arena >:3",
    image: "source/dialogo/personaje dialogo/FIRST.png"
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
  
  const currentDialog = dialogs[currentLine];
  showDialogImage(currentDialog.image, currentLine);
  
  for (const char of sentence) {
    textElement.textContent += char;
    await new Promise(resolve => setTimeout(resolve, 40));
  }
  
  isTyping = false;
  if (arrow) arrow.classList.remove('hidden');
}

function showDialogImage(imagePath, lineIndex) {
  const isLast = lineIndex === dialogs.length - 1;
  
  if (isLast) {
    document.body.classList.add('dialog-last-image');
    let lastContainer = document.getElementById('dialog-image-last');
    if (!lastContainer) {
      lastContainer = document.createElement('div');
      lastContainer.id = 'dialog-image-last';
      document.body.appendChild(lastContainer);
    }
    let image = lastContainer.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      lastContainer.appendChild(image);
    }
    image.src = imagePath;
  } else {
    document.body.classList.remove('dialog-last-image');
    let imageContainer = document.getElementById('dialog-image-container');
    if (!imageContainer) {
      imageContainer = document.createElement('div');
      imageContainer.id = 'dialog-image-container';
      document.body.appendChild(imageContainer);
    }
    let image = imageContainer.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      imageContainer.appendChild(image);
    }
    image.src = imagePath;
  }
}

function hideDialogImage() {
  document.body.classList.remove('dialog-last-image');
  const lastContainer = document.getElementById('dialog-image-last');
  const imageContainer = document.getElementById('dialog-image-container');
  if (lastContainer) lastContainer.style.display = 'none';
  if (imageContainer) imageContainer.style.display = 'none';
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'z') {
    if (isTyping) return;
    
    const textElement = document.getElementById('text-content');
    
    currentLine++;
    if (currentLine < dialogs.length) {
      typeSentence(dialogs[currentLine].text);
    } else {
      if (!dialogBox) dialogBox = document.querySelector('.stardew-box');
      if (dialogBox) {
        dialogBox.classList.remove('active');
        document.body.classList.remove('dialog-active');
        textElement.textContent = "";
      }
      hideDialogImage();
      currentLine = 0;
    }
  }
});

function initializeDialogs() {
  if (dialogInitialized) return;
  dialogInitialized = true;
  
  dialogBox = document.querySelector('.stardew-box');
  if (dialogBox) {
    dialogBox.classList.add('active');
    document.body.classList.add('dialog-active');
    typeSentence(dialogs[0].text);
  }
}

function initializeGame() {
  console.log('🎮 Preparando el juego...');
  initializeDialogs();
}