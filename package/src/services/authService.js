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
        localStorage.setItem('user', JSON.stringify(data.user));
        return data; // Retorna el usuario y el token si el login es exitoso
    } catch (error) {
        throw new Error(error.message || 'Error al iniciar sesión');
    }

};

export const updateUser = async (userData) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token guardado

        const response = await fetch(`${API_URL}/me`, { // 👈 Asegúrate de que la ruta exista en el backend
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar usuario');
        }

        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Guardar cambios en localStorage

        return updatedUser;
    } catch (error) {
        throw new Error(error.message || 'Error al actualizar el usuario');
    }
};


export const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error("No se pudo renovar el token");
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // Guardar nuevo token
  
      return data.token;
    } catch (error) {
      console.error("🚨 Error al renovar token:", error);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };
  
