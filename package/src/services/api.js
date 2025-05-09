import axios from 'axios';

const API_URL = 'http://localhost:5000/api/zonas';

// Configuración común para las cabeceras
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Asumiendo que guardas el token en localStorage
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const zonaService = {
  // Obtener todas las zonas
  getAll: async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Obtener una zona por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Crear nueva zona
  create: async (zonaData) => {
    try {
      const response = await axios.post(API_URL, zonaData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Actualizar zona existente
  update: async (id, zonaData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, zonaData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Eliminar zona
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Métodos adicionales según necesidades
  getParametros: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/parametros`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Manejo centralizado de errores
const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    const message = error.response.data?.message || 'Error en la solicitud';
    return new Error(`API Error: ${message} (${error.response.status})`);
  } else if (error.request) {
    // La solicitud fue hecha pero no se recibió respuesta
    return new Error('No se recibió respuesta del servidor');
  } else {
    // Error al configurar la solicitud
    return new Error(`Error de configuración: ${error.message}`);
  }
};