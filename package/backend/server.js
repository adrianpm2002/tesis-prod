const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const dataSensorRoutes = require('../backend/routes/dataSensorRoutes');
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

        // Confirmar los datos antes de almacenar
        console.log(`Intentando insertar: Humedad=${sensorData.humedad}, Temperatura=${sensorData.temperatura}, Radiación Solar=${sensorData.radiacionSolar}, pH=${sensorData.ph}`);

        const result = await pool.query(
            'INSERT INTO sensor_data (humedad, temperatura, radiacionSolar, ph) VALUES ($1, $2, $3, $4) RETURNING *',
            [sensorData.humedad, sensorData.temperatura, sensorData.radiacionSolar, sensorData.ph]
        );

        console.log('Datos almacenados correctamente en PostgreSQL:', result.rows[0]);
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