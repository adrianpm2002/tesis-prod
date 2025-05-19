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

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    console.log('Solicitud recibida en /login');
    console.log('Datos enviados:', req.body);
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("🔍 Token recibido en backend:", token);

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token requerido' });
    }

    const tokenValue = token.split(' ')[1]; // 👈 Extrae solo el token sin "Bearer"
    console.log("✅ Token procesado:", tokenValue);

    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET); // 👈 Verifica con el mismo JWT_SECRET
        req.userId = decoded.id;
        console.log("✅ Usuario autenticado, ID extraído:", req.userId);
        next();
    } catch (error) {
        console.error("🚨 Error verificando el token:", error.message);
        return res.status(403).json({ message: 'Token inválido' });
    }
};



// Ruta protegida para obtener datos del usuario autenticado
router.get('/me', authenticateToken, async (req, res) => {
    console.log("📢 Solicitud recibida en /me");
    console.log("✅ Datos enviados al frontend:", rows[0]); 
    try {
        // Consulta SQL mejorada para traer toda la información del usuario
        const { rows } = await pool.query(`
            SELECT id, name, email, categoria, avatar, provincia, municipio
            FROM users
            WHERE id = $1
        `, [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log("✅ Enviando usuario completo desde /me:", rows[0]); // 👀 Verifica en consola del backend
        res.json(rows[0]); // 👈 Enviar toda la información al frontend

    } catch (error) {
        console.error('🚨 Error al obtener información del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Ruta protegida para actualizar datos del usuario
router.put('/me', authenticateToken, async (req, res) => {
    console.log("📢 Solicitud recibida en /me para actualizar usuario");

    try {
        const { name, email, categoria, provincia, municipio, avatar } = req.body;

        // Validar que al menos un campo se haya proporcionado
        if (!name && !email && !categoria && !provincia && !municipio && !avatar) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        // Actualizar solo los campos que se proporcionen
        const updateQuery = `
            UPDATE users 
            SET name = COALESCE($1, name), 
                email = COALESCE($2, email), 
                categoria = COALESCE($3, categoria), 
                provincia = COALESCE($4, provincia), 
                municipio = COALESCE($5, municipio), 
                avatar = COALESCE($6, avatar)
            WHERE id = $7
            RETURNING id, name, email, categoria, provincia, municipio, avatar`;

        const { rows } = await pool.query(updateQuery, [name, email, categoria, provincia, municipio, avatar, req.userId]);
        const userId = req.user?.id; // 👈 Asegura que `req.user` tiene el ID
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log("✅ Usuario actualizado:", rows[0]); // Verifica el cambio en la consola del backend
        res.json(rows[0]);

    } catch (error) {
        console.error('🚨 Error SQL:', error.message); // 👈 Solo el mensaje del error
        res.status(500).json({ message: 'Error interno del servidor', error: error.message }); // 👈 Envía detalles al frontend
    }
});


module.exports = router;
