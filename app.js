/**
 * SPSDC MISSION CONTROL - CORE LOGIC
 * Plataforma de entrenamiento y gestión para la Spanish Space Design Competition
 */

// Estado global de la aplicación
const AppState = {
  activeView: 'dashboard',
  juryAuthenticated: false,
  targetDrivePath: 'H:\\Mi unidad\\SPSIN COLEGIOS',
  cloudWebhookUrl: 'https://script.google.com/macros/s/AKfycbzozxziqZdtsx5QE_UPYEW3s_3Cc7ncfKdbaI_Ula1TF_UOUo17l5gl3cvaQd7BbOt6/exec',
  schools: [
    { id: 'col1', name: 'Colegio 01 (Sede Local)' },
    { id: 'col2', name: 'Colegio 02 (Alianza Norte)' },
    { id: 'col3', name: 'Colegio 03 (Alianza Centro)' },
    { id: 'col4', name: 'Colegio 04 (Alianza Sur)' }
  ],
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
      month: 'SEPTIEMBRE',
      title: 'Structural Engineering: El Esqueleto',
      dept: 'Estructura & Materiales',
      status: 'active',
      deadline: '2025-10-05',
      summary: 'Diseño geométrico de la estación espacial, cálculo de gravedad artificial por rotación, dimensionamiento del casco y blindaje pasivo.',
      reqs: [
        'Selección de geometría justificada (Toroide, Cilindro, Esfera o Mancuerna).',
        'Cálculo de gravedad artificial centrípeta (a = ω²·r) demostrando ~1.0 G.',
        'Velocidad de rotación inferior a 4 rpm para evitar cinetosis (mareo Coriolis).',
        'Espesor de casco y materiales (Al-Li, Titanio, Polietileno / Regolito).'
      ],
      sampleDoc: 'Propuesta CONDOR COMPANY 2025 (pág 4-12)'
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
  submissions: []
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initClocks();
  initCountdown();
  loadSubmissions();
  renderSprints();
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

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Renderizado dinámico de Sprints
function renderSprints() {
  const grid = document.getElementById('sprintsGrid');
  if (!grid) return;

  grid.innerHTML = AppState.sprints.map(sprint => `
    <div class="sprint-card">
      <div class="sprint-header">
        <span class="sprint-code">${sprint.code} • ${sprint.month}</span>
        <span class="sprint-badge ${sprint.status === 'active' ? 'badge-active' : 'badge-upcoming'}">
          ${sprint.status === 'active' ? '⚡ ACTIVO' : 'PRÓXIMO'}
        </span>
      </div>
      <h3 class="sprint-title">${sprint.title}</h3>
      <div class="sprint-dept">${sprint.dept}</div>
      <p class="sprint-desc">${sprint.summary}</p>
      
      <div class="sprint-requirements">
        <strong>📋 REQUISITOS DEL ENTREGABLE:</strong>
        <ul>
          ${sprint.reqs.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:auto;">
        <strong>Doc. de referencia:</strong> ${sprint.sampleDoc}
      </div>

      <button class="btn-hud btn-hud-secondary" onclick="prepareSubmissionFor(${sprint.id})">
        📤 Entregar Trabajo de este Sprint
      </button>
    </div>
  `).join('');
}

function prepareSubmissionFor(sprintId) {
  navigateTo('submissions');
  const select = document.getElementById('subSprint');
  if (select) select.value = sprintId;
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
  const school = document.getElementById('subSchool').value;
  const sprintId = document.getElementById('subSprint').value;
  const dept = document.getElementById('subDept').value;
  const teamName = document.getElementById('subTeamName').value.trim();
  const authors = document.getElementById('subAuthors').value.trim();
  const externalLink = document.getElementById('subExternalLink').value.trim();
  const notes = document.getElementById('subNotes').value.trim();

  if (!teamName) {
    alert('Por favor, indica el nombre de tu equipo.');
    return;
  }

  const schoolObj = AppState.schools.find(s => s.id === school);
  const sprintObj = AppState.sprints.find(s => s.id === Number(sprintId));
  const deptObj = AppState.departments.find(d => d.id === dept);

  const subId = 'SUB-' + Date.now().toString().slice(-6);

  // Botón en estado de carga
  const submitBtn = document.querySelector('#submissionForm button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Guardando entrega en Google Drive...';
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
      school: schoolObj ? schoolObj.name : school,
      sprint: sprintObj ? sprintObj.code : `Sprint_${sprintId}`,
      dept: deptObj ? deptObj.name : dept,
      teamName: teamName,
      authors: authors,
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
      schoolId: school,
      schoolName: schoolObj ? schoolObj.name : school,
      sprintId: Number(sprintId),
      sprintName: sprintObj ? sprintObj.title : `Sprint ${sprintId}`,
      deptId: dept,
      deptName: deptObj ? deptObj.name : dept,
      teamName: teamName,
      authors: authors,
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
    uploadedFilesCache = [];
    document.getElementById('selectedFilesList').innerHTML = '';

    // Feedback al usuario
    if (savedOnDisk) {
      alert(`✅ ¡ENTREGA GUARDADA EN TU GOOGLE DRIVE!\n\n` +
            `📁 Carpeta creada:\n${serverSavedPath}\n\n` +
            `📄 Archivos guardados: ${filesData.length}\n` +
            `📋 Ficha técnica guardada: _INFO_ENTREGA.txt\n\n` +
            `Tu Google Drive de escritorio ya la está sincronizando con la nube.`);
    } else {
      alert(`⚠️ ENTREGA REGISTRADA EN LA PLATAFORMA WEB\n\n` +
            `Para que los archivos se vuelquen automáticamente en tu disco duro (H:\\Mi unidad\\SPSIN COLEGIOS):\n` +
            `Asegúrate de tener abierta la plataforma ejecutando el archivo INICIAR_MISSION_CONTROL.bat (o en http://localhost:8080).`);
    }

    renderJurySubmissions();
    navigateTo('dashboard');
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

  // Si no hay ninguna, creamos un par de ejemplo para visualización del jurado
  if (AppState.submissions.length === 0) {
    AppState.submissions = [
      {
        id: 'SUB-104921',
        timestamp: '23/09/2026, 18:30:15',
        schoolId: 'col1',
        schoolName: 'Colegio 01 (Sede Local)',
        sprintId: 1,
        sprintName: 'Structural Engineering: El Esqueleto',
        deptId: 'structural',
        deptName: 'Structural Engineering',
        teamName: 'AeroNova Team',
        authors: 'Lucía G., Marcos P., David R.',
        externalLink: 'https://www.tinkercad.com/things/example-station-3d',
        notes: 'Diseño toroide con radio de 250m a 1.9 rpm (0.98G). Casco triple con blindaje de agua.',
        fileNames: ['AeroNova_Calculos_Gravedad.xlsx', 'Render_Toroide_Blender.png'],
        targetDriveFolder: 'H:\\Mi unidad\\SPSIN COLEGIOS\\Colegio 01\\SPRINT-01',
        status: 'Evaluada',
        score: 92,
        rubric: { technical: 9, feasibility: 9, innovation: 10, presentation: 9 },
        feedback: 'Excelente justificación del límite de Coriolis por debajo de 2 rpm. Renders 3D muy limpios.'
      },
      {
        id: 'SUB-104922',
        timestamp: '23/09/2026, 19:15:40',
        schoolId: 'col2',
        schoolName: 'Colegio 02 (Alianza Norte)',
        sprintId: 1,
        sprintName: 'Structural Engineering: El Esqueleto',
        deptId: 'structural',
        deptName: 'Structural Engineering',
        teamName: 'Pioneer Horizon',
        authors: 'Elena S., Carlos V.',
        externalLink: 'https://docs.google.com/presentation/d/example',
        notes: 'Propuesta de cilindros concéntricos contrarrotatorios para compensar momento angular.',
        fileNames: ['Pioneer_Propuesta_Estructural.pdf'],
        targetDriveFolder: 'H:\\Mi unidad\\SPSIN COLEGIOS\\Colegio 02\\SPRINT-01',
        status: 'Pendiente',
        score: null,
        rubric: null,
        feedback: ''
      }
    ];
    saveSubmissions();
  }
}

// PANEL DE JURADO (EVALUACIÓN)
function unlockJury() {
  const pinInput = document.getElementById('juryPinInput').value;
  if (pinInput === '2026') {
    AppState.juryAuthenticated = true;
    document.getElementById('juryGatePanel').style.display = 'none';
    document.getElementById('juryMainContent').style.display = 'block';
    renderJurySubmissions();
    renderLeaderboard();
  } else {
    alert('PIN incorrecto. El PIN por defecto de los profesores es: 2026');
  }
}

function renderJurySubmissions() {
  const tbody = document.getElementById('jurySubmissionsBody');
  if (!tbody) return;

  const schoolFilter = document.getElementById('juryFilterSchool') ? document.getElementById('juryFilterSchool').value : 'all';
  const sprintFilter = document.getElementById('juryFilterSprint') ? document.getElementById('juryFilterSprint').value : 'all';

  let list = AppState.submissions;
  if (schoolFilter !== 'all') list = list.filter(s => s.schoolId === schoolFilter);
  if (sprintFilter !== 'all') list = list.filter(s => s.sprintId === Number(sprintFilter));

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:30px;">No hay entregas registradas con estos filtros.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(sub => `
    <tr>
      <td><strong>${sub.id}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${sub.timestamp}</span></td>
      <td><strong>${sub.teamName}</strong><br><span style="font-size:0.8rem; color:var(--text-secondary);">${sub.schoolName}</span></td>
      <td><span class="pill-badge">${sub.sprintName.split(':')[0]}</span></td>
      <td>${sub.deptName.split(' ')[0]}</td>
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
  document.getElementById('modalSubTitle').textContent = `Evaluando: ${sub.teamName} (${sub.schoolName})`;
  document.getElementById('modalSubDetails').innerHTML = `
    <strong>Sprint:</strong> ${sub.sprintName} | <strong>Departamento:</strong> ${sub.deptName}<br>
    <strong>Integrantes:</strong> ${sub.authors || 'No especificados'}<br>
    <strong>Notas del equipo:</strong> "${sub.notes || 'Sin notas'}"<br>
    <strong>Carpeta Drive:</strong> <span style="font-family:monospace; color:var(--cyan-core);">${sub.targetDriveFolder}</span>
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

function initSimulationModule() {
  updateStageClockDisplay();
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

  // Repartir en 4 empresas equitativamente
  const distributed = companies.map(comp => ({ ...comp, members: [] }));
  roster.forEach((student, idx) => {
    distributed[idx % 4].members.push(student);
  });

  const container = document.getElementById('companiesRosterContainer');
  if (!container) return;

  container.innerHTML = distributed.map(comp => {
    // Contar cuántos de cada colegio hay
    const countBySchool = {};
    comp.members.forEach(m => {
      countBySchool[m.school] = (countBySchool[m.school] || 0) + 1;
    });

    return `
      <div class="company-card" style="border-top: 4px solid ${comp.color};">
        <h4>${comp.name}</h4>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">${comp.theme}</div>
        <div style="background:rgba(12,17,29,0.8); padding:10px; border-radius:6px; font-size:0.8rem; margin-bottom:12px;">
          <strong>Mix Intercolegial (${comp.members.length} ingenieros):</strong>
          <ul style="margin-left:16px; margin-top:4px; color:var(--text-secondary);">
            ${Object.entries(countBySchool).map(([sch, cnt]) => `<li>${sch}: <strong>${cnt} alumnos</strong></li>`).join('')}
          </ul>
        </div>
        <div style="max-height: 200px; overflow-y: auto; font-size:0.8rem; color:var(--text-secondary);">
          <strong>Directorio del equipo:</strong>
          <ol style="margin-left:18px; margin-top:6px;">
            ${comp.members.map(m => `<li>${m.name}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
  }).join('');

  alert('🤝 ¡Mezcla intercolegial generada con éxito!\n120 alumnos repartidos equitativamente en las 4 empresas aeroespaciales (30 alumnos por empresa).');
}
