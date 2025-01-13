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
    const { zonas } = useZonas(); // Obtenemos las zonas de cultivo

    // Mapa para asignar colores a zonas
    const colorMap = {};
    let colorIndex = 0;

    // Función para asignar cuadrantes según la cantidad de plantas
    const assignQuadrants = () => {
        const assignedQuadrants = [];
        const smallQuadrantsArr = Array(44).fill(null); 
        const mediumQuadrantsArr = Array(24).fill(null); 
        const largeQuadrantsArr = Array(10).fill(null); 

        zonas.forEach(zona => {
            const { nombre, cantidadPlantas } = zona;

            // Asignar color a la zona si no tiene uno ya asignado
            if (!colorMap[nombre]) {
                colorMap[nombre] = greenColors[colorIndex % greenColors.length];
                colorIndex++;
            }

            const zoneColor = colorMap[nombre];

            if (cantidadPlantas >= 10 && cantidadPlantas <= 20) {
                // Asignar cuadrante pequeño
                for (let i = 0; i < smallQuadrantsArr.length; i++) {
                    if (smallQuadrantsArr[i] === null) {
                        smallQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'small', name: nombre, color: zoneColor });
                        break; // Solo se asigna un cuadrante
                    }
                }
            } else if (cantidadPlantas > 20 && cantidadPlantas <= 40) {
                // Asignar cuadrante mediano
                for (let i = 0; i < mediumQuadrantsArr.length; i++) {
                    if (mediumQuadrantsArr[i] === null) {
                        mediumQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'medium', name: nombre, color: zoneColor });
                        break; // Solo se asigna un cuadrante
                    }
                }
            } else if (cantidadPlantas > 40 && cantidadPlantas <= 100) {
                // Asignar cuadrante grande
                for (let i = 0; i < largeQuadrantsArr.length; i++) {
                    if (largeQuadrantsArr[i] === null) {
                        largeQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'large', name: nombre, color: zoneColor });
                        break; // Solo se asigna un cuadrante
                    }
                }
            } else if (cantidadPlantas > 100) {
                // Asignar cuadrantes grandes hasta llenar
                let remainingPlants = cantidadPlantas;

                for (let i = 0; i < largeQuadrantsArr.length; i++) {
                    if (largeQuadrantsArr[i] === null && remainingPlants > 0) {
                        largeQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                        assignedQuadrants.push({ index: i, size: 'large', name: nombre, color: zoneColor });
                        remainingPlants -= 100; // Cada cuadrante grande puede contener hasta 100 plantas
                    }
                }

                // Si quedan plantas, asignar cuadrantes medianos
                if (remainingPlants > 0) {
                    for (let i = 0; i < mediumQuadrantsArr.length; i++) {
                        if (mediumQuadrantsArr[i] === null && remainingPlants > 0) {
                            mediumQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                            assignedQuadrants.push({ index: i, size: 'medium', name: nombre, color: zoneColor });
                            remainingPlants -= 40; // Cada cuadrante mediano puede contener hasta 40 plantas
                        }
                    }
                }

                // Si aún quedan plantas, asignar cuadrantes pequeños
                if (remainingPlants > 0) {
                    for (let i = 0; i < smallQuadrantsArr.length; i++) {
                        if (smallQuadrantsArr[i] === null && remainingPlants > 0) {
                            smallQuadrantsArr[i] = { nombre, cantidadPlantas, color: zoneColor };
                            assignedQuadrants.push({ index: i, size: 'small', name: nombre, color: zoneColor });
                            remainingPlants -= 20; // Cada cuadrante pequeño puede contener hasta 20 plantas
                        }
                    }
                }
            }
        });

        return { assignedQuadrants, smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr };
    };

    const { assignedQuadrants, smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr } = assignQuadrants();

    return (
        <PageContainer title="Casa de Cultivo" description="Mapa de la casa de cultivo de 200 metros cuadrados">
            <DashboardCard title="Mapa de la Casa de Cultivo">
                <Typography>Casa de Cultivo de 20m x 10m dividida en cuadrantes</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 1,
                        mt: 4,
                        height: '800px' // Altura total de la casa de cultivo
                    }}
                >
                    {/* Sección de cuadrantes pequeños */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gridTemplateRows: 'repeat(11, 1fr)',
                            gap: 1,
                            border: '1px solid black',
                            p: 1,
                            height: '100%', // Ajuste para abarcar toda la sección
                        }}
                    >
                        {smallQuadrantsArr.map((quadrant, index) => (
                            <Tooltip
                                key={index}
                                title={quadrant ? `${quadrant.nombre} - ${quadrant.cantidadPlantas} plantas` : ''}
                                arrow
                            >
                                <Box
                                    sx={{
                                        backgroundColor: quadrant ? quadrant.color : '#c3a698',
                                        border: '1px solid #000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: quadrant ? 'black' : 'transparent', // Solo mostrar texto si hay un cultivo
                                    }}
                                >
                                    {quadrant ? quadrant.nombre : index + 1}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>

                    {/* Sección de cuadrantes medianos */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gridTemplateRows: 'repeat(8, 1fr)',
                            gap: 1,
                            border: '1px solid black',
                            p: 1,
                            height: '100%', // Ajuste para abarcar toda la sección
                        }}
                    >
                        {mediumQuadrantsArr.map((quadrant, index) => (
                            <Tooltip
                                key={index}
                                title={quadrant ? `${quadrant.nombre} - ${quadrant.cantidadPlantas} plantas` : ''}
                                arrow
                            >
                                <Box
                                    sx={{
                                        backgroundColor: quadrant ? quadrant.color : '#c3a698',
                                        border: '1px solid #000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: quadrant ? 'black' : 'transparent', // Solo mostrar texto si hay un cultivo
                                    }}
                                >
                                    {quadrant ? quadrant.nombre : index + 1}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>

                    {/* Sección de cuadrantes grandes */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gridTemplateRows: 'repeat(5, 1fr)',
                            gap: 1,
                            border: '1px solid black',
                            p: 1,
                            height: '100%', // Ajuste para abarcar toda la sección
                        }}
                    >
                        {largeQuadrantsArr.map((quadrant, index) => (
                            <Tooltip
                                key={index}
                                title={quadrant ? `${quadrant.nombre} - ${quadrant.cantidadPlantas} plantas` : ''}
                                arrow
                            >
                                <Box
                                    sx={{
                                        backgroundColor: quadrant ? quadrant.color : '#c3a698',
                                        border: '1px solid #000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: quadrant ? 'black' : 'transparent', // Solo mostrar texto si hay un cultivo
                                    }}
                                >
                                    {quadrant ? quadrant.nombre : index + 1}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default SamplePage;

