import React, { useState } from 'react';
import { Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useSensors } from '../../context/SensorContext';

const Sensores = () => {
  const { sensors, handleAddSensor, handleUpdateSensor, handleRemoveSensor } = useSensors();
  const [isAdding, setIsAdding] = useState(false);
  const [currentSensor, setCurrentSensor] = useState({ id: null, name: '', model: '' });

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
        <Button variant="contained" color="primary" onClick={() => setIsAdding(true)}>
          Agregar Sensor
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Nombre del Sensor</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Modelo</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Estado</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map(sensor => (
                <TableRow key={sensor.id}>
                  <TableCell>
                    {currentSensor.id === sensor.id ? (
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre del Sensor"
                        type="text"
                        fullWidth
                        value={currentSensor.name}
                        onChange={(e) => setCurrentSensor({ ...currentSensor, name: e.target.value })}
                      />
                    ) : (
                      <Typography variant="h6">{sensor.name}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {currentSensor.id === sensor.id ? (
                      <TextField
                        margin="dense"
                        label="Modelo del Sensor"
                        type="text"
                        fullWidth
                        value={currentSensor.model}
                        onChange={(e) => setCurrentSensor({ ...currentSensor, model: e.target.value })}
                      />
                    ) : (
                      <Typography variant="h6">{sensor.model}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                      {sensor.isActive ? 'Encendido' : 'Apagado'}
                    </Typography>
                    <div
                      style={{
                        display: 'inline-block',
                      }}
                    >
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
                          width: '4rem',
                          height: '2rem',
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
                            width: '2rem',
                            height: '2rem',
                            backgroundColor: '#fdffff',
                            content: '""',
                            borderRadius: '50%',
                            boxShadow: 'inset 0px 0px 0px 1px #000',
                            transform: sensor.isActive ? 'translateX(2rem)' : 'translateX(0)',
                          }}
                        ></span>
                      </label>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {currentSensor.id === sensor.id ? (
                      <>
                        <Button variant="outlined" color="primary" onClick={handleSave}>
                          Guardar
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit(sensor)}>
                          Modificar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(sensor.id)}>
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
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Nombre del Sensor"
                      type="text"
                      fullWidth
                      value={currentSensor.name}
                      onChange={(e) => setCurrentSensor({ ...currentSensor, name: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      margin="dense"
                      label="Modelo del Sensor"
                      type="text"
                      fullWidth
                      value={currentSensor.model}
                      onChange={(e) => setCurrentSensor({ ...currentSensor, model: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                      Apagado
                    </Typography>
                    <div
                      style={{
                        display: 'inline-block',
                      }}
                    >
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
                          width: '4rem',
                          height: '2rem',
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
                            width: '2rem',
                            height: '2rem',
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
                  <TableCell align="right">
                    <Button variant="outlined" color="primary" onClick={handleSave}>
                      Guardar
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
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









