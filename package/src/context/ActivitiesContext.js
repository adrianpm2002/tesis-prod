import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { activitiesService } from '../services/activitiesService'; // ✅ Importación correcta



const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async (zonaId) => {
    if (!zonaId) {
      console.warn("⚠ Intento de obtener actividades sin zonaId válido.");
      return; // ✅ Evita la solicitud si `zonaId` es `undefined`
    }
  
    try {
      
      const actividades = await activitiesService.getByZona(zonaId);
      setActivities(actividades);
    } catch (error) {
      console.error("🚨 Error al obtener actividades:", error);
    }
  };

  

  const checkActivityExists = async (activityId) => {
    try {
      
      const response = await activitiesService.getById(activityId); // ✅ Debe consultar por ID
  
      if (!response || response.length === 0) {
        console.warn(`⚠ La actividad con ID ${activityId} no existe.`);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error("🚨 Error verificando actividad:", error);
      return false;
    }
  };
  
  
  
  
  const deleteActivity = async (activityId, zonaId) => { // ✅ Agregar zonaId
    if (!activityId) {
      console.error("❌ Intento de eliminar actividad sin ID válido.");
      return;
    }
  
    try {
      await activitiesService.delete(activityId);
      console.log("✅ Actividad eliminada correctamente.");
  
      // 🔄 Refrescar actividades después de la eliminación con el `zonaId` correcto
      await fetchActivities(zonaId); 
    } catch (error) {
      console.error("🚨 Error al eliminar actividad:", error);
    }
  };

  
  
  
  

  useEffect(() => {
    // Se actualizarán las actividades cuando se seleccione una zona
  }, []);

  return (
    <ActivitiesContext.Provider value={{ activities, deleteActivity, fetchActivities }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  return useContext(ActivitiesContext);
};

