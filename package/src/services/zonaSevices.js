// frontend/src/services/zonaServices.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/zonas';

// Configuración común para las cabeceras
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Manejo mejorado de errores
const handleApiError = (error) => {
  if (error.response) {
    // Extraer mensaje del backend si está disponible
    const serverMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        'Error en la solicitud al servidor';
    
    // Crear mensaje descriptivo basado en el código de estado
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
    return new Error('Error al configurar la solicitud: ' + error.message);
  }
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

  // Crear nueva zona con validación mejorada
  create: async (zonaData) => {
    try {
      // Validación básica en el frontend
      if (!zonaData.nombre || 
          zonaData.cantidad_plantas === undefined || 
          !zonaData.fecha_cultivo || 
          zonaData.tiempo_cultivo === undefined) {
        throw new Error('Faltan campos obligatorios: nombre, cantidad_plantas, fecha_cultivo, tiempo_cultivo');
      }

      // Preparar los datos para el backend
      const payload = {
        nombre: zonaData.nombre.trim(),
        cantidad_plantas: Number(zonaData.cantidad_plantas),
        fecha_cultivo: zonaData.fecha_cultivo,
        tiempo_cultivo: Number(zonaData.tiempo_cultivo),
        acidez_min: zonaData.acidez_min ? Number(zonaData.acidez_min) : null,
        acidez_max: zonaData.acidez_max ? Number(zonaData.acidez_max) : null,
        temperatura_min: zonaData.temperatura_min ? Number(zonaData.temperatura_min) : null,
        temperatura_max: zonaData.temperatura_max ? Number(zonaData.temperatura_max) : null,
        humedad_min: zonaData.humedad_min ? Number(zonaData.humedad_min) : null,
        humedad_max: zonaData.humedad_max ? Number(zonaData.humedad_max) : null,
        radiacion_min: zonaData.radiacion_min ? Number(zonaData.radiacion_min) : null,
        radiacion_max: zonaData.radiacion_max ? Number(zonaData.radiacion_max) : null
      };

      const response = await axios.post(API_URL, payload, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Actualizar zona existente
  update: async (id, zonaData) => {
    try {
      // Validación básica
      if (!id || isNaN(id)) {
        throw new Error('ID de zona inválido');
      }

      const payload = {
        nombre: zonaData.nombre?.trim(),
        cantidad_plantas: zonaData.cantidad_plantas !== undefined ? Number(zonaData.cantidad_plantas) : undefined,
        fecha_cultivo: zonaData.fecha_cultivo,
        tiempo_cultivo: zonaData.tiempo_cultivo !== undefined ? Number(zonaData.tiempo_cultivo) : undefined,
        acidez_min: zonaData.acidez_min !== undefined ? (zonaData.acidez_min ? Number(zonaData.acidez_min) : null) : undefined,
        acidez_max: zonaData.acidez_max !== undefined ? (zonaData.acidez_max ? Number(zonaData.acidez_max) : null) : undefined,
        temperatura_min: zonaData.temperatura_min !== undefined ? (zonaData.temperatura_min ? Number(zonaData.temperatura_min) : null) : undefined,
        temperatura_max: zonaData.temperatura_max !== undefined ? (zonaData.temperatura_max ? Number(zonaData.temperatura_max) : null) : undefined,
        humedad_min: zonaData.humedad_min !== undefined ? (zonaData.humedad_min ? Number(zonaData.humedad_min) : null) : undefined,
        humedad_max: zonaData.humedad_max !== undefined ? (zonaData.humedad_max ? Number(zonaData.humedad_max) : null) : undefined,
        radiacion_min: zonaData.radiacion_min !== undefined ? (zonaData.radiacion_min ? Number(zonaData.radiacion_min) : null) : undefined,
        radiacion_max: zonaData.radiacion_max !== undefined ? (zonaData.radiacion_max ? Number(zonaData.radiacion_max) : null) : undefined
      };

      // Eliminar campos undefined para no sobrescribir con undefined
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const response = await axios.put(`${API_URL}/${id}`, payload, getAuthHeader());
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Eliminar zona
  delete: async (id) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de zona inválido');
      }

      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    } catch (error) {
      throw handleApiError(error);
    }
  }
};