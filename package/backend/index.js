require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const zonasRoutes = require('./routes/zonasRoutes');
const sensorsRoutes = require('./routes/sensorsRoutes');
const authRoutes = require('./routes/authRoutes'); // Importamos la ruta de autenticación
const alertasRouter = require("./routes/alertas");
const activitiesRoutes = require('./routes/activitiesRoutes');  // ✅ Importa las rutas de actividades
const cron = require("node-cron");
const { generarAlertasPorActividades } = require("./controllers/alertasController");
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
app.use(alertasRouter);
app.use('/api/actividades', activitiesRoutes); // ✅ Agregar esta línea
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

// ✅ Ejecutar la generación de alertas diariamente a medianoche
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Ejecutando la generación de alertas por actividades...");
  try {
    await generarAlertasPorActividades();
  } catch (error) {
    console.error("❌ Error al generar alertas:", error);
  }
});
