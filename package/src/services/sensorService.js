// frontend/src/services/sensorService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/sensores';

const handleApiError = (error) => {
  if (error.response) {
    const serverMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        'Error en la solicitud al servidor';
    
    let userMessage = serverMessage;
    if (error.response.status === 400) {
      userMessage = `Datos inválidos: ${serverMessage}`;
    } else if (error.response.status === 404) {
      userMessage = 'Sensor no encontrado';
    } else if (error.response.status === 500) {
      userMessage = 'Error interno del servidor';
    }

    return new Error(`Error ${error.response.status}: ${userMessage}`);
  } else if (error.request) {
    return new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
  } else {
    return new Error('Error al configurar la solicitud: ' + error.message);
  }
};

export const sensorService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (sensorData) => {
    try {
      const response = await axios.post(API_URL, {
        tipo: sensorData.type,
        modelo: sensorData.model,
        zona_id: sensorData.zonaId || null,
        activo: sensorData.isActive !== false
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id, sensorData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        tipo: sensorData.type,
        modelo: sensorData.model,
        zona_id: sensorData.zonaId || null,
        activo: sensorData.isActive
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};