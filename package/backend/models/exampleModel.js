const pool = require('../config/db');

const getExampleData = async () => {
  const { rows } = await pool.query('SELECT * FROM example_table');
  return rows;
};

module.exports = { getExampleData };