import React, { useContext, useState, useEffect } from 'react';
import { Typography, Stack, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { DataSensorContext } from '../../../context/dataSensorContext';

const RecentTransactions = () => {
  const sensorData = useContext(DataSensorContext);
  const { temperatura } = sensorData;
  const [hourlyTemperature, setHourlyTemperature] = useState(Array(24).fill(null));

  useEffect(() => {
    const currentHour = new Date().getHours();
    const updatedHourlyTemperature = [...hourlyTemperature];
    updatedHourlyTemperature[currentHour] = temperatura;
    setHourlyTemperature(updatedHourlyTemperature);
  }, [temperatura]);

  const calculateHourlyAverage = () => {
    const averages = [];
    for (let hour = 0; hour < 24; hour++) {
      const temperatureValues = hourlyTemperature
        .filter((value, index) => index === hour && value !== null);
      const average = temperatureValues.length > 0
        ? (temperatureValues.reduce((sum, value) => sum + value, 0) / temperatureValues.length)
        : null;
      averages.push(average);
    }
    return averages;
  };

  const categories = getLast8Hours();
  const temperatureData = calculateHourlyAverage();
  const currentHour = new Date().getHours();
  const currentTemp = temperatureData[currentHour] || temperatura;
  const last8HoursData = getLast8HoursData(temperatureData);
  const variation = calculateVariation(temperatureData);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const successlight = '#e8f5e9';
  const errorlight = '#ffcdd2';

  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 200,
      sparkline: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [primary],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 80, 100],
      },
    },
    markers: {
      size: 4,
      colors: [primary],
      strokeColors: primary,
      strokeWidth: 2,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        format: 'HH:mm',
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#adb0bb',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#adb0bb',
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 3,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Temperatura (°C)',
      color: primary,
      data: last8HoursData,
    },
  ];

  return (
    <DashboardCard title="Niveles de Temperatura">
      <Typography variant="h3" fontWeight="700" mt="-20px">
        Temperatura Actual: {currentTemp !== null ? `${currentTemp.toFixed(2)} °C` : 'Cargando...'}
      </Typography>
      <Stack direction="row" spacing={1} my={2} alignItems="center">
        <Avatar sx={{ bgcolor: variation >= 0 ? successlight : errorlight, width: 27, height: 27 }}>
          {variation >= 0 ? (
            <IconArrowUpRight width={20} color="#66BB6A" />
          ) : (
            <IconArrowDownRight width={20} color="#f44336" />
          )}
        </Avatar>
        <Typography variant="subtitle2" fontWeight="600">
          {variation !== null ? (variation >= 0 ? '+' : '') + variation.toFixed(2) : 'N/A'} °C
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          en la última hora
        </Typography>
      </Stack>
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="line"
        height="200px"
      />
    </DashboardCard>
  );
};

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

function calculateVariation(data) {
  if (data.length < 2) return null; // No hay suficientes datos para calcular la variación
  const currentHour = new Date().getHours();
  const previousHour = (currentHour - 1 + 24) % 24;
  const currentValue = data[currentHour];
  const previousValue = data[previousHour];

  if (currentValue === null || previousValue === null) return null; // No hay datos para calcular la variación
  return (currentValue - previousValue);
}

export default RecentTransactions;