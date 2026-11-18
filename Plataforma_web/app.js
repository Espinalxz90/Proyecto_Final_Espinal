// Credenciales del administrador para validar el acceso
const ADMIN_CREDENCIALES = { correo: "admin@eduia.com", password: "admin123" };

// Catálogo base de los 3 módulos
const modulos = [
  { id: 1, corto: "Módulo 1: Uso Ético", titulo: "Módulo 1: Fundamentos y Uso Ético de la IA",
    desc: "Principios básicos de responsabilidad, transparencia, derechos de autor y sesgos de la IA." },
  { id: 2, corto: "Módulo 2: Normativa", titulo: "Módulo 2: Normativa y Privacidad de Datos",
    desc: "Reglas clave sobre protección de datos personales, confidencialidad y marcos legales vigentes." },
  { id: 3, corto: "Módulo 3: Tips Prácticos", titulo: "Módulo 3: Tips Prácticos y Seguridad en la Práctica",
    desc: "Guías paso a paso para verificar información, redactar prompts éticos y seguridad digital." }
];

// Temas iniciales que se cargan la primera vez
const temasIniciales = [
  { id: 101, modulo: 1, titulo: "Transparencia y Responsabilidad",
    texto: "Al crear textos, imágenes o código con IA Generativa, es fundamental declarar su uso en entornos académicos y profesionales. La IA es una herramienta de apoyo, pero la responsabilidad final sobre la veracidad del contenido siempre recae en el usuario." },
  { id: 102, modulo: 1, titulo: "Derechos de Autor y Plagio",
    texto: "Los modelos de IA se entrenan con grandes volúmenes de información existente. Evita solicitar que imite exactamente el estilo de autores vivos o reproducir obras protegidas sin permiso, ya que esto puede infringir leyes de propiedad intelectual." },
  { id: 201, modulo: 2, titulo: "Protección de Datos Personales",
    texto: "Nunca ingreses nombres completos, contraseñas, números de identificación, historiales médicos ni información confidencial de empresas en chats públicos de IA, ya que los datos pueden almacenarse o usarse para entrenar futuros modelos." },
  { id: 202, modulo: 2, titulo: "Marcos Legales Vigentes (AI Act y Normativas)",
    texto: "Diversas regiones han aprobado regulaciones (como la Ley de IA de la Unión Europea) que clasifican los sistemas según su nivel de riesgo y exigen etiquetar contenidos sintéticos como deepfakes para evitar engaños." },
  { id: 301, modulo: 3, titulo: "Verificación de Información (Fact-Checking)",
    texto: "La IA puede generar datos falsos con apariencia muy convincente ('alucinaciones'). Contrasta siempre fechas, citas legales, estadísticas y enlaces con fuentes oficiales antes de publicar o entregar un trabajo." },
  { id: 302, modulo: 3, titulo: "Cómo redactar Prompts Éticos y Seguros",
    texto: "Un buen prompt debe ser claro, neutral y libre de sesgos discriminatorios. Especifica el contexto, el formato deseado y pide explícitamente que la IA cite sus fuentes o indique si desconoce algún dato." }
];

// Preguntas de autoevaluación por módulo
const quizzes = {
  1: [
    { q: "1. ¿Quién es el responsable final de la información publicada tras usar IA Generativa?",
      op: ["La empresa creadora de la IA", "El usuario que revisa y publica el contenido", "Nadie, es automático"], r: 1 },
    { q: "2. ¿Qué práctica respeta la ética académica al usar IA?",
      op: ["Entregar el texto sin revisarlo", "Declarar con transparencia que se usó IA como apoyo", "Ocultar las fuentes"], r: 1 }
  ],
  2: [
    { q: "1. ¿Qué información NUNCA debes escribir en un prompt público?",
      op: ["Un resumen de un tema público", "Datos personales, contraseñas o documentos confidenciales", "Ideas para un proyecto escolar"], r: 1 },
    { q: "2. ¿Qué exigen las normativas actuales respecto a contenidos sintéticos (deepfakes)?",
      op: ["Que se etiqueten claramente para evitar desinformación", "Que se publiquen sin aviso", "No existe ninguna regla"], r: 0 }
  ],
  3: [
    { q: "1. ¿Qué es una 'alucinación' en la IA Generativa?",
      op: ["Un error de conexión a internet", "Cuando la IA inventa datos falsos haciéndolos parecer reales", "Un tipo de virus"], r: 1 },
    { q: "2. ¿Cuál es la mejor práctica antes de usar datos generados por IA?",
      op: ["Copiar y pegar directamente", "Realizar verificación de hechos (fact-checking) en fuentes reales", "Confiar al 100% en la respuesta"], r: 1 }
  ]
};

// Funciones de apoyo general
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Lee los temas guardados en el navegador para que los cambios del admin se vean en todas las páginas
function obtenerTemas() {
  const guardados = localStorage.getItem('edu_ia_temas');
  if (!guardados) {
    localStorage.setItem('edu_ia_temas', JSON.stringify(temasIniciales));
    return [...temasIniciales];
  }
  return JSON.parse(guardados);
}

function guardarTemasStorage(lista) {
  localStorage.setItem('edu_ia_temas', JSON.stringify(lista));
}

// Funciones de usuarios y progreso en localStorage
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('edu_ia_usuarios') || '[]');
}

function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem('edu_ia_sesion_usuario') || 'null');
}

function actualizarMenu() {
  const nav = $('menuNav');
  if (!nav) return;
  const usu = obtenerUsuarioActivo();
  const enlaceUsuario = usu
    ? `<li><span style="color:#1e3a8a;font-weight:bold">Hola, ${esc(usu.nombre.split(' ')[0])}</span></li>
       <li><a onclick="cerrarSesionUsuario()" style="color:#e53e3e">Salir</a></li>`
    : `<li><a href="login_usuario.html">Iniciar Sesión</a></li>`;

  nav.innerHTML = `
    <li><a href="index.html">Inicio</a></li>
    <li><a href="modulos.html?id=1">Módulos</a></li>
    <li><a href="autoevaluacion.html?id=1">Autoevaluación</a></li>
    ${enlaceUsuario}
    <li><a href="login.html">Admin</a></li>
  `;
}

function cerrarSesionUsuario() {
  localStorage.removeItem('edu_ia_sesion_usuario');
  window.location.href = 'index.html';
}

// Lee parámetros de la URL (ejemplo: modulos.html?id=2)
function obtenerParametro(nombre, defecto = 1) {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get(nombre)) || defecto;
}

// ===== PANTALLA 1: Inicio (index.html) =====
function iniciarInicio() {
  const temas = obtenerTemas();
  const usu = obtenerUsuarioActivo();
  const usuarios = obtenerUsuarios();
  const datosUsu = usu ? usuarios.find(u => u.correo === usu.correo) : null;

  $('tarjetas').innerHTML = modulos.map(m => {
    const notaProgreso = datosUsu && datosUsu.progreso && datosUsu.progreso[m.id]
      ? ` • <strong style="color:#22543d">Quiz: ${datosUsu.progreso[m.id]}</strong>` : '';
    return `
    <div class="card">
      <div class="card-header"><div class="card-icon"></div><span class="card-title">${m.corto}</span></div>
      <p class="desc">${m.desc}</p>
      <div class="card-pie">
        <span class="nota">${temas.filter(t => t.modulo === m.id).length} temas${notaProgreso}</span>
        <a class="btn" href="modulos.html?id=${m.id}">Entrar</a>
      </div>
    </div>`;
  }).join('');
}

function buscar() {
  const q = norm($('busqueda').value.trim());
  $('resultados').style.display = q ? 'flex' : 'none';
  if (!q) return;

  const temas = obtenerTemas();
  const hallados = temas.filter(t => norm(t.titulo + ' ' + t.texto).includes(q));
  $('listaResultados').innerHTML = hallados.length
    ? hallados.map(t => `<div class="caja fila" style="margin-bottom:10px">
        <div><strong>${esc(t.titulo)}</strong><p class="nota">Módulo ${t.modulo}</p></div>
        <a class="btn" href="lectura.html?id=${t.id}">Leer tema</a></div>`).join('')
    : '<p class="desc">No se encontraron temas con esa palabra.</p>';
}

// ===== PANTALLA 2: Lista de temas del módulo (modulos.html) =====
function iniciarModulo() {
  const id = obtenerParametro('id', 1);
  const m = modulos.find(x => x.id === id) || modulos[0];
  const temas = obtenerTemas().filter(t => t.modulo === m.id);

  $('modTitulo').textContent = m.titulo;
  $('modDesc').textContent = m.desc;
  $('listaTemas').innerHTML = temas.length
    ? temas.map((t, i) => `<div class="caja fila" style="margin-bottom:12px">
        <strong>Tema ${i + 1}: ${esc(t.titulo)}</strong>
        <a class="btn" href="lectura.html?id=${t.id}">Leer</a></div>`).join('')
    : '<p class="desc">Aún no hay temas registrados en este módulo.</p>';
  $('btnQuizModulo').href = `autoevaluacion.html?id=${m.id}`;
}

// ===== PANTALLA 3: Lectura del tema (lectura.html) =====
function iniciarLectura() {
  const temas = obtenerTemas();
  const id = obtenerParametro('id', temas[0]?.id || 101);
  const t = temas.find(x => x.id === id) || temas[0];
  if (!t) return;

  const delModulo = temas.filter(x => x.modulo === t.modulo);
  const pos = delModulo.findIndex(x => x.id === t.id);

  $('lecModulo').textContent = modulos.find(m => m.id === t.modulo).titulo;
  $('lecTitulo').textContent = t.titulo;
  $('lecTexto').textContent = t.texto;
  $('btnVolverModulo').href = `modulos.html?id=${t.modulo}`;

  const sig = $('btnSiguiente');
  if (pos < delModulo.length - 1) {
    sig.textContent = 'Siguiente Tema ->';
    sig.href = `lectura.html?id=${delModulo[pos + 1].id}`;
  } else {
    sig.textContent = 'Ir a Autoevaluación ->';
    sig.href = `autoevaluacion.html?id=${t.modulo}`;
  }
}

// ===== PANTALLA 4: Autoevaluación (autoevaluacion.html) =====
let quizActual = 1;

function iniciarQuiz() {
  quizActual = obtenerParametro('id', 1);
  if (!quizzes[quizActual]) quizActual = 1;

  $('quizTitulo').textContent = 'Autoevaluación - ' + modulos.find(m => m.id === quizActual).corto;
  $('resultadoQuiz').style.display = 'none';
  $('preguntas').innerHTML = quizzes[quizActual].map((p, i) => `
    <div class="caja" style="margin-bottom:12px"><p class="pregunta" style="font-weight:bold;margin-bottom:8px">${p.q}</p>
      ${p.op.map((o, j) => `<label class="opcion"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}
    </div>`).join('');
}

function calificar() {
  const lista = quizzes[quizActual];
  let aciertos = 0;
  lista.forEach((p, i) => {
    const marcada = document.querySelector(`input[name="q${i}"]:checked`);
    if (marcada && Number(marcada.value) === p.r) aciertos++;
  });

  const puntaje = `${aciertos}/${lista.length}`;
  const usu = obtenerUsuarioActivo();
  const b = $('resultadoQuiz');
  b.style.display = 'block';

  if (usu) {
    const usuarios = obtenerUsuarios();
    const idx = usuarios.findIndex(u => u.correo === usu.correo);
    if (idx !== -1) {
      if (!usuarios[idx].progreso) usuarios[idx].progreso = {};
      usuarios[idx].progreso[quizActual] = puntaje;
      localStorage.setItem('edu_ia_usuarios', JSON.stringify(usuarios));
    }
    b.className = 'banner exito';
    b.innerHTML = `Resultado: obtuviste ${aciertos} de ${lista.length} aciertos. &nbsp;•&nbsp; Progreso guardado`;
  } else {
    b.className = 'banner';
    b.innerHTML = `
      <div>Resultado: obtuviste ${aciertos} de ${lista.length} aciertos.</div>
      <div class="aviso-progreso">
        ¿Quieres guardar tu calificación para no perder tu avance?
        <a href="login_usuario.html" style="color:#1e3a8a;font-weight:bold">Inicia sesión</a> o
        <a href="registro.html" style="color:#1e3a8a;font-weight:bold">crea una cuenta gratis</a>.
      </div>`;
  }
}

// ===== PANTALLAS NUEVAS: Login y Registro de Usuario =====
function iniciarSesionUsuario(e) {
  e.preventDefault();
  const correo = $('usuCorreo').value.trim().toLowerCase();
  const pass = $('usuPass').value;
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(u => u.correo === correo && u.password === pass);

  if (encontrado) {
    localStorage.setItem('edu_ia_sesion_usuario', JSON.stringify({ nombre: encontrado.nombre, correo: encontrado.correo }));
    window.location.href = 'index.html';
  } else {
    const err = $('errorLoginUsuario');
    err.textContent = 'Correo o contraseña incorrectos.';
    err.style.display = 'block';
  }
}

function registrarUsuario(e) {
  e.preventDefault();
  const nombre = $('regNombre').value.trim();
  const correo = $('regCorreo').value.trim().toLowerCase();
  const password = $('regPass').value;
  const usuarios = obtenerUsuarios();

  if (usuarios.some(u => u.correo === correo)) {
    const err = $('errorRegistro');
    err.textContent = 'Este correo ya está registrado. Inicia sesión.';
    err.style.display = 'block';
    return;
  }

  usuarios.push({ id: Date.now(), nombre, correo, password, progreso: {} });
  localStorage.setItem('edu_ia_usuarios', JSON.stringify(usuarios));
  localStorage.setItem('edu_ia_sesion_usuario', JSON.stringify({ nombre, correo }));
  window.location.href = 'index.html';
}

// ===== PANTALLA 5: Login del Administrador (login.html) =====
function iniciarLogin() {
  if (sessionStorage.getItem('edu_ia_admin') === 'true') {
    window.location.href = 'admin.html';
  }
}

function iniciarSesionAdmin(e) {
  e.preventDefault();
  const correo = $('adminCorreo').value.trim().toLowerCase();
  const pass = $('adminPass').value;

  if (correo === ADMIN_CREDENCIALES.correo && pass === ADMIN_CREDENCIALES.password) {
    sessionStorage.setItem('edu_ia_admin', 'true');
    window.location.href = 'admin.html';
  } else {
    const err = $('errorLogin');
    err.textContent = 'Correo o contraseña incorrectos.';
    err.style.display = 'block';
  }
}

// ===== PANTALLA 6: Panel CRUD del Administrador (admin.html) =====
function iniciarAdmin() {
  if (sessionStorage.getItem('edu_ia_admin') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  pintarAdmin();
}

function cerrarSesionAdmin() {
  sessionStorage.removeItem('edu_ia_admin');
  window.location.href = 'index.html';
}

function pintarAdmin() {
  const temas = obtenerTemas();
  $('selModulo').innerHTML = modulos.map(m => `<option value="${m.id}">${m.titulo}</option>`).join('');
  $('tablaTemas').innerHTML = temas.map(t => `<tr>
    <td>Módulo ${t.modulo}</td><td>${esc(t.titulo)}</td>
    <td><div class="botones">
      <button class="btn sec" style="padding:5px 9px;font-size:0.8rem" onclick="editarTema(${t.id})">Editar</button>
      <button class="btn rojo" onclick="eliminarTema(${t.id})">Eliminar</button></div></td></tr>`).join('');
}

function guardarTema(e) {
  e.preventDefault();
  const temas = obtenerTemas();
  const id = $('idEditar').value;
  const dato = { modulo: Number($('selModulo').value), titulo: $('titTema').value.trim(), texto: $('conTema').value.trim() };

  if (id) {
    Object.assign(temas.find(t => t.id === Number(id)), dato);
  } else {
    temas.push({ id: Date.now(), ...dato });
  }

  guardarTemasStorage(temas);
  limpiarForm();
  pintarAdmin();
  alert('Tema guardado correctamente.');
}

function editarTema(id) {
  const t = obtenerTemas().find(x => x.id === id);
  $('idEditar').value = t.id;
  $('selModulo').value = t.modulo;
  $('titTema').value = t.titulo;
  $('conTema').value = t.texto;
  $('btnGuardar').textContent = 'Actualizar Tema';
}

function eliminarTema(id) {
  if (confirm('¿Seguro que deseas eliminar este tema?')) {
    const filtrados = obtenerTemas().filter(t => t.id !== id);
    guardarTemasStorage(filtrados);
    pintarAdmin();
  }
}

function limpiarForm() {
  $('idEditar').value = '';
  $('titTema').value = '';
  $('conTema').value = '';
  $('btnGuardar').textContent = 'Guardar Tema';
}

// Detecta qué página HTML se abrió y ejecuta su función correspondiente
document.addEventListener('DOMContentLoaded', () => {
  actualizarMenu();
  const pagina = document.body.dataset.pagina;
  if (pagina === 'inicio') iniciarInicio();
  if (pagina === 'modulos') iniciarModulo();
  if (pagina === 'lectura') iniciarLectura();
  if (pagina === 'autoevaluacion') iniciarQuiz();
  if (pagina === 'login') iniciarLogin();
  if (pagina === 'admin') iniciarAdmin();
});
