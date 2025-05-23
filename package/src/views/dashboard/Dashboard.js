import React, { useState, useEffect } from 'react';
import { Grid, Box, MenuItem, FormControl, InputLabel, Select, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { useZonas } from '../../context/ZonaContext';
import Logo from 'src/assets/images/logos/LOGO.png'; // Asegúrate de ajustar la ruta de importación

// Components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import MonthlyEarnings from './components/MonthlyEarnings';

const Dashboard = () => {
  const { zonas } = useZonas();
  const [selectedZona, setSelectedZona] = useState(zonas[0]?.id || '');
  const navigate = useNavigate();

  useEffect(() => {
    // Puedes cargar datos adicionales o realizar otras acciones cuando cambie la zona seleccionada
  }, [selectedZona]);

  const handleZoneChange = async (event) => {
    const newSelectedZona = event.target.value;
    setSelectedZona(newSelectedZona);

    // ✅ Enviar la zona al backend
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
    <PageContainer title="Dashboard" description="this is Dashboard">
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

            {selectedZona ? (
              <Grid container spacing={3}>
                {/* MonthlyEarnings ocupa todo el ancho y tiene un tamaño más grande */}
                <Grid item xs={12}>
                  <MonthlyEarnings zonaId={selectedZona} />
                </Grid>

                {/* Los otros tres componentes se muestran uno al lado del otro */}
                <Grid item xs={12} container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <RecentTransactions zonaId={selectedZona} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <YearlyBreakup zonaId={selectedZona} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ProductPerformance zonaId={selectedZona} />
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="h6" sx={{ color: 'gray', marginTop: 3 }}>
                Por favor selecciona una zona de cultivo para ver los datos.
              </Typography>
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