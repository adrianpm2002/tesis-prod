import axios from 'axios';

export const API_URL = 'http://localhost:3000/api/actividades';


// Obtener token de autenticación (si lo necesitas)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Manejo centralizado de errores
const handleApiError = (error) => {
  if (error.response) {
    const serverMessage =
      error.response.data?.error || error.response.data?.message || 'Error en la solicitud';
    let userMessage = serverMessage;
    
    if (error.response.status === 400) {
      userMessage = `Datos inválidos: ${serverMessage}`;
    } else if (error.response.status === 404) {
      userMessage = 'Recurso no encontrado';
    } else if (error.response.status === 500) {
      userMessage = 'Error interno del servidor';
    }
    
    return new Error(`Error ${error.response.status}: ${userMessage}`);
  } else if (error.request) {
    return new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
  } else {
    return new Error('Error en la configuración de la solicitud: ' + error.message);
  }
};

// Servicio para manejar las actividades
export const activitiesService = {
  // Obtener todas las actividades de una zona específica
  getByZona: async (zonaId) => {
    try {
      
      const response = await axios.get(`${API_URL}/${zonaId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Crear nueva actividad
  create: async (activityData) => {
    try {
      const response = await axios.post(API_URL, activityData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Eliminar actividad
  delete: async (id) => {
    if (!id || isNaN(id)) {
      console.warn("⚠ ID inválido para eliminación:", id);
      return Promise.reject(new Error("ID inválido"));
    }
  
    
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
};



axios.defaults.timeout = 5000; // Tiempo máximo de espera 5s
