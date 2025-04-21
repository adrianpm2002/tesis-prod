import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const DataSensorContext = createContext();

// Proveedor del contexto
export const DataSensorProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState({
        humedad: 0,
        temperatura: 0,
        radiacionSolar: 0,
        ph: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sensor-data');
                setSensorData(response.data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        const interval = setInterval(fetchData, 1000); // Actualiza cada segundo
        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <DataSensorContext.Provider value={sensorData}>
            {children}
        </DataSensorContext.Provider>
    );
};