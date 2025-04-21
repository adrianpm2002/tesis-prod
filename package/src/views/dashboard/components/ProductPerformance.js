import React, { useContext, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';
import { DataSensorContext } from '../../../context/dataSensorContext';

const ProductPerformance = () => {
  const sensorData = useContext(DataSensorContext);
  const { radiacionSolar } = sensorData;
  const [hourlyRadiation, setHourlyRadiation] = useState(Array(24).fill(null));

  useEffect(() => {
    const currentHour = new Date().getHours();
    const updatedHourlyRadiation = [...hourlyRadiation];
    updatedHourlyRadiation[currentHour] = radiacionSolar;
    setHourlyRadiation(updatedHourlyRadiation);
  }, [radiacionSolar]);

  const calculateHourlyAverage = () => {
    const averages = [];
    for (let hour = 0; hour < 24; hour++) {
      const radiationValues = hourlyRadiation
        .filter((value, index) => index === hour && value !== null);
      const average = radiationValues.length > 0
        ? (radiationValues.reduce((sum, value) => sum + value, 0) / radiationValues.length).toFixed(2)
        : null;
      averages.push(average);
    }
    return averages;
  };

  const categories = getLast8Hours();
  const radiationData = calculateHourlyAverage();
  const currentHour = new Date().getHours();
  const currentRadiation = radiationData[currentHour] || radiacionSolar;
  const variation = calculateVariation(radiationData);

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#ffa726';
  const successlight = '#e8f5e9';

  const optionscolumnchart = {
    chart: {
      type: 'area',
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
      colors: [secondary],
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
      colors: [secondary],
      strokeColors: secondary,
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
      name: 'Radiación Solar (W/m²)',
      color: secondary,
      data: getLast8HoursData(radiationData),
    },
  ];

  return (
    <DashboardCard
      title="Radiación Solar (W/m²): Sensor de Radiación Solar"
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="200px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {currentRadiation} W/m²
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
    last8HoursData.push(data[(currentHour - i + 24) % 24] || 0);
  }
  return last8HoursData;
}

function calculateVariation(data) {
  if (data.length < 2) return 0;
  return (data[data.length - 1] - data[data.length - 2]).toFixed(2); // Redondeamos a 2 decimales
}

export default ProductPerformance;

