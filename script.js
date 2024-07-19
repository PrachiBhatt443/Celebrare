const canvas = document.getElementById('canvas');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const fontTypeInput = document.getElementById('fontType');
const addTextButton = document.getElementById('addText');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
let selectedElement = null;

const undoStack = [];
const redoStack = [];

function saveState() {
  const canvasState = canvas.innerHTML;
  undoStack.push(canvasState);
  redoStack.length = 0; // Clear redo stack
}

addTextButton.addEventListener('click', function() {
  saveState();

  const newText = document.createElement('div');
  newText.classList.add('text-element');
  newText.contentEditable = true;
  newText.textContent = "Edit me";
  newText.style.fontSize = fontSizeInput.value + 'px';
  newText.style.color = fontColorInput.value;
  newText.style.fontFamily = fontTypeInput.value;
  newText.style.left = '10px';
  newText.style.top = '10px';

  newText.draggable = true;

  newText.addEventListener('dragstart', function(ev) {
    selectedElement = newText;
    ev.dataTransfer.setData('text/plain', null);
  });

  newText.addEventListener('dragend', function(ev) {
    const offsetX = ev.clientX - canvas.getBoundingClientRect().left;
    const offsetY = ev.clientY - canvas.getBoundingClientRect().top;
    newText.style.left = offsetX + 'px';
    newText.style.top = offsetY + 'px';
    saveState();
  });

  newText.addEventListener('click', function(ev) {
    ev.stopPropagation();
    selectedElement = newText;
  });

  canvas.appendChild(newText);
  selectedElement = newText;
});

fontSizeInput.addEventListener('input', function() {
  if (selectedElement) {
    selectedElement.style.fontSize = fontSizeInput.value + 'px';
    saveState();
  }
});

fontColorInput.addEventListener('input', function() {
  if (selectedElement) {
    selectedElement.style.color = fontColorInput.value;
    saveState();
  }
});

fontTypeInput.addEventListener('input', function() {
  if (selectedElement) {
    selectedElement.style.fontFamily = fontTypeInput.value;
    saveState();
  }
});

canvas.addEventListener('click', function(e) {
  if (e.target === canvas) {
    selectedElement = null;
  }
});

undoButton.addEventListener('click', function() {
  if (undoStack.length > 0) {
    const currentState = canvas.innerHTML;
    redoStack.push(currentState);
    const lastState = undoStack.pop();
    canvas.innerHTML = lastState;
    reattachEventListeners();
  }
});

redoButton.addEventListener('click', function() {
  if (redoStack.length > 0) {
    const currentState = canvas.innerHTML;
    undoStack.push(currentState);
    const nextState = redoStack.pop();
    canvas.innerHTML = nextState;
    reattachEventListeners();
  }
});

function reattachEventListeners() {
  const elements = document.querySelectorAll('.text-element');
  elements.forEach(element => {
    element.addEventListener('dragstart', function(ev) {
      selectedElement = element;
      ev.dataTransfer.setData('text/plain', null);
    });

    element.addEventListener('dragend', function(ev) {
      const offsetX = ev.clientX - canvas.getBoundingClientRect().left;
      const offsetY = ev.clientY - canvas.getBoundingClientRect().top;
      element.style.left = offsetX + 'px';
      element.style.top = offsetY + 'px';
      saveState();
    });

    element.addEventListener('click', function(ev) {
      ev.stopPropagation();
      selectedElement = element;
    });
  });
}

// Initialize canvas state
saveState();
