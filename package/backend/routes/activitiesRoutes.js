const express = require('express');
const router = express.Router(); // ✅ Aquí está la definición correcta de router
const db = require('../config/db'); // ✅ Asegurar que db esté correctamente importado
const { getActivitiesByZona, createActivity, deleteActivity } = require('../controllers/activitiesController');

router.get('/:zonaId', getActivitiesByZona);
router.post('/', createActivity);

router.delete('/:id', deleteActivity);


module.exports = router; // ✅ Asegurar que router se exporte correctamente

