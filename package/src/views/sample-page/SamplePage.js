import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  useMediaQuery,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useZonas } from '../../context/ZonaContext';

const Alarmas = () => {
  const { zonas } = useZonas();
  const [alerts, setAlerts] = useState([]);
  const [archivedAlerts, setArchivedAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const isSmallScreen = useMediaQuery('(max-width:600px)');



  useEffect(() => {
    // ✅ Obtener solo las alertas activas
    fetch("http://localhost:3000/api/alertas")
        .then((res) => res.json())
        .then((data) => setAlerts(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error obteniendo alertas:", err));

    // ✅ Obtener alertas archivadas
    fetch("http://localhost:3000/api/alertas-archivadas")
        .then((res) => res.json())
        .then((data) => setArchivedAlerts(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error obteniendo alertas archivadas:", err));

    // ✅ Obtener actividades programadas para mañana y generar alertas automáticas
    fetch("http://localhost:3000/api/actividades/proximas")

        .then((res) => res.json())
        .then((data) => {
          console.log("Actividades próximas recibidas:", data);
            if (Array.isArray(data)) {
              const nuevasAlertas = data.map(act => ({
                id: `temp-${act.id}`,
                tipo: "Aviso de actividad",
                zona_id: act.zona_id,
                fecha: new Date().toISOString(),
                descripcion: `Mañana se realizará: ${act.tipoactividad} en la zona ${getZonaNombre(act.zona_id)} a las ${act.hora}.`
            }));

                setAlerts(prevAlerts => {
                    // ✅ Evita duplicados comparando descripción y zona_id
                    const alertasFiltradas = nuevasAlertas.filter(nueva => 
                        !prevAlerts.some(alerta => alerta.descripcion === nueva.descripcion && alerta.zona_id === nueva.zona_id)
                    );
                    return [...prevAlerts, ...alertasFiltradas];
                });
            } else {
                console.error("La API no devolvió actividades próximas:", data);
            }
        })
        .catch((err) => console.error("Error obteniendo actividades próximas:", err));
}, []);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event) => {
    setFilterType(event.target.value);
  };

  const handleArchive = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/alertas/${id}/archivar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("Respuesta del backend:", data);

        if (response.ok) {
            setAlerts(alerts.filter(alert => alert.id !== id));
            setArchivedAlerts([...archivedAlerts, alerts.find(alert => alert.id === id)]);
        }
    } catch (error) {
        console.error("❌ Error al archivar alerta:", error);
    }
};



  const filteredAlerts = alerts.filter(alert =>
    alert.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType ? alert.tipo === filterType : true)
  );

  const getZonaNombre = (zonaId) => {
    const zonaEncontrada = zonas.find(zona => zona.id === zonaId);
    return zonaEncontrada ? zonaEncontrada.nombre : `Zona desconocida (${zonaId})`;
  };
  


  return (
    <PageContainer title="Alarmas" description="Registro de alertas del sistema">
      <DashboardCard title="Registro de Alertas">
        

        {isSmallScreen ? (
          <Box>
            {filteredAlerts.map(alert => (
              <Paper key={alert.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e6ffe6' }}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  {alert.tipo}
                </Typography>
                <Typography variant="body2">Zona: {getZonaNombre(alert.zona_id)}</Typography>
                <Typography variant="body2">{new Date(alert.fecha).toLocaleString()}</Typography>
                <Typography variant="body2">{alert.descripcion}</Typography>
                <Box display="flex" justifyContent="flex-end" marginTop="1rem">
                  <Button variant="outlined" color="secondary" onClick={() => handleArchive(alert.id)}>
                    Archivar
                  </Button>
                </Box>
              </Paper>
            ))}
            {filteredAlerts.length === 0 && (
              <Typography align="center">No hay alertas registradas</Typography>
            )}
          </Box>
        ) : (
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
                    <Typography variant="h6">Descripción</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">Acciones</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Typography variant="body1">{alert.tipo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{getZonaNombre(alert.zona_id)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{new Date(alert.fecha).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{alert.descripcion}</Typography>
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
                    <TableCell colSpan={5} align="center">
                      <Typography>No hay alertas registradas</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>

      <DashboardCard title="Alertas Archivadas" style={{ marginTop: '2rem' }}>
        {archivedAlerts.length > 0 ? (
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
                    <Typography variant="h6">Descripción</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {archivedAlerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Typography variant="body1">{alert.tipo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{getZonaNombre(alert.zona_id)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{new Date(alert.fecha).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{alert.descripcion}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography align="center">No hay alertas archivadas</Typography>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default Alarmas;

