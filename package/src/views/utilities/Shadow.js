import React, { useState } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TablePagination,
    Tooltip,
    Button,
    Grid,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useZonas } from '../../context/ZonaContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import './Historial.css'; // Asegúrate de tener este archivo para los estilos

const generateRandomData = (days) => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const humedades = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
        const temperaturaMin = (Math.random() * 5 + 15).toFixed(2);
        const temperaturaMax = (Math.random() * 10 + 20).toFixed(2);
        const ph = (Math.random() * 2 + 5).toFixed(2);
        const co2 = Math.floor(Math.random() * 600 + 300);

        data.push({
            fecha: date.toISOString().split('T')[0],
            humedad: (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(2),
            temperaturaMin,
            temperaturaMax,
            ph,
            co2,
        });
    }
    return data;
};

const Historial = () => {
    const { zonas } = useZonas(); // Obtener las zonas del contexto
    const [selectedZone, setSelectedZone] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedParameter, setSelectedParameter] = useState('humedad'); // Parámetro seleccionado para el gráfico

    const handleZoneChange = (event) => {
        const selected = zonas.find(z => z.nombre === event.target.value);
        setSelectedZone(selected);
        // Generar datos aleatorios para la zona seleccionada
        const data = generateRandomData(30);
        setHistoricalData(data);
        setPage(0); // Resetear la página al seleccionar una nueva zona
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Resetear la página al cambiar el número de filas por página
    };

    const handleParameterChange = (param) => {
        setSelectedParameter(param);
    };

    // Generar fechas para los últimos 30 días
    const generateLast30Days = () => {
        const today = new Date();
        return Array.from({ length: 30 }, (_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - index);
            return date; // Devolver el objeto Date completo
        }).reverse(); // Para que empiece desde el más reciente
    };

    const last30Days = generateLast30Days();

    return (
        <PageContainer title="Historial" description="Visualización del historial de zonas de cultivo">
            <DashboardCard title="Historial de Cultivo">
                <Box sx={{ marginBottom: 3 }}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="zone-select-label">Selecciona una Zona</InputLabel>
                        <Select
                            labelId="zone-select-label"
                            value={selectedZone ? selectedZone.nombre : ''}
                            onChange={handleZoneChange}
                            label="Selecciona una Zona"
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            {zonas.map((zona) => (
                                <MenuItem key={zona.id} value={zona.nombre}>
                                    {zona.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Contenedor con tabla de datos y sección de registro de fechas */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Tabla de datos históricos */}
                    <TableContainer component={Paper} style={{ backgroundColor: 'white', flexGrow: 1, maxWidth: '60%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>
                                        <Tooltip title="Promedio de humedad captada durante el día">
                                            <span>Humedad (%)</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Temperatura máxima y mínima captada durante el día">
                                            <span>Temperatura (°C)</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Valores de pH captados durante el día">
                                            <span>pH</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Valores de dióxido de carbono captados durante el día">
                                            <span>CO2</span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historicalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.fecha}</TableCell>
                                        <TableCell>{data.humedad}</TableCell>
                                        <TableCell>{data.temperaturaMin} - {data.temperaturaMax}</TableCell>
                                        <TableCell>{data.ph}</TableCell>
                                        <TableCell>{data.co2}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Nueva sección "Registro de Fechas" */}
                    <Box sx={{ width: '40%', padding: 2, height: '300px', backgroundColor: '#f5f5f5', borderRadius:  '3%'}}>
                        <Typography variant="h6">Registro de Fechas</Typography>
                        <Grid container spacing={1}>
                            {last30Days.map((date, index) => {
                                const day = date.getDate();
                                const selectedDate = date.toISOString().split('T')[0];
                                const currentData = historicalData.find(d => d.fecha === selectedDate);
                                const riego = currentData && currentData.humedad > 45;
                                const fertilizacion = currentData && currentData.ph < 6;

                                return (
                                    <Grid item xs={2} key={index}> {/* 6 columnas en total */}
                                        <Box 
                                            sx={{ border: '1px solid #ccc', padding: 1, textAlign: 'center', borderRadius: 1, cursor: 'pointer', position: 'relative', height: '100%' }}
                                        >
                                            {/* Puntos indicativos en la parte superior izquierda */}
                                            <Box sx={{ position: 'absolute', top: 5, right: 5, display: 'flex', alignItems: 'center' }}>
                                                {riego && (
                                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'blue', marginRight: 0 }} />
                                                )}
                                                {fertilizacion && (
                                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#a3a21b', marginLeft: riego ? 0 : 0 }} />
                                                )}
                                            </Box>
                                            <Typography variant="body2">{day}</Typography> {/* Solo muestra el día */}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Leyenda de actividades */}
                        <Box sx={{ marginTop: 2, padding: 1, backgroundColor: '#e0e0e0', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'blue', display: 'inline-block', marginRight: 1 }} />
                                Riego
                            </Typography>
                            <Typography variant="body2">
                                <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#a3a21b', display: 'inline-block', marginRight: 1 }} />
                                Fertilización
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={historicalData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    nextIconButtonText="Página siguiente"
                    backIconButtonText="Página anterior"
                />

                {/* Botones para seleccionar el parámetro del gráfico */}
                <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button variant={selectedParameter === 'humedad' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('humedad')}>Humedad</Button>
                    <Button variant={selectedParameter === 'temperatura' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('temperatura')}>Temperatura</Button>
                    <Button variant={selectedParameter === 'ph' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('ph')}>pH</Button>
                    <Button variant={selectedParameter === 'co2' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('co2')}>Dióxido de Carbono</Button>
                </Box>

                {/* Gráfico de tendencias */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        {selectedParameter === 'humedad' && <Line type="monotone" dataKey="humedad" stroke="#8884d8" />}
                        {selectedParameter === 'temperatura' && (
                            <>
                                <Line type="monotone" dataKey="temperaturaMin" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="temperaturaMax" stroke="#ff7300" />
                            </>
                        )}
                        {selectedParameter === 'ph' && <Line type="monotone" dataKey="ph" stroke="#ff0000" />}
                        {selectedParameter === 'co2' && <Line type="monotone" dataKey="co2" stroke="#0000ff" />}
                    </LineChart>
                </ResponsiveContainer>

            </DashboardCard>
        </PageContainer>
    );
};

export default Historial;












