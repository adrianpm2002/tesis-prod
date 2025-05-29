import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Historial.css';
import { useZonas } from '../../context/ZonaContext';
import { useActivities } from '../../context/ActivitiesContext';
import { activitiesService } from '../../services/activitiesService';









// Iconos SVG personalizados
const AutoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#42a5f5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
  </svg>
);

const ManualIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffa726">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff9800">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2zm0 8h-2v2h2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f44336">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const SeedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4caf50">
    <path d="M17.2 3c.7 0 1.4.3 1.9.8.5.5.8 1.1.8 1.9 0 .7-.3 1.4-.8 1.9L12 14.9l-1.4-1.4L17.2 5c.3-.3.3-.7 0-1-.3-.3-.7-.3-1 0l-6.6 6.6-1.4-1.4L15 3.8c.5-.5 1.2-.8 1.9-.8M12 17.5l-1.4-1.4-6.6 6.6c-.3.3-.7.3-1 0-.3-.3-.3-.7 0-1l6.6-6.6-1.4-1.4-6.6 6.6c-.5.5-.8 1.2-.8 1.9 0 .7.3 1.4.8 1.9.5.5 1.1.8 1.9.8.7 0 1.4-.3 1.9-.8l6.6-6.6z" />
  </svg>
);

const HarvestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#8d6e63">
    <path d="M12 3c-4.97 0-9 3.19-9 7.1 0 2.13 1.22 4.04 3.11 5.22l-.93 1.61c-.15.26-.05.59.21.74.26.15.59.05.74-.21l.96-1.66C8.57 16.47 9 15.28 9 14.1c0-1.15.4-2.29 1.1-3.19l1.66 1.11c-.11.18-.21.36-.31.55-.36.69-.55 1.45-.55 2.23 0 .78.19 1.54.55 2.23.36.69.87 1.3 1.51 1.78l-1.36 2.35c-.15.26-.05.59.21.74.08.04.17.07.26.07.19 0 .38-.1.48-.28l1.4-2.42c.78.37 1.66.58 2.58.58 4.97 0 9-3.19 9-7.1 0-3.91-4.03-7.1-9-7.1zm0 1c4.41 0 8 2.69 8 6.1 0 3.41-3.59 6.1-8 6.1s-8-2.69-8-6.1c0-3.41 3.59-6.1 8-6.1z" />
  </svg>
);

// Tipos de actividades
const TIPOS_ACTIVIDAD = [
  { value: 'riego', label: 'Riego', color: '#42a5f5' },
  { value: 'fertilizacion', label: 'Fertilización', color: '#66bb6a' },
  { value: 'control_plagas', label: 'Control de Plagas', color: '#ef5350' },
  { value: 'podas', label: 'Podas', color: '#ab47bc' },
  { value: 'deshierbe', label: 'Deshierbe', color: '#ffa726' }
];







export default function Calendario() {


  const { activities, addActivity, deleteActivity, fetchActivities } = useActivities();

  const [date, setDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { zonas, zonaSeleccionada, setZonaSeleccionada } = useZonas();
  const [tipoActividad, setTipoActividad] = useState('');
  const [horaActividad, setHoraActividad] = useState('08:00');
  const [actividad, setActividad] = useState('');
  const [producto, setProducto] = useState('');
  const [automatico, setAutomatico] = useState(false);
  const [descripcionTipo, setDescripcionTipo] = useState('');

  useEffect(() => {
    if (zonaSeleccionada) {
      fetchActivities(zonaSeleccionada).then((actividades) => {
        
      });
    }
  }, [zonaSeleccionada, fetchActivities]);



  const getByZona = async (zonaId) => {
    try {
      const response = await axios.get(`${API_URL}/${zonaId}`, getAuthHeader());

      if (response.status === 404) {
        console.log("⚠ No hay actividades registradas para esta zona.");
        return []; // ✅ Si la API devuelve 404, maneja la respuesta con un array vacío
      }

      return response.data;
    } catch (error) {
      console.error("🚨 Error al obtener actividades:", error);
      throw handleApiError(error);
    }
  };

  


  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
  };

  const handleOpenModal = (date) => {
    if (!zonaSeleccionada) return;
  
    const zona = zonas.find(z => z.id === zonaSeleccionada);
    if (!zona) return;
  
    const { fechaSiembra, fechaCosecha } = getCultivoInfo(zona) || {};
    if (!fechaSiembra || !fechaCosecha) return;
  
    if (date < fechaSiembra || date > fechaCosecha) {
      console.warn("⚠ No se pueden agregar actividades fuera del período de cultivo.");
      return;
    }
  
    setSelectedDate(date);
    setOpenModal(true);
  };
  

  const isAfterHarvest = (date) => {
    if (!zonaSeleccionada) return false;

    const zona = zonas.find(z => z.id === zonaSeleccionada);
    if (!zona || !zona.fechaCultivo || !zona.tiempoCultivo) return false;

    const fechaSiembra = new Date(zona.fechaCultivo);
    const tiempoCultivo = parseInt(zona.tiempoCultivo) || 0;
    const fechaCosecha = new Date(fechaSiembra);
    fechaCosecha.setDate(fechaSiembra.getDate() + tiempoCultivo);

    return date > fechaCosecha;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setActividad('');
    setTipoActividad('');
    setProducto('');
    setAutomatico(false);
    setDescripcionTipo('');
    setSelectedDate(null);
  };

  const handleOpenDeleteModal = (activity, e) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedActivity(null);
  };

  const handleConfirmDelete = () => {
    if (selectedActivity) {
      
      deleteActivity(selectedActivity.id);
      handleCloseDeleteModal();
    }
  };

  const handleActividadChange = (e) => {
    setActividad(e.target.value);
  };

  const handleZonaChange = (event) => {
    setZonaSeleccionada(event.target.value);
  };

  const handleTipoActividadChange = (e) => {
    const tipo = e.target.value;
    setTipoActividad(tipo);

    const tipoSeleccionado = TIPOS_ACTIVIDAD.find(t => t.value === tipo);
    setDescripcionTipo(tipoSeleccionado?.descripcion || '');

    if (tipo === 'riego') {
      setAutomatico(true);
    } else {
      setAutomatico(false);
    }
  };

  const handleGuardarActividad = async () => {
    const nuevaActividad = {
      date: selectedDate,
      hora: horaActividad,
      zona_id: zonaSeleccionada,
      tipoActividad,
      descripcion: actividad,
      producto,
      automatico
    };

    try {
      await activitiesService.create(nuevaActividad); // 🚀 Guardar en la BD
      fetchActivities(zonaSeleccionada); // 🔄 Recargar actividades desde la API
      handleCloseModal(); // 🔄 Cerrar modal después de guardar
    } catch (error) {
      console.error('Error al guardar actividad:', error);
    }
  };


  const getCultivoInfo = (zona) => {
    if (!zona || !zona.fecha_cultivo || !zona.tiempo_cultivo) {
      console.warn("⚠ No se encontraron datos de siembra/cosecha para la zona:", zona);
      return { fechaSiembra: null, fechaCosecha: null };
    }
  
    const fechaSiembra = new Date(zona.fecha_cultivo); // ✅ Tomar el valor correctamente
    if (isNaN(fechaSiembra.getTime())) {
      console.error("❌ Error al convertir la fecha de cultivo:", zona.fecha_cultivo);
      return { fechaSiembra: null, fechaCosecha: null };
    }
  
    const fechaCosecha = new Date(fechaSiembra);
    fechaCosecha.setDate(fechaSiembra.getDate() + parseInt(zona.tiempo_cultivo));
  
    
    return { fechaSiembra, fechaCosecha };
  };
  
  const getDaysToHarvest = (date) => {
    if (!zonaSeleccionada) return null;

    const zona = zonas.find(z => z.id === zonaSeleccionada);
    if (!zona || !zona.fechaCultivo || !zona.tiempoCultivo) return null;

    const { fechaCosecha } = getCultivoInfo(zona) || {};
    if (!fechaCosecha) return null;

    const diffTime = fechaCosecha - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} días para cosecha`;
    if (diffDays === 0) return '¡Día de cosecha!';
    return `Cosecha pasada hace ${Math.abs(diffDays)} días`;
  };

  const getTileContent = ({ date, view }) => {
    if (view !== 'month' || !zonaSeleccionada) return null;

    

    const zona = zonas.find((z) => z.id === zonaSeleccionada);
    if (!zonaSeleccionada || !activities) return null;

    const { fechaSiembra, fechaCosecha } = getCultivoInfo(zona) || { fechaSiembra: null, fechaCosecha: null };

    // ✅ Filtra actividades del día con comparación correcta de fechas
    const actividadesDia = activities.filter((act) => {
      const actDate = new Date(act.date);
      return (
        act.zona_id === zonaSeleccionada &&
        actDate.getFullYear() === date.getFullYear() &&
        actDate.getMonth() === date.getMonth() &&
        actDate.getDate() === date.getDate()
      );
    });


    // 🌱 Cultivado (inicio del ciclo)
    if (fechaSiembra && fechaSiembra.getFullYear() === date.getFullYear() &&
    fechaSiembra.getMonth() === date.getMonth() &&
    fechaSiembra.getDate() === date.getDate()) {
    return (
        <Tooltip title={<div><strong>Día de Cultivo Iniciado</strong><Divider sx={{ my: 1 }} /></div>}>
            <div className="special-day-icon"><SeedIcon /></div>
        </Tooltip>
    );
}


    // 🌾 Cosecha
    if (fechaCosecha && fechaCosecha.getFullYear() === date.getFullYear() &&
    fechaCosecha.getMonth() === date.getMonth() &&
    fechaCosecha.getDate() === date.getDate()) {
    return (
        <Tooltip title={<div><strong>Día de Cosecha</strong><Divider sx={{ my: 1 }} /></div>}>
            <div className="special-day-icon"><HarvestIcon /></div>
        </Tooltip>
    );
}

    // Días de cultivo intermedios
if (fechaSiembra && fechaCosecha && fechaSiembra.getTime() < date.getTime() && date.getTime() < fechaCosecha.getTime()) {
  return (
    <div className="tile-content-wrapper">
      <div className="entre-dias"></div> {/* ✅ Días de cultivo */}
      <div className="activity-indicators">
        {actividadesDia.map((act, index) => {
          const tipoInfo = TIPOS_ACTIVIDAD.find(t => t.value === act.tipoactividad);
          return (
            <Tooltip
                key={`actividad-${act.id || index}`}
                title={
                  <div style={{ padding: '10px', maxWidth: '250px' }}>
                    <strong>{tipoInfo?.label || 'Actividad desconocida'}</strong>
                    <Divider sx={{ my: 1 }} />
                    <div>Hora: {act.hora}</div>
                    <div>Descripción: {act.descripcion}</div>
                    {act.producto ? <div>Producto: {act.producto}</div> : null}
                    <div>Tipo: {act.automatico ? 'Automático' : 'Manual'}</div>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Evita que el Tooltip se cierre al hacer clic
                        handleOpenDeleteModal(act, e);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Eliminar
                    
                    </Button>
                  </div>
                }
                sx={{ maxWidth: 250 }} // ✅ Limita el tamaño para evitar que se corte
              >
                <span>
                  {act.automatico ? <AutoIcon /> : <ManualIcon />}
                </span>
              </Tooltip>
          );
        })}
      </div>
    </div>
  );
}



    // ✅ Mostrar actividades del día
    if (actividadesDia.length > 0) {
      return (
        <div className="activity-indicators">
          {actividadesDia.map((act, index) => {
            const tipoInfo = TIPOS_ACTIVIDAD.find(t => t.value === act.tipoActividad || t.value === act.tipoactividad);
           

            return (
              <Tooltip
                key={`actividad-${act.id || index}`}
                title={
                  <div style={{ padding: '10px', maxWidth: '250px' }}>
                    <strong>{tipoInfo?.label || 'Actividad desconocida'}</strong>
                    <Divider sx={{ my: 1 }} />
                    <div>Hora: {act.hora}</div>
                    <div>Descripción: {act.descripcion}</div>
                    {act.producto ? <div>Producto: {act.producto}</div> : null}
                    <div>Tipo: {act.automatico ? 'Automático' : 'Manual'}</div>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Evita que el Tooltip se cierre al hacer clic
                        handleOpenDeleteModal(act, e);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Eliminar
                    </Button>
                  </div>
                }
                sx={{ maxWidth: 250 }} // ✅ Limita el tamaño para evitar que se corte
              >
                <span>
                  {act.automatico ? <AutoIcon /> : <ManualIcon />}
                </span>
              </Tooltip>

            );
          })}
        </div>
      );
    }

    return null;
  };




  const getTileClassName = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classNames = [];

    // Día actual
    if (date.toDateString() === today.toDateString()) {
      classNames.push('current-day');
    }

    // Deshabilitar días pasados o después de cosecha
    if ((date < today || isAfterHarvest(date)) && view === 'month') {
      return 'disabled-day';
    }

    const zona = zonas.find((z) => z.id === zonaSeleccionada);
    if (!zona) return '';

    const { fechaSiembra, fechaCosecha } = getCultivoInfo(zona) || {};

    // Día actual - solo borde
    if (date.toDateString() === today.toDateString()) {

      return 'current-day ';
    }

    if (fechaSiembra?.toDateString() === date.toDateString()) {
      return 'siembra-day';
    }

    if (fechaCosecha?.toDateString() === date.toDateString()) {
      return 'cosecha-day';
    }

    if (fechaSiembra && fechaCosecha && fechaSiembra < date && date < fechaCosecha) {
      return 'entre-dias';
    }

    return classNames.join(' ');
  };

  const getTileProps = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (view === 'month' && date.toDateString() === today.toDateString()) {
      return {
        'data-tooltip': `Hoy - ${getDaysToHarvest(date) || ''}`
      };
    }

    return {};
  };

  const tipoSeleccionado = TIPOS_ACTIVIDAD.find(t => t.value === tipoActividad);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="green">
        Agenda de Cultivo
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar Zona de Cultivo</InputLabel>
        <Select
          value={zonaSeleccionada}
          onChange={handleZonaChange}
          label="Seleccionar Zona de Cultivo"
        >
          {zonas.map((zona) => (
            <MenuItem key={zona.id} value={zona.id}>
              {zona.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Calendar
          onChange={handleDateChange}
          value={date}
          onClickDay={handleOpenModal}
          tileClassName={getTileClassName}
          tileContent={getTileContent}
          tileProps={getTileProps}
          locale="es-ES"
          tileDisabled={({ date, view }) => {
            if (view !== 'month') return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || isAfterHarvest(date);
          }}
        />
      </Box>

      {/* Leyenda */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip icon={<SeedIcon />} label="Siembra" size="small" />
        <Chip icon={<HarvestIcon />} label="Cosecha" size="small" />
        <Chip icon={<AutoIcon />} label="Automático" size="small" />
        <Chip icon={<ManualIcon />} label="Manual" size="small" />
      </Box>

      {/* Modal para agregar actividad */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Agregar Actividad para {selectedDate?.toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo de Actividad</InputLabel>
            <Select
              value={tipoActividad}
              onChange={handleTipoActividadChange}
              label="Tipo de Actividad"
            >
              {TIPOS_ACTIVIDAD.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {descripcionTipo && (
            <Box sx={{ mb: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {descripcionTipo}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Hora de la actividad"
            type="time"
            value={horaActividad}
            onChange={(e) => setHoraActividad(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {tipoSeleccionado?.requiereProducto && (
            <TextField
              fullWidth
              label={tipoSeleccionado.productoLabel}
              variant="outlined"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Descripción detallada"
            variant="outlined"
            value={actividad}
            onChange={handleActividadChange}
            sx={{ mb: 2 }}
            multiline
            rows={3}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={automatico}
                onChange={(e) => setAutomatico(e.target.checked)}
                disabled={tipoActividad !== 'riego'}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Ejecución automática
                {tipoActividad === 'riego' ? (
                  <Tooltip title="El riego puede programarse para ejecución automática">
                    <span><AutoIcon /></span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Esta actividad requiere ejecución manual">
                    <span><WarningIcon /></span>
                  </Tooltip>
                )}
              </Box>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleGuardarActividad}
            disabled={!tipoActividad || !actividad}
          >
            Guardar Actividad
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas eliminar esta actividad?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}