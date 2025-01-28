// src/context/userContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Usuario',
    email: 'usuario@example.com',
    category: '',
    avatar: 'src/assets/images/profile/1.jpg', // Ruta de Avatar1
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
