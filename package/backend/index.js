// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const zonasRoutes = require('./routes/zonasRoutes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/zonas', zonasRoutes); // Usa el router como middleware

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});