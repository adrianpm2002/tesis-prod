import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, MenuItem, Select, FormControl, InputLabel, ButtonGroup, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DatosHistoricos = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedParameter, setSelectedParameter] = useState('humedad');

    useEffect(() => {
        // Simulación de la obtención de datos históricos por zona
        const fetchHistoricalData = async () => {
            // Aquí deberías hacer una llamada a tu API o fuente de datos
            const data = [
                {
                    zona: 'Zona 1',
                    datos: [
                        { fecha: '2023-01-01', humedad: 30, temperatura: 20, ph: 6.5, co2: 400, radiacion: 200 },
                        { fecha: '2023-02-01', humedad: 35, temperatura: 22, ph: 6.7, co2: 420, radiacion: 210 },
                        { fecha: '2023-03-01', humedad: 40, temperatura: 25, ph: 6.8, co2: 430, radiacion: 220 },
                    ]
                },
                {
                    zona: 'Zona 2',
                    datos: [
                        { fecha: '2023-01-01', humedad: 45, temperatura: 18, ph: 6.2, co2: 390, radiacion: 180 },
                        { fecha: '2023-02-01', humedad: 50, temperatura: 19, ph: 6.3, co2: 395, radiacion: 185 },
                        { fecha: '2023-03-01', humedad: 55, temperatura: 21, ph: 6.4, co2: 400, radiacion: 190 },
                    ]
                }
            ];
            setHistoricalData(data);
            setSelectedZone(data[0]); // Seleccionar la primera zona por defecto
        };

        fetchHistoricalData();
    }, []);

    const handleZoneChange = (event) => {
        const selected = historicalData.find(z => z.zona === event.target.value);
        setSelectedZone(selected);
    };

    const renderChart = () => {
        let color;
        switch (selectedParameter) {
            case 'humedad':
                color = '#66BB6A';
                break;
            case 'temperatura':
                color = '#43A047';
                break;
            case 'ph':
                color = '#1B5E20';
                break;
            case 'co2':
                color = '#81C784';
                break;
            case 'radiacion':
                color = '#388E3C';
                break;
            default:
                color = '#66BB6A';
        }

        return (
            <LineChart width={600} height={300} data={selectedZone.datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={selectedParameter} stroke={color} activeDot={{ r: 8 }} />
            </LineChart>
        );
    };

    return (
        <PageContainer title="Datos Históricos" description="Visualización de datos históricos de zonas de cultivo">
            <DashboardCard title="Datos Históricos">
                <Box sx={{ marginBottom: 3 }}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="zone-select-label">Selecciona una Zona</InputLabel>
                        <Select
                            labelId="zone-select-label"
                            value={selectedZone ? selectedZone.zona : ''}
                            onChange={handleZoneChange}
                            label="Selecciona una Zona"
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            {historicalData.map((zona) => (
                                <MenuItem key={zona.zona} value={zona.zona}>
                                    {zona.zona}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper} style={{ marginTop: '20px', backgroundColor: 'white' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Humedad (%)</TableCell>
                                <TableCell>Temperatura (°C)</TableCell>
                                <TableCell>pH</TableCell>
                                <TableCell>Dióxido de Carbono (ppm)</TableCell>
                                <TableCell>Radiación Solar (W/m²)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedZone && selectedZone.datos.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.fecha}</TableCell>
                                    <TableCell>{data.humedad}</TableCell>
                                    <TableCell>{data.temperatura}</TableCell>
                                    <TableCell>{data.ph}</TableCell>
                                    <TableCell>{data.co2}</TableCell>
                                    <TableCell>{data.radiacion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {selectedZone && (
                    <Box sx={{ marginTop: 3 }}>
                        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                            <Button onClick={() => setSelectedParameter('humedad')}>Humedad</Button>
                            <Button onClick={() => setSelectedParameter('temperatura')}>Temperatura</Button>
                            <Button onClick={() => setSelectedParameter('ph')}>pH</Button>
                            <Button onClick={() => setSelectedParameter('co2')}>CO2</Button>
                            <Button onClick={() => setSelectedParameter('radiacion')}>Radiación Solar</Button>
                        </ButtonGroup>
                        <Typography variant="h6" gutterBottom sx={{ color: '#4CAF50', marginTop: 3 }}>
                            {`Gráfico de ${selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)}`}
                        </Typography>
                        {renderChart()}
                    </Box>
                )}
            </DashboardCard>
        </PageContainer>
    );
};

export default DatosHistoricos;




