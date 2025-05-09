const express = require('express');
const router = express.Router();
const path = require('path');

// Importación con path absoluto para evitar errores
const controllerPath = path.join(__dirname, '../controllers/zonaController');
const {
  getZonas,
  createZona,
  updateZona,
  deleteZona
} = require(controllerPath);

// Configura las rutas
router.get('/', getZonas);
router.post('/', createZona);
router.put('/:id', updateZona);
router.delete('/:id', deleteZona);

// Exporta el router
module.exports = router;