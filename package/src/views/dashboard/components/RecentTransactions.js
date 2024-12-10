import React from 'react';
import { Select, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const RecentTransactions = () => {

    function generateTemperatureData() {
        const data = [];
        const averageTemp = 24;
    
        for (let hour = 0; hour < 24; hour++) {
            let temp;
    
            if (hour >= 18 || hour < 4) {
                // De 6 PM a 4 AM, la temperatura disminuye
                temp = averageTemp - ((hour >= 18 ? hour - 18 : hour + 6) / 6) * 4;
            } else if (hour >= 4 && hour <= 14) {
                // De 4 AM a 2 PM, la temperatura aumenta
                temp = averageTemp + ((hour - 4) / 10) * 4;
            } else {
                // De 2 PM a 6 PM, la temperatura es estable en promedio
                temp = 28;
            }
    
            data.push(parseFloat(temp.toFixed(2)));
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

    const categories = getLast8Hours();
    const temperatureData = generateTemperatureData();
    const currentHour = new Date().getHours();
    const currentTemp = temperatureData[currentHour];
    const last8HoursData = getLast8HoursData(temperatureData);

    // select
    const [month, setMonth] = React.useState('1');

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

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
            name: 'Temperatura Diaria (°C)',
            data: last8HoursData,  // Mostrar las últimas 8 horas
        }
    ];

    return (
        <DashboardCard title="Niveles de Temperatura" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={1}>Diciembre 2024</MenuItem>
                <MenuItem value={2}>Noviembre 2024</MenuItem>
                <MenuItem value={3}>Octubre 2024</MenuItem>
            </Select>
        }>
            <Typography variant="h4" gutterBottom>
                Temperatura Actual: {currentTemp} °C
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

export default RecentTransactions;



