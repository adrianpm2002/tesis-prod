import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: '',
      email: '',
      categoria: '',
      avatar: '',
      provincia: '',
      municipio: ''
    };
  });

  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem('token');
    console.log("Token antes de enviar petición:", token);

    if (token && !isUserLoaded) {
      fetch('/api/auth/me', {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` // ✅ Confirma que se envía con "Bearer "
        }
    })
        .then(res => res.json())
        .then(data => {
          if (data.name && data.email) {
            setUser(prevUser => ({
              name: data.name ?? '',
              email: data.email ?? '',
              categoria: data.categoria ?? '',
              avatar: data.avatar ?? '',
              provincia: data.provincia ?? '',
              municipio: data.municipio ?? ''
            }));

            localStorage.setItem('user', JSON.stringify(data)); // Guardar en localStorage
          }
        })
        .catch(error => console.error('Error al obtener usuario:', error));

    }
  }, [isUserLoaded]); // Dependencia para evitar múltiples llamadas innecesarias

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


