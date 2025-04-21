import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Menu, Button, IconButton, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { IconUser } from '@tabler/icons-react';
import { useUserContext } from '../../../context/userContext'; // Importa el contexto

const Profile = () => {
  const { user } = useUserContext(); // Usa el contexto
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton size="large" aria-label="show profile options" color="inherit" aria-controls="profile-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar src={user.avatar} alt="Profile Image" sx={{ width: 35, height: 35 }} />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ '& .MuiMenu-paper': { width: '250px' } }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">{user.category}</Typography>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">{user.email}</Typography>
          <Typography variant="body2" color="textSecondary">{user.province}</Typography>
        </Box>
        <MenuItem component={Link} to='/ui/typography'> {/* Ruta actualizada */}
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>Mi perfil</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button to="/auth/login" variant="outlined" color="primary" component={Link} fullWidth>
            Cerrar Sesión
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
