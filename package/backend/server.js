require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const dataSensorRoutes = require('../backend/routes/dataSensorRoutes');
const { analizarYRegistrarAlerta } = require('../backend/controllers/alertasController');
const pool = require('./config/db');

const { activarRiego} = require('./controllers/riegoController');  // Nueva importación



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
let reintentos = 0;
const MAX_REINTENTOS = 5;

function abrirPuerto() {
    serialPort.open((err) => {
        if (err) {
            console.error("❌ Error al abrir el puerto serial:", err.message);
            sensoresConectados = false;

            if (reintentos < MAX_REINTENTOS) {
                reintentos++;
                console.log(`🔁 Reintento ${reintentos}/${MAX_REINTENTOS}...`);
                setTimeout(abrirPuerto, 5000);
            } else {
                console.error("🚨 No se pudo abrir el puerto serial después de varios intentos.");
            }
        } else {
            console.log("✅ Puerto serial abierto correctamente.");
            sensoresConectados = true;
            reintentos = 0; // Resetear si se abre con éxito
        }
    });
}

abrirPuerto();



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
        console.log(`🔍 RAW DATA RECIBIDA: ${data}`);  // ✅ Ver qué está llegando desde Arduino

        // 📌 Filtrar mensajes de estado que Arduino envía sobre la bomba
        if (data.includes("Bomba activada") || data.includes("Bomba apagada")) {
            console.log("⚠ Mensaje de estado recibido desde Arduino. Ignorando...");
            return;  // 🔄 Evitar que estos mensajes se procesen como datos de sensores
        }

        const values = data.split('|').map((val) => parseFloat(val.trim().split(':')[1]));

        if (values.some(val => isNaN(val))) {
            console.warn("⚠ Advertencia: Se detectaron valores inválidos. Ignorando esta lectura...");
            return;
        }

        sensoresConectados = true;
        sensorData = {
            humedad: values[0],
            temperatura: values[1],
            radiacionSolar: values[2],
            ph: values[3],
        };

        console.log("📊 Datos recibidos y procesados:", sensorData);

        // ✅ Guardar los datos en PostgreSQL
        const result = await pool.query(
            'INSERT INTO sensor_data (humedad, temperatura, radiacionSolar, ph) VALUES ($1, $2, $3, $4) RETURNING *',
            [sensorData.humedad, sensorData.temperatura, sensorData.radiacionSolar, sensorData.ph]
        );

        console.log("✅ Datos almacenados en PostgreSQL:", result.rows[0]);

        // ✅ Obtener la zona seleccionada y registrar alertas
        const zonaSeleccionada = global.selectedZona || 2;
        console.log(`🌍 Zona seleccionada en el Dashboard: ${zonaSeleccionada}`);

        await analizarYRegistrarAlerta(serialPort, zonaSeleccionada, result.rows[0].timestamp, sensorData);

    } catch (error) {
        console.error("❌ Error inesperado al procesar datos:", error);
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

let estadoRiegoActual = "OFF";  // 📌 Variable para evitar activaciones repetitivas

app.post('/api/activar-riego', (req, res) => {
    const { estado } = req.body;  // "ON" o "OFF"

    if (!["ON", "OFF"].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido para riego." });
    }

    if (estado !== estadoRiegoActual) {
        activarRiego(serialPort, estado);
        estadoRiegoActual = estado;  // ✅ Actualizar estado solo si cambia
        res.json({ message: `Riego ${estado} correctamente.` });
    } else {
        res.json({ message: `El riego ya estaba en estado ${estado}. No se ha enviado el comando nuevamente.` });
    }
});

/*et estadoLuzActual = "OFF";  // 📌 Variable para evitar activaciones repetitivas

app.post('/api/activar-luz', (req, res) => {
    const { estado } = req.body;  // "ON" o "OFF"

    if (!["ON", "OFF"].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido para iluminacion." });
    }

    if (estado !== estadoLuzActual) {
        activarLuz(serialPort, estado);
        estadoLuzActual = estado;  // ✅ Actualizar estado solo si cambia
        res.json({ message: `Iluminacion ${estado} correctamente.` });
    } else {
        res.json({ message: `La Iluminacion ya estaba en estado ${estado}. No se ha enviado el comando nuevamente.` });
    }
});*/




