import React, { useState, useEffect } from 'react';
import { Grid, CardContent, Button, Box, Typography, Stack, TextField, MenuItem } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { useZonas } from '../../context/ZonaContext';

const ZonaCultivo = () => {
    const { handleAddZone } = useZonas();
    const [zonas, setZonas] = useState(() => {
        const savedZonas = localStorage.getItem('zonas');
        return savedZonas ? JSON.parse(savedZonas) : [];
    });

    const [editingZone, setEditingZone] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        localStorage.setItem('zonas', JSON.stringify(zonas));
    }, [zonas]);

    const handleAddNewZone = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const newZone = {
            id: zonas.length + 1,
            nombre: '',
            suelo: '',
            cantidadPlantas: '',
            acidezMin: '',
            acidezMax: '',
            temperaturaMin: '',
            temperaturaMax: '',
            humedadMin: '',
            humedadMax: '',
            riego: '',
            insumos: '',
            fechaCultivo: formattedDate, // Establece la fecha de cultivo al día actual
            tiempoCultivo: ''
        };

        setZonas([...zonas, newZone]);
        setEditingZone(newZone.id); // Poner en modo edición inmediatamente
    };

    const handleEditZone = (id) => {
        setEditingZone(id);
    };

    const handleRemoveZone = (id) => {
        setZonas(zonas.filter(zona => zona.id !== id));
        if (editingZone === id) setEditingZone(null);
    };

    const handleChange = (id, field, value) => {
        setZonas(zonas.map(zona => zona.id === id ? { ...zona, [field]: value } : zona));
        setValidationErrors({ ...validationErrors, [field]: '' }); // Limpiar errores al cambiar el valor
    };

    const handleSaveZone = (id) => {
        const zona = zonas.find(z => z.id === id);
        const errors = {};

        // Validar campos
        if (!zona.nombre) errors.nombre = 'Campo vacío';
        if (!zona.suelo) errors.suelo = 'Campo vacío';
        if (!zona.cantidadPlantas) errors.cantidadPlantas = 'Campo vacío';
        if (!zona.acidezMin) errors.acidezMin = 'Campo vacío';
        if (!zona.acidezMax) errors.acidezMax = 'Campo vacío';
        if (!zona.temperaturaMin) errors.temperaturaMin = 'Campo vacío';
        if (!zona.temperaturaMax) errors.temperaturaMax = 'Campo vacío';
        if (!zona.humedadMin) errors.humedadMin = 'Campo vacío';
        if (!zona.humedadMax) errors.humedadMax = 'Campo vacío';
        if (!zona.riego) errors.riego = 'Campo vacío';
        if (!zona.insumos) errors.insumos = 'Campo vacío';
        if (!zona.fechaCultivo) errors.fechaCultivo = 'Campo vacío';
        if (!zona.tiempoCultivo) errors.tiempoCultivo = 'Campo vacío';

        if (Object.keys(errors).length === 0) {
            setEditingZone(null); // Salir del modo edición si no hay errores
        } else {
            setValidationErrors(errors); // Mostrar errores
        }
    };

    return (
        <PageContainer title="Zona de Cultivo" description="Gestión de zonas de cultivo">
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    <DashboardCard title="Zonas de Cultivo">
                        <Grid container spacing={3} direction="column">
                            {zonas.map(zona => (
                                <Grid item key={zona.id}>
                                    <BlankCard>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    padding: 2,
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    boxShadow: 2,
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                            >
                                                {editingZone === zona.id ? (
                                                    <Stack spacing={1} sx={{ width: '100%' }}>
                                                        <TextField
                                                            label="Nombre del Cultivo"
                                                            variant="outlined"
                                                            value={zona.nombre}
                                                            onChange={(e) => handleChange(zona.id, 'nombre', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.nombre}
                                                            helperText={validationErrors.nombre}
                                                        />
                                                        <TextField
                                                            select
                                                            label="Tipo de Suelo"
                                                            variant="outlined"
                                                            value={zona.suelo}
                                                            onChange={(e) => handleChange(zona.id, 'suelo', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.suelo}
                                                            helperText={validationErrors.suelo}
                                                        >
                                                            <MenuItem value="arena">Arena</MenuItem>
                                                            <MenuItem value="limo">Limo</MenuItem>
                                                            <MenuItem value="arcilla">Arcilla</MenuItem>
                                                        </TextField>
                                                        <TextField
                                                            label="Cantidad de Plantas"
                                                            variant="outlined"
                                                            type="number"
                                                            value={zona.cantidadPlantas}
                                                            onChange={(e) => handleChange(zona.id, 'cantidadPlantas', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.cantidadPlantas}
                                                            helperText={validationErrors.cantidadPlantas}
                                                        />
                                                        <Stack direction="row" spacing={1}>
                                                            <TextField
                                                                label="Acidez Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMin}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMin', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.acidezMin}
                                                                helperText={validationErrors.acidezMin}
                                                            />
                                                            <TextField
                                                                label="Acidez Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMax}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMax', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.acidezMax}
                                                                helperText={validationErrors.acidezMax}
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <TextField
                                                                label="Temp. Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMin}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMin', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.temperaturaMin}
                                                                helperText={validationErrors.temperaturaMin}
                                                            />
                                                            <TextField
                                                                label="Temp. Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMax}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMax', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.temperaturaMax}
                                                                helperText={validationErrors.temperaturaMax}
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <TextField
                                                                label="Humedad Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMin}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMin', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.humedadMin}
                                                                helperText={validationErrors.humedadMin}
                                                            />
                                                            <TextField
                                                                label="Humedad Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMax}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMax', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                error={!!validationErrors.humedadMax}
                                                                helperText={validationErrors.humedadMax}
                                                            />
                                                        </Stack>
                                                        <TextField
                                                            select
                                                            label="Tipo de Riego"
                                                            variant="outlined"
                                                            value={zona.riego}
                                                            onChange={(e) => handleChange(zona.id, 'riego', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.riego}
                                                            helperText={validationErrors.riego}
                                                        >
                                                            <MenuItem value="goteo">Riego por goteo</MenuItem>
                                                            <MenuItem value="aspersión">Aspersión</MenuItem>
                                                            <MenuItem value="inundación">Inundación</MenuItem>
                                                        </TextField>
                                                        <TextField
                                                            select
                                                            label="Uso de Insumos"
                                                            variant="outlined"
                                                            value={zona.insumos}
                                                            onChange={(e) => handleChange(zona.id, 'insumos', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.insumos}
                                                            helperText={validationErrors.insumos}
                                                        >
                                                            <MenuItem value="fertilizante">Fertilizante</MenuItem>
                                                            <MenuItem value="herbicida">Herbicida</MenuItem>
                                                            <MenuItem value="pesticida">Pesticida</MenuItem>
                                                        </TextField>
                                                        <TextField
                                                            label="Fecha de Cultivo"
                                                            variant="outlined"
                                                            type="date"
                                                            value={zona.fechaCultivo}
                                                            onChange={(e) => handleChange(zona.id, 'fechaCultivo', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.fechaCultivo}
                                                            helperText={validationErrors.fechaCultivo}
                                                        />
                                                        <TextField
                                                            label="Tiempo de Cultivo (días)"
                                                            variant="outlined"
                                                            type="number"
                                                            value={zona.tiempoCultivo}
                                                            onChange={(e) => handleChange(zona.id, 'tiempoCultivo', e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            error={!!validationErrors.tiempoCultivo}
                                                            helperText={validationErrors.tiempoCultivo}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleSaveZone(zona.id)}
                                                        >
                                                            Guardar
                                                        </Button>
                                                    </Stack>
                                                ) : (
                                                    <Stack spacing={1} sx={{ width: '100%' }}>
                                                        <Typography variant="h6">Nombre del Cultivo: {zona.nombre}</Typography>
                                                        <Typography variant="body1">Tipo de Suelo: {zona.suelo}</Typography>
                                                        <Typography variant="body1">Cantidad de Plantas: {zona.cantidadPlantas}</Typography>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="body1">Acidez Min: {zona.acidezMin}</Typography>
                                                            <Typography variant="body1">Acidez Max: {zona.acidezMax}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="body1">Temp. Min: {zona.temperaturaMin}</Typography>
                                                            <Typography variant="body1">Temp. Max: {zona.temperaturaMax}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="body1">Humedad Min: {zona.humedadMin}</Typography>
                                                            <Typography variant="body1">Humedad Max: {zona.humedadMax}</Typography>
                                                        </Stack>
                                                        <Typography variant="body1">Tipo de Riego: {zona.riego}</Typography>
                                                        <Typography variant="body1">Uso de Insumos: {zona.insumos}</Typography>
                                                        <Typography variant="body1">Fecha de Cultivo: {zona.fechaCultivo}</Typography>
                                                        <Typography variant="body1">Tiempo de Cultivo: {zona.tiempoCultivo} días</Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                                                            <Button variant="contained" color="primary" onClick={() => handleEditZone(zona.id)} sx={{ marginRight: 1 }}>Editar</Button>
                                                            <Button variant="contained" color="secondary" onClick={() => handleRemoveZone(zona.id)} sx={{ marginRight: 1 }}>Eliminar</Button>
                                                        </Box>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </BlankCard>
                                </Grid>
                            ))}

                            <Grid item>
                                <BlankCard>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 'auto',
                                                width: '100%',
                                                border: '2px dashed #ccc',
                                                borderRadius: '8px',
                                                padding: 2,
                                                backgroundColor: '#e3f2fd'
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddNewZone}
                                                sx={{
                                                    height: '60px',
                                                    width: '100%',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#4caf50',
                                                    '&:hover': {
                                                        backgroundColor: '#45a049',
                                                    }
                                                }}
                                            >
                                                Agregar Zona de Cultivo
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </BlankCard>
                            </Grid>
                        </Grid>
                    </DashboardCard>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default ZonaCultivo;
