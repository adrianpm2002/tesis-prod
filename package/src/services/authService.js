const API_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que el backend está corriendo en este puerto

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
        }

        return data; // Retorna el usuario y el token si el registro es exitoso
    } catch (error) {
        throw new Error(error.message || 'Error al registrar el usuario');
    }
};
