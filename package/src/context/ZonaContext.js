import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { zonaService } from "../services/zonaSevices";

// Creación del contexto
const ZonaContext = createContext();

export const ZonaProvider = ({ children }) => {
    const [zonas, setZonas] = useState([]);
    const [zonaSeleccionada, setZonaSeleccionada] = useState('');
    const [loading, setLoading] = useState(true);

    // Obtener zonas desde el backend
    const fetchZonas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await zonaService.getAll();
            setZonas(data);
        } catch (error) {
            console.error('Error al obtener zonas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar las zonas al iniciar
    useEffect(() => {
        fetchZonas();
    }, [fetchZonas]);

    // Agregar una nueva zona
    const handleAddZone = useCallback(async (newZone) => {
        try {
            const createdZone = await zonaService.create(newZone);
            setZonas(prevZonas => [...prevZonas, createdZone]);
        } catch (error) {
            console.error('Error al agregar zona:', error);
        }
    }, []);

    // Eliminar una zona
    const handleRemoveZone = useCallback(async (id) => {
        try {
            await zonaService.delete(id);
            fetchZonas(); // Refrescar la lista
        } catch (error) {
            console.error('Error al eliminar zona:', error);
        }
    }, [fetchZonas]);

    // Actualizar una zona
    const handleUpdateZone = useCallback(async (id, updatedData) => {
        try {
            await zonaService.update(id, updatedData);
            fetchZonas(); // Refrescar datos tras actualización
        } catch (error) {
            console.error('Error al actualizar zona:', error);
        }
    }, [fetchZonas]);

    return (
        <ZonaContext.Provider value={{ 
            zonas, 
            zonaSeleccionada, 
            setZonaSeleccionada, 
            loading, 
            handleAddZone, 
            handleUpdateZone, 
            handleRemoveZone 
        }}>
            {children}
        </ZonaContext.Provider>
    );
};

// Hook personalizado para acceder al contexto
export const useZonas = () => {
    const context = useContext(ZonaContext);
    if (!context) {
        throw new Error('useZonas debe usarse dentro de un ZonaProvider');
    }
    return context;
};
