const jwt = require('jsonwebtoken');

// Generar un token de prueba
const testToken = jwt.sign({ id: 1 }, "TU_SECRETO_SEGURO", { expiresIn: '1h' });
console.log("🔐 Token generado correctamente:", testToken);

// Verificar el token generado
try {
    const decoded = jwt.verify(testToken, "TU_SECRETO_SEGURO");
    console.log("✅ Token verificado correctamente:", decoded);
} catch (error) {
    console.error("🚨 Error al verificar el token:", error.message);
}
