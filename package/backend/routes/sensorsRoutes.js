// backend/routes/sensorsRoutes.js
const express = require('express');
const router = express.Router();
const { getSensors, createSensor, updateSensor, deleteSensor } = require('../controllers/sensorsController');

router.get('/', getSensors);         // GET /api/sensores
router.post('/', createSensor);      // POST /api/sensores
router.put('/:id', updateSensor);    // PUT /api/sensores/:id
router.delete('/:id', deleteSensor); // DELETE /api/sensores/:id

module.exports = router;