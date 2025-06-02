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
  const [latestSensorData, setLatestSensorData] = useState(null);
  const theme = useTheme();

  // 📌 Obtener datos históricos
  useEffect(() => {
    const fetchDataForToday = async () => {
      try {
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString().split('T')[0];

        
        const response = await axios.get(`http://localhost:5000/api/sensor-history/${today}`);
        
        setHistoricalData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del día actual:", error);
      }
    };

    fetchDataForToday();
  }, []);

  // 📌 Obtener el último dato del sensor en tiempo real
  useEffect(() => {
    const fetchLatestSensorData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sensor-latest');
        
        setLatestSensorData(response.data);
      } catch (error) {
        console.error("Error al obtener el último valor del sensor:", error);
      }
    };

    fetchLatestSensorData();
    const interval = setInterval(fetchLatestSensorData, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  // 📌 Obtener las últimas 6 horas de datos promediados
  let processedHistoricalData = historicalData.slice(-6).map(dato =>
    dato.radiacion ? Math.round(parseFloat(dato.radiacion)) : 0
  );

  let processedCategories = historicalData.slice(-6).map(dato => `${dato.hora}:00`);

  // 📌 Validar el dato en tiempo real antes de agregarlo al gráfico
  const currentRadiation = latestSensorData && latestSensorData.radiacionsolar !== undefined
    ? Math.round(parseFloat(latestSensorData.radiacionsolar))
    : null;




  // ✅ Agregar el último dato sin promedios
  if (currentRadiation !== null && !isNaN(currentRadiation)) {
    processedHistoricalData[processedHistoricalData.length - 1] = currentRadiation; // Reemplaza el promedio con el dato real
  }

  if (processedCategories[processedCategories.length - 1] !== `${new Date().getHours()}:00`) {
    processedCategories[processedCategories.length - 1] = `${new Date().getHours()}:00`; // Reemplaza la hora duplicada
  }



  const variation = calculateVariation(processedHistoricalData);

  // 📌 Configuración del gráfico
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 200,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [theme.palette.secondary.main],
    },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 80, 100] },
    },
    markers: {
      size: 4,
      colors: [theme.palette.secondary.main],
      strokeColors: theme.palette.secondary.main,
      strokeWidth: 2,
    },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light' },
    xaxis: { categories: processedCategories, labels: { style: { colors: '#adb0bb' } } },
    yaxis: { labels: { style: { colors: '#adb0bb' } } },
    grid: { show: true, borderColor: '#f1f1f1', strokeDashArray: 3 },
  };

  const seriescolumnchart = [
    { name: 'Radiación Solar (W/m²)', color: theme.palette.secondary.main, data: processedHistoricalData },
  ];

  return (
    <PageContainer title="Panel de Control" description="Visualización del historial de radiación solar">
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
            <Avatar sx={{ bgcolor: '#e8f5e9', width: 27, height: 27 }}>
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


