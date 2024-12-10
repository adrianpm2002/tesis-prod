import React from 'react';
import { Box, Typography } from '@mui/material';

const DatosenTR = ({ zona }) => {
    return (
        <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6">Datos de la Zona</Typography>
            <Typography variant="body1"><strong>Nombre:</strong> {zona.nombre}</Typography>
            <Typography variant="body1"><strong>Suelo:</strong> {zona.suelo}</Typography>
            <Typography variant="body1"><strong>Acidez:</strong> {zona.acidezMin} - {zona.acidezMax}</Typography>
            <Typography variant="body1"><strong>Temperatura:</strong> {zona.temperaturaMin} - {zona.temperaturaMax}</Typography>
            <Typography variant="body1"><strong>Humedad:</strong> {zona.humedadMin} - {zona.humedadMax}</Typography>
            <Typography variant="body1"><strong>Riego:</strong> {zona.riego}</Typography>
            <Typography variant="body1"><strong>Insumos:</strong> {zona.insumos}</Typography>
        </Box>
    );
};

export default DatosenTR;
