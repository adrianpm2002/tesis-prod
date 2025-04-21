const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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
parser.on('data', (data) => {
    const values = data.split('|').map((val) => parseFloat(val.trim().split(':')[1]));
    sensorData = {
        humedad: values[0],
        temperatura: values[1],
        radiacionSolar: values[2],
        ph: values[3],
    };
    console.log('Datos recibidos:', sensorData);
});

// Ruta para obtener los datos
app.get('/api/sensor-data', (req, res) => {
    res.json(sensorData);
});

app.listen(port, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${port}`);
});