import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { zonaService } from "../services/zonaSevices";
// Asegúrate de que la ruta sea correcta

const ZonaContext = createContext();

export const ZonaProvider = ({ children }) => {
    const [zonas, setZonas] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchZonas();
    }, [fetchZonas]);

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
            fetchZonas(); // Actualizar estado tras eliminación
        } catch (error) {
            console.error('Error al eliminar zona:', error);
        }
    }, [fetchZonas]);

    const handleUpdateZone = useCallback(async (id, updatedData) => {
        try {
            await zonaService.update(id, updatedData);
            fetchZonas(); // Refrescar datos tras actualización
        } catch (error) {
            console.error('Error al actualizar zona:', error);
        }
    }, [fetchZonas]);

    return (
        <ZonaContext.Provider value={{ zonas, loading, handleAddZone, handleRemoveZone, handleUpdateZone }}>
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
