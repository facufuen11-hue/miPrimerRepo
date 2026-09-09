(() => {
  'use strict';

  // ---------------------------------------------------------------------
  // Navegación mobile
  // ---------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------------------------------------------------------------------
  // Datos del juego
  // ---------------------------------------------------------------------
  const TRIVIA = [
    {
      q: '¿Qué significa la sigla VIH?',
      options: [
        'Virus de Inmunodeficiencia Humana',
        'Virus de Infección Hepática',
        'Vacuna de Inmunización Humana',
        'Virus Infeccioso Hereditario'
      ],
      correct: 0,
      explain: 'VIH es el Virus de Inmunodeficiencia Humana: ataca las defensas del cuerpo.'
    },
    {
      q: '¿Cuál es la diferencia principal entre VIH y sida?',
      options: [
        'Son exactamente lo mismo',
        'El VIH es el virus; el sida es la etapa avanzada si no se trata',
        'El sida se cura y el VIH no',
        'El VIH solo afecta a personas adultas'
      ],
      correct: 1,
      explain: 'El VIH es el virus. El sida es una etapa avanzada que hoy en día se puede evitar con tratamiento.'
    },
    {
      q: 'Una persona con VIH en tratamiento y con carga viral indetectable...',
      options: [
        'Puede transmitir el virus igual que antes',
        'No puede transmitir el virus por vía sexual (I=I)',
        'Ya no tiene VIH en el cuerpo',
        'No necesita cuidarse más de nada'
      ],
      correct: 1,
      explain: 'Indetectable = Intransmisible: con tratamiento correcto, no se transmite el VIH por vía sexual.'
    },
    {
      q: '¿Cuál de estas es una forma correcta de prevenir el VIH?',
      options: [
        'Usar preservativo en las relaciones sexuales',
        'Compartir jeringas',
        'Compartir el cepillo de dientes',
        'Evitar compartir el mate'
      ],
      correct: 0,
      explain: 'El preservativo (externo o interno) usado correctamente es una de las formas más efectivas de prevención.'
    },
    {
      q: '¿Qué es la PrEP?',
      options: [
        'Un tratamiento que cura el sida',
        'Una pastilla que se toma antes de la exposición para prevenir el VIH',
        'Una vacuna contra el VIH',
        'Un tipo especial de preservativo'
      ],
      correct: 1,
      explain: 'La PrEP (Profilaxis Pre-Exposición) es una medicación que reduce mucho el riesgo de adquirir VIH.'
    },
    {
      q: 'Ante una posible exposición al VIH (por ejemplo, relación sin protección), ¿qué conviene hacer?',
      options: [
        'Esperar a tener síntomas',
        'No hace falta hacer nada',
        'Tomar antibióticos comunes',
        'Consultar rápido para evaluar la PEP, idealmente dentro de las 72 horas'
      ],
      correct: 3,
      explain: 'La PEP (Profilaxis Post-Exposición) es un tratamiento de emergencia que funciona mejor cuanto antes se inicia.'
    },
    {
      q: '¿Cuál de estas situaciones NO transmite el VIH?',
      options: [
        'Compartir el mate con una persona que vive con VIH',
        'Relaciones sexuales sin preservativo',
        'Compartir jeringas',
        'De madre a bebé sin tratamiento'
      ],
      correct: 0,
      explain: 'La saliva no transmite VIH: compartir el mate, vasos o cubiertos es completamente seguro.'
    },
    {
      q: 'En Uruguay, el testeo de VIH es...',
      options: [
        'Obligatorio para mayores de 15 años',
        'Voluntario, gratuito y confidencial en el sistema de salud',
        'Solo disponible en Montevideo',
        'De costo elevado'
      ],
      correct: 1,
      explain: 'Cualquier persona puede testearse de forma voluntaria, gratuita y confidencial.'
    }
  ];

  // 5 elementos que transmiten + 5 que no, en orden aleatorio.
  const DRAG_ITEMS = shuffle([
    { label: 'Sangre', zone: 'yes' },
    { label: 'Semen', zone: 'yes' },
    { label: 'Secreciones vaginales', zone: 'yes' },
    { label: 'Leche materna', zone: 'yes' },
    { label: 'Secreciones rectales', zone: 'yes' },
    { label: 'Saliva', zone: 'no' },
    { label: 'Sudor', zone: 'no' },
    { label: 'Lágrimas', zone: 'no' },
    { label: 'Compartir el mate', zone: 'no' },
    { label: 'Picadura de mosquito', zone: 'no' }
  ]);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------------------------------------------------------------------
  // Estado del juego
  // ---------------------------------------------------------------------
  const state = {
    triviaIndex: 0,
    triviaCorrect: 0,
    dragCorrect: 0,
    dragPlaced: 0
  };

  const screens = document.querySelectorAll('.game-screen');
  function showScreen(name) {
    screens.forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
  }

  // ---------------------------------------------------------------------
  // Trivia
  // ---------------------------------------------------------------------
  const triviaQuestionEl = document.getElementById('triviaQuestion');
  const triviaOptionsEl = document.getElementById('triviaOptions');
  const triviaFeedbackEl = document.getElementById('triviaFeedback');
  const triviaNextBtn = document.getElementById('triviaNextBtn');
  const triviaProgressFill = document.getElementById('triviaProgressFill');
  const triviaProgressLabel = document.getElementById('triviaProgressLabel');

  function renderTriviaQuestion() {
    const item = TRIVIA[state.triviaIndex];
    triviaQuestionEl.textContent = item.q;
    triviaFeedbackEl.hidden = true;
    triviaNextBtn.hidden = true;
    triviaOptionsEl.innerHTML = '';

    item.options.forEach((optionText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trivia-option';
      btn.textContent = optionText;
      btn.addEventListener('click', () => onTriviaAnswer(i, btn));
      triviaOptionsEl.appendChild(btn);
    });

    triviaProgressFill.style.width = `${(state.triviaIndex / TRIVIA.length) * 100}%`;
    triviaProgressLabel.textContent = `Pregunta ${state.triviaIndex + 1} de ${TRIVIA.length}`;
  }

  function onTriviaAnswer(selectedIndex, btnEl) {
    const item = TRIVIA[state.triviaIndex];
    const buttons = Array.from(triviaOptionsEl.children);
    buttons.forEach((b) => (b.disabled = true));

    const isCorrect = selectedIndex === item.correct;
    if (isCorrect) {
      state.triviaCorrect += 1;
      btnEl.classList.add('is-correct');
    } else {
      btnEl.classList.add('is-wrong');
      buttons[item.correct].classList.add('is-correct');
    }

    triviaFeedbackEl.textContent = (isCorrect ? '✅ ¡Correcto! ' : '❌ No era esa. ') + item.explain;
    triviaFeedbackEl.hidden = false;
    triviaNextBtn.hidden = false;
    triviaNextBtn.textContent = state.triviaIndex < TRIVIA.length - 1 ? 'Siguiente →' : 'Ir al desafío final →';
  }

  triviaNextBtn.addEventListener('click', () => {
    state.triviaIndex += 1;
    if (state.triviaIndex < TRIVIA.length) {
      renderTriviaQuestion();
    } else {
      triviaProgressFill.style.width = '100%';
      showScreen('drag');
      renderDragGame();
    }
  });

  // ---------------------------------------------------------------------
  // Drag & drop (mouse + touch vía Pointer Events)
  // ---------------------------------------------------------------------
  const dragPool = document.getElementById('dragPool');
  const dropYes = document.getElementById('dropYes');
  const dropNo = document.getElementById('dropNo');
  const dragProgressLabel = document.getElementById('dragProgressLabel');
  const finishGameBtn = document.getElementById('finishGameBtn');
  const dropZoneEls = document.querySelectorAll('.drop-zone');

  let activeChip = null;
  let dragOffset = { x: 0, y: 0 };

  function renderDragGame() {
    dragPool.innerHTML = '';
    dropYes.innerHTML = '';
    dropNo.innerHTML = '';
    state.dragCorrect = 0;
    state.dragPlaced = 0;
    finishGameBtn.hidden = true;
    updateDragProgress();

    DRAG_ITEMS.forEach((item, i) => {
      const chip = document.createElement('div');
      chip.className = 'drag-chip';
      chip.textContent = item.label;
      chip.dataset.zone = item.zone;
      chip.dataset.id = String(i);
      chip.addEventListener('pointerdown', onChipPointerDown);
      dragPool.appendChild(chip);
    });
  }

  function updateDragProgress() {
    dragProgressLabel.textContent = `${state.dragPlaced} / ${DRAG_ITEMS.length} clasificados`;
    if (state.dragPlaced === DRAG_ITEMS.length) {
      finishGameBtn.hidden = false;
    }
  }

  function onChipPointerDown(e) {
    const chip = e.currentTarget;
    if (chip.classList.contains('is-placed')) return;

    activeChip = chip;
    chip.setPointerCapture(e.pointerId);

    const rect = chip.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    chip.style.width = `${rect.width}px`;
    chip.classList.add('is-dragging');
    chip.style.left = `${rect.left}px`;
    chip.style.top = `${rect.top}px`;

    chip.addEventListener('pointermove', onChipPointerMove);
    chip.addEventListener('pointerup', onChipPointerUp);
    chip.addEventListener('pointercancel', onChipPointerUp);
  }

  function onChipPointerMove(e) {
    if (!activeChip) return;
    activeChip.style.left = `${e.clientX - dragOffset.x}px`;
    activeChip.style.top = `${e.clientY - dragOffset.y}px`;

    dropZoneEls.forEach((zone) => {
      const r = zone.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      zone.classList.toggle('is-target-hover', inside);
    });
  }

  function onChipPointerUp(e) {
    if (!activeChip) return;
    const chip = activeChip;
    chip.removeEventListener('pointermove', onChipPointerMove);
    chip.removeEventListener('pointerup', onChipPointerUp);
    chip.removeEventListener('pointercancel', onChipPointerUp);
    dropZoneEls.forEach((zone) => zone.classList.remove('is-target-hover'));

    chip.classList.remove('is-dragging');
    chip.style.left = '';
    chip.style.top = '';
    chip.style.width = '';

    const targetZone = findZoneAtPoint(e.clientX, e.clientY);
    activeChip = null;

    if (!targetZone) {
      dragPool.appendChild(chip);
      return;
    }

    const isCorrect = targetZone.dataset.zone === chip.dataset.zone;
    chip.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    chip.classList.add('is-placed');

    const container = targetZone.dataset.zone === 'yes' ? dropYes : dropNo;
    container.appendChild(chip);

    if (isCorrect) state.dragCorrect += 1;
    state.dragPlaced += 1;
    updateDragProgress();
  }

  function findZoneAtPoint(x, y) {
    for (const zone of dropZoneEls) {
      const r = zone.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // Resultado + envío de puntaje
  // ---------------------------------------------------------------------
  const scoreBreakdownEl = document.getElementById('scoreBreakdown');
  const submitScoreForm = document.getElementById('submitScoreForm');
  const playerNameInput = document.getElementById('playerName');
  const submitScoreBtn = document.getElementById('submitScoreBtn');
  const submitStatusEl = document.getElementById('submitStatus');
  const playAgainBtn = document.getElementById('playAgainBtn');

  document.getElementById('startGameBtn').addEventListener('click', () => {
    state.triviaIndex = 0;
    state.triviaCorrect = 0;
    showScreen('trivia');
    renderTriviaQuestion();
  });

  finishGameBtn.addEventListener('click', () => {
    const triviaPts = state.triviaCorrect * 10;
    const dragPts = state.dragCorrect * 10;
    const total = triviaPts + dragPts;

    scoreBreakdownEl.innerHTML = `
      <div>🧠 Trivia: <strong>${state.triviaCorrect} / ${TRIVIA.length}</strong> (${triviaPts} pts)</div>
      <div>🎯 Clasificación: <strong>${state.dragCorrect} / ${DRAG_ITEMS.length}</strong> (${dragPts} pts)</div>
      <div style="font-size:1.3rem;margin-top:8px">Total: <strong>${total} pts</strong></div>
    `;

    submitStatusEl.hidden = true;
    submitScoreBtn.disabled = false;
    submitScoreForm.hidden = false;
    playAgainBtn.hidden = true;

    showScreen('result');
  });

  submitScoreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = playerNameInput.value.trim() || 'Anónimo';
    submitScoreBtn.disabled = true;
    submitStatusEl.hidden = true;

    socket.emit(
      'game:submitScore',
      { name, triviaCorrect: state.triviaCorrect, dragCorrect: state.dragCorrect },
      (res) => {
        submitStatusEl.hidden = false;
        if (res && res.ok) {
          submitStatusEl.classList.remove('is-error');
          submitStatusEl.textContent = '¡Puntaje enviado! Mirá el ranking más abajo. 🏆';
          submitScoreForm.hidden = true;
          playAgainBtn.hidden = false;
          document.getElementById('ranking').scrollIntoView({ behavior: 'smooth' });
        } else {
          submitStatusEl.classList.add('is-error');
          submitStatusEl.textContent = 'Hubo un problema al enviar el puntaje. Probá de nuevo.';
          submitScoreBtn.disabled = false;
        }
      }
    );
  });

  playAgainBtn.addEventListener('click', () => {
    showScreen('start');
  });

  // ---------------------------------------------------------------------
  // Socket.io: ranking en vivo
  // ---------------------------------------------------------------------
  const socket = io();
  const leaderboardBody = document.getElementById('leaderboardBody');

  socket.on('leaderboard:update', (top) => {
    if (!Array.isArray(top) || top.length === 0) {
      leaderboardBody.innerHTML = '<tr class="leaderboard__empty"><td colspan="3">Todavía nadie jugó. ¡Sé el primero! 🚀</td></tr>';
      return;
    }
    leaderboardBody.innerHTML = top
      .map((entry, i) => {
        const safeName = escapeHtml(entry.name);
        return `<tr><td>${i + 1}</td><td>${safeName}</td><td>${entry.score}</td></tr>`;
      })
      .join('');
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }
})();
