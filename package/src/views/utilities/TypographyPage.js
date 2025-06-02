import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Avatar, MenuItem, FormControl, InputLabel, Select, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext'; // Importa el contexto
import Avatar1 from 'src/assets/images/profile/1.jpg';
import Avatar2 from 'src/assets/images/profile/2.jpg';
import Avatar3 from 'src/assets/images/profile/3.jpg';
import Avatar4 from 'src/assets/images/profile/4.jpg';

// Lista de provincias y municipios de ejemplo
const provincias = {
  'Pinar del Río': ['Pinar del Río', 'Consolación del Sur', 'Viñales', '...'],
  'Artemisa': ['Artemisa', 'Bauta', 'Güira de Melena', '...'],
  'La Habana': ['La Habana Vieja', 'Centro Habana', 'Playa', '...'],
  'Mayabeque': ['San José de las Lajas', 'Bejucal', 'Santa Cruz del Norte', '...'],
  'Matanzas': ['Matanzas', 'Varadero', 'Cárdenas', '...'],
  'Cienfuegos': ['Cienfuegos', 'Palmira', 'Cruces', '...'],
  'Villa Clara': ['Santa Clara', 'Caibarién', 'Camajuaní', '...'],
  'Sancti Spíritus': ['Sancti Spíritus', 'Trinidad', 'Jatibonico', '...'],
  'Ciego de Ávila': ['Ciego de Ávila', 'Morón', 'Venezuela', '...'],
  'Camagüey': ['Camagüey', 'Florida', 'Nuevitas', '...'],
  'Las Tunas': ['Las Tunas', 'Puerto Padre', 'Amancio', '...'],
  'Holguín': ['Holguín', 'Gibara', 'Moa', '...'],
  'Granma': ['Bayamo', 'Manzanillo', 'Jiguaní', '...'],
  'Santiago de Cuba': ['Santiago de Cuba', 'Palma Soriano', 'San Luis', '...'],
  'Guantánamo': ['Guantánamo', 'Baracoa', 'Caimanera', '...'],
  'Isla de la Juventud': ['Nueva Gerona', 'La Fe', '...']
};

const UserProfileForm = () => {
  const { user, setUser } = useUserContext(); // Usa el contexto
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);

  // PASO 1: Cargar usuario desde localStorage si el contexto aún no lo tiene
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(prevUser => ({ ...prevUser, ...JSON.parse(storedUser) }));
    }
  }, []); // 👈 Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    console.log(user)
    if (user.provincia && provincias[user.provincia]) {
      setMunicipios(provincias[user.provincia]);
    } else {
      setMunicipios([]); // 👈 Evita errores si `user.province` es `undefined`
    }
  }, [user.provincia]);

  const handleAvatarChange = (selectedAvatar) => {
    setUser({ ...user, avatar: selectedAvatar });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
        const now = Math.floor(Date.now() / 1000); // Obtiene el tiempo actual en segundos
        if (payload.exp < now) {
          console.error("🚨 Token expirado. Redirigiendo a login...");
          localStorage.removeItem('token');
          window.location.href = '/login'; // Redirigir a login si el token expiró
          return; // Detener la ejecución si el token no es válido
        }
      }

      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // 👈 Enviar el token de autenticación
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(user) // 👈 Enviar los datos actualizados
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.message || 'Error al actualizar usuario');
      }
      
      console.log("✅ Usuario actualizado:", updatedUser);
      console.log("🔍 Datos enviados en PUT:", JSON.stringify(user, null, 2));
      setUser(updatedUser); // 👈 Actualizar el contexto con los nuevos datos
      localStorage.setItem('user', JSON.stringify(updatedUser)); // 👈 Persistir los cambios en localStorage

      navigate('/dashboard'); // Redirigir después de la actualización

    } catch (error) {
      console.error("🚨 Error al actualizar usuario:", error);
    }
  };

  return (

    <Container  title="Datos del Usuario" maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">Perfil de Usuario</Typography>
      </Box>
      <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={user?.name || ''}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
          <Avatar src={user.avatar} sx={{ width: 100, height: 100, mr: 2 }} />
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          {[Avatar1, Avatar2, Avatar3, Avatar4].map((img, index) => (
            <Grid item key={index}>
              <Avatar
                src={img}
                sx={{ width: 60, height: 60, cursor: 'pointer', border: user.avatar === img ? '2px solid blue' : 'none' }}
                onClick={() => handleAvatarChange(img)}
              />
            </Grid>
          ))}
        </Grid>
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <InputLabel id="categoria-select-label">Categoría</InputLabel>
          <Select
            labelId="categoria-select-label"
            label="Categoría"
            value={user.categoria ?? ''} // 👈 Prevenir valores `undefined`
            onChange={(e) => setUser({ ...user, categoria: e.target.value })}
          >
            <MenuItem value="Especialista">Especialista</MenuItem>
            <MenuItem value="Tecnico">Técnico</MenuItem>
            <MenuItem value="Ingeniero">Ingeniero</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={user?.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <InputLabel id="province-select-label">Provincia</InputLabel>
          <Select
            labelId="province-select-label"
            label="Provincia"
            value={user.provincia|| ''}
            onChange={(e) => setUser({ ...user, provincia: e.target.value })}
          >
            {Object.keys(provincias).map((provincia) => (
              <MenuItem key={provincia} value={provincia}>{provincia}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <InputLabel id="municipio-select-label">Municipio</InputLabel>
          <Select
            labelId="municipio-select-label"
            label="Municipio"
            value={user.municipio || ''} // 👈 Si es `undefined`, usa una cadena vacía
            onChange={(e) => setUser({ ...user, municipio: e.target.value })}
            disabled={!user.provincia}
          >

            {municipios.map((municipio) => (
              <MenuItem key={municipio} value={municipio}>{municipio}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ textAlign: 'center' }}>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfileForm;

