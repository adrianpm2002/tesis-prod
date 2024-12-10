import React, { useState, useEffect } from 'react';
import { Grid, CardContent, Button, Box, Typography, Stack, TextField, MenuItem } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';


const Datos = () => {
    <h1> Hola </h1>
}

const ZonaCultivo = () => {
    const [zonas, setZonas] = useState(() => {
        const savedZonas = localStorage.getItem('zonas');
        return savedZonas ? JSON.parse(savedZonas) : [];

    });
    const [page, setPage] = useState('ZonaCultivo');
    const [editingZone, setEditingZone] = useState(null);
    

    useEffect(() => {
        localStorage.setItem('zonas', JSON.stringify(zonas));
    }, [zonas]);

    const handleAddZone = () => {
        setZonas([...zonas, { id: zonas.length + 1, nombre: '', suelo: '', acidezMin: '', acidezMax: '', temperaturaMin: '', temperaturaMax: '', humedadMin: '', humedadMax: '', riego: '', insumos: '' }]);
    };

    const handleEditZone = (id) => {
        setEditingZone(id);
    };

    const handleDeleteZone = (id) => {
        setZonas(zonas.filter(zona => zona.id !== id));
        if (editingZone === id) setEditingZone(null);
    };

    

    const handleChange = (id, field, value) => {
        setZonas(zonas.map(zona => zona.id === id ? { ...zona, [field]: value } : zona));
    };

    const getContent = () => {
        if (page == 'ZonaCultivo') 
        return <ZonaCultivo/>
        else if (page == 'Datos')
        return <Datos/>
    }

    const toPage = page => event => {
        event.preventDefault();
        setPage(page)
    }

    return (
        <PageContainer title="Zona de Cultivo" description="Gestión de zonas de cultivo">
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    <DashboardCard title="Zonas de Cultivo">
                        <Grid container spacing={3}>
                            {zonas.map(zona => (
                                <Grid item key={zona.id}>
                                    <BlankCard>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    height: 550,
                                                    width: 400,
                                                    border: '2px dashed #ccc',
                                                    borderRadius: '8px',
                                                    position: 'relative',
                                                    padding: 2
                                                }}
                                            >
                                                {editingZone === zona.id ? (
                                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                                        <TextField
                                                            label="Nombre del Cultivo"
                                                            variant="outlined"
                                                            value={zona.nombre}
                                                            onChange={(e) => handleChange(zona.id, 'nombre', e.target.value)}
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            select
                                                            label="Tipo de Suelo"
                                                            variant="outlined"
                                                            value={zona.suelo}
                                                            onChange={(e) => handleChange(zona.id, 'suelo', e.target.value)}
                                                            fullWidth
                                                        >
                                                            <MenuItem value="arena">Arena</MenuItem>
                                                            <MenuItem value="limo">Limo</MenuItem>
                                                            <MenuItem value="arcilla">Arcilla</MenuItem>
                                                        </TextField>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Acidez Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMin}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMin', e.target.value)}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Acidez Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMax}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMax', e.target.value)}
                                                                fullWidth
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Temperatura Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMin}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMin', e.target.value)}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Temperatura Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMax}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMax', e.target.value)}
                                                                fullWidth
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Humedad Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMin}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMin', e.target.value)}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Humedad Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMax}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMax', e.target.value)}
                                                                fullWidth
                                                            />
                                                        </Stack>
                                                        <TextField
                                                            select
                                                            label="Tipo de Riego"
                                                            variant="outlined"
                                                            value={zona.riego}
                                                            onChange={(e) => handleChange(zona.id, 'riego', e.target.value)}
                                                            fullWidth
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
                                                        >
                                                            <MenuItem value="fertilizante">Fertilizante</MenuItem>
                                                            <MenuItem value="herbicida">Herbicida</MenuItem>
                                                            <MenuItem value="pesticida">Pesticida</MenuItem>
                                                        </TextField>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => setEditingZone(null)}
                                                        >
                                                            Guardar
                                                        </Button>
                                                    </Stack>
                                                ) : (


                                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                                        <TextField
                                                            label="Nombre del Cultivo"
                                                            variant="outlined"
                                                            value={zona.nombre}
                                                            onChange={(e) => handleChange(zona.id, 'nombre', e.target.value)}
                                                            fullWidth
                                                            InputProps={{ readOnly: true, style: { cursor: 'default' } }}

                                                        />
                                                        <TextField
                                                            select
                                                            label="Tipo de Suelo"
                                                            variant="outlined"
                                                            value={zona.suelo}
                                                            onChange={(e) => handleChange(zona.id, 'suelo', e.target.value)}
                                                            fullWidth
                                                            InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                        >
                                                            <MenuItem value="arena">Arena</MenuItem>
                                                            <MenuItem value="limo">Limo</MenuItem>
                                                            <MenuItem value="arcilla">Arcilla</MenuItem>
                                                        </TextField>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Acidez Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMin}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMin', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                            <TextField
                                                                label="Acidez Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.acidezMax}
                                                                onChange={(e) => handleChange(zona.id, 'acidezMax', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Temperatura Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMin}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMin', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                            <TextField
                                                                label="Temperatura Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.temperaturaMax}
                                                                onChange={(e) => handleChange(zona.id, 'temperaturaMax', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="Humedad Min"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMin}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMin', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                            <TextField
                                                                label="Humedad Max"
                                                                variant="outlined"
                                                                type="number"
                                                                value={zona.humedadMax}
                                                                onChange={(e) => handleChange(zona.id, 'humedadMax', e.target.value)}
                                                                fullWidth
                                                                InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                            />
                                                        </Stack>
                                                        <TextField
                                                            select
                                                            label="Tipo de Riego"
                                                            variant="outlined"
                                                            value={zona.riego}
                                                            onChange={(e) => handleChange(zona.id, 'riego', e.target.value)}
                                                            fullWidth
                                                            InputProps={{ readOnly: true, style: { cursor: 'default' } }}
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
                                                            InputProps={{ readOnly: true, style: { cursor: 'default' } }}
                                                        >
                                                            <MenuItem value="fertilizante">Fertilizante</MenuItem>
                                                            <MenuItem value="herbicida">Herbicida</MenuItem>
                                                            <MenuItem value="pesticida">Pesticida</MenuItem>
                                                        </TextField>
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                                            <Button variant="contained" color="primary" onClick={() => handleEditZone(zona.id)} sx={{ marginRight: 1 }} > Editar </Button>
                                                            <Button variant="contained" color="secondary" onClick={() => handleDeleteZone(zona.id)} sx={{ marginRight: 1 }} > Eliminar </Button>
                                                            <a href='#' onClick={toPage('Datos')}>
                                                                Mostrar Datos
                                                            </a>
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
                                                height: 500,
                                                width: 400,
                                                border: '2px dashed #ccc',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddZone}
                                                sx={{ height: '100%', width: '100%' }}
                                            >
                                                Agregar Zona
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

