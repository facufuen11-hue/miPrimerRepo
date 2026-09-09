const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LEADERBOARD_TOP_N } = require('./config');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'leaderboard.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function loadAll() {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[leaderboard] No se pudo leer el archivo, se reinicia vacío:', err.message);
    return [];
  }
}

// Escritura atómica: escribe en un archivo temporal y luego renombra,
// para no corromper el JSON si el server se corta a mitad de escritura.
function saveAll(entries) {
  ensureStore();
  const tmpFile = `${DATA_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(entries, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
}

function addScore({ name, score, triviaCorrect, dragCorrect }) {
  const entries = loadAll();
  const entry = {
    id: crypto.randomUUID(),
    name,
    score,
    triviaCorrect,
    dragCorrect,
    createdAt: new Date().toISOString()
  };
  entries.push(entry);
  saveAll(entries);
  return entry;
}

function getTop(n = LEADERBOARD_TOP_N) {
  const entries = loadAll();
  return entries
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // en empate, gana quien lo envió primero
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    .slice(0, n)
    .map((e) => ({ name: e.name, score: e.score, createdAt: e.createdAt }));
}

function getAll() {
  return loadAll();
}

function reset() {
  saveAll([]);
}

function toCSV() {
  const entries = loadAll();
  const header = 'nombre,puntaje,aciertos_trivia,aciertos_juego,fecha_hora';
  const rows = entries.map((e) => {
    const safeName = `"${String(e.name).replace(/"/g, '""')}"`;
    return [safeName, e.score, e.triviaCorrect, e.dragCorrect, e.createdAt].join(',');
  });
  return [header, ...rows].join('\n');
}

module.exports = { addScore, getTop, getAll, reset, toCSV };
