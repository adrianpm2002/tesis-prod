const express = require('express');
const cropController = require('../controllers/cropController.js'); // Asegúrate de que esta ruta sea correcta
const router = express.Router(); // Crear un enrutador

// Definir las rutas
router.get('/crops', cropController.getAllCrops); // Obtener todos los cultivos
router.post('/crops', cropController.createCrop); // Crear un nuevo cultivo

module.exports = router; // Exportar el enrutador