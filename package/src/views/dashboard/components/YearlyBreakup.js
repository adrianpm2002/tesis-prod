import React, { useContext, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { DataSensorContext } from '../../../context/dataSensorContext';

const PHValueDisplay = () => {
  const sensorData = useContext(DataSensorContext);
  const { ph } = sensorData;
  const [hourlyPH, setHourlyPH] = useState(Array(24).fill(null));

  useEffect(() => {
    const currentHour = new Date().getHours();
    const updatedHourlyPH = [...hourlyPH];
    updatedHourlyPH[currentHour] = ph;
    setHourlyPH(updatedHourlyPH);
  }, [ph]);

  const calculateHourlyAverage = () => {
    const averages = [];
    for (let hour = 0; hour < 24; hour++) {
      const pHValues = hourlyPH
        .filter((value, index) => index === hour && value !== null);
      const average = pHValues.length > 0
        ? (pHValues.reduce((sum, value) => sum + value, 0) / pHValues.length)
        : null;
      averages.push(average);
    }
    return averages;
  };

  const categories = getLast8Hours();
  const pHData = calculateHourlyAverage();
  const currentHour = new Date().getHours();
  const currentPH = pHData[currentHour] || ph;

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  // Función para convertir el valor de pH (0 a 14) a un porcentaje (0 a 100)
  const pHToPercentage = (pHValue) => {
    return (pHValue / 14) * 100;
  };

  // Opciones para el medidor de pH
  const optionsGauge = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '70%',
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 0,
            fontSize: '22px',
            formatter: function (val) {
              // Mostrar el valor de pH real (0 a 14) en lugar del porcentaje
              return ((val / 100) * 14).toFixed(2);
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ['pH'],
  };

  // Serie para el medidor de pH (convertido a porcentaje)
  const seriesGauge = [pHToPercentage(currentPH || 0)];

  // Opciones para el gráfico lineal
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
      name: 'pH',
      color: secondary,
      data: getLast8HoursData(pHData),
    },
  ];

  return (
    <DashboardCard
      title="Valor de pH: Sensor de pH"
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="line" height="200px" />
      }
    >
      <>
        {/* Contenedor para centrar el medidor en el eje X y reducir la distancia */}
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ marginBottom: '8px' }}>
          {/* Medidor de pH personalizado */}
          <Chart
            options={optionsGauge}
            series={seriesGauge}
            type="radialBar"
            width="200" // Tamaño del medidor
            height="200" // Tamaño del medidor
          />
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
    const hourIndex = (currentHour - i + 24) % 24;
    const value = data[hourIndex] !== null && data[hourIndex] !== undefined ? data[hourIndex] : last8HoursData[last8HoursData.length - 1] || 0;
    last8HoursData.push(value);
  }
  return last8HoursData;
}

export default PHValueDisplay;