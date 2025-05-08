import React, { useState, useEffect, useMemo } from 'react';
import Card from './borrar';
import SuccessCard from './crearZona';
import {
    Button as MuiButton,
    Box,
    Typography,
    Stack,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Modal,
    TextField,
    Grid,
    TablePagination,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { useZonas } from '../../context/ZonaContext';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import styled from 'styled-components';

// ------------------------------------
// Componentes de Botones (Estilizados)
// ------------------------------------
const ParametersButton = ({ onClick }) => (
    <StyledParametersWrapper>
        <button className="button" onClick={onClick}>
            <p className="text">Parámetros</p>
        </button>
    </StyledParametersWrapper>
);

const EditButton = ({ onClick }) => (
    <StyledEditWrapper>
        <button className="edit-button" onClick={onClick}>
            <svg viewBox="0 0 512 512" className="edit-svgIcon">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
        </button>
    </StyledEditWrapper>
);

const DeleteButton = ({ onClick }) => (
    <StyledWrapper>
        <button className="delete-button" onClick={onClick}>
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
        </button>
    </StyledWrapper>
);

// ------------------------------------
// Estilos (Styled Components)
// ------------------------------------
const StyledParametersWrapper = styled.div`
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    gap: 15px;
    background-color: #181717;
    outline: 3px #181717 solid;
    outline-offset: -3px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 400ms;
    height: 40px;
  }
  .button .text {
    color: rgb(247, 247, 247);
    font-weight: 700;
    font-size: 0.9em;
    transition: 400ms;
    margin: 0;
  }
  .button:hover {
    background-color: transparent;
  }
  .button:hover .text {
    color: #181717;
  }
`;

const StyledEditWrapper = styled.div`
  .edit-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
  }
  .edit-svgIcon {
    width: 17px;
    transition-duration: 0.3s;
  }
  .edit-svgIcon path {
    fill: white;
  }
  .edit-button:hover {
    width: 120px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: rgb(4, 138, 55);
    align-items: center;
  }
  .edit-button:hover .edit-svgIcon {
    width: 20px;
    transition-duration: 0.3s;
    transform: translateY(60%);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  .edit-button::before {
    display: none;
    content: "Editar";
    color: white;
    transition-duration: 0.3s;
    font-size: 2px;
  }
  .edit-button:hover::before {
    display: block;
    padding-right: 10px;
    font-size: 13px;
    opacity: 1;
    transform: translateY(0px);
    transition-duration: 0.3s;
  }
`;

const StyledWrapper = styled.div`
  .delete-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
  }
  .delete-svgIcon {
    width: 15px;
    transition-duration: 0.3s;
  }
  .delete-svgIcon path {
    fill: white;
  }
  .delete-button:hover {
    width: 90px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: rgb(255, 69, 69);
    align-items: center;
  }
  .delete-button:hover .delete-svgIcon {
    width: 20px;
    transition-duration: 0.3s;
    transform: translateY(60%) rotate(360deg);
  }
  .delete-button::before {
    display: none;
    content: "Borrar";
    color: white;
    transition-duration: 0.3s;
    font-size: 2px;
  }
  .delete-button:hover::before {
    display: block;
    padding-right: 10px;
    font-size: 13px;
    opacity: 1;
    transform: translateY(0px);
    transition-duration: 0.3s;
  }
`;

// ------------------------------------
// Esquemas de Validación (Yup)
// ------------------------------------
const initialValues = {
    nombre: '',
    cantidadPlantas: '',
    fechaCultivo: '',
    tiempoCultivo: '',
};

const initialParametros = {
    acidezMin: '',
    acidezMax: '',
    temperaturaMin: '',
    temperaturaMax: '',
    humedadMin: '',
    humedadMax: '',
    radiacionMin: '',
    radiacionMax: '',
};

const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    cantidadPlantas: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'No puede ser un número negativo')
        .required('La cantidad de plantas es obligatoria'),
    fechaCultivo: Yup.date()
        .typeError('Debe seleccionar una fecha válida')
        .required('La fecha de cultivo es obligatoria'),
    tiempoCultivo: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'No puede ser un número negativo')
        .required('El tiempo de cultivo es obligatorio'),
});

const parametrosSchema = Yup.object({
    acidezMin: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'El pH mínimo no puede ser menor que 0')
        .max(14, 'El pH mínimo no puede ser mayor que 14')
        .required('El pH mínimo es obligatorio')
        .test('esMenorQueMax', 'El pH mínimo debe ser menor que el máximo', function (value) {
            return !this.parent.acidezMax || value < this.parent.acidezMax;
        }),
    acidezMax: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'El pH máximo no puede ser menor que 0')
        .max(14, 'El pH máximo no puede ser mayor que 14')
        .required('El pH máximo es obligatorio'),
    temperaturaMin: Yup.number()
        .typeError('Debe ser un número')
        .min(-40, 'La temperatura mínima no puede ser menor que -40°C')
        .max(40, 'La temperatura mínima no puede ser mayor que 40°C')
        .required('La temperatura mínima es obligatoria')
        .test('esMenorQueMax', 'La temperatura mínima debe ser menor que la máxima', function (value) {
            return !this.parent.temperaturaMax || value < this.parent.temperaturaMax;
        }),
    temperaturaMax: Yup.number()
        .typeError('Debe ser un número')
        .min(-40, 'La temperatura máxima no puede ser menor que -40°C')
        .max(40, 'La temperatura máxima no puede ser mayor que 40°C')
        .required('La temperatura máxima es obligatoria'),
    humedadMin: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'La humedad mínima no puede ser menor que 0%')
        .max(100, 'La humedad mínima no puede ser mayor que 100%')
        .required('La humedad mínima es obligatoria')
        .test('esMenorQueMax', 'La humedad mínima debe ser menor que la máxima', function (value) {
            return !this.parent.humedadMax || value < this.parent.humedadMax;
        }),
    humedadMax: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'La humedad máxima no puede ser menor que 0%')
        .max(100, 'La humedad máxima no puede ser mayor que 100%')
        .required('La humedad máxima es obligatoria'),
    radiacionMin: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'La radiación mínima no puede ser menor que 0 W/m²')
        .max(2000, 'La radiación mínima no puede ser mayor que 2000 W/m²')
        .required('La radiación mínima es obligatoria')
        .test('esMenorQueMax', 'La radiación mínima debe ser menor que la máxima', function (value) {
            return !this.parent.radiacionMax || value < this.parent.radiacionMax;
        }),
    radiacionMax: Yup.number()
        .typeError('Debe ser un número')
        .min(0, 'La radiación máxima no puede ser menor que 0 W/m²')
        .max(2000, 'La radiación máxima no puede ser mayor que 2000 W/m²')
        .required('La radiación máxima es obligatoria'),
});

// ------------------------------------
// Componente Principal
// ------------------------------------
const ZonaCultivo = () => {
    const { zonas, handleAddZone, handleUpdateZone, handleRemoveZone } = useZonas();
    const [openModal, setOpenModal] = useState(false);
    const [openParametrosModal, setOpenParametrosModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempBasicData, setTempBasicData] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Función para abrir el modal de confirmación
    const handleOpenDeleteModal = (id) => {
        setZoneToDelete(id);
        setOpenDeleteModal(true);
    };

    // Función para confirmar la eliminación
    const handleConfirmDelete = () => {
        if (zoneToDelete) {
            handleRemoveZone(zoneToDelete);
        }
        setOpenDeleteModal(false);
    };

    // Formulario de datos básicos
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            setTempBasicData(values);
            setOpenModal(false);
            setOpenParametrosModal(true);
        },
    });

    // Formulario de parámetros
    const parametrosFormik = useFormik({
        initialValues: initialParametros,
        validationSchema: parametrosSchema,
        onSubmit: (values) => {
            const zonaCompleta = { ...tempBasicData, ...values };
            if (editingIndex !== null) {
                handleUpdateZone(zonas[editingIndex].id, zonaCompleta);
            } else {
                handleAddZone(zonaCompleta); // Actualización en tiempo real aquí
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 3000); // Cierra después de 3 segundos
            }
            handleCloseParametrosModal();
        },
    });

    // Función para cerrar el modal de éxito
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    // Cerrar modales y resetear estados
    const handleCloseModal = () => {
        setOpenModal(false);
        formik.resetForm();
    };

    const handleCloseParametrosModal = () => {
        setOpenParametrosModal(false);
        parametrosFormik.resetForm();
        setEditingIndex(null);
        setTempBasicData(null);
    };

    // Abrir modal de edición
    const handleOpenModal = (index = null) => {
        if (index !== null) {
            const zona = zonas[index];
            formik.setValues({
                nombre: zona.nombre,
                cantidadPlantas: zona.cantidadPlantas,
                fechaCultivo: zona.fechaCultivo,
                tiempoCultivo: zona.tiempoCultivo,
            });
            setEditingIndex(index);
        } else {
            formik.resetForm();
            setEditingIndex(null);
        }
        setOpenModal(true);
    };

    // Abrir modal de parámetros
    const handleOpenParametrosModal = (index) => {
        const zona = zonas[index];
        parametrosFormik.setValues({
            acidezMin: zona.acidezMin || '',
            acidezMax: zona.acidezMax || '',
            temperaturaMin: zona.temperaturaMin || '',
            temperaturaMax: zona.temperaturaMax || '',
            humedadMin: zona.humedadMin || '',
            humedadMax: zona.humedadMax || '',
            radiacionMin: zona.radiacionMin || '',
            radiacionMax: zona.radiacionMax || '',
        });
        setEditingIndex(index);
        setOpenParametrosModal(true);
    };

    // Configuración de la tabla
    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor('nombre', { header: 'Nombre' }),
            columnHelper.accessor('cantidadPlantas', { header: 'Plantas' }),
            columnHelper.accessor('fechaCultivo', {
                header: 'Fecha de Cultivo',
                cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('es-ES') : '',
            }),
            columnHelper.accessor('tiempoCultivo', {
                header: 'Tiempo de Cultivo',
                cell: info => `${info.getValue()} días`,
            }),
            columnHelper.display({
                id: 'acciones',
                header: 'Acciones',
                cell: ({ row }) => (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <EditButton onClick={() => handleOpenModal(row.index)} />
                        <ParametersButton onClick={() => handleOpenParametrosModal(row.index)} />
                        <DeleteButton onClick={() => handleOpenDeleteModal(zonas[row.index].id)} />
                    </Stack>
                ),
            }),
        ],
        [zonas]
    );

    const table = useReactTable({
        data: zonas,
        columns, // las columnas definidas anteriormente
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5, // Tamaño de página por defecto
            },
        },
    });

    return (
        <PageContainer title="Zona de Cultivo" description="Gestión de zonas de cultivo">

            <DashboardCard title="Zonas de Cultivo">
            

                <Stack spacing={2}>
                    <MuiButton variant="contained" onClick={() => handleOpenModal()}>
                        Agregar Zona de Cultivo
                    </MuiButton>


                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableCell key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableCell>
                                        ))}
                                        
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Paginación */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={zonas.length}
                            rowsPerPage={table.getState().pagination.pageSize}
                            page={table.getState().pagination.pageIndex}
                            onPageChange={(_, page) => table.setPageIndex(page)}
                            onRowsPerPageChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        />
                    </TableContainer>
                </Stack>
            </DashboardCard>



            {/* Modal de datos básicos */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        {editingIndex !== null ? 'Editar Zona' : 'Nueva Zona'}
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                {...formik.getFieldProps('nombre')}
                                error={formik.touched.nombre && !!formik.errors.nombre}
                                helperText={formik.touched.nombre && formik.errors.nombre}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Cantidad de Plantas"
                                name="cantidadPlantas"
                                {...formik.getFieldProps('cantidadPlantas')}
                                error={formik.touched.cantidadPlantas && !!formik.errors.cantidadPlantas}
                                helperText={formik.touched.cantidadPlantas && formik.errors.cantidadPlantas}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha de Cultivo"
                                name="fechaCultivo"
                                InputLabelProps={{ shrink: true }}
                                {...formik.getFieldProps('fechaCultivo')}
                                error={formik.touched.fechaCultivo && !!formik.errors.fechaCultivo}
                                helperText={formik.touched.fechaCultivo && formik.errors.fechaCultivo}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Tiempo de Cultivo (días)"
                                name="tiempoCultivo"
                                {...formik.getFieldProps('tiempoCultivo')}
                                error={formik.touched.tiempoCultivo && !!formik.errors.tiempoCultivo}
                                helperText={formik.touched.tiempoCultivo && formik.errors.tiempoCultivo}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                            <MuiButton type="submit" variant="contained">
                                {editingIndex !== null ? 'Guardar' : 'Siguiente'}
                            </MuiButton>
                        </Stack>
                    </form>
                </Box>
            </Modal>

            {/* Modal de parámetros */}
            <Modal open={openParametrosModal} onClose={handleCloseParametrosModal}>
                <Box sx={{ ...modalStyle, maxWidth: '800px' }}>
                    <Typography variant="h6" gutterBottom>
                        {editingIndex !== null
                            ? `Parámetros: ${zonas[editingIndex]?.nombre}`
                            : 'Configurar Parámetros'}
                    </Typography>
                    <form onSubmit={parametrosFormik.handleSubmit}>
                        <Grid container spacing={3}>
                            {[
                                { label: 'Acidez Mínima (pH)', name: 'acidezMin', min: 0, max: 14, step: 0.1 },
                                { label: 'Acidez Máxima (pH)', name: 'acidezMax', min: 0, max: 14, step: 0.1 },
                                { label: 'Temperatura Mínima (°C)', name: 'temperaturaMin', min: -40, max: 40, step: 0.1 },
                                { label: 'Temperatura Máxima (°C)', name: 'temperaturaMax', min: -40, max: 40, step: 0.1 },
                                { label: 'Humedad Mínima (%)', name: 'humedadMin', min: 0, max: 100 },
                                { label: 'Humedad Máxima (%)', name: 'humedadMax', min: 0, max: 100 },
                                { label: 'Radiación Mínima (W/m²)', name: 'radiacionMin', min: 0, max: 2000 },
                                { label: 'Radiación Máxima (W/m²)', name: 'radiacionMax', min: 0, max: 2000 },
                            ].map((field, idx) => (
                                <Grid item xs={12} sm={6} key={field.name}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        type="number"
                                        {...parametrosFormik.getFieldProps(field.name)}
                                        error={parametrosFormik.touched[field.name] && !!parametrosFormik.errors[field.name]}
                                        helperText={parametrosFormik.touched[field.name] && parametrosFormik.errors[field.name]}
                                        InputProps={{
                                            inputProps: {
                                                min: field.min,
                                                max: field.max,
                                                step: field.step || 1
                                            }
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <MuiButton type="submit" variant="contained" sx={{ width: '200px' }}>
                                {editingIndex !== null ? 'Actualizar' : 'Crear Zona'}
                            </MuiButton>
                        </Box>
                    </form>
                </Box>
            </Modal>

            {/* Modal de Confirmación para Eliminar */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.5)' } }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    p: 0,
                }}>
                    <Card
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setOpenDeleteModal(false)}
                    />
                </Box>
            </Modal>

            <Modal
                open={showSuccessModal}
                onClose={handleCloseSuccessModal}
                BackdropProps={{ style: { backgroundColor: 'transparent' } }}
                sx={{
                    '& .MuiBox-root': {
                        outline: 'none',
                        maxWidth: 'fit-content' // Ajusta el ancho al contenido
                    }
                }}
            >
                <Box sx={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    p: 0,
                }}>
                    <SuccessCard onClose={handleCloseSuccessModal} />
                </Box>
            </Modal>

        </PageContainer>
    );
};



// Estilo del modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default ZonaCultivo;