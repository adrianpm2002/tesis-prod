import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Popover, MenuItem, ListItemText, Typography } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from './user-profile';
import PropTypes from 'prop-types';
import { useUserContext } from '../../../context/userContext';

const Header = ({ toggleMobileSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/alertas");
        const data = await res.json();
        if (Array.isArray(data)) {
          const activeAlerts = data.filter(alert => !alert.archivada);
          setNotifications(activeAlerts);
        } else {
          console.error("La API no devolvió un array de alertas:", data);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error obteniendo alertas:", err);
        setNotifications([]);
      }
    };

    const fetchUpcomingActivities = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/actividades/proximas");
        const data = await res.json();
        if (Array.isArray(data)) {
          const activityAlerts = data.map(act => ({
            id: `temp-${act.id}`,
            tipo: "Aviso de actividad",
            zona_id: act.zona_id,
            fecha: new Date().toISOString(),
            descripcion: `Mañana se realizará: ${act.tipoactividad} en la zona ${act.zona_id} a las ${act.hora}.`
          }));
          setNotifications(prev => [...prev, ...activityAlerts]);
        } else {
          console.error("La API no devolvió actividades próximas:", data);
        }
      } catch (err) {
        console.error("Error obteniendo actividades próximas:", err);
      }
    };

    fetchAlerts();
    fetchUpcomingActivities();
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{ display: { lg: "none", xs: "inline" } }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* ✅ Icono de notificaciones con cantidad total de alertas */}
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          aria-haspopup="true"
          onClick={handleNotificationClick}
        >
          <Badge badgeContent={notifications.length} color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        {/* ✅ Popover con todas las alertas */}
        <Popover
          id="notifications-popover"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          sx={{ '& .MuiPopover-paper': { width: '250px', marginLeft: '10px' } }}
        >
          {notifications.length > 0 ? (
            notifications.map((alert, index) => (
              <MenuItem key={index}>
                <ListItemText primary={alert.tipo} secondary={alert.descripcion} />
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <ListItemText primary="No hay alertas activas." />
            </MenuItem>
          )}
        </Popover>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h6">{user.name}</Typography>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired,
};

export default Header;



