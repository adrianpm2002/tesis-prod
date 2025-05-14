const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Asegúrate de que `db.js` está correctamente configurado
require('dotenv').config();

const router = express.Router();

// Ruta para registrar usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user: newUser.rows[0], token });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
