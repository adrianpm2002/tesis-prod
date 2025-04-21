const { getExampleData } = require('../models/exampleModel');

const getData = async (req, res) => {
  try {
    const data = await getExampleData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getData };