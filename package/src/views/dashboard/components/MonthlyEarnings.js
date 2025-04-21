import React, { useContext, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { DataSensorContext } from '../../../context/dataSensorContext'; // Importa el contexto

const MonthlyEarnings = () => {
  // Usa el contexto para obtener los datos del sensor
  const sensorData = useContext(DataSensorContext);
  const { humedad } = sensorData;

  // Estado para almacenar el registro histórico de la humedad por horas
  const [hourlyHumidity, setHourlyHumidity] = useState(Array(24).fill(null));

  // Estado para el color de fondo dinámico del gráfico
  const [chartBackgroundColor, setChartBackgroundColor] = useState('#ffffff');

  // Actualizar el registro histórico y el fondo del gráfico cada vez que cambie la humedad
  useEffect(() => {
    const currentHour = new Date().getHours();
    const updatedHourlyHumidity = [...hourlyHumidity];
    updatedHourlyHumidity[currentHour] = humedad; // Guardar la humedad actual en la hora correspondiente
    setHourlyHumidity(updatedHourlyHumidity);

    // Determinar el color de fondo basado en la humedad actual
    let color;
    if (humedad >= 0 && humedad <= 20) {
      color = '#5a3a32';
    } else if (humedad >= 21 && humedad <= 40) {
      color = '#b67636';
    } else if (humedad >= 41 && humedad <= 60) {
      color = '#cfae7f';
    } else if (humedad >= 61 && humedad <= 80) {
      color = '#e9eced';
    } else if (humedad >= 81 && humedad <= 100) {
      color = '#53525d';
    } else {
      color = '#ffffff'; // Fondo blanco por defecto
    }

    // Aplicar el degradado con el color seleccionado y el blanco
    setChartBackgroundColor(`linear-gradient(to bottom, ${color}, #ffffff)`);
  }, [humedad]);

  // Calcular la media de humedad por hora
  const calculateHourlyAverage = () => {
    const averages = [];
    for (let hour = 0; hour < 24; hour++) {
      const humidityValues = hourlyHumidity
        .filter((value, index) => index === hour && value !== null); // Filtrar valores no nulos
      const average = humidityValues.length > 0
        ? (humidityValues.reduce((sum, value) => sum + value, 0) / humidityValues.length) // Paréntesis corregido
        : null; // Calcular la media si hay datos
      averages.push(average);
    }
    return averages;
  };

  // Obtener las últimas 8 horas y los datos de humedad
  const categories = getLast8Hours();
  const humidityData = calculateHourlyAverage(); // Usar la media por horas
  const currentHour = new Date().getHours();
  const currentHumidity = humidityData[currentHour] || humedad; // Mostrar la humedad actual si no hay media
  const last8HoursData = getLast8HoursData(humidityData);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
      background: chartBackgroundColor, // Fondo del gráfico dinámico
    },
    colors: [primary, secondary],
    stroke: {
      show: true,
      curve: 'smooth',
      width: 2,
      lineCap: "butt",
      colors: [primary, secondary],
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
      name: 'Humedad Diaria (%)',
      data: last8HoursData,  // Mostrar las últimas 8 horas
    }
  ];

  return (
    <DashboardCard title="Humedad (%): Sensor de Humedad">
      <Typography variant="h4" gutterBottom>
        Humedad Actual: {currentHumidity !== null ? `${currentHumidity.toFixed(2)} %` : 'Cargando...'}
      </Typography>
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="line"
        height="370px"
      />
    </DashboardCard>
  );
};

// Funciones para obtener las últimas 8 horas y los datos de humedad

function getLast8Hours() {
  const hours = [];
  const currentHour = new Date().getHours();

  for (let i = 7; i >= 0; i--) {
    let hour = (currentHour - i + 24) % 24;
    hours.push(hour > 9 ? `${hour}:00` : `0${hour}:00`);
  }

  return hours;
}

function getLast8HoursData(data) {
  const currentHour = new Date().getHours();
  const last8HoursData = [];
  for (let i = 7; i >= 0; i--) {
    const hourIndex = (currentHour - i + 24) % 24;
    const value = data[hourIndex] !== null && data[hourIndex] !== undefined ? data[hourIndex] : last8HoursData[last8HoursData.length - 1] || 0;
    last8HoursData.push(value);
  }
  return last8HoursData;
}

export default MonthlyEarnings;