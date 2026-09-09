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
  // Fluidos clickeables
  // ---------------------------------------------------------------------
  const FLUID_INFO = {
    sangre: 'La sangre es el fluido con mayor concentración de virus. El contacto con sangre infectada (por ejemplo, al compartir jeringas) es una vía de transmisión directa.',
    semen: 'El semen y el líquido preseminal pueden contener VIH. Es una de las vías más comunes de transmisión sexual sin protección.',
    vaginales: 'Las secreciones vaginales también pueden transmitir el virus durante relaciones sexuales sin preservativo.',
    leche: 'La leche materna de una persona con VIH sin tratamiento puede transmitir el virus al bebé durante la lactancia. Con tratamiento y seguimiento médico, el riesgo se reduce muchísimo.',
    rectales: 'Las secreciones rectales pueden transmitir el virus en relaciones sexuales anales sin protección.'
  };

  const fluidGrid = document.getElementById('fluidGrid');
  const fluidDetail = document.getElementById('fluidDetail');
  const fluidDetailText = document.getElementById('fluidDetailText');

  fluidGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.fluid-card');
    if (!card) return;

    const isSame = card.classList.contains('is-active');
    fluidGrid.querySelectorAll('.fluid-card').forEach((c) => c.classList.remove('is-active'));

    if (isSame) {
      fluidDetail.hidden = true;
      return;
    }

    card.classList.add('is-active');
    fluidDetailText.textContent = FLUID_INFO[card.dataset.fluid] || '';
    fluidDetail.hidden = false;
  });

  // ---------------------------------------------------------------------
  // Mitos y verdades (acordeón)
  // ---------------------------------------------------------------------
  const MITOS = [
    { text: 'El VIH se transmite por dar la mano o abrazar.', esMito: true, explain: 'El virus no sobrevive fuera del cuerpo ni se transmite por contacto de piel sana.' },
    { text: 'Compartir el mate transmite VIH.', esMito: true, explain: 'La saliva no transmite el virus. Compartir el mate, vasos o cubiertos es completamente seguro.' },
    { text: 'Las picaduras de mosquito transmiten VIH.', esMito: true, explain: 'El mosquito no inyecta sangre de una persona a otra, y el virus no sobrevive ni se replica dentro del insecto.' },
    { text: 'Una persona con VIH indetectable no transmite el virus por vía sexual.', esMito: false, explain: 'Es el principio Indetectable = Intransmisible (I=I), respaldado por estudios científicos internacionales.' },
    { text: 'El VIH se transmite por usar el mismo baño o la misma pileta.', esMito: true, explain: 'No hay transmisión por contacto con superficies, agua o inodoros compartidos.' },
    { text: 'El preservativo reduce muchísimo el riesgo de transmisión sexual.', esMito: false, explain: 'Usado correctamente en cada relación sexual, es una de las formas más efectivas de prevención.' },
    { text: 'Solo algunos grupos de personas pueden contraer VIH.', esMito: true, explain: 'Cualquier persona puede adquirir el virus, sin importar su orientación sexual, género o edad.' },
    { text: 'El testeo de VIH es gratuito y confidencial en Uruguay.', esMito: false, explain: 'Cualquier persona puede testearse de forma voluntaria, gratuita y confidencial en el sistema de salud.' }
  ];

  const mitosAccordion = document.getElementById('mitosAccordion');
  MITOS.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'accordion-item';
    el.innerHTML = `
      <button type="button" class="accordion-item__q" aria-expanded="false">
        <span>${item.text}</span>
        <span class="accordion-item__icon">+</span>
      </button>
      <div class="accordion-item__a">
        <span class="accordion-item__badge ${item.esMito ? 'accordion-item__badge--mito' : 'accordion-item__badge--verdad'}">
          ${item.esMito ? 'Mito' : 'Verdad'}
        </span>
        <p>${item.explain}</p>
      </div>
    `;
    const btn = el.querySelector('.accordion-item__q');
    btn.addEventListener('click', () => {
      const isOpen = el.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
    mitosAccordion.appendChild(el);
  });

  // ---------------------------------------------------------------------
  // Cuestionario
  // ---------------------------------------------------------------------
  const QUIZ = [
    {
      q: '¿A qué familia de virus pertenece el VIH?',
      options: ['Retrovirus', 'Herpesvirus', 'Coronavirus', 'Papilomavirus'],
      correct: 0,
      explain: 'El VIH es un retrovirus: usa ARN y una enzima (transcriptasa reversa) para integrarse al ADN de la célula que infecta.'
    },
    {
      q: '¿Qué células del sistema inmunológico ataca principalmente el VIH?',
      options: ['Glóbulos rojos', 'Linfocitos T CD4+', 'Plaquetas', 'Neuronas'],
      correct: 1,
      explain: 'El VIH ataca los linfocitos T CD4+, células clave para las defensas del cuerpo.'
    },
    {
      q: '¿Cuál de estos NO es uno de los 5 fluidos que transmiten el VIH?',
      options: ['Sangre', 'Semen', 'Saliva', 'Leche materna'],
      correct: 2,
      explain: 'La saliva no transmite el VIH. Los 5 fluidos son sangre, semen, secreciones vaginales, leche materna y secreciones rectales.'
    },
    {
      q: '¿Cuál es la diferencia principal entre VIH y sida?',
      options: ['Son lo mismo', 'El VIH es el virus; el sida es la etapa avanzada si no se trata', 'El sida se cura y el VIH no', 'El VIH solo afecta a personas adultas'],
      correct: 1,
      explain: 'El VIH es el virus. El sida es una etapa avanzada que hoy en día se puede evitar con tratamiento.'
    },
    {
      q: 'Compartir el mate con una persona que vive con VIH...',
      options: ['Transmite el virus siempre', 'No transmite el virus, porque la saliva no lo transmite', 'Solo transmite si comparten la bombilla', 'Depende de la carga viral'],
      correct: 1,
      explain: 'La saliva no transmite VIH: compartir el mate es completamente seguro.'
    },
    {
      q: '¿Qué significa "indetectable = intransmisible" (I=I)?',
      options: ['Que la persona ya no tiene VIH', 'Que una persona en tratamiento con carga viral indetectable no transmite el virus por vía sexual', 'Que el test dio negativo', 'Que no hace falta usar preservativo con nadie'],
      correct: 1,
      explain: 'I=I: con tratamiento correcto y carga viral indetectable, no se transmite el VIH por vía sexual.'
    },
    {
      q: '¿Qué es la PrEP?',
      options: ['Un tratamiento que cura el VIH', 'Una pastilla que se toma antes de la exposición para prevenir el VIH', 'Una vacuna contra el VIH', 'Un tipo especial de preservativo'],
      correct: 1,
      explain: 'La PrEP (Profilaxis Pre-Exposición) es una medicación que reduce mucho el riesgo de adquirir VIH.'
    },
    {
      q: 'Ante una posible exposición al VIH, ¿qué conviene hacer?',
      options: ['Esperar a tener síntomas', 'Consultar rápido para evaluar la PEP, idealmente dentro de las 72 horas', 'No hace falta hacer nada', 'Tomar antibióticos comunes'],
      correct: 1,
      explain: 'La PEP (Profilaxis Post-Exposición) es un tratamiento de emergencia que funciona mejor cuanto antes se inicia.'
    },
    {
      q: '¿Cómo se llama el tratamiento que reduce la carga viral del VIH?',
      options: ['TAR (Tratamiento Antirretroviral)', 'Quimioterapia', 'Insulina', 'Un antibiótico de amplio espectro'],
      correct: 0,
      explain: 'El TAR (Tratamiento Antirretroviral) reduce la cantidad de virus en sangre hasta niveles indetectables.'
    },
    {
      q: 'En Uruguay, el testeo de VIH es...',
      options: ['Obligatorio para mayores de 15 años', 'Voluntario, gratuito y confidencial en el sistema de salud', 'Solo disponible en Montevideo', 'De costo elevado'],
      correct: 1,
      explain: 'Cualquier persona puede testearse de forma voluntaria, gratuita y confidencial.'
    }
  ];

  const BEST_SCORE_KEY = 'vihInteractivo.bestScore'; // guardado solo en este dispositivo/navegador

  const quizState = { index: 0, correctCount: 0 };
  const screens = document.querySelectorAll('.quiz-screen');
  function showScreen(name) {
    screens.forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
  }

  const startQuizBtn = document.getElementById('startQuizBtn');
  const bestScoreLabel = document.getElementById('bestScoreLabel');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizProgressLabel = document.getElementById('quizProgressLabel');
  const resultNumber = document.getElementById('resultNumber');
  const resultMessage = document.getElementById('resultMessage');
  const retryQuizBtn = document.getElementById('retryQuizBtn');

  function getBestScore() {
    try {
      const v = window.localStorage.getItem(BEST_SCORE_KEY);
      return v === null ? null : Number.parseInt(v, 10);
    } catch (err) {
      return null; // localStorage puede no estar disponible (modo privado, etc.)
    }
  }

  function setBestScore(score) {
    try {
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch (err) {
      /* si no se puede guardar, no pasa nada: simplemente no persiste */
    }
  }

  function refreshBestScoreLabel() {
    const best = getBestScore();
    if (best === null) {
      bestScoreLabel.hidden = true;
    } else {
      bestScoreLabel.hidden = false;
      bestScoreLabel.textContent = `Tu mejor puntaje: ${best}/10`;
    }
  }
  refreshBestScoreLabel();

  function renderQuestion() {
    const item = QUIZ[quizState.index];
    quizQuestion.textContent = item.q;
    quizFeedback.hidden = true;
    quizNextBtn.hidden = true;
    quizOptions.innerHTML = '';

    item.options.forEach((optionText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = optionText;
      btn.addEventListener('click', () => onAnswer(i, btn));
      quizOptions.appendChild(btn);
    });

    quizProgressFill.style.width = `${(quizState.index / QUIZ.length) * 100}%`;
    quizProgressLabel.textContent = `Pregunta ${quizState.index + 1} de ${QUIZ.length}`;
  }

  function onAnswer(selectedIndex, btnEl) {
    const item = QUIZ[quizState.index];
    const buttons = Array.from(quizOptions.children);
    buttons.forEach((b) => (b.disabled = true));

    const isCorrect = selectedIndex === item.correct;
    if (isCorrect) {
      quizState.correctCount += 1;
      btnEl.classList.add('is-correct');
    } else {
      btnEl.classList.add('is-wrong');
      buttons[item.correct].classList.add('is-correct');
    }

    quizFeedback.textContent = (isCorrect ? '✅ ¡Correcto! ' : '❌ No era esa. ') + item.explain;
    quizFeedback.hidden = false;
    quizNextBtn.hidden = false;
    quizNextBtn.textContent = quizState.index < QUIZ.length - 1 ? 'Siguiente →' : 'Ver resultado →';
  }

  function animateCountUp(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function showResult() {
    const score = quizState.correctCount;

    let message;
    if (score >= 9) {
      message = '¡Excelente! Dominás el tema. 🎉';
    } else if (score >= 6) {
      message = 'Bien, repasá algunos puntos. 👍';
    } else {
      message = 'Te conviene volver a leer la guía. 📖';
    }
    resultMessage.textContent = message;

    const best = getBestScore();
    if (best === null || score > best) setBestScore(score);

    showScreen('result');
    animateCountUp(resultNumber, score, 800);
  }

  startQuizBtn.addEventListener('click', () => {
    quizState.index = 0;
    quizState.correctCount = 0;
    showScreen('question');
    renderQuestion();
  });

  quizNextBtn.addEventListener('click', () => {
    quizState.index += 1;
    if (quizState.index < QUIZ.length) {
      renderQuestion();
    } else {
      quizProgressFill.style.width = '100%';
      showResult();
    }
  });

  retryQuizBtn.addEventListener('click', () => {
    refreshBestScoreLabel();
    showScreen('start');
  });
})();
