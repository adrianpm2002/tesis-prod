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
  
  useEffect(() => {
    if (user.province) {
      setMunicipios(provincias[user.province] || []);
    }
  }, [user.province]);
  
  const handleAvatarChange = (selectedAvatar) => {
    setUser({ ...user, avatar: selectedAvatar });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">Perfil de Usuario</Typography>
      </Box>
      <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={user.name}
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
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            label="Categoría"
            value={user.category}
            onChange={(e) => setUser({ ...user, category: e.target.value })}
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
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <InputLabel id="province-select-label">Provincia</InputLabel>
          <Select
            labelId="province-select-label"
            label="Provincia"
            value={user.province}
            onChange={(e) => setUser({ ...user, province: e.target.value })}
          >
            {Object.keys(provincias).map((province) => (
              <MenuItem key={province} value={province}>{province}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
          <InputLabel id="municipio-select-label">Municipio</InputLabel>
          <Select
            labelId="municipio-select-label"
            label="Municipio"
            value={user.municipio}
            onChange={(e) => setUser({ ...user, municipio: e.target.value })}
            disabled={!user.province}
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

