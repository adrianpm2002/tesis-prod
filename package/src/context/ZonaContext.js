import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ZonaContext = createContext();

export const ZonaProvider = ({ children }) => {
    const [zonas, setZonas] = useState(() => {
        const savedZonas = localStorage.getItem('zonas');
        return savedZonas ? JSON.parse(savedZonas) : [];
    });

    // Guardar en localStorage automáticamente
    useEffect(() => {
        localStorage.setItem('zonas', JSON.stringify(zonas));
    }, [zonas]);

    // Función optimizada con useCallback
    const handleAddZone = useCallback((newZone) => {
        setZonas(prevZonas => [...prevZonas, { 
            ...newZone, 
            id: Date.now() // Usamos timestamp para IDs únicos
        }]);
    }, []);

    const handleRemoveZone = useCallback((id) => {
        setZonas(prevZonas => prevZonas.filter(zona => zona.id !== id));
    }, []);

    const handleUpdateZone = useCallback((id, updatedData) => {
        setZonas(prevZonas => prevZonas.map(zona => 
            zona.id === id ? { ...zona, ...updatedData } : zona
        ));
    }, []);

    return (
        <ZonaContext.Provider value={{ 
            zonas, 
            handleAddZone, 
            handleRemoveZone, 
            handleUpdateZone 
        }}>
            {children}
        </ZonaContext.Provider>
    );
};

export const useZonas = () => {
    const context = useContext(ZonaContext);
    if (!context) {
        throw new Error('useZonas debe usarse dentro de un ZonaProvider');
    }
    return context;
};
