import React, { useState } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Popover, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from './user-profile';
import PropTypes from 'prop-types';
import { notifications } from './data'; // Importa las notificaciones

const Header = ({ toggleMobileSidebar, hasZonas }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          aria-haspopup="true"
          onClick={handleNotificationClick}
        >
          {hasZonas ? (
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          ) : (
            <IconBellRinging size="21" stroke="1.5" />
          )}
        </IconButton>

        <Popover
          id="notifications-popover"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          sx={{ '& .MuiPopover-paper': { width: '250px', marginLeft: '10px' } }}
        >
          {hasZonas ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} sx={{ color: notification.color }}>
                <ListItemIcon>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: notification.color, marginRight: 1 }} />
                </ListItemIcon>
                <ListItemText primary={notification.title} secondary={notification.subtitle} />
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <ListItemText primary="No existen notificaciones" />
            </MenuItem>
          )}
        </Popover>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h6">Adrian Pascual Martinez</Typography>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired,
  hasZonas: PropTypes.bool.isRequired,
};

export default Header;
