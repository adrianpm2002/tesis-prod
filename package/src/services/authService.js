const API_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que el backend está corriendo en este puerto

// Función para registrar un usuario
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

// Función para iniciar sesión
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el inicio de sesión');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // Guardar el token en el localStorage

        return data; // Retorna el usuario y el token si el login es exitoso
    } catch (error) {
        throw new Error(error.message || 'Error al iniciar sesión');
    }
};

