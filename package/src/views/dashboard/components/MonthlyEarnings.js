import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Typography, Fab } from '@mui/material';
import { IconDroplet } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';

const MonthlyEarnings = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#008000';
  const errorlight = '#fdede8';

  // Obtener las últimas 8 horas y los datos de humedad
  const categories = getLast8Hours();
  const humidityData = generateHumidityData();
  const currentHour = new Date().getHours();
  const currentHumidity = humidityData[currentHour];

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#008000',
      toolbar: {
        show: false,
      },
      height: 100,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    xaxis: {
      categories: categories,
    }
  };

  const seriescolumnchart = [
    {
      name: 'Humedad Diaria (%)',
      color: secondary,
      data: getLast8HoursData(humidityData),  // Mostrar las últimas 8 horas
    },
  ];

  return (
    <DashboardCard
      title="Humedad (%): Sensor de Humedad"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconDroplet width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="60px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {currentHumidity}%
        </Typography>
      </>
    </DashboardCard>
  );
};

// Funciones para generar los datos de humedad y obtener las últimas 8 horas

function generateHumidityData() {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
        let humidity;

        if (hour >= 21 || hour < 6) {
            // De 9 PM a 6 AM, la humedad varía entre 80% y 90%
            humidity = (Math.random() * 10) + 80;
        } else if (hour >= 12 && hour < 18) {
            // De 12 PM a 6 PM, la humedad varía entre 70% y 85%
            humidity = (Math.random() * 15) + 70;
        } else {
            // Rango estándar para el resto del día
            humidity = (Math.random() * 10) + 75;
        }

        data.push(parseFloat(humidity.toFixed(2)));
    }

    return data;
}

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
        last8HoursData.push(data[(currentHour - i + 24) % 24]);
    }

    return last8HoursData;
}

export default MonthlyEarnings;

