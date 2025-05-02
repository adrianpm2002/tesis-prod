// src/context/ActivitiesContext.js
import React, { createContext, useContext, useState } from 'react';

const ActivitiesContext = createContext();

export const useActivities = () => {
    return useContext(ActivitiesContext);
};

export const ActivitiesProvider = ({ children }) => {
    const [activities, setActivities] = useState([]);

    const addActivity = (activity) => {
        setActivities((prevActivities) => [...prevActivities, activity]);
    };

    const deleteActivity = (id) => {
        setActivities((prevActivities) => 
            prevActivities.filter(activity => activity.id !== id)
        );
    };

    return (
        <ActivitiesContext.Provider value={{ activities, addActivity, deleteActivity }}>
            {children}
        </ActivitiesContext.Provider>
    );
};
