// Número WhatsApp (usa formato internacional sin +)
const WA_NUMBER = '18574925572';

// Configuración de seguridad / límites
const LIMITS = {
  nombre: 80,
  email: 100,
  telefono: 30,
  servicio: 60,
  mensaje: 800
};

// Selectors - asume que el formulario que mostraste es el único form en ese bloque
const form = document.querySelector('.appointment-box form') || document.querySelector('form');
const btn = form.querySelector('button[type="submit"]');

// Encuentra campos por placeholder (igual que tu HTML). Si tienes ids, mejor usarlos.
const inputNombre = form.querySelector('input[placeholder="Tu Nombre"]');
const inputEmail = form.querySelector('input[placeholder="Tu Email"]');
const inputTelefono = form.querySelector('input[placeholder="Tu Teléfono"]');
const selectServicio = form.querySelector('select');
const textarea = form.querySelector('textarea[placeholder="Describe tu caso brevemente"]');
// Honeypot: campo invisible para bots (opcional - agrega el input en tu HTML con name="website")
const honeypot = form.querySelector('input[name="website"]');

// Regex simples
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const rePhone = /^[0-9+\-\s()]{6,30}$/; // flexible: números, +, -, espacio, paréntesis

// Simple sanitizer: elimina cualquier etiqueta HTML y controla saltos de línea
function sanitize(input) {
  if (typeof input !== 'string') return '';
  // elimina etiquetas <...>
  const noTags = input.replace(/<[^>]*>/g, '');
  // reemplaza múltiples saltos por uno
  return noTags.replace(/\r\n|\r|\n/g, '\n').trim();
}

// Mostrar errores básicos (puedes reemplazar con tu UI de alerts)
function showError(message) {
  alert(message);
}

// Bloqueo temporal del botón para evitar spam
function disableButtonTemporarily(duration = 3000) {
  if (!btn) return;
  btn.disabled = true;
  setTimeout(() => { btn.disabled = false; }, duration);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Honeypot check: si tiene valor -> probable bot -> ignora
  if (honeypot && honeypot.value && honeypot.value.trim() !== '') {
    return;
  }

  // Leer y sanear
  const nombreRaw = inputNombre ? inputNombre.value : '';
  const emailRaw = inputEmail ? inputEmail.value : '';
  const telefonoRaw = inputTelefono ? inputTelefono.value : '';
  const servicioIndex = selectServicio ? selectServicio.selectedIndex : -1;
  const servicioText = (selectServicio && servicioIndex >= 0) ? selectServicio.options[servicioIndex].text : '';
  const mensajeRaw = textarea ? textarea.value : '';

  const nombre = sanitize(nombreRaw).slice(0, LIMITS.nombre);
  const email = sanitize(emailRaw).slice(0, LIMITS.email);
  const telefono = sanitize(telefonoRaw).slice(0, LIMITS.telefono);
  const servicio = sanitize(servicioText).slice(0, LIMITS.servicio);
  const mensaje = sanitize(mensajeRaw).slice(0, LIMITS.mensaje);

  // Validaciones mínimas (client-side)
  if (!nombre) { showError('Por favor escribe tu nombre.'); return; }
  if (!email || !reEmail.test(email)) { showError('Por favor escribe un email válido.'); return; }
  if (!telefono || !rePhone.test(telefono)) { showError('Por favor escribe un teléfono válido.'); return; }
  if (!servicio || /^Selecciona/i.test(servicio)) { showError('Por favor selecciona un servicio.'); return; }
  if (!mensaje) { showError('Por favor describe brevemente tu caso.'); return; }

  // Preparar mensaje (usa \n para saltos; luego encodeURIComponent)
  let texto = 'Hola, quiero solicitar una consulta.\n';
  texto += '📌 Nombre: ' + nombre + '\n';
  texto += '📧 Email: ' + email + '\n';
  texto += '📱 Teléfono: ' + telefono + '\n';
  texto += '📑 Servicio: ' + servicio + '\n';
  texto += '📝 Descripción:\n' + mensaje;

  // encode
  const encoded = encodeURIComponent(texto);

  // Bloquear botón 3s para evitar doble click / spam
  disableButtonTemporarily(3000);

  // Abrir WhatsApp en nueva pestaña
  const waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encoded;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
});
