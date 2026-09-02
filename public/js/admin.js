(() => {
  'use strict';

  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('passwordInput');
  const loginMsg = document.getElementById('loginMsg');
  const adminActions = document.getElementById('adminActions');
  const resetBtn = document.getElementById('resetBtn');
  const exportLink = document.getElementById('exportLink');

  let password = '';

  function showMsg(text, type) {
    loginMsg.textContent = text;
    loginMsg.className = `msg ${type || ''}`;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    password = passwordInput.value;
    showMsg('Verificando...', '');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.ok) {
        showMsg('Acceso concedido ✅', 'ok');
        adminActions.classList.add('is-visible');
        exportLink.href = `/api/admin/export?password=${encodeURIComponent(password)}`;
      } else {
        showMsg('Contraseña incorrecta ❌', 'error');
        adminActions.classList.remove('is-visible');
      }
    } catch (err) {
      showMsg('Error de conexión con el servidor.', 'error');
    }
  });

  resetBtn.addEventListener('click', async () => {
    const confirmed = confirm('¿Seguro que querés borrar todo el ranking? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      showMsg(data.ok ? 'Ranking reiniciado ✅' : 'No se pudo reiniciar (contraseña incorrecta)', data.ok ? 'ok' : 'error');
    } catch (err) {
      showMsg('Error de conexión con el servidor.', 'error');
    }
  });
})();
