import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { zonaService } from "../services/zonaSevices";
// Asegúrate de que la ruta sea correcta

const ZonaContext = createContext();

export const ZonaProvider = ({ children }) => {
    const [zonas, setZonas] = useState([]);

    // Obtener zonas al cargar el componente
    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const data = await zonaService.getAll();
                setZonas(data);
            } catch (error) {
                console.error('Error al obtener zonas:', error);
            }
        };
        fetchZonas();
    }, []);

    const handleAddZone = useCallback(async (newZone) => {
        try {
            const createdZone = await zonaService.create(newZone);
            setZonas(prevZonas => [...prevZonas, createdZone]);
        } catch (error) {
            console.error('Error al agregar zona:', error);
        }
    }, []);

    const handleRemoveZone = useCallback(async (id) => {
        try {
            await zonaService.delete(id);
            setZonas(prevZonas => prevZonas.filter(zona => zona.id !== id));
        } catch (error) {
            console.error('Error al eliminar zona:', error);
        }
    }, []);

    const handleUpdateZone = useCallback(async (id, updatedData) => {
        try {
            const updatedZone = await zonaService.update(id, updatedData);
            setZonas(prevZonas => prevZonas.map(zona => (zona.id === id ? updatedZone : zona)));
        } catch (error) {
            console.error('Error al actualizar zona:', error);
        }
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
