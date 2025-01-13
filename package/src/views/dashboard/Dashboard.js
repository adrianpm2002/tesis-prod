import React, { useState, useEffect } from 'react';
import { Grid, Box, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useZonas } from '../../context/ZonaContext'; // Corrección en la ruta de importación

// Components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import MonthlyEarnings from './components/MonthlyEarnings';

const Dashboard = () => {
  const { zonas } = useZonas();
  const [selectedZona, setSelectedZona] = useState(zonas[0]?.id || ''); // Inicializar con la primera zona disponible

  useEffect(() => {
    // Puedes cargar datos adicionales o realizar otras acciones cuando cambie la zona seleccionada
  }, [selectedZona]);

  const handleZoneChange = (event) => {
    setSelectedZona(event.target.value);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
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
            <Grid item xs={12} lg={8}>
              <RecentTransactions zonaId={selectedZona} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MonthlyEarnings zonaId={selectedZona} />
                </Grid>
                <Grid item xs={12}>
                  <YearlyBreakup zonaId={selectedZona} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={8}>
              <ProductPerformance zonaId={selectedZona} />
            </Grid>
            <Grid item xs={12} lg={8}>
              <SalesOverview zonaId={selectedZona} />
            </Grid>
            <Grid item xs={12} lg={4}></Grid>
            <Grid container spacing={3}></Grid>
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ color: 'gray', marginTop: 3 }}>
            Por favor selecciona una zona de cultivo para ver los datos.
          </Typography>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;




