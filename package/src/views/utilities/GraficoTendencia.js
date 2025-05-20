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
import { useEffect } from "react";
import axios from "axios";



const Historial = () => {
    const { zonas } = useZonas(); // Obtener las zonas del contexto
    const [selectedZone, setSelectedZone] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedParameter, setSelectedParameter] = useState('humedad'); // Parámetro seleccionado para el gráfico



    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/sensor-history`);
                console.log("Datos históricos recibidos:", response.data);

                const aggregatedData = response.data.reduce((acc, dato) => {
                    const fecha = dato.fecha.split("T")[0];

                    if (!acc[fecha]) {
                        acc[fecha] = { fecha, humedad: [], temperaturaMin: [], temperaturaMax: [], ph: [], radiacion: [] };
                    }

                    acc[fecha].humedad.push(parseFloat(dato.humedad) || 0); // ✅ Evita NaN
                    acc[fecha].temperaturaMin.push(parseFloat(dato.temperatura_min) || 0);
                    acc[fecha].temperaturaMax.push(parseFloat(dato.temperatura_max) || 0);
                    acc[fecha].ph.push(parseFloat(dato.ph) || 0);
                    acc[fecha].radiacion.push(parseFloat(dato.radiacion) || 0);

                    return acc;
                }, {});

                const formattedData = Object.values(aggregatedData).map((day) => ({
                    fecha: day.fecha,
                    humedad: day.humedad.length ? (day.humedad.reduce((sum, h) => sum + h, 0) / day.humedad.length).toFixed(2) : "0.00",
                    temperaturaMin: day.temperaturaMin.length ? (day.temperaturaMin.reduce((sum, t) => sum + t, 0) / day.temperaturaMin.length).toFixed(2) : "0.00",
                    temperaturaMax: day.temperaturaMax.length ? (day.temperaturaMax.reduce((sum, t) => sum + t, 0) / day.temperaturaMax.length).toFixed(2) : "0.00",
                    ph: day.ph.length ? (day.ph.reduce((sum, p) => sum + p, 0) / day.ph.length).toFixed(2) : "0.00",
                    radiacion: day.radiacion.length ? (day.radiacion.reduce((sum, r) => sum + r, 0) / day.radiacion.length).toFixed(2) : "0.00",
                }));

                console.log("Datos formateados para el gráfico:", formattedData);
                setHistoricalData(formattedData);
            } catch (error) {
                console.error("Error al obtener datos históricos:", error);
            }
        };

        fetchHistoricalData();
    }, []);




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
                        {selectedParameter === "humedad" && <Line type="monotone" dataKey="humedad" stroke="#8884d8" />}
                        {selectedParameter === "temperatura" && (
                            <>
                                <Line type="monotone" dataKey="temperaturaMin" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="temperaturaMax" stroke="#ff7300" />
                            </>
                        )}
                        {selectedParameter === "ph" && <Line type="monotone" dataKey="ph" stroke="#43a047" />}
                        {selectedParameter === "radiacion" && <Line type="monotone" dataKey="radiacion" stroke="#d50000" />}
                    </LineChart>
                </ResponsiveContainer>


            </DashboardCard>
        </PageContainer>
    );
};

export default Historial;
