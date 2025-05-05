import React, { createContext, useContext, useState, useEffect } from 'react';

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
    const [sensors, setSensors] = useState(() => {
        try {
            const savedSensors = localStorage.getItem('sensors');
            if (savedSensors) {
                const parsed = JSON.parse(savedSensors);
                // Filtramos cualquier dato basura que no tenga los campos requeridos
                return parsed.filter(sensor => 
                    sensor.id && sensor.type && sensor.model
                );
            }
            return [];
        } catch (error) {
            console.error("Error al cargar sensores:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('sensors', JSON.stringify(sensors));
    }, [sensors]);

    const handleAddSensor = (sensor) => {
        // Usamos Date.now() para un ID más único que length+1
        setSensors(prev => [...prev, { ...sensor, id: Date.now() }]);
    };

    const handleUpdateSensor = (updatedSensor) => {
        setSensors(prev => 
            prev.map(sensor => (sensor.id === updatedSensor.id ? updatedSensor : sensor))
        );
    };

    const handleRemoveSensor = (id) => {
        setSensors(prev => prev.filter(sensor => sensor.id !== id));
    };

    return (
        <SensorContext.Provider value={{ 
            sensors, 
            handleAddSensor, 
            handleUpdateSensor, 
            handleRemoveSensor 
        }}>
            {children}
        </SensorContext.Provider>
    );
};

export const useSensors = () => useContext(SensorContext);