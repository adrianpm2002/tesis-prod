require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const zonasRoutes = require('./routes/zonasRoutes');
const sensorsRoutes = require('./routes/sensorsRoutes');
const authRoutes = require('./routes/authRoutes'); // Importamos la ruta de autenticación


const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Rutas
app.use('/api/zonas', zonasRoutes);
app.use('/api/sensores', sensorsRoutes);
app.use('/api/auth', authRoutes); // Agregamos la ruta de autenticación

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
