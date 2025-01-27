// src/context/SensorContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
    const [sensors, setSensors] = useState(() => {
        const savedSensors = localStorage.getItem('sensors');
        return savedSensors ? JSON.parse(savedSensors) : [];
    });

    useEffect(() => {
        localStorage.setItem('sensors', JSON.stringify(sensors));
    }, [sensors]);

    const handleAddSensor = (sensor) => {
        setSensors([...sensors, { ...sensor, id: sensors.length + 1 }]);
    };

    const handleUpdateSensor = (updatedSensor) => {
        setSensors(sensors.map(sensor => (sensor.id === updatedSensor.id ? updatedSensor : sensor)));
    };

    const handleRemoveSensor = (id) => {
        setSensors(sensors.filter(sensor => sensor.id !== id));
    };

    return (
        <SensorContext.Provider value={{ sensors, handleAddSensor, handleUpdateSensor, handleRemoveSensor }}>
            {children}
        </SensorContext.Provider>
    );
};

export const useSensors = () => useContext(SensorContext);
