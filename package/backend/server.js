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
// Configura el puerto serial (ajusta el nombre del puerto según tu sistema)
const serialPort = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Almacena los datos recibidos
let sensorData = {
    humedad: 0,
    temperatura: 0,
    radiacionSolar: 0,
    ph: 0,
};

app.post('/api/selected-zone', (req, res) => {
    try {
        const { selectedZona } = req.body; // ✅ Recibir la zona desde el frontend

        if (!selectedZona) {
            return res.status(400).json({ error: "Zona seleccionada no proporcionada." });
        }

        console.log(`✅ Zona seleccionada en el Dashboard actualizada: ${selectedZona}`);

        global.selectedZona = selectedZona; // ✅ Guardar la zona globalmente en el servidor

        res.status(200).json({ message: "Zona seleccionada actualizada correctamente." });
    } catch (error) {
        console.error("❌ Error al actualizar la zona seleccionada:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});



// Escucha los datos del puerto serial
parser.on('data', async (data) => {
    try {
        const values = data.split('|').map((val) => parseFloat(val.trim().split(':')[1]));
        sensorData = {
            humedad: values[0],
            temperatura: values[1],
            radiacionSolar: values[2],
            ph: values[3],
        };
        console.log('Datos recibidos:', sensorData);

        const result = await pool.query(
            'INSERT INTO sensor_data (humedad, temperatura, radiacionSolar, ph) VALUES ($1, $2, $3, $4) RETURNING *',
            [sensorData.humedad, sensorData.temperatura, sensorData.radiacionSolar, sensorData.ph]
        );

        console.log('Datos almacenados correctamente en PostgreSQL:', result.rows[0]);

        // ✅ Obtener la zona seleccionada dinámicamente
        const zonaSeleccionada = global.selectedZona || 15; // ⚠ Si no hay zona seleccionada, usa un valor por defecto
        console.log(`Zona seleccionada en el Dashboard: ${zonaSeleccionada}`);

        // ✅ Analizar y registrar alertas en la base de datos si hay valores anómalos
        await analizarYRegistrarAlerta(zonaSeleccionada, result.rows[0].timestamp, sensorData);

    } catch (error) {
        console.error('Error al almacenar datos en PostgreSQL:', error);
    }
});

// Ruta para obtener los datos
app.get('/api/sensor-data', (req, res) => {
    res.json(sensorData);
});

console.log("Rutas cargadas en el servidor:", app._router.stack.map(layer => layer.route?.path).filter(Boolean));


app.listen(port, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${port}`);
});

