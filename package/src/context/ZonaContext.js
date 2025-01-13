// src/context/ZonaContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ZonaContext = createContext();

export const ZonaProvider = ({ children }) => {
    const [zonas, setZonas] = useState(() => {
        const savedZonas = localStorage.getItem('zonas');
        return savedZonas ? JSON.parse(savedZonas) : [];
    });

    useEffect(() => {
        localStorage.setItem('zonas', JSON.stringify(zonas));
    }, [zonas]);

    const handleAddZone = () => {
        setZonas([...zonas, { id: zonas.length + 1, nombre: '', suelo: '', acidezMin: '', acidezMax: '', temperaturaMin: '', temperaturaMax: '', humedadMin: '', humedadMax: '', riego: '', insumos: '' }]);
    };

    const handleRemoveZone = (id) => {
        setZonas(zonas.filter(zona => zona.id !== id));
    };

    return (
        <ZonaContext.Provider value={{ zonas, handleAddZone, handleRemoveZone }}>
            {children}
        </ZonaContext.Provider>
    );
};

export const useZonas = () => useContext(ZonaContext);
