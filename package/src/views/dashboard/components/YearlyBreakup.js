import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import axios from 'axios';

export default function TablaMensual() {
  const [historicalData, setHistoricalData] = useState([]);
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  useEffect(() => {
    const fetchDataForToday = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; 
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
  const last7HoursData = historicalData.slice(-8, -1).map(dato => parseFloat(dato.ph).toFixed(2));
  const categories = historicalData.slice(-8).map(dato => `${dato.hora}:00`);
  
  // 📌 Obtener el valor en tiempo real
  const currentPh = historicalData.length > 0
    ? parseFloat(historicalData[historicalData.length - 1].ph).toFixed(2)
    : "Cargando...";

  // ✅ Asegurar que la última hora refleje el dato real, no un promedio
  if (historicalData.length > 0) {
    last7HoursData.push(parseFloat(currentPh));
    categories.push(`${new Date().getHours()}:00`);
  }

  // 📌 Función para convertir el valor de pH (0 a 14) a un porcentaje (0 a 100)
  const pHToPercentage = (pHValue) => (pHValue / 14) * 100;

  // 📌 Configuración del medidor de pH
  const optionsGauge = {
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '70%' },
        track: { background: '#f2f2f2', strokeWidth: '100%', margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 0,
            fontSize: '22px',
            formatter: (val) => ((val / 100) * 14).toFixed(2), // Mostrar pH real
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: { shade: 'dark', shadeIntensity: 0.15, inverseColors: false, opacityFrom: 1, opacityTo: 1, stops: [0, 50, 65, 91] },
    },
    stroke: { dashArray: 4 },
    labels: ['pH'],
  };

  // 📌 Serie para el medidor de pH (convertido a porcentaje)
  const seriesGauge = [pHToPercentage(currentPh || 0)];

  // 📌 Configuración del gráfico con diseño `area`
  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 200,
      sparkline: { enabled: false },
    },
    stroke: { curve: 'smooth', width: 2, colors: [primary] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 80, 100] } },
    markers: { size: 4, colors: [primary], strokeColors: primary, strokeWidth: 2 },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light', x: { format: 'HH:mm' } },
    xaxis: { categories: categories, labels: { style: { colors: '#adb0bb' } } },
    yaxis: { labels: { style: { colors: '#adb0bb' } } },
    grid: { show: true, borderColor: '#f1f1f1', strokeDashArray: 3 },
  };

  const seriescolumnchart = [{ name: 'pH', color: primary, data: last7HoursData }];

  return (
    <DashboardCard
      title="Valor de pH: Sensor de pH"
      footer={<Chart options={optionscolumnchart} series={seriescolumnchart} type="line" height="200px" />}
    >
      {/* Contenedor para centrar el medidor en el eje X y reducir la distancia */}
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ marginBottom: '8px' }}>
        {/* Medidor de pH personalizado */}
        <Chart options={optionsGauge} series={seriesGauge} type="radialBar" width="200" height="200" />
      </Stack>
    </DashboardCard>
  );
}


