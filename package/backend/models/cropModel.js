const pool = require('../config/db');

const Crop = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM crops');
    return res.rows;
  },
  create: async (crop) => {
    const res = await pool.query('INSERT INTO crops (name, type) VALUES ($1, $2) RETURNING *', [crop.name, crop.type]);
    return res.rows[0];
  },
  // Agrega más métodos según sea necesario
};

module.exports = Crop;