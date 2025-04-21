import React, { useState } from 'react';
import { Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery, Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useSensors } from '../../context/SensorContext';


const Sensores = () => {
  const { sensors, handleAddSensor, handleUpdateSensor, handleRemoveSensor } = useSensors();
  const [isAdding, setIsAdding] = useState(false);
  const [currentSensor, setCurrentSensor] = useState({ id: null, name: '', model: '' });
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleSave = () => {
    if (currentSensor.id) {
      handleUpdateSensor(currentSensor);
    } else {
      handleAddSensor(currentSensor);
    }
    setIsAdding(false);
    setCurrentSensor({ id: null, name: '', model: '' });
  };

  const handleDelete = (id) => {
    handleRemoveSensor(id);
  };

  const handleEdit = (sensor) => {
    setCurrentSensor(sensor);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCurrentSensor({ id: null, name: '', model: '' });
  };

  const toggleSensorStatus = (sensor) => {
    handleUpdateSensor({ ...sensor, isActive: !sensor.isActive });
  };

  return (
    <PageContainer title="Sensores" description="Vista de sensores registrados">
      <DashboardCard title="Sensores Registrados">
        <Button variant="contained" color="primary" onClick={() => setIsAdding(true)} style={{ marginBottom: '1rem' }}>
          Agregar Sensor
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant={isSmallScreen ? "body1" : "h6"}>Nombre del Sensor</Typography>
                </TableCell>
                {!isSmallScreen && (
                  <TableCell>
                    <Typography variant="h6">Modelo</Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant={isSmallScreen ? "body1" : "h6"}>Estado</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant={isSmallScreen ? "body1" : "h6"}>Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map(sensor => (
                <TableRow key={sensor.id}>
                  <TableCell>
                    {currentSensor.id === sensor.id ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre del Sensor"
                            type="text"
                            fullWidth
                            value={currentSensor.name}
                            onChange={(e) => setCurrentSensor({ ...currentSensor, name: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="dense"
                            label="Modelo del Sensor"
                            type="text"
                            fullWidth
                            value={currentSensor.model}
                            onChange={(e) => setCurrentSensor({ ...currentSensor, model: e.target.value })}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography variant={isSmallScreen ? "body1" : "h6"}>{sensor.name}</Typography>
                    )}
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell>
                      {currentSensor.id === sensor.id ? null : (
                        <Typography variant="h6">{sensor.model}</Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                      {sensor.isActive ? 'Encendido' : 'Apagado'}
                    </Typography>
                    <div style={{ display: 'inline-block' }}>
                      <input
                        type="checkbox"
                        checked={sensor.isActive}
                        onChange={() => toggleSensorStatus(sensor)}
                        id={`switch-${sensor.id}`}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor={`switch-${sensor.id}`}
                        style={{
                          backgroundColor: sensor.isActive ? '#00a878' : '#fe5e41',
                          width: isSmallScreen ? '3rem' : '4rem',
                          height: isSmallScreen ? '1.5rem' : '2rem',
                          borderRadius: '2rem',
                          display: 'inline-block',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            transition: '.2s',
                            display: 'block',
                            position: 'absolute',
                            width: isSmallScreen ? '1.5rem' : '2rem',
                            height: isSmallScreen ? '1.5rem' : '2rem',
                            backgroundColor: '#fdffff',
                            content: '""',
                            borderRadius: '50%',
                            boxShadow: 'inset 0px 0px 0px 1px #000',
                            transform: sensor.isActive ? 'translateX(1.5rem)' : 'translateX(0)',
                          }}
                        ></span>
                      </label>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {currentSensor.id === sensor.id ? (
                      <>
                        <Button variant="outlined" color="primary" onClick={handleSave} size={isSmallScreen ? "small" : "medium"}>
                          Guardar
                        </Button>
                        <Button variant="outlined" onClick={handleCancel} size={isSmallScreen ? "small" : "medium"}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit(sensor)} size={isSmallScreen ? "small" : "medium"}>
                          Modificar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(sensor.id)} size={isSmallScreen ? "small" : "medium"}>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Nombre del Sensor"
                          type="text"
                          fullWidth
                          value={currentSensor.name}
                          onChange={(e) => setCurrentSensor({ ...currentSensor, name: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="dense"
                          label="Modelo del Sensor"
                          type="text"
                          fullWidth
                          value={currentSensor.model}
                          onChange={(e) => setCurrentSensor({ ...currentSensor, model: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell>
                      <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                        Apagado
                      </Typography>
                      <div style={{ display: 'inline-block' }}>
                        <input
                          type="checkbox"
                          disabled
                          id="new-sensor-switch"
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="new-sensor-switch"
                          style={{
                            backgroundColor: '#fe5e41',
                            width: isSmallScreen ? '3rem' : '4rem',
                            height: isSmallScreen ? '1.5rem' : '2rem',
                            borderRadius: '2rem',
                            display: 'inline-block',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              transition: '.2s',
                              display: 'block',
                              position: 'absolute',
                              width: isSmallScreen ? '1.5rem' : '2rem',
                              height: isSmallScreen ? '1.5rem' : '2rem',
                              backgroundColor: '#fdffff',
                              content: '""',
                              borderRadius: '50%',
                              boxShadow: 'inset 0px 0px 0px 1px #000',
                              transform: 'translateX(0)',
                            }}
                          ></span>
                        </label>
                      </div>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Button variant="outlined" color="primary" onClick={handleSave} size={isSmallScreen ? "small" : "medium"}>
                      Guardar
                    </Button>
                    <Button variant="outlined" onClick={handleCancel} size={isSmallScreen ? "small" : "medium"}>
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {sensors.length === 0 && !isAdding && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No hay sensores registrados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default Sensores;










