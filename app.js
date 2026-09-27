/**
 * SPSDC MISSION CONTROL - CORE LOGIC
 * Plataforma de entrenamiento y gestión para la Spanish Space Design Competition
 */

// Configuración predeterminada de los 4 colegios participantes
const DEFAULT_SCHOOLS = [
  { id: 'col1', name: 'ANDEL', shortCode: 'ANDEL' },
  { id: 'col2', name: 'FUENLLANA', shortCode: 'FUEN' },
  { id: 'col3', name: 'J.H. NEWMAN', shortCode: 'NEWMAN' },
  { id: 'col4', name: 'EL PRADO', shortCode: 'PRADO' }
];

// Claves de Google Classroom para desbloqueo paulatino de cada Sprint
const DEFAULT_SPRINT_KEYS = {
  1: 'HERMES2026',
  2: 'ORGANOS2026',
  3: 'HUMAN2026',
  4: 'ROBOTS2026',
  5: 'COLONY2026'
};

// Estado global de la aplicación
const AppState = {
  activeView: 'dashboard',
  juryAuthenticated: false,
  targetDrivePath: 'H:\\Mi unidad\\SPSIN COLEGIOS',
  cloudWebhookUrl: 'https://script.google.com/macros/s/AKfycbzozxziqZdtsx5QE_UPYEW3s_3Cc7ncfKdbaI_Ula1TF_UOUo17l5gl3cvaQd7BbOt6/exec',
  schools: JSON.parse(JSON.stringify(DEFAULT_SCHOOLS)),
  sprintKeys: Object.assign({}, DEFAULT_SPRINT_KEYS),
  departments: [
    { id: 'structural', name: 'Structural Engineering (El Esqueleto)' },
    { id: 'operations', name: 'Operations & Infrastructure (Los Órganos)' },
    { id: 'human_factors', name: 'Human Factors & Safety (La Vida)' },
    { id: 'automation', name: 'Automation & Robotics (El Cerebro)' },
    { id: 'business', name: 'Business & Cost (El Negocio)' }
  ],
  sprints: [
    {
      id: 1,
      code: 'SPRINT-01',
      month: 'SEPTIEMBRE / OCTUBRE',
      planet: '🪐 DESTINO: PLANETA MERCURIO (HERMES-1)',
      title: 'Structural Engineering: El Esqueleto (Estación en Mercurio)',
      dept: 'Estructura & Materiales · Contrato FS-M01',
      status: 'active',
      deadline: '2026-10-15',
      summary: 'Diseño estructural de la primera estación orbital y asentamiento en el planeta Mercurio. Retos: radiación solar masiva (9.1 kW/m²), gradientes térmicos (-180°C a +430°C), gravedad artificial rotatoria (0.9-1.0 G) y escudo solar pasivo (Sunshield).',
      deliverables: {
        individual: [
          {
            code: 'IND-1A',
            title: 'Memoria de Cálculo: Gravedad Artificial y Efecto Coriolis en Mercurio',
            desc: 'Cálculo de radio (r) y velocidad angular (ω) para 0.9-1.0 G, verificación de límite de cinetosis (< 3 rpm) y gradiente cabeza-pies (< 12%).'
          },
          {
            code: 'IND-1B',
            title: 'Ficha Técnica: Casco Multicapa y Blindaje Térmico/Radiológico frente al Sol',
            desc: 'Selección de aleaciones del casco (Al-Li, Titanio), escudo térmico reflectante (+430°C), escudo Whipple y blindaje de protones solares.'
          },
          {
            code: 'IND-1C',
            title: 'Oral Defense & Technical Pitch in English (1-2 min Video)',
            desc: 'Grabación individual en vídeo de 1-2 minutos de pie y a CUERPO COMPLETO, exponiendo en inglés la solución técnica propuesta (física o casco) con presencia escénica formal ante la Foundation Society. Subir archivo MP4 o enlace (Loom/Drive/YouTube).'
          }
        ],
        group: [
          {
            code: 'GRP-1',
            title: 'Propuesta Estructural Completa por Colegio (ANDEL, FUENLLANA, NEWMAN, EL PRADO)',
            desc: 'Trabajo conjunto de los alumnos de cada colegio (2-5 alumnos): planos o modelo 3D (TinkerCAD/Blender), escudo solar parasol, distribución de cubiertas y memoria técnica unificada (3-6 págs).'
          }
        ]
      },
      reqs: [
        'Geometría macroestructural justificada (Toroide, Mancuerna, Cilindros) y dimensiones.',
        'Escudo solar parasol (Sunshield pasivo) frente a la radiación directa de Mercurio (9.1 kW/m²).',
        'Cálculo riguroso de gravedad centrípeta (a = ω²·r) entre 0.85 G y 1.0 G con rotación < 3 rpm.',
        'Despiece del casco multicapa contra gradientes de -180°C a +430°C y tormentas solares.',
        'Entrega individual obligatoria (IND-1A o IND-1B) y Entrega grupal unificada del colegio (GRP-1).'
      ],
      sampleDoc: 'RFP Oficial M01 · Structural Design (Secciones S1, S2, S4)'
    },
    {
      id: 2,
      code: 'SPRINT-02',
      month: 'OCTUBRE',
      title: 'Operations & Infrastructure: Los Órganos',
      dept: 'Operaciones & Soporte Vital',
      status: 'upcoming',
      deadline: '2025-10-25',
      summary: 'Matriz energética (solar/nuclear), balance de potencia eléctrica, ciclo cerrado de reciclaje de aire/agua (ECLSS) y puertos de atraque.',
      reqs: [
        'Power Budget: Balance de potencia en kW para soporte vital, propulsión y subsistemas.',
        'Sistemas de generación: Paneles fotovoltaicos vs Reactores nucleares de fisión rápida.',
        'ECLSS: Tasa de recuperación de agua ≥ 95% y ciclo Sabatier para O2.',
        'Puertos de atraque y esclusas de transferencia de contenedores.'
      ],
      sampleDoc: 'Propuesta SAPIEN (Komorebi) 2026'
    },
    {
      id: 3,
      code: 'SPRINT-03',
      month: 'NOVIEMBRE (Semana 1-2)',
      title: 'Human Factors & Safety: La Vida',
      dept: 'Habitabilidad & Salud',
      status: 'upcoming',
      deadline: '2025-11-15',
      summary: 'Diseño de la comunidad interior para 80-100 habitantes, urbanismo, psicología de confinamiento, contramedidas médicas y evacuación.',
      reqs: [
        'Zonificación urbana: m² privados por tripulante, zonas comunes, ocio y agricultura.',
        'Ciclos de luz circadiana y control acústico/psicológico.',
        'Instalaciones médicas y protocolos de aislamiento ante emergencias.',
        'Flota de cápsulas de escape y refugio contra tormentas solares (SPE).'
      ],
      sampleDoc: 'Propuesta PONTIFEX 2026'
    },
    {
      id: 4,
      code: 'SPRINT-04',
      month: 'NOVIEMBRE (Semana 3-4)',
      title: 'Automation & Business: El Cerebro y el Capital',
      dept: 'Robótica & Finanzas',
      status: 'upcoming',
      deadline: '2025-12-05',
      summary: 'Catálogo de robots de mantenimiento EVA, computación y ciberseguridad, presupuesto de construcción y cronograma de hitos (Gantt).',
      reqs: [
        'Especificación de 2 robots externos (tipo Canadarm/mantenimiento) y 1 dron interno.',
        'Presupuesto desglosado por fases: I+D, lanzamiento, ensamblaje y operaciones.',
        'Diagrama Gantt de 5 a 10 años hasta la plena operatividad (FOC).',
        'Modelo de ingresos y retorno comercial de la inversión.'
      ],
      sampleDoc: 'UKSDC Competition Guidelines 2025'
    },
    {
      id: 5,
      code: 'SPRINT-05',
      month: 'DICIEMBRE',
      title: 'Gran Simulación Intercolegial (Fase Local)',
      dept: 'Integración Completa RFP',
      status: 'upcoming',
      deadline: '2025-12-20',
      summary: 'Jornada intensiva de simulación mezclando a los 120 alumnos de los 4 colegios en 4 grandes empresas para responder al RFP oficial.',
      reqs: [
        'Entrega de la propuesta completa unificada (máx. 35-50 diapositivas).',
        'Elección de Presidencia y Directores de departamento por parte de los alumnos.',
        'Defensa oral de 15 minutos ante el panel de jueces.',
        'Ronda de preguntas y respuestas técnicas (Q&A) de 10 minutos.'
      ],
      sampleDoc: 'RFP Olympus MTC / National Final Guidelines'
    }
  ],
  submissions: [],
  registeredStudents: [],
  activeStudent: null
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initClocks();
  initCountdown();
  loadSchoolsConfig();
  populateSchoolDropdowns();
  loadRegisteredStudents();
  loadSprintKeys();
  loadStudentSession();
  loadSubmissions();
  renderSprints();
  updateDeliverableOptions();
  setupEventListeners();
  initCalculators();
  initSimulationModule();
});

// Relojes de la barra superior (UTC & Local)
function initClocks() {
  function updateClocks() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    const utcEl = document.getElementById('utcClock');
    if (utcEl) utcEl.textContent = `${utcHours}:${utcMinutes}:${utcSeconds}`;

    const localHours = String(now.getHours()).padStart(2, '0');
    const localMinutes = String(now.getMinutes()).padStart(2, '0');
    const localSeconds = String(now.getSeconds()).padStart(2, '0');
    const localEl = document.getElementById('localClock');
    if (localEl) localEl.textContent = `${localHours}:${localMinutes}:${localSeconds}`;
  }
  updateClocks();
  setInterval(updateClocks, 1000);
}

// Cuenta atrás para la Gran Simulación de Diciembre
function initCountdown() {
  const targetDate = new Date('2025-12-20T08:30:00');
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMinutes').textContent = '00';
      document.getElementById('cdSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Navegación entre pestañas de la Web
function navigateTo(viewId) {
  AppState.activeView = viewId;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

  const targetSec = document.getElementById(viewId);
  const targetTab = document.querySelector(`.nav-tab[data-view="${viewId}"]`);

  if (targetSec) targetSec.classList.add('active');
  if (targetTab) targetTab.classList.add('active');

  if (viewId === 'december') {
    initSimulationModule();
  }

  if (viewId === 'sprints' || viewId === 'submissions') {
    if (AppState.activeStudent) {
      showStudentLoggedInUI(AppState.activeStudent);
    } else {
      showStudentLoggedOutUI();
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// GESTIÓN DE CLAVES Y DESBLOQUEO DE SPRINTS (GOOGLE CLASSROOM)
function loadSprintKeys() {
  const saved = localStorage.getItem('spsdc_sprint_keys');
  if (saved) {
    try {
      AppState.sprintKeys = Object.assign({}, DEFAULT_SPRINT_KEYS, JSON.parse(saved));
    } catch(e) {
      AppState.sprintKeys = Object.assign({}, DEFAULT_SPRINT_KEYS);
    }
  } else {
    AppState.sprintKeys = Object.assign({}, DEFAULT_SPRINT_KEYS);
  }
}

function saveSprintKeys() {
  localStorage.setItem('spsdc_sprint_keys', JSON.stringify(AppState.sprintKeys));
}

function getUnlockedSprints() {
  try {
    const raw = sessionStorage.getItem('spsdc_unlocked_sprints');
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function unlockSprint(sprintId) {
  const inputEl = document.getElementById(`sprintKeyInput_${sprintId}`);
  const keyEntered = inputEl ? inputEl.value.trim().toUpperCase() : '';
  const expectedKey = (AppState.sprintKeys[sprintId] || DEFAULT_SPRINT_KEYS[sprintId] || '').toUpperCase();

  if (!keyEntered) {
    alert('Por favor, introduce la clave facilitada por tu profesor en Google Classroom.');
    return;
  }

  if (keyEntered !== expectedKey) {
    alert(`❌ Clave incorrecta para el Sprint ${sprintId}.\n\nPor favor, comprueba el anuncio oficial de tu profesor en Google Classroom.`);
    return;
  }

  const unlocked = getUnlockedSprints();
  if (!unlocked.includes(sprintId)) {
    unlocked.push(sprintId);
    sessionStorage.setItem('spsdc_unlocked_sprints', JSON.stringify(unlocked));
  }

  renderSprints();
  alert(`🔓 ¡Sprint ${sprintId} Desbloqueado y Desplegado!\n\nYa puedes revisar las especificaciones técnicas del pliego oficial (RFP), requisitos y buzón de entregas.`);
}

function lockSprint(sprintId) {
  let unlocked = getUnlockedSprints();
  unlocked = unlocked.filter(id => id !== sprintId);
  sessionStorage.setItem('spsdc_unlocked_sprints', JSON.stringify(unlocked));
  renderSprints();
}

// Renderizado dinámico de Sprints (Comprimidos por defecto · Desbloqueo por Clave de Classroom)
function renderSprints() {
  const grid = document.getElementById('sprintsGrid');
  if (!grid) return;

  const unlockedSprints = getUnlockedSprints();

  grid.innerHTML = AppState.sprints.map(sprint => {
    const isUnlocked = unlockedSprints.includes(sprint.id);
    const isMercury = sprint.id === 1;

    // ESTADO 1: SPRINT COMPRIMIDO (BLOQUEADO HASTA CLAVE DE CLASSROOM)
    if (!isUnlocked) {
      return `
      <div class="sprint-card sprint-card-collapsed" id="sprintCard_${sprint.id}">
        <div class="sprint-header">
          <span class="sprint-code">${sprint.code} • ${sprint.month}</span>
          <span class="sprint-badge badge-locked">🔒 SPRINT COMPRIMIDO</span>
        </div>
        
        <h3 class="sprint-title" style="margin: 6px 0 2px 0;">${sprint.title}</h3>
        <div class="sprint-dept" style="color:var(--text-muted); font-size:0.82rem;">${sprint.dept}</div>

        <div class="sprint-unlock-box">
          <label for="sprintKeyInput_${sprint.id}" style="font-size:0.95rem; color:var(--amber-alert); margin-bottom:10px; font-weight:700; display:flex; align-items:center; gap:8px; letter-spacing:0.5px;">
            <span>🔑 CLAVE DE ACCESO (GOOGLE CLASSROOM):</span>
          </label>
          <div style="display:flex; gap:12px; align-items:stretch; flex-wrap:wrap;">
            <input type="text" id="sprintKeyInput_${sprint.id}" class="form-control sprint-unlock-input" placeholder="Escribe aquí la clave" style="flex:1; min-width:260px;" onkeyup="if(event.key==='Enter') unlockSprint(${sprint.id})">
            <button class="btn-hud btn-hud-primary" style="white-space:nowrap; min-height:52px; padding:0 24px; font-size:0.95rem; font-weight:700; display:inline-flex; align-items:center; justify-content:center; gap:8px;" onclick="unlockSprint(${sprint.id})">
              🔓 Desplegar Sprint
            </button>
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:10px;">
            ℹ️ Tu profesor facilitará la clave oficial en el tablón de Google Classroom en la fecha fijada.
          </div>
        </div>
      </div>
      `;
    }

    // ESTADO 2: SPRINT DESPLEGADO / DESBLOQUEADO
    return `
    <div class="sprint-card" id="sprintCard_${sprint.id}" style="${isMercury ? 'border-color: rgba(6,182,212,0.5); box-shadow: 0 0 25px rgba(6,182,212,0.15);' : ''}">
      <div class="sprint-header">
        <span class="sprint-code">${sprint.code} • ${sprint.month}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="sprint-badge badge-active">🔓 DESPLEGADO</span>
          <button class="btn-hud btn-hud-secondary" style="padding:2px 8px; font-size:0.7rem;" onclick="lockSprint(${sprint.id})" title="Volver a comprimir">
            🔒 Comprimir
          </button>
        </div>
      </div>

      ${sprint.planet ? `<div class="rfp-badge-planet">${sprint.planet}</div>` : ''}

      <h3 class="sprint-title">${sprint.title}</h3>
      <div class="sprint-dept">${sprint.dept}</div>
      
      <div style="display:flex; align-items:center; gap:8px; margin: 6px 0 10px 0; flex-wrap:wrap;">
        <span class="badge-modality-group">👥 En Equipo (Mismo Colegio)</span> 
        <span class="badge-modality-indiv">👤 Individual</span>
      </div>

      <p class="sprint-desc">${sprint.summary}</p>
      
      ${sprint.deliverables ? `
        <div class="sprint-deliverables-container">
          <strong style="color:var(--text-primary); font-size:0.82rem; display:block; margin-bottom:8px; font-family:var(--font-hud);">
            📦 ENTREGABLES FORMALES REQUERIDOS:
          </strong>

          <!-- Entregas Individuales -->
          <div style="margin-bottom:10px;">
            <div style="font-size:0.75rem; color:var(--cyan-core); font-weight:700; margin-bottom:4px;">
              👤 ENTREGAS INDIVIDUALES (Física, Materiales & Vídeo en Inglés):
            </div>
            ${(sprint.deliverables.individual || []).map(ind => `
              <div style="margin-bottom:6px; background:rgba(6,182,212,0.04); border-left:3px solid var(--cyan-core); padding:6px 8px; border-radius:0 4px 4px 0;">
                <span class="deliverable-tag-ind">${ind.code}</span>
                <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${ind.title}</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${ind.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Entrega Grupal por Colegio -->
          <div>
            <div style="font-size:0.75rem; color:var(--emerald-success); font-weight:700; margin-bottom:4px;">
              👥 ENTREGA GRUPAL POR COLEGIO (2-5 alumnos):
            </div>
            ${(sprint.deliverables.group || []).map(grp => `
              <div style="background:rgba(16,185,129,0.05); border-left:3px solid var(--emerald-success); padding:6px 8px; border-radius:0 4px 4px 0;">
                <span class="deliverable-tag-grp">${grp.code}</span>
                <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${grp.title}</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${grp.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="sprint-requirements">
          <strong>📋 REQUISITOS DEL ENTREGABLE:</strong>
          <ul>
            ${sprint.reqs ? sprint.reqs.map(r => `<li>${r}</li>`).join('') : ''}
          </ul>
        </div>
      `}

      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:auto; margin-bottom:12px;">
        <strong>Doc. contractual de referencia:</strong> ${sprint.sampleDoc || 'Contract FS-M01'}
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto;">
        ${isMercury ? `
          <button class="btn-hud btn-hud-primary" style="width:100%; justify-content:center;" onclick="openRfpModal(${sprint.id})">
            📜 Ver RFP Oficial (Mercurio FS-M01)
          </button>
        ` : ''}
        <button class="btn-hud btn-hud-secondary" style="width:100%; justify-content:center;" onclick="prepareSubmissionFor(${sprint.id})">
          📤 Entregar Trabajo de este Sprint
        </button>
      </div>
    </div>
    `;
  }).join('');
}

// Modal de visualización del RFP Oficial
function openRfpModal(sprintId) {
  const modal = document.getElementById('rfpModal');
  const body = document.getElementById('rfpModalBody');
  const title = document.getElementById('rfpModalTitle');
  const subtitle = document.getElementById('rfpModalSubtitle');
  if (!modal || !body) return;

  if (sprintId === 1) {
    if (title) title.textContent = 'REQUEST FOR PROPOSAL (RFP) · SPRINT 01';
    if (subtitle) subtitle.innerHTML = 'CONTRACT FS-M01 · FOUNDATION SOCIETY · 🪐 DESTINO: PLANETA MERCURIO (HERMES-1)';

    body.innerHTML = `
      <div style="background:rgba(245,158,11,0.08); border-left:4px solid var(--amber-alert); padding:14px 18px; border-radius:4px; margin-bottom:20px;">
        <strong style="color:var(--amber-alert); font-family:var(--font-hud);">⚡ CONDICIONES EXTREMAS DE MISIÓN EN MERCURIO:</strong>
        <p style="margin:6px 0 0 0; font-size:0.86rem; color:var(--text-secondary); line-height:1.5;">
          • Radiación solar directa: <strong>9.1 kW/m²</strong> (6.6 veces la terrestre) a 0.38 UA.<br>
          • Amplitud térmica en el casco: <strong>-180 °C</strong> (lado oscuro) hasta <strong>+430 °C</strong> (cara al Sol).<br>
          • Gravedad artificial requerida: <strong>0.9 - 1.0 G</strong> rotatoria en hábitat permanente (radio recomendado: 100-250 m).<br>
          • Límite médico de cinetosis vestibular (Coriolis): <strong>ω &lt; 3.0 rpm</strong> y gradiente cabeza-pies <strong>&le; 12%</strong>.
        </p>
      </div>

      <h4 style="font-family:var(--font-hud); color:var(--cyan-core); margin:18px 0 8px 0; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
        1. REQUISITOS TÉCNICOS CONTRACTUALES (FOUNDATION SOCIETY FS-M01)
      </h4>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S1.1</span> La propuesta <strong>SHALL</strong> definir la geometría de la estación orbital (Toroide de Stanford, Cilindro rotatorio o Mancuerna contrarrotatoria) indicando radio y dimensiones exteriores.
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S1.2</span> La propuesta <strong>SHALL</strong> incorporar un <strong>Escudo Solar Primario (Sunshield pasivo)</strong> que bloquee el flujo térmico de 9.1 kW/m² y proyecte un cono de sombra protector sobre los módulos habitados.
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S1.3</span> La propuesta <strong>SHALL</strong> detallar la composición multicapa del casco (aleación Al-Li / Titanio, cerámicas de circonio de alta reflectividad, escudo Whipple antimeteoroides y blindaje de protones solares).
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S2.1</span> La propuesta <strong>SHALL</strong> separar claramente los volúmenes con gravedad artificial (alojamiento, centro médico, laboratorios) del muelle de atraque de naves espaciales, que debe situarse en el <strong>eje de rotación (cero-G)</strong>.
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S4.1</span> La aceleración centrípeta en la cubierta principal <strong>SHALL</strong> estar comprendida entre <strong>0.85 G y 1.00 G</strong> (aplicando a = ω² · r).
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S4.2</span> La velocidad de rotación <strong>SHALL</strong> ser inferior a <strong>3.0 rpm</strong> para evitar el efecto Coriolis y la cinetosis vestibular.
      </div>
      <div class="rfp-clause">
        <span class="rfp-shall">MANDATORIO S4.3</span> El gradiente de gravedad cabeza-pies para una persona de 1.80 m <strong>SHALL</strong> ser inferior al <strong>12%</strong>.
      </div>

      <h4 style="font-family:var(--font-hud); color:var(--cyan-core); margin:24px 0 10px 0; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
        2. ESTRUCTURA DE ENTREGABLES OBLIGATORIOS (BUZÓN DE MISIÓN)
      </h4>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:20px;">
        <div style="background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:14px;">
          <span class="deliverable-tag-ind">👤 ENTREGA INDIVIDUAL IND-1A</span>
          <h5 style="color:var(--cyan-core); margin:8px 0 4px 0; font-size:0.95rem;">Memoria de Cálculo de Gravedad Artificial</h5>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0; line-height:1.4;">
            Desarrollo matemático del radio y rpm requeridos para alcanzar 1 G. Cálculo del gradiente cabeza-pies para una persona de 1.80 m y justificación de tolerancia médica (&lt; 3 rpm).<br>
            <strong>Formato:</strong> PDF, Word o Excel con fórmulas y conclusiones.
          </p>
        </div>

        <div style="background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:14px;">
          <span class="deliverable-tag-ind">👤 ENTREGA INDIVIDUAL IND-1B</span>
          <h5 style="color:var(--cyan-core); margin:8px 0 4px 0; font-size:0.95rem;">Ficha Técnica del Casco Multicapa</h5>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0; line-height:1.4;">
            Especificación de materiales (Al-Li, Titanio, cerámicas), capas reflectantes para +430 °C, escudo Whipple antimeteoroides y blindaje contra tormentas solares.<br>
            <strong>Formato:</strong> PDF o infografía técnica explicativa.
          </p>
        </div>

        <div style="background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:14px;">
          <span class="deliverable-tag-ind">👤 ENTREGA INDIVIDUAL IND-1C</span>
          <h5 style="color:var(--cyan-core); margin:8px 0 4px 0; font-size:0.95rem;">Oral Pitch in English (1-2 min Vídeo)</h5>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0; line-height:1.4;">
            Defensa individual grabada en vídeo de 1 a 2 minutos exponiendo en inglés la solución técnica propuesta (física o casco) con <strong>encuadre de CUERPO COMPLETO (de pie)</strong> y presencia formal ante la Foundation Society.<br>
            <strong>Formato:</strong> Archivo MP4/MOV o enlace a Loom, Drive o YouTube.
          </p>
        </div>
      </div>

      <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.4); border-radius:8px; padding:16px; margin-bottom:20px;">
        <span class="deliverable-tag-grp">👥 ENTREGA GRUPAL GRP-1 (EXCLUSIVA POR COLEGIO)</span>
        <h5 style="color:var(--emerald-success); margin:8px 0 6px 0; font-size:1rem;">Propuesta Estructural Completa de la Estación en Mercurio</h5>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0; line-height:1.5;">
          Trabajo en equipo entre alumnos del <strong>MISMO colegio</strong> (ANDEL, FUENLLANA, J.H. NEWMAN o EL PRADO) de 2 a 5 participantes:<br>
          1. <strong>Nombre de la estación y concepto general:</strong> Justificación de la arquitectura elegida.<br>
          2. <strong>Planos o Modelo 3D:</strong> Maqueta virtual (TinkerCAD / Blender / SketchUp) o plano acotado mostrando la geometría y el parasol solar.<br>
          3. <strong>Distribución de cubiertas:</strong> Módulos con gravedad artificial vs atraque de naves en microgravedad (eje rotacional).<br>
          4. <strong>Memoria técnica unificada (3 a 6 págs o presentación de 5-10 diapositivas):</strong> Integrando los cálculos individuales de los miembros del equipo.
        </p>
        <span style="font-size:0.8rem; color:var(--text-muted);">
          📍 <em>Nota importante:</em> En esta fase los equipos colaboran internamente entre compañeros del mismo colegio para competir o aportar a la gran simulación de Diciembre.
        </span>
      </div>

      <h4 style="font-family:var(--font-hud); color:var(--cyan-core); margin:20px 0 8px 0; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
        3. RÚBRICA OFICIAL DEL JURADO (100 PUNTOS)
      </h4>
      <table style="width:100%; border-collapse:collapse; font-size:0.82rem; margin-top:8px;">
        <thead>
          <tr style="background:rgba(255,255,255,0.05); text-align:left;">
            <th style="padding:8px; border:1px solid var(--border-subtle);">Criterio</th>
            <th style="padding:8px; border:1px solid var(--border-subtle); width:70px;">Peso</th>
            <th style="padding:8px; border:1px solid var(--border-subtle);">Descripción del Estándar Aeroespacial</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px; border:1px solid var(--border-subtle); color:var(--cyan-core); font-weight:600;">Rigor Técnico y Físico</td>
            <td style="padding:8px; border:1px solid var(--border-subtle); text-align:center; font-weight:700;">25 pts</td>
            <td style="padding:8px; border:1px solid var(--border-subtle);">Cálculos exactos de gravedad rotatoria, gradiente cabeza-pies &lt; 12% y respeto estricto del límite de mareo vestibular (&lt; 3 rpm).</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid var(--border-subtle); color:var(--cyan-core); font-weight:600;">Viabilidad Térmica en Mercurio</td>
            <td style="padding:8px; border:1px solid var(--border-subtle); text-align:center; font-weight:700;">25 pts</td>
            <td style="padding:8px; border:1px solid var(--border-subtle);">Eficacia del parasol pasivo contra 9.1 kW/m², materiales resistentes al rango -180 °C a +430 °C y blindaje contra viento solar.</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid var(--border-subtle); color:var(--cyan-core); font-weight:600;">Diseño 3D y Planos de la Estación</td>
            <td style="padding:8px; border:1px solid var(--border-subtle); text-align:center; font-weight:700;">25 pts</td>
            <td style="padding:8px; border:1px solid var(--border-subtle);">Claridad de planos, modelos 3D (TinkerCAD/renders) y distribución coherente de áreas residenciales vs atraques cero-G.</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid var(--border-subtle); color:var(--cyan-core); font-weight:600;">Defensa Oral en Inglés y Calidad Ejecutiva</td>
            <td style="padding:8px; border:1px solid var(--border-subtle); text-align:center; font-weight:700;">25 pts</td>
            <td style="padding:8px; border:1px solid var(--border-subtle);">Síntesis ejecutiva, claridad formal, defensa oral individual en inglés IND-1C (vídeo 1-2 min de pie a cuerpo completo) y cohesión de equipo.</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  modal.style.display = 'flex';
  modal.classList.add('active');
}

function closeRfpModal() {
  const modal = document.getElementById('rfpModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function downloadRfpMarkdown() {
  const a = document.createElement('a');
  a.href = 'RFP_SPRINT_01_MERCURIO.md';
  a.download = 'RFP_SPRINT_01_MERCURIO.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Selector de Modalidad de Entrega (Individual vs Grupo)
function setSubmissionModality(modality) {
  const btnGroup = document.getElementById('btnModalityGroup');
  const btnIndiv = document.getElementById('btnModalityIndividual');
  const hiddenInput = document.getElementById('subModality');
  const labelTeam = document.getElementById('labelTeamName');
  const inputTeam = document.getElementById('subTeamName');
  const labelAuthors = document.getElementById('labelAuthors');
  const inputAuthors = document.getElementById('subAuthors');
  const authorsHint = document.getElementById('authorsHint');

  const student = AppState.activeStudent;

  if (modality === 'individual') {
    if (btnGroup) btnGroup.classList.remove('active');
    if (btnIndiv) btnIndiv.classList.add('active');
    if (hiddenInput) hiddenInput.value = 'individual';

    if (labelTeam) labelTeam.textContent = 'Nombre y Apellidos del Alumno *';
    if (labelAuthors) labelAuthors.textContent = 'Curso y Grupo Académico *';

    if (student) {
      if (inputTeam) {
        inputTeam.value = student.name;
        inputTeam.readOnly = true;
        inputTeam.style.backgroundColor = 'rgba(6,182,212,0.08)';
        inputTeam.style.borderColor = 'var(--cyan-core)';
      }
      if (inputAuthors) {
        inputAuthors.value = student.grade;
        inputAuthors.readOnly = true;
        inputAuthors.style.backgroundColor = 'rgba(6,182,212,0.08)';
        inputAuthors.style.borderColor = 'var(--cyan-core)';
      }
      if (authorsHint) authorsHint.textContent = '🔒 Datos individuales y curso preconfigurados automáticamente según tu clave oficial.';
    } else {
      if (inputTeam) {
        inputTeam.placeholder = 'Ej: Lucía Gómez Fernández';
        inputTeam.readOnly = false;
        inputTeam.style.backgroundColor = '';
        inputTeam.style.borderColor = '';
      }
      if (inputAuthors) {
        inputAuthors.placeholder = 'Ej: 4º ESO B (o 1º Bachillerato A)';
        inputAuthors.readOnly = false;
        inputAuthors.style.backgroundColor = '';
        inputAuthors.style.borderColor = '';
      }
      if (authorsHint) authorsHint.textContent = 'Especifica tu curso escolar para registrar tu entrega individual en el expediente.';
    }
  } else {
    if (btnGroup) btnGroup.classList.add('active');
    if (btnIndiv) btnIndiv.classList.remove('active');
    if (hiddenInput) hiddenInput.value = 'group';

    if (labelTeam) labelTeam.textContent = 'Nombre del Equipo / Grupo *';
    if (labelAuthors) labelAuthors.textContent = 'Nombres y Apellidos de los Integrantes *';

    if (inputTeam) {
      inputTeam.readOnly = false;
      inputTeam.style.backgroundColor = '';
      inputTeam.style.borderColor = '';
      if (student && inputTeam.value === student.name) {
        inputTeam.value = '';
      }
      inputTeam.placeholder = 'Ej: Equipo Aurora - Escuadrón Apolo';
    }

    if (inputAuthors) {
      inputAuthors.readOnly = false;
      inputAuthors.style.backgroundColor = '';
      inputAuthors.style.borderColor = '';
      if (student) {
        if (!inputAuthors.value || inputAuthors.value === student.grade) {
          inputAuthors.value = `${student.name} (Líder), `;
        }
        if (authorsHint) authorsHint.textContent = '👥 Tu nombre ya figura como líder. Añade los nombres y apellidos de tus compañeros de equipo.';
      } else {
        inputAuthors.placeholder = 'Ej: Lucía Gómez (Líder), David Romero, Carlos Vega...';
        if (authorsHint) authorsHint.textContent = 'Indica todos los miembros del equipo que firman el trabajo.';
      }
    }
  }

  // Actualizar el selector dinámico del entregable (IND-1A, IND-1B, GRP-1)
  updateDeliverableOptions();
}

// Actualización dinámica del selector de entregables del Sprint y Modalidad
function updateDeliverableOptions() {
  const select = document.getElementById('subDeliverableType');
  const sprintId = document.getElementById('subSprint') ? document.getElementById('subSprint').value : '1';
  const modality = document.getElementById('subModality') ? document.getElementById('subModality').value : 'group';
  const hintEl = document.getElementById('deliverableHint');

  if (!select) return;

  const sprint = AppState.sprints.find(s => s.id === Number(sprintId));
  select.innerHTML = '';

  if (sprint && sprint.deliverables) {
    if (modality === 'individual') {
      (sprint.deliverables.individual || []).forEach(del => {
        const opt = document.createElement('option');
        opt.value = del.code;
        opt.textContent = `${del.code}: ${del.title}`;
        select.appendChild(opt);
      });
      if (hintEl) {
        hintEl.innerHTML = `👤 <strong>Entrega Individual:</strong> Elige entre memoria de gravedad (IND-1A), ficha de blindaje (IND-1B) o el <strong>vídeo en inglés a cuerpo completo (IND-1C)</strong>.`;
      }
    } else {
      (sprint.deliverables.group || []).forEach(del => {
        const opt = document.createElement('option');
        opt.value = del.code;
        opt.textContent = `${del.code}: ${del.title}`;
        select.appendChild(opt);
      });
      if (hintEl) {
        hintEl.innerHTML = `👥 <strong>Entrega Grupal por Colegio:</strong> Equipo formado exclusivamente por alumnos del mismo colegio (ANDEL, FUENLLANA, J.H. NEWMAN o EL PRADO).`;
      }
    }
  } else {
    const opt = document.createElement('option');
    opt.value = modality === 'individual' ? `IND-${sprintId}` : `GRP-${sprintId}`;
    opt.textContent = modality === 'individual' 
      ? `IND-${sprintId}: Entrega Individual Técnica del Sprint` 
      : `GRP-${sprintId}: Propuesta de Equipo del Colegio`;
    select.appendChild(opt);
  }
}

// CONTROL DE ACCESO POR CLAVE DE ALUMNO (BUZÓN DE ENTREGA Y SPRINTS)
function loadStudentSession() {
  // Limpiar cualquier residuo permanente en localStorage para que no quede abierta la sesión
  localStorage.removeItem('spsdc_student_session');

  const saved = sessionStorage.getItem('spsdc_student_session');
  if (saved) {
    try {
      const student = JSON.parse(saved);
      const exists = AppState.registeredStudents.find(s => s.key === student.key);
      if (exists) {
        AppState.activeStudent = exists;
        showStudentLoggedInUI(exists);
        return;
      }
    } catch (e) {
      sessionStorage.removeItem('spsdc_student_session');
    }
  }
  showStudentLoggedOutUI();
}

function loginStudentFromSprints() {
  const inputEl = document.getElementById('sprintsStudentKeyInput');
  const key = inputEl ? inputEl.value : '';
  loginStudentWithKey(key);
}

function loginStudentWithKey(keyParam) {
  const inputEl = document.getElementById('studentKeyInput');
  const sprintsInputEl = document.getElementById('sprintsStudentKeyInput');
  const rawKey = keyParam || (inputEl && inputEl.value ? inputEl.value : (sprintsInputEl ? sprintsInputEl.value : ''));
  const cleanKey = (rawKey || '').trim().toUpperCase();

  if (!cleanKey) {
    alert('Por favor, introduce tu clave personal de alumno.');
    return;
  }

  let student = AppState.registeredStudents.find(s => s.key.toUpperCase() === cleanKey);
  
  // Soporte de alias retrocompatible
  if (!student) {
    if (cleanKey.includes('COL1-01') || cleanKey.includes('ANDEL-01')) student = AppState.registeredStudents.find(s => s.schoolId === 'col1');
    else if (cleanKey.includes('COL2-01') || cleanKey.includes('FUEN-01')) student = AppState.registeredStudents.find(s => s.schoolId === 'col2');
    else if (cleanKey.includes('COL3-01') || cleanKey.includes('NEWMAN-01')) student = AppState.registeredStudents.find(s => s.schoolId === 'col3');
    else if (cleanKey.includes('COL4-01') || cleanKey.includes('PRADO-01')) student = AppState.registeredStudents.find(s => s.schoolId === 'col4');
  }

  if (!student) {
    alert(`❌ Clave "${cleanKey}" no reconocida en el Censo Oficial.\n\nPor favor, contacta con tu profesor para que te inscriba en la plataforma.`);
    return;
  }

  AppState.activeStudent = student;
  // Guardar exclusivamente en sessionStorage (se destruye al cerrar la pestaña o el navegador)
  sessionStorage.setItem('spsdc_student_session', JSON.stringify(student));
  showStudentLoggedInUI(student);

  alert(`🚀 ¡Identificación exitosa!\n\nBienvenido/a, ${student.name}.\nColegio: ${student.schoolName}\nCurso: ${student.grade}\n\nTus datos individuales ya están preconfigurados.`);
}

function logoutStudent() {
  AppState.activeStudent = null;
  sessionStorage.removeItem('spsdc_student_session');
  sessionStorage.removeItem('spsdc_unlocked_sprints');
  localStorage.removeItem('spsdc_student_session');
  showStudentLoggedOutUI();
  renderSprints();
  alert('🔒 Sesión cerrada correctamente.\nTodos tus accesos y datos locales han sido desvinculados.');
}

function showStudentLoggedInUI(student) {
  // Buzón de entrega
  const gate = document.getElementById('studentGatePanel');
  const mainContent = document.getElementById('submissionMainContent');
  const nameEl = document.getElementById('bannerStudentName');
  const infoEl = document.getElementById('bannerStudentInfo');
  const schoolSelect = document.getElementById('subSchool');

  if (gate) gate.style.display = 'none';
  if (mainContent) mainContent.style.display = 'block';

  if (nameEl) nameEl.textContent = student.name;
  if (infoEl) infoEl.textContent = `${student.schoolName} • ${student.grade} • Clave Oficial: ${student.key}`;

  if (schoolSelect) {
    schoolSelect.value = student.schoolId;
    schoolSelect.disabled = true;
  }

  // Vista de Sprints
  const sprintsGate = document.getElementById('sprintsGatePanel');
  const sprintsMain = document.getElementById('sprintsMainContent');
  const bannerSprintsName = document.getElementById('bannerSprintsStudentName');
  const bannerSprintsInfo = document.getElementById('bannerSprintsStudentInfo');

  if (sprintsGate) sprintsGate.style.display = 'none';
  if (sprintsMain) sprintsMain.style.display = 'block';

  if (bannerSprintsName) bannerSprintsName.textContent = student.name;
  if (bannerSprintsInfo) bannerSprintsInfo.textContent = `${student.schoolName} • ${student.grade} • Clave Oficial: ${student.key}`;

  const curMod = document.getElementById('subModality') ? document.getElementById('subModality').value : 'group';
  setSubmissionModality(curMod);
  renderSprints();
  renderStudentSubmissionsHistory();
}

// OBTENER Y RENDERIZAR ENTREGAS ANTERIORES DEL ALUMNO ACTIVO
function getSubmissionsForActiveStudent() {
  if (!AppState.activeStudent) return [];
  const s = AppState.activeStudent;
  return AppState.submissions.filter(sub => {
    // Coincidencia por clave de alumno
    if (sub.studentKey && sub.studentKey.toUpperCase() === s.key.toUpperCase()) return true;
    // Coincidencia por nombre en autores o equipo
    if (sub.authors && sub.authors.toLowerCase().includes(s.name.toLowerCase())) return true;
    if (sub.teamName && sub.teamName.toLowerCase().includes(s.name.toLowerCase())) return true;
    return false;
  });
}

function renderStudentSubmissionsHistory() {
  const container = document.getElementById('studentSubmissionsHistory');
  if (!container) return;

  const mySubs = getSubmissionsForActiveStudent();

  if (mySubs.length === 0) {
    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.5); border: 1px dashed var(--border-subtle); border-radius: 8px; padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        📭 Aún no constan entregas registradas para tu clave oficial en este dispositivo.<br>
        <span style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; display: inline-block;">
          Cuando realices tu primer envío a través del formulario superior, quedará archivado automáticamente aquí junto con la calificación y comentarios del jurado.
        </span>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      ${mySubs.map(sub => {
        const isEvaluated = sub.status === 'Evaluada';
        return `
          <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid ${isEvaluated ? 'rgba(16,185,129,0.5)' : 'var(--border-subtle)'}; border-left: 4px solid ${isEvaluated ? 'var(--emerald-success)' : 'var(--cyan-core)'}; border-radius: 8px; padding: 18px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="pill-badge" style="font-size: 0.75rem;">${sub.id}</span>
                  <span class="${sub.modality === 'individual' ? 'badge-modality-indiv' : 'badge-modality-group'}">
                    ${sub.modality === 'individual' ? '👤 Individual' : '👥 En Equipo'}
                  </span>
                  ${sub.deliverableCode ? `
                    <span class="${sub.modality === 'individual' ? 'deliverable-tag-ind' : 'deliverable-tag-grp'}" style="font-size: 0.72rem; padding: 2px 6px;">
                      ${sub.deliverableCode}
                    </span>
                  ` : ''}
                </div>
                <h4 style="color: #fff; margin: 8px 0 2px 0; font-size: 1.05rem;">
                  ${sub.deliverableName || sub.sprintName}
                </h4>
                <div style="font-size: 0.8rem; color: var(--cyan-core);">
                  ${sub.sprintName} • ${sub.deptName || ''}
                </div>
              </div>

              <!-- Estado y Calificación -->
              <div style="text-align: right;">
                <span class="sprint-badge ${isEvaluated ? 'badge-active' : 'badge-upcoming'}" style="font-size: 0.8rem;">
                  ${isEvaluated ? `✅ EVALUADA (${sub.score}/100)` : '⏳ PENDIENTE DE CORRECCIÓN'}
                </span>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                  📅 ${sub.timestamp}
                </div>
              </div>
            </div>

            <!-- Detalles del envío -->
            <div style="margin-top: 12px; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 6px;">
              <div><strong>Firmantes:</strong> ${sub.authors || sub.teamName}</div>
              ${sub.fileNames && sub.fileNames.length > 0 ? `
                <div style="margin-top: 6px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <strong>Archivos enviados:</strong>
                  ${sub.fileNames.map(f => `<span style="color: var(--cyan-core); font-size: 0.8rem;">📎 ${f}</span>`).join(' • ')}
                </div>
              ` : ''}
              ${sub.externalLink ? `
                <div style="margin-top: 6px;">
                  <strong>Enlace aportado:</strong> <a href="${sub.externalLink}" target="_blank" style="color: var(--amber-alert); text-decoration: underline;">🔗 Abrir enlace del proyecto</a>
                </div>
              ` : ''}
              ${sub.notes ? `
                <div style="margin-top: 6px; font-style: italic; color: var(--text-muted);">
                  "${sub.notes}"
                </div>
              ` : ''}
            </div>

            <!-- Feedback del Jurado si está evaluada -->
            ${isEvaluated && sub.feedback ? `
              <div style="margin-top: 12px; background: rgba(16,185,129,0.08); border-left: 3px solid var(--emerald-success); padding: 10px 14px; border-radius: 0 6px 6px 0; font-size: 0.85rem;">
                <strong style="color: var(--emerald-success); font-family: var(--font-hud);">💬 FEEDBACK DEL JURADO:</strong>
                <p style="margin: 4px 0 0 0; color: #fff; line-height: 1.4;">${sub.feedback}</p>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function showStudentLoggedOutUI() {
  // Buzón de entrega
  const gate = document.getElementById('studentGatePanel');
  const mainContent = document.getElementById('submissionMainContent');
  const schoolSelect = document.getElementById('subSchool');
  const inputKey = document.getElementById('studentKeyInput');

  if (gate) gate.style.display = 'block';
  if (mainContent) mainContent.style.display = 'none';
  if (schoolSelect) schoolSelect.disabled = false;
  if (inputKey) inputKey.value = '';

  // Vista de Sprints
  const sprintsGate = document.getElementById('sprintsGatePanel');
  const sprintsMain = document.getElementById('sprintsMainContent');
  const sprintsKeyInput = document.getElementById('sprintsStudentKeyInput');

  if (sprintsGate) sprintsGate.style.display = 'block';
  if (sprintsMain) sprintsMain.style.display = 'none';
  if (sprintsKeyInput) sprintsKeyInput.value = '';
}

function handleSprintSelectionChange() {
  const sprintId = document.getElementById('subSprint') ? document.getElementById('subSprint').value : '1';
  if (sprintId === '5') {
    setSubmissionModality('group');
    const labelTeam = document.getElementById('labelTeamName');
    if (labelTeam) labelTeam.textContent = 'Compañía Aeroespacial (Condor / Sapien / Boscom / Pontifex) *';
  } else {
    const curMod = document.getElementById('subModality') ? document.getElementById('subModality').value : 'group';
    setSubmissionModality(curMod);
  }
}

function prepareSubmissionFor(sprintId) {
  navigateTo('submissions');
  const select = document.getElementById('subSprint');
  if (select) {
    select.value = sprintId;
    handleSprintSelectionChange();
  }
}

// Lógica del Buzón de Entrega (Upload Bay)
let uploadedFilesCache = [];

function setupEventListeners() {
  // Pestañas de navegación
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.getAttribute('data-view');
      navigateTo(view);
    });
  });

  // Drag and Drop para el buzón
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileUploadInput');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  // Formulario de entrega
  const subForm = document.getElementById('submissionForm');
  if (subForm) {
    subForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitWork();
    });
  }
}

function handleFiles(files) {
  uploadedFilesCache = Array.from(files);
  const fileListEl = document.getElementById('selectedFilesList');
  if (!fileListEl) return;

  if (uploadedFilesCache.length === 0) {
    fileListEl.innerHTML = '';
    return;
  }

  fileListEl.innerHTML = `
    <div style="margin-top:10px; font-size:0.88rem; color:var(--cyan-core);">
      <strong>Archivos listos para enviar (${uploadedFilesCache.length}):</strong>
      <ul style="margin-left: 20px; color: #fff;">
        ${uploadedFilesCache.map(f => `<li>${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
      </ul>
    </div>
  `;
}

// Convertir archivo a Base64 para envío al servidor local
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Quitar el prefijo Data URL (ej: "data:application/pdf;base64,")
      const result = reader.result;
      const base64Index = result.indexOf(';base64,');
      if (base64Index !== -1) {
        resolve(result.substring(base64Index + 8));
      } else {
        resolve(result);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

async function submitWork() {
  const modality = document.getElementById('subModality') ? document.getElementById('subModality').value : 'group';
  const school = AppState.activeStudent ? AppState.activeStudent.schoolId : document.getElementById('subSchool').value;
  const sprintId = document.getElementById('subSprint').value;
  const dept = document.getElementById('subDept').value;
  const teamOrStudentName = document.getElementById('subTeamName').value.trim();
  const authorsOrGrade = document.getElementById('subAuthors').value.trim();
  const externalLink = document.getElementById('subExternalLink').value.trim();
  const notes = document.getElementById('subNotes').value.trim();

  if (!teamOrStudentName) {
    alert(modality === 'individual' 
      ? 'Por favor, introduce tu Nombre y Apellidos.' 
      : 'Por favor, indica el nombre de tu equipo.');
    return;
  }

  const schoolObj = AppState.schools.find(s => s.id === school);
  const sprintObj = AppState.sprints.find(s => s.id === Number(sprintId));
  const deptObj = AppState.departments.find(d => d.id === dept);

  const subId = 'SUB-' + Date.now().toString().slice(-6);
  const displayTeamName = modality === 'individual' ? `[INDIVIDUAL] ${teamOrStudentName}` : teamOrStudentName;
  const displayAuthors = modality === 'individual' ? `${teamOrStudentName} (${authorsOrGrade || 'Alumno individual'})` : authorsOrGrade;

  const deliverableSelect = document.getElementById('subDeliverableType');
  const deliverableCode = deliverableSelect ? deliverableSelect.value : (modality === 'individual' ? 'IND-1A' : 'GRP-1');
  const deliverableName = deliverableSelect && deliverableSelect.selectedOptions[0] ? deliverableSelect.selectedOptions[0].textContent : deliverableCode;

  // Botón en estado de carga
  const submitBtn = document.querySelector('#submissionForm button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Procesando y enviando entrega...';
  }

  try {
    // 1. Convertir archivos adjuntos a base64
    const filesData = [];
    for (const file of uploadedFilesCache) {
      const base64 = await readFileAsBase64(file);
      filesData.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64
      });
    }

    // 2. Enviar al endpoint de guardado local en Google Drive
    const uploadPayload = {
      id: subId,
      modality: modality,
      deliverableCode: deliverableCode,
      deliverableName: deliverableName,
      studentKey: AppState.activeStudent ? AppState.activeStudent.key : null,
      school: schoolObj ? schoolObj.name : school,
      sprint: sprintObj ? sprintObj.code : `Sprint_${sprintId}`,
      dept: deptObj ? deptObj.name : dept,
      teamName: displayTeamName,
      authors: displayAuthors,
      notes: notes,
      externalLink: externalLink,
      files: filesData
    };

    let serverSavedPath = `SPSIN COLEGIOS/${uploadPayload.school}/${uploadPayload.sprint}/${uploadPayload.teamName}`;
    let savedOnDisk = false;

    // 2.A Enviar a la nube de Google Drive (Google Apps Script)
    if (AppState.cloudWebhookUrl) {
      try {
        const response = await fetch(AppState.cloudWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(uploadPayload)
        });

        if (response.ok) {
          const resJson = await response.json();
          if (resJson.status === 'success') {
            serverSavedPath = resJson.savedDir;
            savedOnDisk = true;
          }
        }
      } catch (cloudErr) {
        // En caso de bloqueo CORS en la redirección, reenviar en modo no-cors para asegurar que Google lo ejecute
        try {
          await fetch(AppState.cloudWebhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(uploadPayload)
          });
          savedOnDisk = true;
        } catch (noCorsErr) {
          console.warn('No se pudo contactar con el webhook de Google Drive:', noCorsErr);
        }
      }
    }

    // 2.B Si está en local, guardar también en el servidor local de contingencia
    try {
      if (window.location.origin.includes('localhost') || window.location.protocol === 'file:') {
        const localUrl = window.location.origin.includes('localhost') ? '/api/upload' : 'http://localhost:8080/api/upload';
        await fetch(localUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadPayload)
        });
        savedOnDisk = true;
      }
    } catch (localErr) {
      // Servidor local no activo, la nube ya lo gestionó
    }

    // 3. Registrar en el estado de la aplicación y localStorage
    const newSubmission = {
      id: subId,
      timestamp: new Date().toLocaleString('es-ES'),
      modality: modality,
      deliverableCode: deliverableCode,
      deliverableName: deliverableName,
      studentKey: AppState.activeStudent ? AppState.activeStudent.key : null,
      schoolId: school,
      schoolName: schoolObj ? schoolObj.name : school,
      sprintId: Number(sprintId),
      sprintName: sprintObj ? sprintObj.title : `Sprint ${sprintId}`,
      deptId: dept,
      deptName: deptObj ? deptObj.name : dept,
      teamName: displayTeamName,
      authors: displayAuthors,
      externalLink: externalLink,
      notes: notes,
      fileNames: uploadedFilesCache.map(f => f.name),
      targetDriveFolder: serverSavedPath,
      savedOnDisk: savedOnDisk,
      status: 'Pendiente',
      score: null,
      rubric: null,
      feedback: ''
    };

    AppState.submissions.unshift(newSubmission);
    saveSubmissions();

    // Reset del formulario
    document.getElementById('submissionForm').reset();
    setSubmissionModality('group');
    uploadedFilesCache = [];
    document.getElementById('selectedFilesList').innerHTML = '';

    // Feedback al usuario
    const modalityLabel = modality === 'individual' ? '👤 Individual' : '👥 En Equipo';
    if (savedOnDisk) {
      alert(`✅ ¡ENTREGA ENVIADA CON ÉXITO!\n\n` +
            `ID de Entrega: ${subId}\n` +
            `Modalidad: ${modalityLabel}\n` +
            `Entregable: ${deliverableName}\n` +
            `${modality === 'individual' ? 'Estudiante' : 'Equipo'}: ${teamOrStudentName}\n` +
            `Colegio: ${uploadPayload.school}\n` +
            `Sprint: ${uploadPayload.sprint}\n` +
            `Archivos recibidos: ${filesData.length}\n\n` +
            `El panel del jurado ya tiene registrada vuestra propuesta.`);
    } else {
      alert(`✅ ¡ENTREGA REGISTRADA CON ÉXITO!\n\n` +
            `ID de Entrega: ${subId}\n` +
            `Modalidad: ${modalityLabel}\n` +
            `Entregable: ${deliverableName}\n` +
            `${modality === 'individual' ? 'Estudiante' : 'Equipo'}: ${teamOrStudentName}\n` +
            `Archivos procesados: ${filesData.length}\n\n` +
            `Vuestro trabajo ha sido enviado al jurado.`);
    }

    renderJurySubmissions();
    renderStudentSubmissionsHistory();
    // Scroll suave hacia el expediente para que vea su entrega registrada
    const historyEl = document.getElementById('studentSubmissionsHistory');
    if (historyEl) historyEl.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Error al enviar entrega:', err);
    alert('Hubo un problema al procesar la entrega: ' + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}

// Persistencia de entregas
function saveSubmissions() {
  localStorage.setItem('spsdc_submissions', JSON.stringify(AppState.submissions));
  syncSubmissionsToServer();
}

async function syncSubmissionsToServer() {
  try {
    const endpoint = (window.location.origin.includes('localhost') || window.location.protocol === 'file:')
      ? (window.location.origin.includes('localhost') ? '/api/submissions/sync' : 'http://localhost:8080/api/submissions/sync')
      : null;
    if (!endpoint) return;

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AppState.submissions)
    });
  } catch(e) {
    // Modo offline / GitHub Pages
  }
}

async function fetchSubmissionsFromServer() {
  try {
    const endpoint = (window.location.origin.includes('localhost') || window.location.protocol === 'file:')
      ? (window.location.origin.includes('localhost') ? '/api/submissions' : 'http://localhost:8080/api/submissions')
      : null;
    if (!endpoint) return;

    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const map = new Map();
        AppState.submissions.forEach(s => map.set(s.id, s));
        data.forEach(s => {
          map.set(s.id, Object.assign({}, map.get(s.id) || {}, s));
        });
        AppState.submissions = Array.from(map.values());
        localStorage.setItem('spsdc_submissions', JSON.stringify(AppState.submissions));

        if (AppState.activeStudent) {
          renderStudentSubmissionsHistory();
        }
        if (AppState.juryAuthenticated) {
          renderJurySubmissions();
          renderLeaderboard();
        }
      }
    }
  } catch (e) {
    // Offline / GitHub Pages
  }
}

function loadSubmissions() {
  const saved = localStorage.getItem('spsdc_submissions');
  if (saved) {
    try {
      AppState.submissions = JSON.parse(saved);
    } catch (e) {
      AppState.submissions = [];
    }
  }

  // Si no hay ninguna, creamos un set de ejemplo que incluye equipo e individual
  if (AppState.submissions.length === 0) {
    AppState.submissions = [
      {
        id: 'SUB-104921',
        timestamp: '23/09/2026, 18:30:15',
        modality: 'group',
        schoolId: 'col1',
        schoolName: 'ANDEL',
        sprintId: 1,
        sprintName: 'Structural Engineering: El Esqueleto',
        deptId: 'structural',
        deptName: 'Structural Engineering',
        teamName: 'AeroNova Team',
        authors: 'Lucía G., Marcos P., David R.',
        externalLink: 'https://www.tinkercad.com/things/example-station-3d',
        notes: 'Diseño toroide con radio de 250m a 1.9 rpm (0.98G). Casco triple con blindaje de agua.',
        fileNames: ['AeroNova_Calculos_Gravedad.xlsx', 'Render_Toroide_Blender.png'],
        targetDriveFolder: 'H:\\Mi unidad\\SPSIN COLEGIOS\\ANDEL\\SPRINT-01',
        status: 'Evaluada',
        score: 92,
        rubric: { technical: 9, feasibility: 9, innovation: 10, presentation: 9 },
        feedback: 'Excelente justificación del límite de Coriolis por debajo de 2 rpm. Renders 3D muy limpios.'
      },
      {
        id: 'SUB-104922',
        timestamp: '23/09/2026, 19:15:40',
        modality: 'group',
        schoolId: 'col2',
        schoolName: 'FUENLLANA',
        sprintId: 1,
        sprintName: 'Structural Engineering: El Esqueleto',
        deptId: 'structural',
        deptName: 'Structural Engineering',
        teamName: 'Pioneer Horizon',
        authors: 'Elena S., Carlos V.',
        externalLink: 'https://docs.google.com/presentation/d/example',
        notes: 'Propuesta de cilindros concéntricos contrarrotatorios para compensar momento angular.',
        fileNames: ['Pioneer_Propuesta_Estructural.pdf'],
        targetDriveFolder: 'H:\\Mi unidad\\SPSIN COLEGIOS\\FUENLLANA\\SPRINT-01',
        status: 'Pendiente',
        score: null,
        rubric: null,
        feedback: ''
      },
      {
        id: 'SUB-104923',
        timestamp: '24/09/2026, 11:20:05',
        modality: 'individual',
        schoolId: 'col3',
        schoolName: 'J.H. NEWMAN',
        sprintId: 1,
        sprintName: 'Structural Engineering: El Esqueleto',
        deptId: 'structural',
        deptName: 'Structural Engineering',
        teamName: '[INDIVIDUAL] Mateo Navas',
        authors: 'Mateo Navas (4º ESO B)',
        externalLink: '',
        notes: 'Estudio individual comparativo de aleaciones Al-Li vs blindaje de polietileno frente a radiación cósmica (GCR).',
        fileNames: ['Estudio_Materiales_MateoNavas.pdf'],
        targetDriveFolder: 'H:\\Mi unidad\\SPSIN COLEGIOS\\J.H. NEWMAN\\SPRINT-01',
        status: 'Pendiente',
        score: null,
        rubric: null,
        feedback: ''
      }
    ];
    saveSubmissions();
  } else {
    // Sincronizar nombres si cambiaron
    AppState.submissions.forEach(sub => {
      const sch = AppState.schools.find(s => s.id === sub.schoolId);
      if (sch) sub.schoolName = sch.name;
    });
  }

  // Sincronizar automáticamente en segundo plano con el servidor central/Google Drive
  fetchSubmissionsFromServer();
}

// PANEL DE JURADO (EVALUACIÓN & CENSO)
function unlockJury() {
  const pinInput = document.getElementById('juryPinInput').value;
  if (pinInput === '2026') {
    AppState.juryAuthenticated = true;
    AppState.organizerAuthenticated = true;
    document.getElementById('juryGatePanel').style.display = 'none';
    document.getElementById('juryMainContent').style.display = 'block';
    renderJurySubmissions();
    renderRegisteredStudentsTable();
    renderLeaderboard();
  } else {
    alert('PIN incorrecto. Acceso restringido exclusivamente a profesores y miembros del jurado.');
  }
}

// Navegación interna entre pestañas del panel de Jurado
function switchJurySubTab(tabName) {
  const tabs = [
    { id: 'eval', btn: 'tabBtnEval', container: 'subtabJuryEval' },
    { id: 'students', btn: 'tabBtnStudents', container: 'subtabJuryStudents' },
    { id: 'leaderboard', btn: 'tabBtnLeaderboard', container: 'subtabJuryLeaderboard' },
    { id: 'sprintkeys', btn: 'tabBtnSprintKeys', container: 'subtabJurySprintKeys' }
  ];

  tabs.forEach(t => {
    const btn = document.getElementById(t.btn);
    const container = document.getElementById(t.container);
    if (btn) {
      if (t.id === tabName) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (container) {
      container.style.display = (t.id === tabName) ? 'block' : 'none';
    }
  });

  if (tabName === 'students') {
    renderRegisteredStudentsTable();
  } else if (tabName === 'eval') {
    renderJurySubmissions();
  } else if (tabName === 'leaderboard') {
    renderLeaderboard();
  } else if (tabName === 'sprintkeys') {
    renderJurySprintKeys();
  }
}

// Renderizado de Claves de Google Classroom para los Profesores
function renderJurySprintKeys() {
  const container = document.getElementById('sprintKeysListContainer');
  if (!container) return;

  container.innerHTML = AppState.sprints.map(sprint => {
    const currentKey = AppState.sprintKeys[sprint.id] || DEFAULT_SPRINT_KEYS[sprint.id] || `SPRINT-${sprint.id}`;
    return `
      <div style="background:rgba(15,23,42,0.8); border:1px solid var(--border-subtle); border-radius:8px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
        <div style="max-width:400px;">
          <span class="pill-badge" style="margin-bottom:6px;">${sprint.code} • ${sprint.month}</span>
          <div style="font-weight:700; color:#fff; font-size:1.05rem;">${sprint.title}</div>
          <div style="font-size:0.8rem; color:var(--cyan-core); margin-top:2px;">${sprint.dept}</div>
        </div>

        <div style="display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap;">
          <div>
            <label style="display:block; font-size:0.75rem; color:var(--amber-alert); font-weight:700; margin-bottom:4px; letter-spacing:0.5px;">
              CLAVE CLASSROOM (PARA LOS ALUMNOS):
            </label>
            <input type="text" id="adminSprintKey_${sprint.id}" class="form-control" value="${currentKey}" style="width:180px; font-family:var(--font-hud); letter-spacing:2px; text-transform:uppercase; text-align:center; font-weight:700; font-size:0.95rem;">
          </div>
          <button class="btn-hud btn-hud-primary" style="padding:10px 14px; font-size:0.82rem;" onclick="copySprintKey(${sprint.id})">
            📋 Copiar para Classroom
          </button>
          <button class="btn-hud btn-hud-secondary" style="padding:10px 14px; font-size:0.82rem;" onclick="saveSingleSprintKey(${sprint.id})">
            💾 Guardar Clave
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function copySprintKey(sprintId) {
  const input = document.getElementById(`adminSprintKey_${sprintId}`);
  const key = input ? input.value.trim().toUpperCase() : (AppState.sprintKeys[sprintId] || '');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(key).then(() => {
      alert(`📋 ¡Clave copiada con éxito!\n\nClave del Sprint ${sprintId}: "${key}"\n\nYa puedes pegarla en el tablón de Google Classroom para tus alumnos.`);
    }).catch(() => {
      alert(`Clave del Sprint ${sprintId}: ${key}`);
    });
  } else {
    alert(`Clave del Sprint ${sprintId}: ${key}`);
  }
}

function saveSingleSprintKey(sprintId) {
  const input = document.getElementById(`adminSprintKey_${sprintId}`);
  const key = input ? input.value.trim().toUpperCase() : '';
  if (!key) {
    alert('La clave no puede estar vacía.');
    return;
  }
  AppState.sprintKeys[sprintId] = key;
  saveSprintKeys();
  renderSprints();
  alert(`💾 Clave del Sprint ${sprintId} actualizada a "${key}".`);
}

// GESTIÓN Y CONFIGURACIÓN DINÁMICA DE COLEGIOS
function loadSchoolsConfig() {
  const saved = localStorage.getItem('spsdc_schools_config');
  if (saved) {
    try {
      AppState.schools = JSON.parse(saved);
    } catch (e) {
      AppState.schools = JSON.parse(JSON.stringify(DEFAULT_SCHOOLS));
    }
  } else {
    AppState.schools = JSON.parse(JSON.stringify(DEFAULT_SCHOOLS));
    saveSchoolsConfig();
  }
}

function saveSchoolsConfig() {
  localStorage.setItem('spsdc_schools_config', JSON.stringify(AppState.schools));
}

function populateSchoolDropdowns() {
  const selects = [
    { id: 'subSchool', includeAll: false },
    { id: 'regStudentSchool', includeAll: false },
    { id: 'juryFilterSchool', includeAll: true },
    { id: 'filterStudentSchool', includeAll: true }
  ];

  selects.forEach(({ id, includeAll }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const currentVal = el.value;
    let html = '';
    if (includeAll) {
      html += '<option value="all">Todos los Colegios</option>';
    }
    AppState.schools.forEach(sch => {
      html += `<option value="${sch.id}">${sch.name}</option>`;
    });
    el.innerHTML = html;
    if (currentVal && (currentVal === 'all' || AppState.schools.some(s => s.id === currentVal))) {
      el.value = currentVal;
    }
  });

  const summaryEl = document.getElementById('schoolsListSummary');
  if (summaryEl) {
    summaryEl.textContent = AppState.schools.map(s => s.name).join(' • ');
  }

  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`editSchoolName${i}`);
    if (input && AppState.schools[i - 1]) {
      input.value = AppState.schools[i - 1].name;
    }
  }
}

function toggleSchoolEditor(forceOpen) {
  const container = document.getElementById('schoolEditorContainer');
  if (!container) return;
  if (forceOpen === true) {
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
}

function saveEditedSchoolNames() {
  const newNames = [];
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`editSchoolName${i}`);
    const val = input ? input.value.trim() : '';
    if (!val) {
      alert(`Por favor, introduce un nombre válido para el Colegio ${i}.`);
      return;
    }
    newNames.push(val);
  }

  AppState.schools.forEach((sch, idx) => {
    sch.name = newNames[idx];
    sch.shortCode = newNames[idx].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
  });

  saveSchoolsConfig();

  // Actualizar nombres en los alumnos registrados
  AppState.registeredStudents.forEach(st => {
    const sch = AppState.schools.find(s => s.id === st.schoolId);
    if (sch) st.schoolName = sch.name;
  });
  saveRegisteredStudents();

  // Actualizar nombres en las entregas
  AppState.submissions.forEach(sub => {
    const sch = AppState.schools.find(s => s.id === sub.schoolId);
    if (sch) sub.schoolName = sch.name;
  });
  saveSubmissions();

  populateSchoolDropdowns();
  renderRegisteredStudentsTable();
  renderJurySubmissions();
  renderLeaderboard();

  if (AppState.activeStudent) {
    const sch = AppState.schools.find(s => s.id === AppState.activeStudent.schoolId);
    if (sch) AppState.activeStudent.schoolName = sch.name;
    showStudentLoggedInUI(AppState.activeStudent);
  }

  toggleSchoolEditor(false);
  alert('✅ Nombres de colegios actualizados y guardados correctamente en todo el sistema.');
}

function resetToDefaultSchools() {
  if (confirm('¿Restablecer los nombres de los 4 colegios a los originales (ANDEL, FUENLLANA, J.H. NEWMAN, EL PRADO)?')) {
    AppState.schools = JSON.parse(JSON.stringify(DEFAULT_SCHOOLS));
    saveSchoolsConfig();

    AppState.registeredStudents.forEach(st => {
      const sch = AppState.schools.find(s => s.id === st.schoolId);
      if (sch) st.schoolName = sch.name;
    });
    saveRegisteredStudents();

    AppState.submissions.forEach(sub => {
      const sch = AppState.schools.find(s => s.id === sub.schoolId);
      if (sch) sub.schoolName = sch.name;
    });
    saveSubmissions();

    populateSchoolDropdowns();
    renderRegisteredStudentsTable();
    renderJurySubmissions();
    renderLeaderboard();
    toggleSchoolEditor(false);
    alert('🔄 Nombres de colegios restablecidos a ANDEL, FUENLLANA, J.H. NEWMAN y EL PRADO.');
  }
}

// GESTIÓN DEL CENSO DE ALUMNOS INSCRITOS
function loadRegisteredStudents() {
  const saved = localStorage.getItem('spsdc_registered_students');
  if (saved) {
    try {
      AppState.registeredStudents = JSON.parse(saved);
    } catch (e) {
      AppState.registeredStudents = [];
    }
  }

  // Si no hay alumnos, crear plantilla inicial representativa de los 4 colegios y cursos
  if (AppState.registeredStudents.length === 0) {
    AppState.registeredStudents = [
      { key: 'ALU-ANDEL-01', firstName: 'Lucía', lastName: 'Gómez Fernández', name: 'Lucía Gómez Fernández', schoolId: 'col1', schoolName: 'ANDEL', grade: '4º ESO', createdAt: '23/09/2026' },
      { key: 'ALU-ANDEL-02', firstName: 'Marcos', lastName: 'Pérez Salazar', name: 'Marcos Pérez Salazar', schoolId: 'col1', schoolName: 'ANDEL', grade: '1º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-ANDEL-03', firstName: 'David', lastName: 'Romero Gil', name: 'David Romero Gil', schoolId: 'col1', schoolName: 'ANDEL', grade: '2º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-FUEN-01', firstName: 'Elena', lastName: 'Santos Vega', name: 'Elena Santos Vega', schoolId: 'col2', schoolName: 'FUENLLANA', grade: '4º ESO', createdAt: '23/09/2026' },
      { key: 'ALU-FUEN-02', firstName: 'Carlos', lastName: 'Vidal Rivas', name: 'Carlos Vidal Rivas', schoolId: 'col2', schoolName: 'FUENLLANA', grade: '1º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-FUEN-03', firstName: 'Marina', lastName: 'Soler Bravo', name: 'Marina Soler Bravo', schoolId: 'col2', schoolName: 'FUENLLANA', grade: '2º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-NEWMAN-01', firstName: 'Mateo', lastName: 'Navas Ruíz', name: 'Mateo Navas Ruíz', schoolId: 'col3', schoolName: 'J.H. NEWMAN', grade: '4º ESO', createdAt: '23/09/2026' },
      { key: 'ALU-NEWMAN-02', firstName: 'Clara', lastName: 'Domínguez Cano', name: 'Clara Domínguez Cano', schoolId: 'col3', schoolName: 'J.H. NEWMAN', grade: '1º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-NEWMAN-03', firstName: 'Jorge', lastName: 'Alarcón Gil', name: 'Jorge Alarcón Gil', schoolId: 'col3', schoolName: 'J.H. NEWMAN', grade: '2º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-PRADO-01', firstName: 'Sofía', lastName: 'Morales Chen', name: 'Sofía Morales Chen', schoolId: 'col4', schoolName: 'EL PRADO', grade: '4º ESO', createdAt: '23/09/2026' },
      { key: 'ALU-PRADO-02', firstName: 'Adrián', lastName: 'Lozano Blanco', name: 'Adrián Lozano Blanco', schoolId: 'col4', schoolName: 'EL PRADO', grade: '1º Bachillerato', createdAt: '23/09/2026' },
      { key: 'ALU-PRADO-03', firstName: 'Valeria', lastName: 'Nieto Ríos', name: 'Valeria Nieto Ríos', schoolId: 'col4', schoolName: 'EL PRADO', grade: '2º Bachillerato', createdAt: '23/09/2026' }
    ];
    saveRegisteredStudents();
  } else {
    // Sincronizar nombres actuales de colegios con los alumnos existentes
    AppState.registeredStudents.forEach(st => {
      const sch = AppState.schools.find(s => s.id === st.schoolId);
      if (sch) st.schoolName = sch.name;
    });
  }
}

function saveRegisteredStudents() {
  localStorage.setItem('spsdc_registered_students', JSON.stringify(AppState.registeredStudents));
}

function generateStudentKey(schoolId) {
  const school = AppState.schools.find(s => s.id === schoolId);
  let prefix = 'COL1';
  if (school) {
    if (school.shortCode) {
      prefix = school.shortCode;
    } else {
      prefix = school.name.split(' ')[0].replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase();
    }
  } else {
    prefix = (schoolId || 'col1').toUpperCase();
  }
  if (prefix === 'FUENLLANA') prefix = 'FUEN';
  if (prefix === 'ELPRADO') prefix = 'PRADO';

  const existingForSchool = AppState.registeredStudents.filter(s => s.schoolId === schoolId);
  const nextNum = existingForSchool.length + 1;
  const keyCandidate = `ALU-${prefix}-${String(nextNum).padStart(2, '0')}`;
  
  if (AppState.registeredStudents.some(s => s.key === keyCandidate)) {
    return `ALU-${prefix}-${Date.now().toString().slice(-3)}`;
  }
  return keyCandidate;
}

function handleRegisterStudent(e) {
  if (e) e.preventDefault();

  const firstName = document.getElementById('regStudentFirstName').value.trim();
  const lastName = document.getElementById('regStudentLastName').value.trim();
  const schoolId = document.getElementById('regStudentSchool').value;
  const grade = document.getElementById('regStudentGrade').value;
  const customKey = document.getElementById('regStudentCustomKey').value.trim().toUpperCase();

  if (!firstName || !lastName) {
    alert('Por favor, indica nombre y apellidos del alumno.');
    return;
  }

  const schoolObj = AppState.schools.find(s => s.id === schoolId);
  const finalKey = customKey || generateStudentKey(schoolId);

  // Comprobar si la clave ya existe
  if (AppState.registeredStudents.some(s => s.key === finalKey)) {
    alert(`La clave "${finalKey}" ya está en uso. Por favor, especifica otra clave o déjala vacía para autogenerar.`);
    return;
  }

  const newStudent = {
    key: finalKey,
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    schoolId: schoolId,
    schoolName: schoolObj ? schoolObj.name : schoolId,
    grade: grade,
    createdAt: new Date().toLocaleDateString('es-ES')
  };

  AppState.registeredStudents.push(newStudent);
  saveRegisteredStudents();

  // Reset del formulario
  document.getElementById('studentRegistrationForm').reset();
  renderRegisteredStudentsTable();

  alert(`✅ ¡ALUMNO INSCRITO CON ÉXITO!\n\n` +
        `Estudiante: ${newStudent.name}\n` +
        `Colegio: ${newStudent.schoolName}\n` +
        `Curso: ${newStudent.grade}\n` +
        `CLAVE ASIGNADA: ${newStudent.key}\n\n` +
        `Entrega esta clave al alumno para que pueda acceder al Buzón.`);
}

function renderRegisteredStudentsTable() {
  const tbody = document.getElementById('registeredStudentsBody');
  if (!tbody) return;

  const schoolFilter = document.getElementById('filterStudentSchool') ? document.getElementById('filterStudentSchool').value : 'all';
  const gradeFilter = document.getElementById('filterStudentGrade') ? document.getElementById('filterStudentGrade').value : 'all';
  const search = document.getElementById('searchStudentQuery') ? document.getElementById('searchStudentQuery').value.trim().toLowerCase() : '';

  let list = AppState.registeredStudents;
  if (schoolFilter !== 'all') list = list.filter(s => s.schoolId === schoolFilter);
  if (gradeFilter !== 'all') list = list.filter(s => s.grade === gradeFilter);
  if (search) {
    list = list.filter(s => s.name.toLowerCase().includes(search) || s.key.toLowerCase().includes(search));
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:26px;">No hay alumnos registrados con estos criterios.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(s => {
    // Contar entregas realizadas por este alumno
    const subCount = AppState.submissions.filter(sub => {
      if (sub.studentKey && sub.studentKey === s.key) return true;
      if (sub.authors && sub.authors.includes(s.name)) return true;
      if (sub.teamName && sub.teamName.includes(s.name)) return true;
      return false;
    }).length;

    return `
      <tr>
        <td>
          <span class="key-badge">${s.key}</span>
          <button type="button" class="btn-hud btn-hud-secondary" style="padding:2px 8px; font-size:0.72rem; margin-left:6px;" onclick="copyStudentKey('${s.key}')" title="Copiar clave">
            📋 Copiar
          </button>
        </td>
        <td><strong>${s.name}</strong></td>
        <td><span style="font-size:0.85rem; color:var(--text-secondary);">${s.schoolName}</span></td>
        <td><span class="pill-badge">${s.grade}</span></td>
        <td><span style="font-size:0.8rem; color:var(--text-muted);">${s.createdAt || '23/09/2026'}</span></td>
        <td>
          <span class="sprint-badge ${subCount > 0 ? 'badge-active' : 'badge-upcoming'}">
            ${subCount} ${subCount === 1 ? 'entrega' : 'entregas'}
          </span>
        </td>
        <td>
          <button type="button" class="btn-hud btn-hud-secondary" style="padding:4px 10px; font-size:0.75rem; color:var(--rose-danger);" onclick="deleteRegisteredStudent('${s.key}')">
            🗑️ Baja
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function copyStudentKey(key) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(key).then(() => {
      alert(`📋 Clave "${key}" copiada al portapapeles. Puedes entregársela al alumno.`);
    }).catch(() => {
      prompt('Copia esta clave de alumno:', key);
    });
  } else {
    prompt('Copia esta clave de alumno:', key);
  }
}

function deleteRegisteredStudent(key) {
  const student = AppState.registeredStudents.find(s => s.key === key);
  if (!student) return;

  if (confirm(`¿Estás seguro de que deseas dar de baja a ${student.name} (${student.key})?`)) {
    AppState.registeredStudents = AppState.registeredStudents.filter(s => s.key !== key);
    saveRegisteredStudents();
    renderRegisteredStudentsTable();
  }
}

function toggleBatchStudentImport() {
  const box = document.getElementById('batchImportContainer');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

function handleBatchImportStudents() {
  const textarea = document.getElementById('batchStudentsInput');
  if (!textarea) return;

  const raw = textarea.value.trim();
  if (!raw) {
    alert('Pega al menos una línea con datos de alumno.');
    return;
  }

  const lines = raw.split('\n');
  let addedCount = 0;

  lines.forEach(line => {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const fullName = parts[0];
      let schoolId = 'col1';
      const schoolToken = (parts[1] || '').toLowerCase();
      if (schoolToken.includes('andel') || schoolToken === '1' || schoolToken === 'col1') {
        schoolId = 'col1';
      } else if (schoolToken.includes('fuen') || schoolToken === '2' || schoolToken === 'col2') {
        schoolId = 'col2';
      } else if (schoolToken.includes('newman') || schoolToken === '3' || schoolToken === 'col3') {
        schoolId = 'col3';
      } else if (schoolToken.includes('prado') || schoolToken === '4' || schoolToken === 'col4') {
        schoolId = 'col4';
      } else {
        const found = AppState.schools.find(s => s.name.toLowerCase().includes(schoolToken));
        schoolId = found ? found.id : 'col1';
      }

      let grade = parts[2] || '4º ESO';
      if (grade.includes('4')) grade = '4º ESO';
      else if (grade.includes('1')) grade = '1º Bachillerato';
      else if (grade.includes('2')) grade = '2º Bachillerato';

      const schoolObj = AppState.schools.find(s => s.id === schoolId);
      const key = generateStudentKey(schoolId);

      AppState.registeredStudents.push({
        key: key,
        name: fullName,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
        schoolId: schoolId,
        schoolName: schoolObj ? schoolObj.name : schoolId,
        grade: grade,
        createdAt: new Date().toLocaleDateString('es-ES')
      });
      addedCount++;
    }
  });

  saveRegisteredStudents();
  renderRegisteredStudentsTable();
  textarea.value = '';
  toggleBatchStudentImport();

  alert(`🎉 ¡Lote procesado con éxito!\nSe han inscrito ${addedCount} nuevos alumnos con sus claves oficiales generadas.`);
}

function exportStudentsToCSV() {
  if (AppState.registeredStudents.length === 0) {
    alert('No hay alumnos registrados para exportar.');
    return;
  }

  let csv = 'Clave;Nombre Completo;Colegio;Curso;Fecha de Alta\n';
  AppState.registeredStudents.forEach(s => {
    csv += `"${s.key}";"${s.name}";"${s.schoolName}";"${s.grade}";"${s.createdAt || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Censo_Alumnos_SPSDC_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function renderJurySubmissions() {
  const tbody = document.getElementById('jurySubmissionsBody');
  if (!tbody) return;

  const schoolFilter = document.getElementById('juryFilterSchool') ? document.getElementById('juryFilterSchool').value : 'all';
  const sprintFilter = document.getElementById('juryFilterSprint') ? document.getElementById('juryFilterSprint').value : 'all';
  const modalityFilter = document.getElementById('juryFilterModality') ? document.getElementById('juryFilterModality').value : 'all';

  let list = AppState.submissions;
  if (schoolFilter !== 'all') list = list.filter(s => s.schoolId === schoolFilter);
  if (sprintFilter !== 'all') list = list.filter(s => s.sprintId === Number(sprintFilter));
  if (modalityFilter !== 'all') list = list.filter(s => (s.modality || 'group') === modalityFilter);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:30px;">No hay entregas registradas con estos filtros.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(sub => `
    <tr>
      <td><strong>${sub.id}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${sub.timestamp}</span></td>
      <td>
        <span class="${sub.modality === 'individual' ? 'badge-modality-indiv' : 'badge-modality-group'}">
          ${sub.modality === 'individual' ? '👤 INDIVIDUAL' : '👥 EQUIPO'}
        </span>
        ${sub.deliverableCode ? `
          <div style="margin-top:5px;">
            <span class="${sub.modality === 'individual' ? 'deliverable-tag-ind' : 'deliverable-tag-grp'}" style="font-size:0.7rem; padding:2px 6px;">
              ${sub.deliverableCode}
            </span>
          </div>
        ` : ''}
      </td>
      <td><strong>${sub.teamName}</strong><br><span style="font-size:0.78rem; color:var(--text-muted);">${sub.authors || ''}</span></td>
      <td><span style="font-size:0.85rem; color:var(--text-secondary);">${sub.schoolName}</span></td>
      <td><span class="pill-badge">${sub.sprintName.split(':')[0]}</span><br><span style="font-size:0.75rem; color:var(--text-secondary);">${sub.deptName ? sub.deptName.split(' ')[0] : ''}</span></td>
      <td>
        ${sub.fileNames.map(f => `<div style="font-size:0.8rem; color:var(--cyan-core);">📎 ${f}</div>`).join('')}
        ${sub.externalLink ? `<a href="${sub.externalLink}" target="_blank" style="font-size:0.8rem; color:var(--amber-alert); text-decoration:underline;">🔗 Enlace 3D/Slides</a>` : ''}
      </td>
      <td>
        <span class="sprint-badge ${sub.status === 'Evaluada' ? 'badge-active' : 'badge-upcoming'}">
          ${sub.status} ${sub.score ? `(${sub.score}/100)` : ''}
        </span>
      </td>
      <td>
        <button class="btn-hud btn-hud-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="openEvaluationModal('${sub.id}')">
          ⚖️ Evaluar
        </button>
      </td>
    </tr>
  `).join('');
}

let activeEvaluatingSubId = null;

function openEvaluationModal(subId) {
  const sub = AppState.submissions.find(s => s.id === subId);
  if (!sub) return;

  activeEvaluatingSubId = subId;
  const modalityBadge = sub.modality === 'individual'
    ? `<span class="badge-modality-indiv" style="margin-bottom:8px;">👤 Modalidad: Entrega Individual</span>`
    : `<span class="badge-modality-group" style="margin-bottom:8px;">👥 Modalidad: Entrega en Equipo</span>`;

  const deliverableBadge = sub.deliverableCode 
    ? `<span class="${sub.modality === 'individual' ? 'deliverable-tag-ind' : 'deliverable-tag-grp'}" style="margin-left:8px; font-size:0.75rem;">${sub.deliverableCode}: ${sub.deliverableName || ''}</span>`
    : '';

  document.getElementById('modalSubTitle').innerHTML = `${modalityBadge} ${deliverableBadge}<br>Evaluando: ${sub.teamName} (${sub.schoolName})`;
  document.getElementById('modalSubDetails').innerHTML = `
    <strong>Sprint:</strong> ${sub.sprintName} | <strong>Departamento:</strong> ${sub.deptName}<br>
    <strong>${sub.modality === 'individual' ? 'Estudiante y Curso' : 'Integrantes del Equipo'}:</strong> ${sub.authors || 'No especificados'}<br>
    <strong>Entregable Específico:</strong> <span style="color:var(--amber-alert); font-weight:600;">${sub.deliverableName || sub.deliverableCode || 'Propuesta de Sprint'}</span><br>
    <strong>Notas / Resumen:</strong> "${sub.notes || 'Sin notas'}"<br>
    <strong>Registro de Misión:</strong> <span style="font-family:monospace; color:var(--cyan-core);">${sub.targetDriveFolder}</span>
  `;

  // Asignar valores si ya fue evaluada
  const rub = sub.rubric || { technical: 7, feasibility: 7, innovation: 7, presentation: 7 };
  document.getElementById('rubTechnical').value = rub.technical;
  document.getElementById('rubFeasibility').value = rub.feasibility;
  document.getElementById('rubInnovation').value = rub.innovation;
  document.getElementById('rubPresentation').value = rub.presentation;

  updateRubricDisplay();
  document.getElementById('rubFeedback').value = sub.feedback || '';

  document.getElementById('evalModal').classList.add('active');
}

function closeEvaluationModal() {
  document.getElementById('evalModal').classList.remove('active');
}

function updateRubricDisplay() {
  const t = Number(document.getElementById('rubTechnical').value);
  const f = Number(document.getElementById('rubFeasibility').value);
  const i = Number(document.getElementById('rubInnovation').value);
  const p = Number(document.getElementById('rubPresentation').value);

  document.getElementById('valTechnical').textContent = `${t} / 10`;
  document.getElementById('valFeasibility').textContent = `${f} / 10`;
  document.getElementById('valInnovation').textContent = `${i} / 10`;
  document.getElementById('valPresentation').textContent = `${p} / 10`;

  const totalScore = Math.round(((t + f + i + p) / 40) * 100);
  document.getElementById('totalRubricScore').textContent = `${totalScore} / 100`;
}

function saveEvaluation() {
  const sub = AppState.submissions.find(s => s.id === activeEvaluatingSubId);
  if (!sub) return;

  const t = Number(document.getElementById('rubTechnical').value);
  const f = Number(document.getElementById('rubFeasibility').value);
  const i = Number(document.getElementById('rubInnovation').value);
  const p = Number(document.getElementById('rubPresentation').value);
  const feedback = document.getElementById('rubFeedback').value.trim();

  sub.rubric = { technical: t, feasibility: f, innovation: i, presentation: p };
  sub.score = Math.round(((t + f + i + p) / 40) * 100);
  sub.feedback = feedback;
  sub.status = 'Evaluada';

  saveSubmissions();
  closeEvaluationModal();
  renderJurySubmissions();
  renderLeaderboard();
  alert(`✅ Evaluación guardada para ${sub.teamName}. Puntuación final: ${sub.score} puntos.`);
}

function renderLeaderboard() {
  const boardEl = document.getElementById('leaderboardBody');
  if (!boardEl) return;

  // Agrupar por colegios
  const schoolStats = {};
  AppState.schools.forEach(sch => {
    schoolStats[sch.id] = { name: sch.name, totalScore: 0, count: 0 };
  });

  AppState.submissions.forEach(sub => {
    if (sub.score !== null && schoolStats[sub.schoolId]) {
      schoolStats[sub.schoolId].totalScore += sub.score;
      schoolStats[sub.schoolId].count += 1;
    }
  });

  const sorted = Object.values(schoolStats).sort((a, b) => {
    const avgA = a.count ? a.totalScore / a.count : 0;
    const avgB = b.count ? b.totalScore / b.count : 0;
    return avgB - avgA;
  });

  const medals = ['🥇', '🥈', '🥉', '🚀'];

  boardEl.innerHTML = sorted.map((s, idx) => {
    const avg = s.count ? (s.totalScore / s.count).toFixed(1) : 'Sin notas';
    return `
      <tr>
        <td style="font-size:1.3rem;">${medals[idx] || '⭐'}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.count} entregas evaluadas</td>
        <td><strong style="color:var(--cyan-core); font-size:1.1rem;">${avg}</strong></td>
      </tr>
    `;
  }).join('');
}

// CALCULADORAS AEROESPACIALES
function initCalculators() {
  // Calculadora de Gravedad Artificial
  const radiusInput = document.getElementById('calcRadius');
  const rpmInput = document.getElementById('calcRpm');

  function calculateGravity() {
    const r = parseFloat(radiusInput.value); // metros
    const rpm = parseFloat(rpmInput.value); // revoluciones por minuto
    
    // ω en rad/s = rpm * 2 * π / 60
    const omega = (rpm * 2 * Math.PI) / 60;
    // a = ω² * r
    const accel = omega * omega * r; // m/s²
    const gValue = accel / 9.80665; // g's
    // v = ω * r
    const vTangential = omega * r; // m/s
    const vKmh = vTangential * 3.6;

    document.getElementById('valRadiusDisplay').textContent = `${r} m`;
    document.getElementById('valRpmDisplay').textContent = `${rpm.toFixed(1)} rpm`;
    document.getElementById('resGravity').textContent = `${gValue.toFixed(2)} G (${accel.toFixed(1)} m/s²)`;
    document.getElementById('resVelocity').textContent = `${vTangential.toFixed(1)} m/s (${vKmh.toFixed(0)} km/h)`;

    // Indicador Coriolis
    const coriolisBox = document.getElementById('coriolisAlert');
    if (rpm < 2.0) {
      coriolisBox.className = 'coriolis-indicator coriolis-green';
      coriolisBox.innerHTML = `🟢 <strong>ZONA ÓPTIMA (&lt; 2 rpm):</strong> Adaptación humana inmediata. Efecto Coriolis imperceptible en movimientos cotidianos.`;
    } else if (rpm <= 4.0) {
      coriolisBox.className = 'coriolis-indicator coriolis-amber';
      coriolisBox.innerHTML = `🟡 <strong>ZONA ACEPTABLE (2 - 4 rpm):</strong> Requiere periodo de aclimatación de 24h. Mareo ligero en giros bruscos de cabeza.`;
    } else {
      coriolisBox.className = 'coriolis-indicator coriolis-red';
      coriolisBox.innerHTML = `🔴 <strong>ZONA PELIGROSA (&gt; 4 rpm):</strong> Cinetosis severa y desorientación vestibular en tripulación normal. Aumenta el radio del hábitat.`;
    }

    // Animación visual del anillo
    const ring = document.getElementById('animRing');
    if (ring) {
      const animSpeed = rpm > 0 ? (60 / rpm).toFixed(2) : 0;
      ring.style.animation = rpm > 0 ? `spinStation ${animSpeed}s linear infinite` : 'none';
    }
  }

  if (radiusInput && rpmInput) {
    radiusInput.addEventListener('input', calculateGravity);
    rpmInput.addEventListener('input', calculateGravity);
    calculateGravity();
  }

  // Calculadora ECLSS (Soporte Vital)
  const crewInput = document.getElementById('eclssCrew');
  const daysInput = document.getElementById('eclssDays');
  const recycleInput = document.getElementById('eclssRecycle');

  function calculateECLSS() {
    const crew = parseInt(crewInput.value);
    const days = parseInt(daysInput.value);
    const recycleRate = parseFloat(recycleInput.value) / 100;

    // Constantes biomédicas NASA por persona/día
    const o2PerDay = 0.84; // kg
    const drinkWaterPerDay = 2.5; // L
    const hygieneWaterPerDay = 25.0; // L
    const foodDryPerDay = 0.62; // kg

    const totalO2 = crew * days * o2PerDay;
    const rawWater = crew * days * (drinkWaterPerDay + hygieneWaterPerDay);
    const waterAfterRecycle = rawWater * (1 - recycleRate);
    const totalFood = crew * days * foodDryPerDay;

    document.getElementById('eclssCrewDisplay').textContent = `${crew} astronautas`;
    document.getElementById('eclssDaysDisplay').textContent = `${days} días`;
    document.getElementById('eclssRecycleDisplay').textContent = `${(recycleRate * 100).toFixed(0)}%`;

    document.getElementById('resO2').textContent = `${totalO2.toFixed(0)} kg O₂`;
    document.getElementById('resWater').textContent = `${waterAfterRecycle.toFixed(0)} L (Ahorro de ${(rawWater - waterAfterRecycle).toFixed(0)} L)`;
    document.getElementById('resFood').textContent = `${totalFood.toFixed(0)} kg raciones secas`;
  }

  if (crewInput && daysInput && recycleInput) {
    crewInput.addEventListener('input', calculateECLSS);
    daysInput.addEventListener('input', calculateECLSS);
    recycleInput.addEventListener('input', calculateECLSS);
    calculateECLSS();
  }
}

// MÓDULO GRAN SIMULACIÓN DE DICIEMBRE
let stageTimerInterval = null;
let stageSecondsLeft = 9 * 3600; // 9 horas (08:30 a 17:30)
let stageTimerRunning = false;

// Estado de organizador y publicación
AppState.organizerAuthenticated = false;
AppState.publishedRoster = localStorage.getItem('spsdc_roster_published') === 'true';

function initSimulationModule() {
  updateStageClockDisplay();
  if (AppState.organizerAuthenticated || AppState.juryAuthenticated) {
    toggleOrganizerControlsUI(true);
  }
  renderCompaniesRoster();
}

function updateStageClockDisplay() {
  const clockEl = document.getElementById('stageGiantClock');
  if (!clockEl) return;

  const h = Math.floor(stageSecondsLeft / 3600);
  const m = Math.floor((stageSecondsLeft % 3600) / 60);
  const s = stageSecondsLeft % 60;

  clockEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (stageSecondsLeft <= 1800) { // Últimos 30 minutos
    clockEl.classList.add('alert');
  } else {
    clockEl.classList.remove('alert');
  }
}

function toggleStageTimer() {
  const btn = document.getElementById('btnToggleStageTimer');
  if (stageTimerRunning) {
    clearInterval(stageTimerInterval);
    stageTimerRunning = false;
    if (btn) btn.textContent = '▶️ Reanudar Reloj de Misión';
  } else {
    stageTimerRunning = true;
    if (btn) btn.textContent = '⏸️ Pausar Reloj';
    stageTimerInterval = setInterval(() => {
      if (stageSecondsLeft > 0) {
        stageSecondsLeft--;
        updateStageClockDisplay();
      } else {
        clearInterval(stageTimerInterval);
        stageTimerRunning = false;
        alert('🚨 ATENCIÓN: ¡TIEMPO AGOTADO! DEADLINE DE ENTREGA FINAL ALCANZADO.');
      }
    }, 1000);
  }
}

function resetStageTimer(hours = 9) {
  clearInterval(stageTimerInterval);
  stageTimerRunning = false;
  stageSecondsLeft = hours * 3600;
  updateStageClockDisplay();
  const btn = document.getElementById('btnToggleStageTimer');
  if (btn) btn.textContent = '▶️ Iniciar Reloj de Misión';
}

// Mezclador de los 4 colegios en 4 empresas aeroespaciales
function generateMixedCompanies() {
  const companies = [
    { name: 'CONDOR COMPANY', theme: 'Hábitat rotatorio y sistemas nucleares', color: '#38bdf8' },
    { name: 'SAPIEN (木漏れ日)', theme: 'Robótica de carga y visión LiDAR', color: '#f59e0b' },
    { name: 'BOSCOM CORP', theme: 'Asentamiento orbital y telecomunicaciones', color: '#10b981' },
    { name: 'PONTIFEX AEROSPACE', theme: 'Propulsión iónica y ensamblaje modular', color: '#a855f7' }
  ];

  // Simulación de 120 alumnos (30 por colegio)
  const roster = [];
  AppState.schools.forEach((sch, sIdx) => {
    for (let i = 1; i <= 30; i++) {
      roster.push({
        id: `ALU-${sIdx + 1}-${i}`,
        school: sch.name,
        name: `Estudiante ${i} (${sch.name.split(' ')[0]} ${sch.name.split(' ')[1] || ''})`
      });
    }
  });

  // Barajar aleatoriamente (Fisher-Yates)
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roster[i], roster[j]] = [roster[j], roster[i]];
  }

  // Repartir en 4 empresas equitativamente (30 por empresa)
  const distributed = companies.map(comp => ({ ...comp, members: [] }));
  roster.forEach((student, idx) => {
    distributed[idx % 4].members.push(student);
  });

  AppState.distributedCompanies = distributed;
  localStorage.setItem('spsdc_mixed_companies', JSON.stringify(distributed));

  renderCompaniesRoster();

  alert('🤝 ¡Mezcla intercolegial generada con éxito!\n120 alumnos repartidos equitativamente en las 4 empresas aeroespaciales (30 alumnos por empresa).\n\nPara que los alumnos la vean en sus dispositivos, haz clic en "📢 Publicar Equipos a Alumnos".');
}

// Renderizado de las compañías (Protegido si no está publicado)
function renderCompaniesRoster() {
  const container = document.getElementById('companiesRosterContainer');
  if (!container) return;

  const isOrganizer = AppState.organizerAuthenticated || AppState.juryAuthenticated;
  const isPublished = AppState.publishedRoster;

  // Si no está publicado y el usuario NO es organizador:
  if (!isPublished && !isOrganizer) {
    container.innerHTML = `
      <div class="company-card" style="border-top: 4px solid #38bdf8;">
        <h4>CONDOR COMPANY</h4>
        <div style="color:var(--text-muted); font-size:0.85rem;">Hábitat rotatorio centrípeto y reactores nucleares.</div>
        <div style="font-size:0.85rem; color:var(--cyan-core); margin-top:14px; background:rgba(6,182,212,0.1); padding:10px; border-radius:6px;">
          ⏳ Distribución de ingenieros en preparación por el Comité Organizador.
        </div>
      </div>
      <div class="company-card" style="border-top: 4px solid #f59e0b;">
        <h4>SAPIEN (木漏れ日)</h4>
        <div style="color:var(--text-muted); font-size:0.85rem;">Robótica avanzada de carga y visión espacial.</div>
        <div style="font-size:0.85rem; color:var(--cyan-core); margin-top:14px; background:rgba(6,182,212,0.1); padding:10px; border-radius:6px;">
          ⏳ Distribución de ingenieros en preparación por el Comité Organizador.
        </div>
      </div>
      <div class="company-card" style="border-top: 4px solid #10b981;">
        <h4>BOSCOM CORP</h4>
        <div style="color:var(--text-muted); font-size:0.85rem;">Infraestructura orbital y red de comunicaciones.</div>
        <div style="font-size:0.85rem; color:var(--cyan-core); margin-top:14px; background:rgba(6,182,212,0.1); padding:10px; border-radius:6px;">
          ⏳ Distribución de ingenieros en preparación por el Comité Organizador.
        </div>
      </div>
      <div class="company-card" style="border-top: 4px solid #a855f7;">
        <h4>PONTIFEX AEROSPACE</h4>
        <div style="color:var(--text-muted); font-size:0.85rem;">Propulsión iónica y ensamblaje modular.</div>
        <div style="font-size:0.85rem; color:var(--cyan-core); margin-top:14px; background:rgba(6,182,212,0.1); padding:10px; border-radius:6px;">
          ⏳ Distribución de ingenieros en preparación por el Comité Organizador.
        </div>
      </div>
    `;
    return;
  }

  // Si está publicado o es organizador:
  let distributed = AppState.distributedCompanies;
  if (!distributed || distributed.length === 0) {
    const saved = localStorage.getItem('spsdc_mixed_companies');
    if (saved) {
      try {
        distributed = JSON.parse(saved);
        AppState.distributedCompanies = distributed;
      } catch (e) {
        distributed = null;
      }
    }
  }

  if (!distributed || distributed.length === 0) {
    if (isOrganizer) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:30px; background:rgba(30,41,59,0.5); border:1px dashed var(--amber-alert); border-radius:8px;">
          <div style="font-size:2rem; margin-bottom:8px;">🎲</div>
          <strong style="color:var(--amber-alert); font-family:var(--font-hud);">AÚN NO SE HAN SORTEADO LOS EQUIPOS</strong>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:6px;">
            Haz clic en <strong>"🎲 Sortear / Mezclar Equipos"</strong> en la barra superior de organizador para repartir los 120 alumnos entre las 4 compañías.
          </p>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = distributed.map(comp => {
    const countBySchool = {};
    (comp.members || []).forEach(m => {
      countBySchool[m.school] = (countBySchool[m.school] || 0) + 1;
    });

    const statusBadge = isPublished
      ? `<span style="display:inline-block; font-size:0.75rem; background:rgba(16,185,129,0.2); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:12px;">🟢 PUBLICADO</span>`
      : `<span style="display:inline-block; font-size:0.75rem; background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:12px;">🔒 BORRADOR</span>`;

    return `
      <div class="company-card" style="border-top: 4px solid ${comp.color};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="margin:0;">${comp.name}</h4>
          ${isOrganizer ? statusBadge : ''}
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">${comp.theme}</div>
        <div style="background:rgba(12,17,29,0.8); padding:10px; border-radius:6px; font-size:0.8rem; margin-bottom:12px;">
          <strong>Mix Intercolegial (${(comp.members || []).length} ingenieros):</strong>
          <ul style="margin-left:16px; margin-top:4px; color:var(--text-secondary);">
            ${Object.entries(countBySchool).map(([sch, cnt]) => `<li>${sch}: <strong>${cnt} alumnos</strong></li>`).join('')}
          </ul>
        </div>
        <div style="max-height: 200px; overflow-y: auto; font-size:0.8rem; color:var(--text-secondary);">
          <strong>Directorio del equipo:</strong>
          <ol style="margin-left:18px; margin-top:6px;">
            ${(comp.members || []).map(m => `<li>${m.name}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
  }).join('');
}

// CONTROL DE ACCESO EXCLUSIVO DE ORGANIZADORES PARA DICIEMBRE
function handleOrganizerAccess() {
  if (AppState.organizerAuthenticated || AppState.juryAuthenticated) {
    toggleOrganizerControlsUI(true);
    renderCompaniesRoster();
    return;
  }

  const pin = prompt('Introduce el PIN de Organizador / Profesor:');
  if (pin === '2026') {
    AppState.organizerAuthenticated = true;
    toggleOrganizerControlsUI(true);
    renderCompaniesRoster();
    alert('🔓 Acceso de Organizador concedido. Ya tienes el control del reloj y el sorteo de equipos.');
  } else if (pin !== null) {
    alert('PIN incorrecto. Acceso restringido exclusivamente a organizadores.');
  }
}

function toggleOrganizerControlsUI(show) {
  const toolbar = document.getElementById('organizerToolbar');
  const clockControls = document.getElementById('organizerClockControls');
  const lockIcon = document.getElementById('organizerLockStatus');
  const btnToggle = document.getElementById('btnOrganizerToggle');

  if (toolbar) toolbar.style.display = show ? 'block' : 'none';
  if (clockControls) clockControls.style.display = show ? 'flex' : 'none';
  if (lockIcon) lockIcon.textContent = show ? '🔓' : '🔒';
  if (btnToggle) btnToggle.innerHTML = show ? '🔓 Modo Organizador Activo' : '🔒 Acceso Organizadores';

  updatePublishButtonUI();
}

function togglePublishRoster() {
  if (!AppState.organizerAuthenticated && !AppState.juryAuthenticated) return;

  AppState.publishedRoster = !AppState.publishedRoster;
  localStorage.setItem('spsdc_roster_published', AppState.publishedRoster ? 'true' : 'false');
  updatePublishButtonUI();
  renderCompaniesRoster();

  if (AppState.publishedRoster) {
    alert('📢 ¡Equipos publicados!\nLos alumnos ya pueden ver la composición de las 4 compañías aeroespaciales en sus pantallas.');
  } else {
    alert('🔒 Equipos ocultados a los alumnos.\nAhora los alumnos solo verán el mensaje de preparación.');
  }
}

function updatePublishButtonUI() {
  const btn = document.getElementById('btnPublishRoster');
  if (btn) {
    btn.innerHTML = AppState.publishedRoster 
      ? '👁️ Ocultar Equipos a Alumnos' 
      : '📢 Publicar Equipos a Alumnos';
  }
}

function launchStageFullscreen() {
  const el = document.getElementById('december');
  if (!el) return;

  if (!document.fullscreenElement) {
    el.requestFullscreen().catch(err => {
      alert('Error al activar pantalla completa: ' + err.message);
    });
  } else {
    document.exitFullscreen();
  }
}

