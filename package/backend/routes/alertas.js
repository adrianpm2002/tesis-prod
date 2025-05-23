const express = require("express");
const pool = require("../config/db"); // ✅ Importar la conexión a PostgreSQL
const { analizarYRegistrarAlerta } = require("../controllers/alertasController");
const { archivarAlerta } = require("../controllers/alertasController");

const router = express.Router();

// ✅ Ruta para obtener alertas activas 
router.get("/api/alertas", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM alertas 
            WHERE archivada = FALSE 
            ORDER BY fecha DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error obteniendo alertas:", error);
        res.status(500).json({ error: "Error obteniendo alertas" });
    }
});

// ✅ Nueva ruta para obtener alertas archivadas
router.get("/api/alertas-archivadas", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM alertas 
            WHERE archivada = TRUE 
            ORDER BY fecha DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error obteniendo alertas archivadas:", error);
        res.status(500).json({ error: "Error obteniendo alertas archivadas" });
    }
});

// ✅ Endpoint para analizar alertas manualmente
router.post("/api/alertas", analizarYRegistrarAlerta);

router.put("/api/alertas/:id/archivar", archivarAlerta);

module.exports = router;

