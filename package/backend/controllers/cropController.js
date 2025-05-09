const Crop = require('../models/cropModel');

const cropController = {
  getAllCrops: async (req, res) => {
    try {
      const crops = await Crop.getAll();
      res.json(crops);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  createCrop: async (req, res) => {
    try {
      const newCrop = await Crop.create(req.body);
      res.status(201).json(newCrop);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = cropController;
