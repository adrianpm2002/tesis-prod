import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {
  Typography,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useSensors } from '../../context/SensorContext';
import { useZonas } from '../../context/ZonaContext';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel
} from '@tanstack/react-table';
import { useSnackbar } from 'notistack';

// Switch personalizado con el estilo proporcionado
const StatusSwitch = styled.div`
  .switch {
    --false: #E81B1B;
    --true: #009068;
  }

  input[type=checkbox] {
    appearance: none;
    height: 2rem;
    width: 3.5rem;
    background-color: #fff;
    position: relative;
    border-radius: .2em;
    cursor: pointer;
    border: 1px solid #ddd;
  }

  input[type=checkbox]::before {
    content: '';
    display: block;
    height: 1.9em;
    width: 1.9em;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: calc(1.9em/2 + .3em);
    background-color: var(--false);
    border-radius: .2em;
    transition: .3s ease;
  }

  input[type=checkbox]:checked::before {
    background-color: var(--true);
    left: calc(100% - (1.9em/2 + .3em));
  }
`;

// Opciones para el tipo de sensor
const sensorTypes = [
  { value: 'Humedad', label: 'Humedad' },
  { value: 'Temperatura', label: 'Temperatura' },
  { value: 'Radiacion', label: 'Radiación' },
  { value: 'pH', label: 'pH' }
];

// Esquema de validación con Yup
const sensorSchema = Yup.object().shape({
  type: Yup.string().required('Seleccione un tipo de sensor'),
  model: Yup.string()
    .min(2, 'Modelo demasiado corto')
    .max(30, 'Modelo demasiado largo')
    .required('Campo requerido'),
  zonaId: Yup.string().required('Seleccione una zona'),
  isActive: Yup.boolean()
});

const Sensores = () => {
  const { sensors, loading, error, handleAddSensor, handleUpdateSensor, handleRemoveSensor } = useSensors();
  const { zonas } = useZonas();
  const { enqueueSnackbar } = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSensorId, setCurrentSensorId] = useState(null);
  const [sensorToDelete, setSensorToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({
    zona: '',
    type: '',
    status: ''
  });

  // Filtrar sensores basados en los filtros seleccionados
  const filteredSensors = useMemo(() => {
    return sensors.filter(sensor => {
      const matchesZona = !filters.zona || sensor.zonaId?.toString() === filters.zona;
      const matchesType = !filters.type || sensor.type === filters.type;
      const matchesStatus = filters.status === '' ||
        (filters.status === 'active' && sensor.isActive) ||
        (filters.status === 'inactive' && !sensor.isActive);
      return matchesZona && matchesType && matchesStatus;
    });
  }, [sensors, filters]);

  // Configuración de Formik
const formik = useFormik({
  initialValues: {
    type: '',
    model: '',
    zonaId: '',
    isActive: false
  },
  validationSchema: sensorSchema,
  onSubmit: async (values, { setSubmitting }) => {
    try {
      const sensorData = {
        type: values.type,
        model: values.model,
        zonaId: values.zonaId ? parseInt(values.zonaId) : null, // Asegúrate que sea número
        isActive: values.isActive
      };

      if (currentSensorId) {
        await handleUpdateSensor({ 
          ...sensorData,
          id: currentSensorId 
        });
        enqueueSnackbar('Sensor actualizado correctamente', { variant: 'success' });
      } else {
        await handleAddSensor({
          type: values.type,
          model: values.model,
          zonaId: values.zonaId,  // Envía el nombre correcto
          isActive: values.isActive
        });
        enqueueSnackbar('Sensor agregado correctamente', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.message || 'Error al guardar el sensor';
      enqueueSnackbar(errorMessage, { 
        variant: 'error',
        autoHideDuration: 5000 // Extiende el tiempo para leer el mensaje
      });
      console.error('Error detallado:', error); // Para depuración
    } finally {
      setSubmitting(false);
    }
  }
});

  // Función para cambiar el estado del sensor
  const toggleSensorStatus = (sensor) => {
    handleUpdateSensor({ ...sensor, isActive: !sensor.isActive });
  };

  // Definición de columnas
  const columns = useMemo(
    () => [
      {
        header: 'Tipo',
        accessorKey: 'type',
        cell: ({ getValue }) => (
          <Typography variant={isSmallScreen ? "body1" : "h6"}>{getValue()}</Typography>
        )
      },
      {
        header: 'Modelo',
        accessorKey: 'model',
        cell: ({ getValue }) => (
          <Typography variant={isSmallScreen ? "body1" : "h6"}>{getValue()}</Typography>
        )
      },
      {
        header: 'Zona',
        accessorKey: 'zona',
        cell: ({ getValue }) => (
          <Typography variant={isSmallScreen ? "body1" : "h6"}>
            {getValue() || 'No asignado'}
          </Typography>
        )
      },
      {
        header: 'Estado',
        accessorKey: 'isActive',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusSwitch>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={row.original.isActive || false}
                  onChange={() => toggleSensorStatus(row.original)}
                />
              </label>
            </StatusSwitch>
            <Typography ml={1}>
              {row.original.isActive ? 'Activo' : 'Inactivo'}
            </Typography>
          </Box>
        )
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => handleOpenDeleteModal(row.original.id)}
            >
              Eliminar
            </Button>
          </Box>
        )
      }
    ],
    [isSmallScreen]
  );

  // Configuración de la tabla
  const table = useReactTable({
    data: filteredSensors,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Función para abrir el modal de confirmación
  const handleOpenDeleteModal = (id) => {
    setSensorToDelete(id);
    setOpenDeleteModal(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      if (sensorToDelete) {
        await handleRemoveSensor(sensorToDelete);
        enqueueSnackbar('Sensor eliminado correctamente', { variant: 'success' });
      }
      setOpenDeleteModal(false);
      setSensorToDelete(null);
    } catch (error) {
      enqueueSnackbar('Error al eliminar el sensor', { variant: 'error' });
    }
  };

  const handleEdit = (sensor) => {
    setCurrentSensorId(sensor.id);
    formik.setValues({
      type: sensor.type,
      model: sensor.model,
      zonaId: sensor.zonaId ? sensor.zonaId.toString() : '',
      isActive: sensor.isActive || false
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setCurrentSensorId(null);
    formik.resetForm();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    formik.resetForm();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    table.setPageIndex(0);
  };

  const clearFilters = () => {
    setFilters({
      zona: '',
      type: '',
      status: ''
    });
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);
  if (loading && sensors.length === 0) {
    return (
      <PageContainer title="Sensores" description="Vista de sensores registrados">
        <DashboardCard title="Sensores Registrados">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <CircularProgress />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Agregar Sensor
            </Button>

            {/* Filtros */}
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-zona-label">Zona</InputLabel>
                <Select
                  labelId="filter-zona-label"
                  id="filter-zona"
                  value={filters.zona}
                  onChange={(e) => handleFilterChange('zona', e.target.value)}
                  label="Zona"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {zonas.map((zona) => (
                    <MenuItem key={zona.id} value={zona.id.toString()}>
                      {zona.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-type-label">Tipo</InputLabel>
                <Select
                  labelId="filter-type-label"
                  id="filter-type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {sensorTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-status-label">Estado</InputLabel>
                <Select
                  labelId="filter-status-label"
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                </Select>
              </FormControl>

              {(filters.zona || filters.type || filters.status) && (
                <Button onClick={clearFilters} size="small">
                  Limpiar
                </Button>
              )}
            </Stack>
          </Box>

          {/* Mostrar filtros activos */}
          {(filters.zona || filters.type || filters.status) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filtros aplicados:
              </Typography>
              <Stack direction="row" spacing={1}>
                {filters.zona && (
                  <Chip
                    label={`Zona: ${zonas.find(z => z.id.toString() === filters.zona)?.nombre}`}
                    onDelete={() => handleFilterChange('zona', '')}
                  />
                )}
                {filters.type && (
                  <Chip
                    label={`Tipo: ${sensorTypes.find(t => t.value === filters.type)?.label}`}
                    onDelete={() => handleFilterChange('type', '')}
                  />
                )}
                {filters.status && (
                  <Chip
                    label={`Estado: ${filters.status === 'active' ? 'Activos' : 'Inactivos'}`}
                    onDelete={() => handleFilterChange('status', '')}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Tabla con React Table */}
          <Paper sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e0e0e0',
                          cursor: header.column.getCanSort() ? 'pointer' : 'default'
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted()] ?? null}
                        </Box>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
              <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                variant="outlined"
                size="small"
              >
                {'<<'}
              </Button>
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                variant="outlined"
                size="small"
              >
                {'<'}
              </Button>
              <span>
                Página{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </strong>
              </span>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                variant="outlined"
                size="small"
              >
                {'>'}
              </Button>
              <Button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                variant="outlined"
                size="small"
              >
                {'>>'}
              </Button>
            </Box>
          </Paper>

          {/* Diálogo para agregar/editar con Formik */}
          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <form onSubmit={formik.handleSubmit}>
              <DialogTitle>
                {currentSensorId ? 'Editar Sensor' : 'Agregar Nuevo Sensor'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="type-label">Tipo de Sensor</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type"
                        name="type"
                        label="Tipo de Sensor"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                      >
                        {sensorTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.type && formik.errors.type && (
                        <Typography color="error" variant="caption">
                          {formik.errors.type}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="model"
                      name="model"
                      label="Modelo del Sensor"
                      value={formik.values.model}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.model && Boolean(formik.errors.model)}
                      helperText={formik.touched.model && formik.errors.model}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="zona-label">Zona Asignada</InputLabel>
                      <Select
                        labelId="zona-label"
                        id="zonaId"
                        name="zonaId"
                        label="Zona Asignada"
                        value={formik.values.zonaId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.zonaId && Boolean(formik.errors.zonaId)}
                      >
                        {zonas.map((zona) => (
                          <MenuItem key={zona.id} value={zona.id.toString()}>
                            {zona.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.zonaId && formik.errors.zonaId && (
                        <Typography color="error" variant="caption">
                          {formik.errors.zonaId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 2 }}>Estado:</Typography>
                      <StatusSwitch>
                        <label className="switch">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </label>
                      </StatusSwitch>
                      <Typography ml={1}>
                        {formik.values.isActive ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" color="primary" variant="contained">
                  Guardar
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Modal de confirmación para eliminar */}
          <Dialog
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                ¿Estás seguro que deseas eliminar este sensor? Esta acción no se puede deshacer.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color="secondary"
                variant="contained"
              >
                Confirmar Eliminación
              </Button>
            </DialogActions>
          </Dialog>
        </DashboardCard>
      </PageContainer>
    );
  }
};

export default Sensores;