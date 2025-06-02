
const express = require("express");
const router = express.Router();
const { getUpcomingActivities, getActivitiesByZona, createActivity, deleteActivity } = require("../controllers/activitiesController");

// ✅ Definir la ruta para obtener actividades programadas para mañana
router.get("/proximas", async (req, res) => {
    try {
        const actividades = await getUpcomingActivities();
        res.json(actividades);
    } catch (error) {
        console.error("🚨 Error en /api/actividades/proximas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ✅ Mantener las rutas existentes
router.get("/:zonaId", getActivitiesByZona);
router.post("/", createActivity);
router.delete("/:id", deleteActivity);

module.exports = router;




