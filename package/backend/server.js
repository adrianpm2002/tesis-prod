const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const dataSensorRoutes = require('../backend/routes/dataSensorRoutes');
const { analizarYRegistrarAlerta } = require('../backend/controllers/alertasController');
const pool = require('./config/db');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(dataSensorRoutes);

// 📌 Configura el puerto serial
const serialPort = new SerialPort({ path: 'COM5', baudRate: 9600, autoOpen: false });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// 📌 Estado global para detectar si los sensores están conectados
let sensoresConectados = false;

// 📌 Almacena los datos del sensor
let sensorData = {
    humedad: 0,
    temperatura: 0,
    radiacionSolar: 0,
    ph: 0,
};

// 📌 Intentar abrir el puerto serial y manejar errores
serialPort.open((err) => {
    if (err) {
        console.error("❌ Error al abrir el puerto serial:", err.message);
        sensoresConectados = false;
    } else {
        console.log("✅ Puerto serial abierto correctamente.");
        sensoresConectados = true;
    }
});

// 📌 Ruta para actualizar la zona seleccionada
app.post('/api/selected-zone', (req, res) => {
    try {
        const { selectedZona } = req.body;

        if (!selectedZona) {
            return res.status(400).json({ error: "Zona seleccionada no proporcionada." });
        }

        console.log(`✅ Zona seleccionada en el Dashboard: ${selectedZona}`);
        global.selectedZona = selectedZona;

        res.status(200).json({ message: "Zona seleccionada actualizada correctamente." });
    } catch (error) {
        console.error("❌ Error al actualizar la zona seleccionada:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// 📌 Escuchar los datos del puerto serial
parser.on('data', async (data) => {
    try {
        const values = data.split('|').map((val) => parseFloat(val.trim().split(':')[1]));

        // ✅ Detectar si los valores son válidos antes de procesar
        if (values.some(val => isNaN(val))) {
            console.error("⚠ Error en datos del sensor, posible desconexión.");
            sensoresConectados = false;
            return;
        }

        sensorData = {
            humedad: values[0],
            temperatura: values[1],
            radiacionSolar: values[2],
            ph: values[3],
        };

        console.log("📊 Datos recibidos:", sensorData);

        // ✅ Guardar los datos en PostgreSQL
        const result = await pool.query(
            'INSERT INTO sensor_data (humedad, temperatura, radiacionSolar, ph) VALUES ($1, $2, $3, $4) RETURNING *',
            [sensorData.humedad, sensorData.temperatura, sensorData.radiacionSolar, sensorData.ph]
        );

        console.log("✅ Datos almacenados en PostgreSQL:", result.rows[0]);
        sensoresConectados = true; // ✅ Confirma que los sensores están activos

        // ✅ Obtener la zona seleccionada y registrar alertas
        const zonaSeleccionada = global.selectedZona || 15;
        console.log(`🌍 Zona seleccionada en el Dashboard: ${zonaSeleccionada}`);

        await analizarYRegistrarAlerta(zonaSeleccionada, result.rows[0].timestamp, sensorData);
    } catch (error) {
        console.error("❌ Error al almacenar datos en PostgreSQL:", error);
        sensoresConectados = false;
    }
});

// 📌 Nueva ruta para verificar si los sensores están conectados
app.get('/api/sensores-estado', (req, res) => {
    res.json({ sensoresConectados });
});

// 📌 Ruta para obtener los datos del sensor
app.get('/api/sensor-data', (req, res) => {
    res.json(sensorData);
});

console.log("📢 Rutas cargadas en el servidor:", app._router.stack.map(layer => layer.route?.path).filter(Boolean));

app.listen(port, () => {
    console.log(`🚀 Servidor Node.js corriendo en http://localhost:${port}`);
});
