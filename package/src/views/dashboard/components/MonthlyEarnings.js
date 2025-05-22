import React, { useState, useMemo } from 'react';
import {
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

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

  // 📌 Determinar el color de fondo basado en la humedad más reciente
  useEffect(() => {
    if (historicalData.length > 0) {
      const humedadActual = parseFloat(historicalData[historicalData.length - 1].humedad);
      let color;
      if (humedadActual >= 0 && humedadActual <= 20) {
        color = '#5a3a32';
      } else if (humedadActual >= 21 && humedadActual <= 40) {
        color = '#b67636';
      } else if (humedadActual >= 41 && humedadActual <= 60) {
        color = '#cfae7f';
      } else if (humedadActual >= 61 && humedadActual <= 80) {
        color = '#e9eced';
      } else if (humedadActual >= 81 && humedadActual <= 100) {
        color = '#53525d';
      } else {
        color = '#ffffff';
      }
      setChartBackgroundColor(`linear-gradient(to bottom, ${color}, #ffffff)`);
    }
  }, [historicalData]);

  // 📌 Extraer los datos del historial para el gráfico
  const last8HoursData = historicalData.slice(-8).map(dato => Math.round(parseFloat(dato.humedad)));
  const categories = historicalData.slice(-8).map(dato => `${dato.hora}:00`);
  const currentHumidity = historicalData.length > 0
    ? Math.round(parseFloat(historicalData[historicalData.length - 1].humedad))
    : "Cargando...";

  // 📌 Configuración del gráfico con estilos visuales de `MonthlyEarnings`
  const theme = useTheme();
  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
      background: chartBackgroundColor,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    stroke: {
      show: true,
      curve: 'smooth',
      width: 2,
      lineCap: "butt",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Humedad por horas (%)',
      data: last8HoursData,
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