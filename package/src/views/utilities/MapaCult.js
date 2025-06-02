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
        if (!zona || !zona.fecha_cultivo) return { 
            diasTranscurridos: 0, 
            tiempoRestante: 0,
            cosecha: 'No disponible' 
        };
    
        const fechaSiembra = new Date(zona.fecha_cultivo);
        const hoy = new Date();
        const diasTranscurridos = Math.floor((hoy - fechaSiembra) / (1000 * 60 * 60 * 24));
        const tiempoCultivo = parseInt(zona.tiempo_cultivo) || 0;
    
        const fechaCosecha = new Date(fechaSiembra);
        fechaCosecha.setDate(fechaSiembra.getDate() + tiempoCultivo);
    
        const cultivoInfo = {
            diasTranscurridos: diasTranscurridos > 0 ? diasTranscurridos : 0,
            tiempoRestante: Math.max(0, tiempoCultivo - diasTranscurridos),
            cosecha: fechaCosecha.toLocaleDateString(),
            fechaSiembra: fechaSiembra.toLocaleDateString()
        };
    
        
    
        return cultivoInfo;
    };
    

    // Función para asignar cuadrantes
    const assignQuadrants = () => {


        // Función para generar colores dinámicos basados en el nombre de la zona
        const generateDynamicColor = (name) => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const color = `#${(hash & 0x00FFFFFF).toString(16).padStart(6, '0')}`;
            return color;
        };

        let colorIndex = 0; 
        const assignedQuadrants = zonas.map(zona => {
            const { nombre, cantidad_plantas } = zona; // Extraemos 'nombre'
        
            if (!colorMap[nombre]) {
                colorMap[nombre] = greenColors[colorIndex % greenColors.length];
                colorIndex++;
            }
        
            return {
                ...zona,
                color: colorMap[nombre]
            };
        });

        const smallQuadrantsArr = new Array(44).fill(null);
const mediumQuadrantsArr = new Array(24).fill(null);
const largeQuadrantsArr = new Array(10).fill(null);

zonas.forEach(zona => {
    const { nombre, cantidad_plantas } = zona;

    if (!colorMap[nombre]) {
        colorMap[nombre] = greenColors[colorIndex % greenColors.length];
        colorIndex++;
    }
    const zoneColor = colorMap[nombre];
    let remainingPlants = cantidad_plantas;

    // **Definir el tipo de cuadrante basado en la cantidad inicial de plantas**
    const cuadrantePreferido = cantidad_plantas > 100 
        ? largeQuadrantsArr 
        : cantidad_plantas > 40 
        ? mediumQuadrantsArr 
        : smallQuadrantsArr;

    // **Asignar las plantas dentro del mismo tipo de cuadrante primero**
    while (remainingPlants > 0) {
        const index = cuadrantePreferido.findIndex(q => q === null);
        if (index !== -1) {
            cuadrantePreferido[index] = { ...zona, color: zoneColor };
            assignedQuadrants.push({ index, size: cuadrantePreferido === largeQuadrantsArr ? 'large' : cuadrantePreferido === mediumQuadrantsArr ? 'medium' : 'small', name: nombre, color: zoneColor });

            remainingPlants -= cuadrantePreferido === largeQuadrantsArr ? 100 : cuadrantePreferido === mediumQuadrantsArr ? 40 : 20;
        } else {
            break; // Cuando se acaban los cuadrantes del tipo preferido, pasamos al siguiente.
        }
    }

    // **Si no quedan más cuadrantes del tipo preferido, asignamos a otros disponibles**
    while (remainingPlants > 0) {
        const fallbackQuadrant = largeQuadrantsArr.findIndex(q => q === null) !== -1 ? largeQuadrantsArr
            : mediumQuadrantsArr.findIndex(q => q === null) !== -1 ? mediumQuadrantsArr
            : smallQuadrantsArr;

        const index = fallbackQuadrant.findIndex(q => q === null);
        if (index !== -1) {
            fallbackQuadrant[index] = { ...zona, color: zoneColor };
            assignedQuadrants.push({ index, size: fallbackQuadrant === largeQuadrantsArr ? 'large' : fallbackQuadrant === mediumQuadrantsArr ? 'medium' : 'small', name: nombre, color: zoneColor });
            remainingPlants -= fallbackQuadrant === largeQuadrantsArr ? 100 : fallbackQuadrant === mediumQuadrantsArr ? 40 : 20;
        } else {
            break;
        }
    }
});
        
        return { assignedQuadrants, smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr };
    };

    const { assignedQuadrants, smallQuadrantsArr, mediumQuadrantsArr, largeQuadrantsArr } = assignQuadrants();


    // Componente para renderizar cuadrantes
    const renderQuadrant = (quadrant, index, size) => {
        
    
        const cultivoInfo = quadrant ? getCultivoInfo(quadrant) : null;
        return (
            <Tooltip
                key={index}
                title={
                    quadrant ? (
                        <div>
                            <div><strong>Zona:</strong> {quadrant.nombre}</div>
                            <div><strong>Plantas:</strong> {quadrant.cantidad_plantas}</div>
                            <div><strong>Fecha de siembra:</strong> {cultivoInfo?.fechaSiembra || "N/A"}</div>
                            <div><strong>Días transcurridos:</strong> {cultivoInfo?.diasTranscurridos || "N/A"}</div>
                            <div><strong>Tiempo de cultivo:</strong> {quadrant.tiempo_cultivo || "N/A"} días</div>
                            <div><strong>Días restantes:</strong> {cultivoInfo?.tiempoRestante || "N/A"}</div>
                            <div><strong>Fecha estimada de cosecha:</strong> {cultivoInfo?.cosecha || "N/A"}</div>
                        </div>
                    ) : `Cuadrante ${size} #${index + 1} - Disponible`
                }
                arrow
            >
                <Box sx={{
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
                }}>
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
                        {smallQuadrantsArr.map((quadrant, index) => (
                            <React.Fragment key={index}>
                                {renderQuadrant(quadrant, index, 'small')}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', gap: 1, border: '1px solid black', p: 1, height: '100%' }}>
                        {mediumQuadrantsArr.map((quadrant, index) => (
                            <React.Fragment key={index}>
                                {renderQuadrant(quadrant, index, 'medium')}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 1, border: '1px solid black', p: 1, height: '100%' }}>
                        {largeQuadrantsArr.map((quadrant, index) => (
                            <React.Fragment key={index}>
                                {renderQuadrant(quadrant, index, 'large')}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
                <Typography>Casa de Cultivo de 20m x 10m dividida en cuadrantes</Typography>
            </DashboardCard>
        </PageContainer>
    );
};

export default SamplePage;