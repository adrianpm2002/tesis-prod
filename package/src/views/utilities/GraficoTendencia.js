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
        const radiacion = Math.floor(Math.random() * 600 + 300);

        data.push({
            fecha: date.toISOString().split('T')[0],
            humedad: (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(2),
            temperaturaMin,
            temperaturaMax,
            ph,
            radiacion,
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

                {/* Botones para seleccionar el parámetro del gráfico */}
                <Box sx={{ marginTop: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
                    <Button variant={selectedParameter === 'humedad' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('humedad')}>Humedad</Button>
                    <Button variant={selectedParameter === 'temperatura' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('temperatura')}>Temperatura</Button>
                    <Button variant={selectedParameter === 'ph' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('ph')}>pH</Button>
                    <Button variant={selectedParameter === 'radiacion' ? 'contained' : 'outlined'} onClick={() => handleParameterChange('radiacion')}>Radiación Solar</Button>
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
                        {selectedParameter === 'radiacion' && <Line type="monotone" dataKey="radiacion" stroke="#0000ff" />}
                    </LineChart>
                </ResponsiveContainer>

            </DashboardCard>
        </PageContainer>
    );
};

export default Historial;
