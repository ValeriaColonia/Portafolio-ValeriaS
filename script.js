// Grupos a mover 
const grupoExpresion = document.getElementById('expresion');
const pupilDer = document.getElementById('ojo2');
const pupilIzq = document.getElementById('ojo1');
const rubor = document.getElementById('rubor');

// Limitacion de movimiento de pupila 
const eyeDer = document.getElementById('claro_ojo_der');
const eyeIzq = document.getElementById('claro_ojo_iz');

// posicion del cursor o toque
let cursorPos = { x: 0, y: 0 };

// Ajusta tamaño actual de pantalla
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Actualización de tamaño de pantalla
function defTamaPantalla() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

// posicion de mouse y actualiza animacion segun movimiento 
function mouseMove(e) {
  cursorPos = { x: e.clientX, y: e.clientY };
  seguir();
}

// pantallas táctiles
function touchMove(e) {
  const t = e.targetTouches && e.targetTouches[0];
  if (!t) return;
  cursorPos = { x: t.clientX, y: t.clientY };
  seguir();
}

// movimiento de SVG en X y Y
function setTransform(el, tx, ty) {
  if (!el) return;
  el.style.transformBox = 'fill-box';
  el.style.transformOrigin = 'center';
  el.style.transform = `translate(${tx}px, ${ty}px)`;
}

// Cálculo de desplazamiento de elemento en base al cursor 
// clamppX limita 
// yrelacion y xrelacion controlan sensibilidad del movimiento

function seguirCursor(el, xrelacion, yrelacion, clampPx = 8) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const centerX = r.x + r.width / 2;
  const centerY = r.y + r.height / 2;

  const dx = ((cursorPos.x - centerX) * 100) / windowWidth;
  const dy = ((cursorPos.y - centerY) * 100) / windowHeight;

  let tx = dx / xrelacion;
  let ty = dy / yrelacion;

  tx = Math.max(-clampPx, Math.min(clampPx, tx));
  ty = Math.max(-clampPx, Math.min(clampPx, ty));

  setTransform(el, tx, ty);
}


// Movimiento de pupilas en ara delimitada
// intensidad controla movimiento de pupila
// companionEl movimiento de las dos pupilas y companionFactor Rango de movimiento del compañero

function moverPupilaDentro(pupilEl, eyeEl, intensidad = 0.18, companionEl = null, companionFactor = 0.5) {
  if (!pupilEl || !eyeEl) return;

  const eyeRectScreen = eyeEl.getBoundingClientRect();
  const pupilBoxSVG = pupilEl.getBBox();

  const eyeCX = eyeRectScreen.x + eyeRectScreen.width / 2;
  const eyeCY = eyeRectScreen.y + eyeRectScreen.height / 2;

  let dx = cursorPos.x - eyeCX;
  let dy = cursorPos.y - eyeCY;

  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;

  const maxX = Math.max(2, (eyeRectScreen.width - (pupilBoxSVG.width || 8)) * intensidad);
  const maxY = Math.max(2, (eyeRectScreen.height - (pupilBoxSVG.height || 8)) * intensidad);

  const tx = nx * maxX;
  const ty = ny * maxY;

  setTransform(pupilEl, tx, ty);

  if (companionEl) {
    setTransform(companionEl, tx * companionFactor, ty * companionFactor);
  }
}

// Bucle de animacion 

function seguir() {
  seguirCursor(grupoExpresion, -10, -10, 8);
  seguirCursor(rubor, -18, -18, 5);
  moverPupilaDentro(pupilDer, eyeDer, 0.20);
  moverPupilaDentro(pupilIzq, eyeIzq, 0.20);

}

// Eventos para actualizar la animacion
window.addEventListener('resize', defTamaPantalla);
window.addEventListener('mousemove', mouseMove, { passive: true });
window.addEventListener('touchmove', touchMove, { passive: true });