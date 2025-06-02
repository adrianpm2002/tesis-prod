const pool = require('../config/db');

const getActivitiesByZona = async (req, res) => {
  const { zonaId } = req.params;
  

  try {
    const result = await pool.query('SELECT * FROM actividades WHERE zona_id = $1 ORDER BY date, hora', [zonaId]);

    if (result.rowCount === 0) {
      
      return res.status(200).json([]); // ✅ Cambiado de `404` a `200` con array vacío
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




const createActivity = async (req, res) => {
  const { date, hora, zona_id, tipoActividad, descripcion, producto, automatico } = req.body; // ✅ Agregar `hora`

  try {
    const result = await pool.query('SELECT fecha_cultivo, tiempo_cultivo FROM zonas WHERE id = $1', [zona_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    const { fechaCultivo, tiempoCultivo } = result.rows[0];
    const fechaSiembra = new Date(fechaCultivo);
    const fechaCosecha = new Date(fechaSiembra);
    fechaCosecha.setDate(fechaSiembra.getDate() + parseInt(tiempoCultivo));

    if (new Date(date) < fechaSiembra || new Date(date) > fechaCosecha) {
      console.warn("⚠ No se pueden agregar actividades fuera del período de cultivo.");
      return res.status(400).json({ error: "Las actividades deben estar dentro del período de cultivo." });
    }

    // ✅ Ahora `hora` está incluido en la inserción
    const insertResult = await pool.query(
      `INSERT INTO actividades (date, hora, zona_id, tipoActividad, descripcion, producto, automatico)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [date, hora, zona_id, tipoActividad, descripcion, producto, automatico]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('🚨 Error al crear actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};





const deleteActivity = async (req, res) => {
  const { id } = req.params;
  

  try {
    if (!id || isNaN(id)) {
      console.warn("⚠ ID inválido:", id);
      return res.status(400).json({ error: 'ID inválido' });
    }

    const query = 'DELETE FROM actividades WHERE id = CAST($1 AS INTEGER)';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      console.warn(`⚠ La actividad con ID ${id} no existe en la base de datos.`);
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({ success: true, message: 'Actividad eliminada correctamente' });
  } catch (error) {
    console.error('🚨 Error en la eliminación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getActivitiesByZona, createActivity, deleteActivity };


