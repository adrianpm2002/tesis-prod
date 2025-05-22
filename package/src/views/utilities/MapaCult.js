import React from 'react';
import { Typography, Box, Tooltip } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useZonas } from '../../context/ZonaContext';

const greenColors = [
    '#d9f9d9', '#b2e0b2', '#8cd98c', '#66c266', '#4db84d',
    '#33a833', '#1f9f1f', '#009900', '#008f00', '#007700',
    '#006600', '#005500', '#004400', '#003300', '#002200',
    '#001100', '#00b300', '#00cc00', '#00e600', '#00ff00'
];

const SamplePage = () => {
    const { zonas, loading } = useZonas();

    if (loading) {
        return <Typography>Cargando datos...</Typography>;
    }

    // Mapa para asignar colores a zonas
    const colorMap = {};
    let colorIndex = 0;
    
    // Función corregida para calcular días de cultivo y fecha de cosechas
    const getCultivoInfo = (zona) => {
        if (!zona || !zona.fechaCultivo) return { 
            diasTranscurridos: 0, 
            tiempoRestante: 0,
            cosecha: 'No disponible' 
        };
        
        const fechaSiembra = new Date(zona.fechaCultivo);
        const hoy = new Date();
        const diasTranscurridos = Math.floor((hoy - fechaSiembra) / (1000 * 60 * 60 * 24));
        const tiempoCultivo = parseInt(zona.tiempoCultivo) || 0;
        
        const fechaCosecha = new Date(fechaSiembra);
        fechaCosecha.setDate(fechaSiembra.getDate() + tiempoCultivo);
        
        return {
            diasTranscurridos: diasTranscurridos > 0 ? diasTranscurridos : 0,
            tiempoRestante: Math.max(0, tiempoCultivo - diasTranscurridos),
            cosecha: fechaCosecha.toLocaleDateString(),
            fechaSiembra: fechaSiembra.toLocaleDateString()
        };
    };

    // Función para asignar cuadrantes
    const assignQuadrants = () => {
        const assignedQuadrants = [];
        const smallQuadrantsArr = Array(44).fill(null); 
        const mediumQuadrantsArr = Array(24).fill(null); 
        const largeQuadrantsArr = Array(10).fill(null); 

        zonas.forEach(zona => {
            const { nombre, cantidadPlantas } = zona;

            if (!colorMap[nombre]) {
                colorMap[nombre] = greenColors[colorIndex % greenColors.length];
                colorIndex++;
            }

            const zoneColor = colorMap[nombre];

            if (cantidadPlantas > 0 && cantidadPlantas <= 20) {
                for (let i = 0; i < smallQuadrantsArr.length; i++) {
                    if (smallQuadrantsArr[i] === null) {
                        smallQuadrantsArr[i] = { ...zona, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'small', name: nombre, color: zoneColor });
                        break;
                    }
                }
            } else if (cantidadPlantas > 20 && cantidadPlantas <= 40) {
                for (let i = 0; i < mediumQuadrantsArr.length; i++) {
                    if (mediumQuadrantsArr[i] === null) {
                        mediumQuadrantsArr[i] = { ...zona, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'medium', name: nombre, color: zoneColor });
                        break;
                    }
                }
            } else if (cantidadPlantas > 40 && cantidadPlantas <= 100) {
                for (let i = 0; i < largeQuadrantsArr.length; i++) {
                    if (largeQuadrantsArr[i] === null) {
                        largeQuadrantsArr[i] = { ...zona, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'large', name: nombre, color: zoneColor });
                        break;
                    }
                }
            } else if (cantidadPlantas > 100) {
                let remainingPlants = cantidadPlantas;

                for (let i = 0; i < largeQuadrantsArr.length; i++) {
                    if (largeQuadrantsArr[i] === null && remainingPlants > 0) {
                        largeQuadrantsArr[i] = { ...zona, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'large', name: nombre, color: zoneColor });
                        remainingPlants -= 100;
                    }
                }

                if (remainingPlants > 0) {
                    for (let i = 0; i < mediumQuadrantsArr.length; i++) {
                        if (mediumQuadrantsArr[i] === null && remainingPlants > 0) {
                            mediumQuadrantsArr[i] = { ...zona, color: zoneColor };
                            assignedQuadrants.push({ index: i, size: 'medium', name: nombre, color: zoneColor });
                            remainingPlants -= 40;
                        }
                    }
                }

                if (remainingPlants > 0) {
                    for (let i = 0; i < smallQuadrantsArr.length; i++) {
                        if (smallQuadrantsArr[i] === null && remainingPlants > 0) {
                            smallQuadrantsArr[i] = { ...zona, color: zoneColor };
                            assignedQuadrants.push({ index: i, size: 'small', name: nombre, color: zoneColor });
                            remainingPlants -= 20;
                        }
                    }
                }
            }
        });

        return { assignedQuadrants, smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr };
    };

    const { smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr } = assignQuadrants(zonas);

    // Componente para renderizar cuadrantes
    const renderQuadrant = (quadrant, index, size) => {
        const cultivoInfo = getCultivoInfo(quadrant);
        return (
            <Tooltip
                key={index}
                title={
                    quadrant ? (
                        <div>
                            <div><strong>Zona:</strong> {quadrant.nombre}</div>
                            <div><strong>Plantas:</strong> {quadrant.cantidadPlantas}</div>
                            <div><strong>Fecha de siembra:</strong> {cultivoInfo.fechaSiembra}</div>
                            <div><strong>Días transcurridos:</strong> {cultivoInfo.diasTranscurridos}</div>
                            <div><strong>Tiempo de cultivo:</strong> {quadrant.tiempoCultivo} días</div>
                            <div><strong>Días restantes:</strong> {cultivoInfo.tiempoRestante}</div>
                            <div><strong>Fecha estimada de cosecha:</strong> {cultivoInfo.cosecha}</div>
                        </div>
                    ) : `Cuadrante ${size} #${index + 1} - Disponible`
                }
                arrow
            >
                <Box
                    sx={{
                        backgroundColor: quadrant ? quadrant.color : '#c3a698',
                        border: '1px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: size === 'small' ? '32px' : 'auto',
                        color: quadrant ? 'black' : 'transparent',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            zIndex: 1,
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }
                    }}
                >
                    {quadrant ? quadrant.nombre : index + 1}
                </Box>
            </Tooltip>
        );
    };

    return (
        <PageContainer title="Casa de Cultivo" description="Mapa de la casa de cultivo">
        <DashboardCard title="Mapa de la Casa de Cultivo">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1, mt: 4, overflowY: 'auto', maxHeight: '800px' }}>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(11, 1fr)', gap: 1, border: '1px solid black', p: 1, height: '100%' }}>
                    {smallQuadrantsArr.map((quadrant, index) => renderQuadrant(quadrant, index, 'small'))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', gap: 1, border: '1px solid black', p: 1, height: '100%' }}>
                    {mediumQuadrantsArr.map((quadrant, index) => renderQuadrant(quadrant, index, 'medium'))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 1, border: '1px solid black', p: 1, height: '100%' }}>
                    {largeQuadrantsArr.map((quadrant, index) => renderQuadrant(quadrant, index, 'large'))}
                </Box>
            </Box>
            <Typography>Casa de Cultivo de 20m x 10m dividida en cuadrantes</Typography>
        </DashboardCard>
    </PageContainer>
    );
};

export default SamplePage;