module.exports = {
  PORT: process.env.PORT || 3000,
  // Contraseña simple para /admin (reiniciar ranking / exportar datos).
  // Podés sobreescribirla con la variable de entorno ADMIN_PASSWORD.
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'vih2026',
  // Puntaje máximo posible: 8 preguntas de trivia (10 pts) + 10 elementos del juego (10 pts)
  MAX_TRIVIA_CORRECT: 8,
  MAX_DRAG_CORRECT: 10,
  POINTS_PER_ITEM: 10,
  LEADERBOARD_TOP_N: 15
};
