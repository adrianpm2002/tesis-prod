const pool = require('../config/db');

// Función para obtener el último registro de sensores
const obtenerUltimosValores = async () => {
    try {
        const result = await pool.query(`
            SELECT * FROM sensor_data
            ORDER BY timestamp DESC
            LIMIT 1;
        `);

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error obteniendo últimos valores de sensores:", error);
        return null;
    }
};

// Función para analizar los datos y registrar alertas
const analizarYRegistrarAlerta = async (selectedZona, timestamp, sensorData) => {
    try {
        console.log(`🔎 Analizando alertas para la zona seleccionada: ${selectedZona}`);

        const zona = await pool.query("SELECT * FROM zonas WHERE id = $1", [selectedZona]);
        if (zona.rows.length === 0) {
            console.error(`❌ Zona con ID ${selectedZona} no encontrada`);
            return;
        }

        const { humedad_min, humedad_max, temperatura_min, temperatura_max, radiacion_min, radiacion_max, acidez_min, acidez_max } = zona.rows[0];

        let alertas = [];

        if (sensorData.temperatura > temperatura_max) {
            alertas.push({
                tipo: "Temperatura fuera de rango",
                zona_id: selectedZona,
                descripcion: `Temperatura ${sensorData.temperatura} fuera del rango máximo de ${temperatura_max}`
            });
        }
        if (sensorData.humedad < humedad_min || sensorData.humedad > humedad_max) {
            alertas.push({
                tipo: "Humedad fuera de rango",
                zona_id: selectedZona,
                descripcion: `Humedad ${sensorData.humedad} fuera del rango ${humedad_min} - ${humedad_max}`
            });
        }
        if (sensorData.radiacionSolar < radiacion_min || sensorData.radiacionSolar > radiacion_max) {
            alertas.push({
                tipo: "Radiación fuera de rango",
                zona_id: selectedZona,
                descripcion: `Radiación ${sensorData.radiacionSolar} fuera del rango ${radiacion_min} - ${radiacion_max}`
            });
        }
        if (sensorData.ph < acidez_min || sensorData.ph > acidez_max) {
            alertas.push({
                tipo: "pH fuera de rango",
                zona_id: selectedZona,
                descripcion: `pH ${sensorData.ph} fuera del rango ${acidez_min} - ${acidez_max}`
            });
        }

        for (const alerta of alertas) {
            // ✅ Verificar si ya existe una alerta con el mismo tipo y zona
            const existeAlerta = await pool.query(`
                SELECT id FROM alertas
                WHERE zona_id = $1 AND tipo = $2
            `, [alerta.zona_id, alerta.tipo]);

            if (existeAlerta.rows.length > 0) {
                // ✅ Si la alerta existe, actualizar la fecha y la descripción
                await pool.query(`
                    UPDATE alertas 
                    SET fecha = $1, descripcion = $2
                    WHERE id = $3
                `, [timestamp, alerta.descripcion, existeAlerta.rows[0].id]);

                console.log(`🔄 Alerta actualizada en la zona ${alerta.zona_id}: ${alerta.tipo}`);
            } else {
                // ✅ Si no existe, insertar una nueva
                await pool.query(`
                    INSERT INTO alertas (tipo, zona_id, fecha, descripcion)
                    VALUES ($1, $2, $3, $4)
                `, [alerta.tipo, alerta.zona_id, timestamp, alerta.descripcion]);

                console.log(`✅ Nueva alerta registrada en la zona ${alerta.zona_id}: ${alerta.tipo}`);
            }
        }

    } catch (error) {
        console.error("❌ Error al analizar y registrar alertas:", error);
    }
};


const archivarAlerta = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            UPDATE alertas 
            SET archivada = TRUE 
            WHERE id = $1
        `, [id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: "Alerta archivada correctamente." });
        } else {
            res.status(404).json({ error: "Alerta no encontrada." });
        }
    } catch (error) {
        console.error("❌ Error al archivar alerta:", error);
        res.status(500).json({ error: "Error al procesar la solicitud." });
    }
};




module.exports = { analizarYRegistrarAlerta, archivarAlerta };

