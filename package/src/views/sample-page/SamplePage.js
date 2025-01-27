import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useZonas } from '../../context/ZonaContext'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

const Alarmas = () => {
  const { zonas } = useZonas();
  const [alerts, setAlerts] = useState([]);
  const [archivedAlerts, setArchivedAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Ejemplo de datos de alertas
  useEffect(() => {
    if (zonas.length > 0) {
      setAlerts([
        {
          id: 1,
          type: 'Humedad Alta',
          zone: zonas[0].nombre,
          date: '2025-01-27',
          time: '10:00 AM',
          description: 'El nivel de humedad ha superado el límite establecido.',
          severity: 'crítica',
        },
        {
          id: 2,
          type: 'Cosecha',
          zone: zonas[0]?.nombre || '',
          date: '2025-01-26',
          time: '09:00 AM',
          description: 'Es tiempo de cosechar los cultivos.',
          severity: 'aviso',
        },
      ]);
    }
  }, [zonas]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event) => {
    setFilterType(event.target.value);
  };

  const handleArchive = (id) => {
    setArchivedAlerts([...archivedAlerts, ...alerts.filter(alert => alert.id === id)]);
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType ? alert.type === filterType : true)
  );

  return (
    <PageContainer title="Alarmas" description="Registro de alertas del sistema">
      <DashboardCard title="Registro de Alertas">
        <Box display="flex" justifyContent="space-between" marginBottom="1rem" alignItems="center">
          <TextField
            label="Buscar por tipo"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: '1rem' }}
          />
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="filter-type-label">Filtrar por tipo</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              onChange={handleFilter}
              label="Filtrar por tipo"
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="Humedad Alta">Humedad Alta</MenuItem>
              <MenuItem value="Cosecha">Cosecha</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Tipo de Alerta</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Zona</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Fecha</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Hora</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Descripción</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.map(alert => (
                <TableRow key={alert.id} style={{ backgroundColor: alert.severity === 'crítica' ? '#ffe6e6' : '#e6ffe6' }}>
                  <TableCell>
                    <Typography variant="body1" style={{ color: alert.severity === 'crítica' ? 'red' : 'green' }}>
                      {alert.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.zone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.description}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="secondary" onClick={() => handleArchive(alert.id)}>
                      Archivar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAlerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No hay alertas registradas</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
      <DashboardCard title="Alertas Archivadas" style={{ marginTop: '2rem' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Tipo de Alerta</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Zona</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Fecha</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Hora</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Descripción</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archivedAlerts.map(alert => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Typography variant="body1">{alert.type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.zone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{alert.description}</Typography>
                  </TableCell>
                </TableRow>
              ))}
              {archivedAlerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>No hay alertas archivadas</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default Alarmas;
