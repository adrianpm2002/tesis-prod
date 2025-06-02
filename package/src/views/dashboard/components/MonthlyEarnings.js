import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import axios from 'axios';

export default function TablaMensual() {
  const [historicalData, setHistoricalData] = useState([]);
  const [latestSensorData, setLatestSensorData] = useState(null);
  const [chartBackgroundColor, setChartBackgroundColor] = useState('#ffffff');
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
    dato.humedad ? Math.round(parseFloat(dato.humedad)) : 0
  );

  let processedCategories = historicalData.slice(-6).map(dato => `${dato.hora}:00`);

  // 📌 Validar el dato en tiempo real antes de agregarlo al gráfico
  const currentHumidity = latestSensorData && latestSensorData.humedad !== undefined
    ? Math.round(parseFloat(latestSensorData.humedad))
    : null;

  // ✅ Agregar el último dato sin promedios
  if (currentHumidity !== null && !isNaN(currentHumidity)) {
    processedHistoricalData[processedHistoricalData.length - 1] = currentHumidity; // Reemplaza el promedio con el dato real
  }

  if (processedCategories[processedCategories.length - 1] !== `${new Date().getHours()}:00`) {
    processedCategories[processedCategories.length - 1] = `${new Date().getHours()}:00`; // Reemplaza la hora duplicada
  }

  

  // 📌 Determinar el color de fondo basado en la humedad más reciente
  useEffect(() => {
    if (currentHumidity !== null) {
      let color;
      if (currentHumidity >= 0 && currentHumidity <= 20) {
        color = '#5a3a32';
      } else if (currentHumidity >= 21 && currentHumidity <= 40) {
        color = '#b67636';
      } else if (currentHumidity >= 41 && currentHumidity <= 60) {
        color = '#cfae7f';
      } else if (currentHumidity >= 61 && currentHumidity <= 80) {
        color = '#e9eced';
      } else if (currentHumidity >= 81 && currentHumidity <= 100) {
        color = '#53525d';
      } else {
        color = '#ffffff';
      }
      setChartBackgroundColor(`linear-gradient(to bottom, ${color}, #ffffff)`);
    }
  }, [currentHumidity]);

  const variation = calculateVariation(processedHistoricalData);

  // 📌 Configuración del gráfico con estilos visuales
  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: true },
      height: 370,
      background: chartBackgroundColor,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: "butt",
    },
    dataLabels: { enabled: false },
    legend: { show: true },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: { tickAmount: 4 },
    xaxis: {
      categories: processedCategories,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Humedad por horas (%)',
      data: processedHistoricalData,
    }
  ];

  return (
    <PageContainer title="Historial" description="Visualización del historial de humedad">
      <DashboardCard title="Historial de Humedad">
        <Typography variant="h4" gutterBottom>
          Humedad Actual: {currentHumidity} %
        </Typography>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="line" height="370px" />
      </DashboardCard>
    </PageContainer>
  );
}

// 📌 Función para calcular la variación en la última hora
function calculateVariation(data) {
  if (data.length < 2) return 0;
  return (data[data.length - 1] - data[data.length - 2]).toFixed(2);
}
