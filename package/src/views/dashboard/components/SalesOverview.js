import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const SalesOverview = () => {
    function getLastNDays(n) {
        const dates = [];
        for (let i = n; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            dates.push(`${day}/${month}`);
        }
        return dates;
    }
    
    const categories = getLastNDays(10);

    // select
    const [month, setMonth] = React.useState('1');

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // Generate random CO2 values between 405 and 440
    const generateRandomCO2Values = (count) => {
        return Array.from({ length: count }, () => Math.floor(Math.random() * (440 - 405 + 1)) + 405);
    };

    // chart
    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
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
            categories: getLastNDays(8),
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
            name: 'Niveles aceptables',
            data: generateRandomCO2Values(8), // Genera valores aleatorios para niveles aceptables
        },
        {
            name: 'Nivel actual de CO2',
            data: generateRandomCO2Values(8), // Genera valores aleatorios para el nivel actual de CO2
        },
    ];

    return (
        <DashboardCard title="Niveles de CO2" action={
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
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;

