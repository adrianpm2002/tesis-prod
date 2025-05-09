// backend/controllers/zonasController.js
const pool = require('../config/db');

// Controlador para obtener zonas
const getZonas = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM zonas ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    res.status(500).json({
      error: 'Error al obtener zonas',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Crear nueva zona
const createZona = async (req, res) => {
  // Campos obligatorios
  const { nombre, cantidad_plantas, fecha_cultivo, tiempo_cultivo } = req.body;
  
  // Validación mejorada
  const errors = [];
  if (!nombre?.trim()) errors.push('El nombre es requerido');
  if (cantidad_plantas === undefined || isNaN(cantidad_plantas)) errors.push('La cantidad de plantas es requerida y debe ser un número');
  if (!fecha_cultivo) errors.push('La fecha de cultivo es requerida');
  if (tiempo_cultivo === undefined || isNaN(tiempo_cultivo)) errors.push('El tiempo de cultivo es requerido y debe ser un número');

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: errors,
      required_fields: {
        nombre: 'string',
        cantidad_plantas: 'number',
        fecha_cultivo: 'date (YYYY-MM-DD)',
        tiempo_cultivo: 'number'
      }
    });
  }

  try {
    // Campos opcionales con valores por defecto
    const {
      acidez_min = null,
      acidez_max = null,
      temperatura_min = null,
      temperatura_max = null,
      humedad_min = null,
      humedad_max = null,
      radiacion_min = null,
      radiacion_max = null
    } = req.body;

    const result = await pool.query(
      `INSERT INTO zonas (
        nombre, cantidad_plantas, fecha_cultivo, tiempo_cultivo,
        acidez_min, acidez_max, temperatura_min, temperatura_max,
        humedad_min, humedad_max, radiacion_min, radiacion_max
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        nombre.trim(),
        parseInt(cantidad_plantas),
        fecha_cultivo,
        parseInt(tiempo_cultivo),
        acidez_min ? parseFloat(acidez_min) : null,
        acidez_max ? parseFloat(acidez_max) : null,
        temperatura_min ? parseFloat(temperatura_min) : null,
        temperatura_max ? parseFloat(temperatura_max) : null,
        humedad_min ? parseFloat(humedad_min) : null,
        humedad_max ? parseFloat(humedad_max) : null,
        radiacion_min ? parseFloat(radiacion_min) : null,
        radiacion_max ? parseFloat(radiacion_max) : null
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear zona:', error);
    
    let errorMessage = 'Error al crear la zona';
    let statusCode = 500;
    
    if (error.code === '23502') {
      errorMessage = `Falta el campo requerido: ${error.column}`;
      statusCode = 400;
    } else if (error.code === '22007') {
      errorMessage = 'Formato de fecha inválido (use YYYY-MM-DD)';
      statusCode = 400;
    } else if (error.code === '22P02') {
      errorMessage = 'Tipo de dato inválido (verifique números)';
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.detail : undefined,
      code: error.code
    });
  }
};

// Actualizar zona existente
const updateZona = async (req, res) => {
  const { id } = req.params;
  
  // Validar ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de zona inválido' });
  }

  // Campos obligatorios
  const { nombre, cantidad_plantas, fecha_cultivo, tiempo_cultivo } = req.body;
  
  // Validación
  const errors = [];
  if (!nombre?.trim()) errors.push('El nombre es requerido');
  if (cantidad_plantas === undefined || isNaN(cantidad_plantas)) errors.push('La cantidad de plantas es requerida y debe ser un número');
  if (!fecha_cultivo) errors.push('La fecha de cultivo es requerida');
  if (tiempo_cultivo === undefined || isNaN(tiempo_cultivo)) errors.push('El tiempo de cultivo es requerido y debe ser un número');

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: errors
    });
  }

  try {
    // Campos opcionales
    const {
      acidez_min,
      acidez_max,
      temperatura_min,
      temperatura_max,
      humedad_min,
      humedad_max,
      radiacion_min,
      radiacion_max
    } = req.body;

    const result = await pool.query(
      `UPDATE zonas SET 
        nombre = $1,
        cantidad_plantas = $2,
        fecha_cultivo = $3,
        tiempo_cultivo = $4,
        acidez_min = COALESCE($5, acidez_min),
        acidez_max = COALESCE($6, acidez_max),
        temperatura_min = COALESCE($7, temperatura_min),
        temperatura_max = COALESCE($8, temperatura_max),
        humedad_min = COALESCE($9, humedad_min),
        humedad_max = COALESCE($10, humedad_max),
        radiacion_min = COALESCE($11, radiacion_min),
        radiacion_max = COALESCE($12, radiacion_max)
      WHERE id = $13
      RETURNING *`,
      [
        nombre.trim(),
        parseInt(cantidad_plantas),
        fecha_cultivo,
        parseInt(tiempo_cultivo),
        acidez_min ? parseFloat(acidez_min) : null,
        acidez_max ? parseFloat(acidez_max) : null,
        temperatura_min ? parseFloat(temperatura_min) : null,
        temperatura_max ? parseFloat(temperatura_max) : null,
        humedad_min ? parseFloat(humedad_min) : null,
        humedad_max ? parseFloat(humedad_max) : null,
        radiacion_min ? parseFloat(radiacion_min) : null,
        radiacion_max ? parseFloat(radiacion_max) : null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar zona:', error);
    
    let errorMessage = 'Error al actualizar la zona';
    let statusCode = 500;
    
    if (error.code === '23502') {
      errorMessage = `Falta el campo requerido: ${error.column}`;
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.detail : undefined
    });
  }
};

// Eliminar zona
const deleteZona = async (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de zona inválido' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM zonas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar zona:', error);
    res.status(500).json({
      error: 'Error al eliminar la zona',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getZonas,
  createZona,
  updateZona,
  deleteZona
};