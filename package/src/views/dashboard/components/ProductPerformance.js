import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import axios from 'axios';

export default function TablaMensual() {
  const [historicalData, setHistoricalData] = useState([]);
  const [chartBackgroundColor, setChartBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    const fetchDataForToday = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // 📌 Obtiene la fecha actual
        console.log("Obteniendo datos para:", today);

        const response = await axios.get(`http://localhost:5000/api/sensor-history/${today}`);
        console.log("Datos de hoy:", response.data);

        setHistoricalData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del día actual:", error);
      }
    };

    fetchDataForToday();
  }, []);

  // 📌 Extraer los datos del historial para el gráfico
  const last7HoursData = historicalData.slice(-8, -1).map(dato => Math.round(parseFloat(dato.radiacion)));
  const categories = historicalData.slice(-8).map(dato => `${dato.hora}:00`);
  const currentRadiation = historicalData.length > 0 
    ? Math.round(parseFloat(historicalData[historicalData.length - 1].radiacion)) 
    : "Cargando...";



  // ✅ Asegurar que la última hora refleje el dato real, no un promedio
if (historicalData.length > 0) {
  last7HoursData.push(currentRadiation);
  categories.push(`${new Date().getHours()}:00`);
}

  const variation = calculateVariation(last7HoursData);

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#ffa726';
  const successlight = '#e8f5e9';

  // 📌 Configuración del gráfico con diseño `area`
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 200,
      sparkline: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [secondary],
    },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 80, 100] },
    },
    markers: {
      size: 4,
      colors: [secondary],
      strokeColors: secondary,
      strokeWidth: 2,
    },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light', x: { format: 'HH:mm' } },
    xaxis: { categories: categories, labels: { style: { colors: '#adb0bb' } } },
    yaxis: { labels: { style: { colors: '#adb0bb' } } },
    grid: { show: true, borderColor: '#f1f1f1', strokeDashArray: 3 },
  };

  const seriescolumnchart = [
    { name: 'Radiación Solar (W/m²)', color: secondary, data: last7HoursData },
  ];

  return (
    <PageContainer title="Historial" description="Visualización del historial de radiación solar">
      <DashboardCard
        title="Radiación Solar (W/m²): Sensor de Radiación Solar"
        footer={
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="200px" />
        }
      >
        <>
          <Typography variant="h4" gutterBottom>
            Radiación Solar Actual: {currentRadiation} W/m²
          </Typography>
          <Stack direction="row" spacing={1} my={2} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              {variation >= 0 ? (
                <IconArrowUpRight width={20} color="#66BB6A" />
              ) : (
                <IconArrowDownRight width={20} color="#f44336" />
              )}
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {variation >= 0 ? '+' : ''}{variation} W/m²
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              en la última hora
            </Typography>
          </Stack>
        </>
      </DashboardCard>
    </PageContainer>
  );
}

// 📌 Función para calcular la variación en la última hora
function calculateVariation(data) {
  if (data.length < 2) return 0;
  return (data[data.length - 1] - data[data.length - 2]).toFixed(2);
}

