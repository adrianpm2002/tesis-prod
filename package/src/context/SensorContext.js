import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuración base de axios
    const api = axios.create({
        baseURL: 'http://localhost:3000/api', // Asegúrate que coincide con tu backend
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const fetchSensors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sensors'); // Asegúrate que la ruta es correcta
            setSensors(response.data);
            setError(null);
        } catch (err) {
            setError({
                message: err.response?.data?.message || 'Error al cargar sensores',
                severity: 'error'
            });
            console.error('Error fetching sensors:', err);
        } finally {
            setLoading(false);
        }
    };


    const handleAddSensor = async (sensor) => {
        try {
          // Asegúrate que los nombres coincidan EXACTAMENTE con el backend
          const response = await api.post('/sensores', {
            tipo: sensor.type,
            modelo: sensor.model,
            zona_id: sensor.zonaId || null,  // Cambiado de zoneId a zona_id
            activo: sensor.isActive !== false
          });
          setSensors(prev => [...prev, response.data]);
          return response.data;
        } catch (err) {
          console.error('Error detallado en handleAddSensor:', err.response?.data); // Log completo
          throw new Error(err.response?.data?.error || 'Error al crear sensor');
        }
      };

    const handleUpdateSensor = async (sensor) => {
        try {
            const response = await api.put(`/sensors/${sensor.id}`, { // Usa la instancia `api` y ruta correcta
                tipo: sensor.type,
                modelo: sensor.model,
                zona_id: sensor.zonaId || null,
                activo: sensor.isActive
            });
            setSensors(prev =>
                prev.map(s => (s.id === sensor.id ? response.data : s))
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleRemoveSensor = async (id) => {
        try {
            await api.delete(`/sensors/${id}`);
            setSensors(prev => prev.filter(sensor => sensor.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <SensorContext.Provider value={{ 
          sensors, 
          loading,
          error,
          fetchSensors,
          handleAddSensor,
          handleUpdateSensor,
          handleRemoveSensor
        }}>
          {children}
        </SensorContext.Provider>
      );
    };
    
    export const useSensors = () => useContext(SensorContext);