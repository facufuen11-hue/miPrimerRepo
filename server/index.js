const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');

const config = require('./config');
const leaderboard = require('./leaderboard');
const { getLocalIPs } = require('./network');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------- Helpers ----------

function clampInt(value, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function sanitizeName(rawName) {
  const name = String(rawName || '').trim().slice(0, 24);
  return name.length > 0 ? name : 'Anónimo';
}

// ---------- Rutas de la app ----------

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard.getTop(config.LEADERBOARD_TOP_N));
});

// Página con el código QR apuntando a esta misma IP de red local, para
// proyectar en el aula y que se conecten escaneando.
app.get('/qr', async (req, res) => {
  try {
    const ips = getLocalIPs();
    const ip = req.query.ip || ips[0];
    const url = ip ? `http://${ip}:${config.PORT}` : `http://localhost:${config.PORT}`;
    const qrDataUrl = await QRCode.toDataURL(url, { width: 480, margin: 2 });
    const otherIps = ips.filter((x) => x !== ip);

    res.send(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Escaneá para entrar - VIH Interactivo</title>
<style>
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
       background:#1b1330;color:#fdfaf6;font-family:"IBM Plex Sans",Arial,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
  h1{font-family:Georgia,serif;font-size:clamp(1.6rem,4vw,2.4rem);margin:0 0 8px}
  p{margin:4px 0;opacity:.85}
  img{background:#fff;padding:16px;border-radius:16px;margin:24px 0;max-width:80vw;width:420px}
  code{background:rgba(255,255,255,.1);padding:4px 10px;border-radius:8px;font-size:1.1rem}
  .otros{font-size:.85rem;opacity:.6;margin-top:16px}
</style>
</head>
<body>
  <h1>📱 Escaneá para jugar</h1>
  <p>Conectate a la misma red WiFi y escaneá este código:</p>
  <img src="${qrDataUrl}" alt="Código QR de acceso">
  <p>O entrá manualmente a: <code>${url}</code></p>
  ${otherIps.length ? `<p class="otros">Otras IP detectadas: ${otherIps.map((i) => `http://${i}:${config.PORT}`).join(' · ')}</p>` : ''}
</body>
</html>`);
  } catch (err) {
    res.status(500).send('No se pudo generar el código QR: ' + err.message);
  }
});

// ---------- Admin (protegido con contraseña simple hardcodeada) ----------

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  res.json({ ok: password === config.ADMIN_PASSWORD });
});

app.post('/api/admin/reset', (req, res) => {
  const { password } = req.body || {};
  if (password !== config.ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Contraseña incorrecta' });
  }
  leaderboard.reset();
  io.emit('leaderboard:update', leaderboard.getTop(config.LEADERBOARD_TOP_N));
  res.json({ ok: true });
});

app.get('/api/admin/export', (req, res) => {
  const { password } = req.query;
  if (password !== config.ADMIN_PASSWORD) {
    return res.status(401).send('Contraseña incorrecta');
  }
  const csv = leaderboard.toCSV();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="ranking-vih-${Date.now()}.csv"`);
  res.send('﻿' + csv); // BOM para que Excel abra bien los acentos
});

// ---------- Socket.io: juego y ranking en vivo ----------

io.on('connection', (socket) => {
  socket.emit('leaderboard:update', leaderboard.getTop(config.LEADERBOARD_TOP_N));

  socket.on('game:submitScore', (payload, ack) => {
    try {
      const triviaCorrect = clampInt(payload && payload.triviaCorrect, 0, config.MAX_TRIVIA_CORRECT);
      const dragCorrect = clampInt(payload && payload.dragCorrect, 0, config.MAX_DRAG_CORRECT);
      const name = sanitizeName(payload && payload.name);
      const score = (triviaCorrect + dragCorrect) * config.POINTS_PER_ITEM;

      const entry = leaderboard.addScore({ name, score, triviaCorrect, dragCorrect });
      const top = leaderboard.getTop(config.LEADERBOARD_TOP_N);

      io.emit('leaderboard:update', top);
      if (typeof ack === 'function') ack({ ok: true, entry, top });
    } catch (err) {
      console.error('[socket] error al guardar puntaje:', err);
      if (typeof ack === 'function') ack({ ok: false, error: 'No se pudo guardar el puntaje' });
    }
  });
});

server.listen(config.PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log('\n🎓 VIH Interactivo corriendo!');
  console.log(`   Local:  http://localhost:${config.PORT}`);
  if (ips.length) {
    ips.forEach((ip) => console.log(`   Red:    http://${ip}:${config.PORT}`));
    console.log(`\n   📱 Código QR para proyectar: http://${ips[0]}:${config.PORT}/qr`);
  } else {
    console.log('   (No se detectó una IP de red local; conectate por WiFi y volvé a intentar)');
  }
  console.log(`\n   🔒 Panel admin: http://localhost:${config.PORT}/admin  (contraseña: ${config.ADMIN_PASSWORD})\n`);
});
