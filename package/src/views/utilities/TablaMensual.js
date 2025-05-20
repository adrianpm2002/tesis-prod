import React, { useState, useMemo } from 'react';
import {
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    TableHead,
    Tooltip,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useZonas } from '../../context/ZonaContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from 'react';
import axios from 'axios';




function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {'<<'}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {'<'}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {'>'}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {'>>'}
            </IconButton>
        </Box>
    );
}


export default function TablaMensual() {
    const { zonas } = useZonas();
    const [selectedZone, setSelectedZone] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sensor-history');
                console.log('Datos que llegan al frontend:', response.data);
                setHistoricalData(response.data);
            } catch (error) {
                console.error('Error al obtener datos históricos:', error);
            }
        };

        fetchHistoricalData();
    }, []);

    const handleZoneChange = async (event) => {
        const selected = zonas.find(z => z.nombre === event.target.value);
        setSelectedZone(selected);

        try {
            const response = await axios.get(`http://localhost:5000/api/sensor-history/${selected.nombre}`);
            setHistoricalData(response.data);
        } catch (error) {
            console.error('Error al obtener datos históricos por zona:', error);
        }

        setPage(0); // Resetear la página al cambiar de zona
    };

    const handleRowClick = async (row) => {
        try {
            const fecha = row.fecha.split('T')[0]; // ✅ Extrae `YYYY-MM-DD`

            console.log("Solicitando datos para la fecha:", fecha);

            const response = await axios.get(`http://localhost:5000/api/sensor-history/${fecha}`);
            setSelectedRow({ ...row, datosPorHora: response.data });
        } catch (error) {
            console.error("Error al obtener datos por hora:", error);
        }
    };

    const [parametroSeleccionado, setParametroSeleccionado] = useState("humedad"); // 🚀 Parámetro por defecto


    const handleCloseModal = () => {
        setSelectedRow(null);
    };

    const handleComentarioChange = (e) => {
        setSelectedRow({ ...selectedRow, comentario: e.target.value });
    };

    const toggleAnormal = () => {
        setSelectedRow({ ...selectedRow, anormal: !selectedRow.anormal });
    };

    const guardarComentario = () => {
        setHistoricalData(historicalData.map(item => item.fecha === selectedRow.fecha ? selectedRow : item));
        handleCloseModal();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte Mensual - Historial de Cultivo", 14, 20);
        doc.text(`Zona: ${selectedZone?.nombre || ''}`, 14, 30);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

        autoTable(doc, {
            startY: 50,
            head: [["Fecha", "Humedad", "Temperatura", "pH", "Radiación", "Comentario"]],
            body: historicalData.map(row => [
                row.fecha,
                row.humedad,
                row.temperatura,
                row.ph,
                row.radiacion,
                row.comentario
            ])
        });

        doc.save("reporte_mensual.pdf");
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - historicalData.length) : 0;



    return (
        <PageContainer title="Historial" description="Visualización del historial de zonas de cultivo">
            <DashboardCard title="Historial de Cultivo">
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>

                    <Button variant="contained" onClick={exportPDF}>Generar Reporte</Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="tabla historial">
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell align="right">Humedad</TableCell>
                                <TableCell align="right">Temperatura</TableCell>
                                <TableCell align="right">pH</TableCell>
                                <TableCell align="right">Radiación</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historicalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                                <TableRow key={index} hover onClick={() => handleRowClick(data)}>
                                    <TableCell>{data.fecha ? data.fecha.split('T')[0] : 'Sin fecha'}</TableCell>
                                    <TableCell align="right">{data.humedad ?? 'N/A'}</TableCell>
                                    <TableCell align="right">{data.temperatura_min ?? 'N/A'} - {data.temperatura_max ?? 'N/A'}</TableCell>
                                    <TableCell align="right">{data.ph ?? 'N/A'}</TableCell>
                                    <TableCell align="right">{data.radiacion ?? 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={historicalData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'Filas por página' },
                                        native: true,
                                    }}
                                    labelRowsPerPage="Filas por página"
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                    onPageChange={(event, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPage(parseInt(event.target.value, 10));
                                        setPage(0);
                                    }}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>

                <Dialog open={!!selectedRow} onClose={handleCloseModal} fullWidth maxWidth="md">
                    <DialogTitle>Detalles del día {new Date(selectedRow?.fecha).toLocaleDateString()}</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">Valores por Hora</Typography>
                        <Box height={250}>

                            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: 1, mt: 2 }}>
                                <Button variant={parametroSeleccionado === "humedad" ? "contained" : "outlined"} size="small" sx={{ width: "auto", height: "25px" }} onClick={() => setParametroSeleccionado("humedad")}>Humedad</Button>
                                <Button variant={parametroSeleccionado === "temperatura" ? "contained" : "outlined"} size="small" sx={{ width: "auto", height: "25px" }} onClick={() => setParametroSeleccionado("temperatura")}>Temperatura</Button>
                                <Button variant={parametroSeleccionado === "ph" ? "contained" : "outlined"} size="small" sx={{ width: "auto", height: "25px" }} onClick={() => setParametroSeleccionado("ph")}>pH</Button>
                                <Button variant={parametroSeleccionado === "radiacion" ? "contained" : "outlined"} size="small" sx={{ width: "auto", height: "25px" }} onClick={() => setParametroSeleccionado("radiacion")}>Radiación Solar</Button>
                            </Box>

                            <ResponsiveContainer width="100%" height="100%">
                                {selectedRow?.datosPorHora?.length > 0 ? (

                                    <LineChart data={selectedRow.datosPorHora.map((dato) => ({
                                        hora: `${dato.hora}:00`,
                                        valor: dato[parametroSeleccionado]
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hora" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>

                                ) : (
                                    <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 2 }}>
                                        No hay datos por hora disponibles.
                                    </Typography>
                                )}



                            </ResponsiveContainer>

                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Observaciones del día"
                            placeholder="Anota eventos importantes, condiciones del clima, posibles problemas detectados o cualquier información relevante para el análisis futuro."
                            value={selectedRow?.comentario || ''}
                            onChange={handleComentarioChange}
                            sx={{ mt: 2 }}
                        />
                        <Button variant="outlined" color={selectedRow?.anormal ? "error" : "primary"} onClick={toggleAnormal} sx={{ mt: 2 }}>
                            {selectedRow?.anormal ? "Desmarcar como Anormal" : "Marcar como Anormal"}
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={guardarComentario} variant="contained">Guardar</Button>
                    </DialogActions>
                </Dialog>
            </DashboardCard>
        </PageContainer>
    );

}
