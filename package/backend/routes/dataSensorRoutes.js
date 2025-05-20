const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.post('/api/sensor-data', async (req, res) => {
    try {
        const { humedad, temperatura, radiacionSolar, ph } = req.body;
        await pool.query(
            'INSERT INTO sensor_data (humedad, temperatura, radiacionSolar, ph) VALUES ($1, $2, $3, $4)',
            [humedad, temperatura, radiacionSolar, ph]
        );
        res.status(201).json({ message: 'Datos almacenados correctamente' });
    } catch (error) {
        console.error('Error al almacenar datos:', error);
        res.status(500).json({ error: 'Error al almacenar datos' });
    }
});

router.get('/api/sensor-history', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                DATE(timestamp) AS fecha,
                AVG(humedad) AS humedad,
                MIN(temperatura) AS temperatura_min,
                MAX(temperatura) AS temperatura_max,
                AVG(ph) AS ph,
                AVG(radiacionSolar) AS radiacion
            FROM sensor_data
            GROUP BY fecha
            ORDER BY fecha DESC
            LIMIT 30;
        `);

        // Convertir valores a números antes de enviarlos al frontend
        const formattedData = result.rows.map(row => ({
            fecha: row.fecha,
            humedad: Number(row.humedad).toFixed(2),
            temperatura_min: row.temperatura_min,
            temperatura_max: row.temperatura_max,
            ph: Number(row.ph).toFixed(2),
            radiacion: Number(row.radiacion).toFixed(2)
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error al obtener el promedio diario:', error);
        res.status(500).json({ error: 'Error al procesar datos' });
    }
});

router.get('/api/sensor-history/:fecha', async (req, res) => {
    try {
        const fechaRaw = req.params.fecha;
        const fecha = fechaRaw.split('T')[0]; // ✅ Extrae solo `YYYY-MM-DD`

        console.log("Buscando datos para la fecha en backend:", fecha);

        const result = await pool.query(`
            SELECT 
                EXTRACT(HOUR FROM timestamp) AS hora,
                AVG(humedad) AS humedad,
                AVG(temperatura) AS temperatura,
                AVG(ph) AS ph,
                AVG(radiacionSolar) AS radiacion
            FROM sensor_data
            WHERE DATE(timestamp) = $1
            GROUP BY hora
            ORDER BY hora ASC;
        `, [fecha]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No hay datos disponibles para la fecha ${fecha}.` });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener datos por hora:", error);
        res.status(500).json({ error: "Error al procesar datos" });
    }
});







module.exports = router;
