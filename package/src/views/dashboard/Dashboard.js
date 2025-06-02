import React, { useState, useEffect } from 'react';
import { Grid, Box, MenuItem, FormControl, InputLabel, Select, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { useZonas } from '../../context/ZonaContext';
import Logo from 'src/assets/images/logos/LOGO.png'; 

// Components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import MonthlyEarnings from './components/MonthlyEarnings';

const Dashboard = () => {
  const { zonas } = useZonas();
  const [selectedZona, setSelectedZona] = useState(zonas[0]?.id || '');
  const [sensoresConectados, setSensoresConectados] = useState(true);
  const navigate = useNavigate();

  // 📌 Verificar el estado de los sensores en el backend
  useEffect(() => {
    const verificarEstadoSensores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sensores-estado");
        const data = await response.json();
        setSensoresConectados(data.sensoresConectados);
      } catch (error) {
        console.error("❌ Error al verificar estado de sensores:", error);
        setSensoresConectados(false);
      }
    };

    verificarEstadoSensores();
    const interval = setInterval(verificarEstadoSensores, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // 📌 Actualizar la zona seleccionada
  const handleZoneChange = async (event) => {
    const newSelectedZona = event.target.value;
    setSelectedZona(newSelectedZona);

    try {
      await fetch("http://localhost:5000/api/selected-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedZona: newSelectedZona }),
      });
      console.log("✅ Zona actualizada en el servidor:", newSelectedZona);
    } catch (error) {
      console.error("❌ Error al actualizar la zona en el servidor:", error);
    }
  };

  const handleCreateZone = () => {
    navigate('/zonaCultivo?create=true');
  };

  return (
    <PageContainer title="Dashboard" description="Monitoreo del sistema agrícola">
      <Box>
        {zonas.length > 0 ? (
          <>
            <FormControl fullWidth variant="outlined" size="small" sx={{ marginBottom: 3 }}>
              <InputLabel id="zona-select-label">Selecciona una Zona</InputLabel>
              <Select
                labelId="zona-select-label"
                value={selectedZona}
                onChange={handleZoneChange}
                label="Selecciona una Zona"
                sx={{ backgroundColor: 'white', color: 'black' }}
              >
                {zonas.map((zona) => (
                  <MenuItem key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 🔎 Verificar si los sensores están conectados */}
            {sensoresConectados ? (
              selectedZona ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}><MonthlyEarnings zonaId={selectedZona} /></Grid>
                  <Grid item xs={12} container spacing={3}>
                    <Grid item xs={12} md={4}><RecentTransactions zonaId={selectedZona} /></Grid>
                    <Grid item xs={12} md={4}><YearlyBreakup zonaId={selectedZona} /></Grid>
                    <Grid item xs={12} md={4}><ProductPerformance zonaId={selectedZona} /></Grid>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h6" sx={{ color: 'gray', marginTop: 3 }}>
                  Por favor selecciona una zona de cultivo para ver los datos.
                </Typography>
              )
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
                <Typography variant="h4" sx={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                  ⚠ Sistema de sensores no conectado
                </Typography>
                <Typography variant="body1" sx={{ color: 'gray', textAlign: 'center', marginBottom: '40px' }}>
                  Conecte el sistema de sensores para visualizar los datos del cultivo. Mientras tanto, puede gestionar zonas y realizar otras tareas administrativas.
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
            <img src={Logo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
            <Typography variant="h4" sx={{ color: 'gray', textAlign: 'center', marginBottom: '20px' }}>
              Bienvenido al Sistema de Monitoreo Agrícola
            </Typography>
            <Typography variant="body1" sx={{ color: 'gray', textAlign: 'center', marginBottom: '40px' }}>
              Registra una nueva zona de cultivo para comenzar a gestionar tus campos y monitorear los datos de tus cultivos.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreateZone}>
              Crear Zona de Cultivo
            </Button>
          </Box>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
