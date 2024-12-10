import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpRight } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';

const ProductPerformance = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#ffa726';  // Color ajustado para radiación solar
  const successlight = '#e8f5e9';  // Color ajustado para indicadores de éxito

  // Obtener las últimas 8 horas y los datos de radiación solar
  const categories = getLast8Hours();
  const radiationData = generateRadiationData();

  // Calcular la variación en las últimas dos horas
  const lastRadiation = radiationData[radiationData.length - 1];
  const variation = calculateVariation(radiationData);

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#ffa726',  // Color ajustado para radiación solar
      toolbar: {
        show: false,
      },
      height: 200,  // Aumentar la altura del gráfico si es necesario
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
      name: '',
      color: secondary,
      data: radiationData,
    },
  ];

  return (
    <DashboardCard
      title="Radiación Solar (W/m²): Sensor de Radiación Solar"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconArrowUpRight width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="200px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {lastRadiation} W/m²
        </Typography>
        <Stack direction="row" spacing={1} my={2} alignItems="center">
          <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
            <IconArrowUpRight width={20} color="#66BB6A" />
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

// Funciones para generar las últimas 8 horas y los datos de radiación solar

function getLast8Hours() {
    const hours = [];
    const currentHour = new Date().getHours();

    for (let i = 7; i >= 0; i--) {
        let hour = (currentHour - i + 24) % 24;  // Asegurarse de que la hora esté en el rango de 0 a 23
        let label = hour > 9 ? `${hour}:00` : `0${hour}:00`;  // Formatear la hora para que tenga dos dígitos
        hours.push(label);
    }

    return hours;
}

function generateRadiationData() {
    const data = [];
    const currentHour = new Date().getHours();

    for (let i = 7; i >= 0; i--) {
        let hour = (currentHour - i + 24) % 24;  // Asegurarse de que la hora esté en el rango de 0 a 23
        
        let value;
        if (hour >= 20 || hour < 6) {
            value = 0;  // De 8 PM a 6 AM, los valores son 0
        } else if (hour >= 6 && hour <= 14) {
            value = (hour - 6) * 100;  // De 6 AM a 2 PM, los valores aumentan linealmente
        } else {
            value = Math.floor(Math.random() * 100) + 400;  // Otros valores entre 400 y 500
        }

        data.push(value);
    }

    return data;
}

function calculateVariation(data) {
    if (data.length < 2) return 0;
    return data[data.length - 1] - data[data.length - 2];
}

export default ProductPerformance;



