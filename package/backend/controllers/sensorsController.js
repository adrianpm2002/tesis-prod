// backend/controllers/sensorsController.js
const pool = require('../config/db');

// Obtener todos los sensores
const getSensors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensores ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener sensores:', error);
    res.status(500).json({
      error: 'Error al obtener sensores',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Crear nuevo sensor
const createSensor = async (req, res) => {
  const { tipo, modelo, zona_id, activo } = req.body;

  // Validación
  if (!tipo || !modelo) {
    return res.status(400).json({
      error: 'Campos obligatorios faltantes',
      required_fields: {
        tipo: 'string (Humedad, Temperatura, Radiacion, pH)',
        modelo: 'string',
        zona_id: 'number (opcional)',
        activo: 'boolean (opcional, default: true)'
      }
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sensores (tipo, modelo, zona_id, activo)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        tipo,
        modelo,
        zona_id || null,
        activo !== undefined ? activo : true
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear sensor:', error);
    
    let errorMessage = 'Error al crear el sensor';
    let statusCode = 500;
    
    if (error.code === '23503') { // Violación de clave foránea
      errorMessage = 'La zona especificada no existe';
      statusCode = 400;
    } else if (error.code === '23502') { // Violación NOT NULL
      errorMessage = `Falta el campo requerido: ${error.column}`;
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.detail : undefined
    });
  }
};

// Actualizar sensor
const updateSensor = async (req, res) => {
  const { id } = req.params;
  const { tipo, modelo, zona_id, activo } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de sensor inválido' });
  }

  try {
    const result = await pool.query(
      `UPDATE sensores SET
        tipo = COALESCE($1, tipo),
        modelo = COALESCE($2, modelo),
        zona_id = $3,
        activo = COALESCE($4, activo)
       WHERE id = $5
       RETURNING *`,
      [
        tipo,
        modelo,
        zona_id || null,
        activo,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sensor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar sensor:', error);
    
    let errorMessage = 'Error al actualizar el sensor';
    let statusCode = 500;
    
    if (error.code === '23503') {
      errorMessage = 'La zona especificada no existe';
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.detail : undefined
    });
  }
};

// Eliminar sensor
const deleteSensor = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de sensor inválido' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM sensores WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sensor no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar sensor:', error);
    res.status(500).json({
      error: 'Error al eliminar el sensor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSensors,
  createSensor,
  updateSensor,
  deleteSensor
};