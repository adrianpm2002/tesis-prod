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

const generateRandomData = (days) => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const humedades = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
        const temperaturaMin = (Math.random() * 5 + 15).toFixed(2);
        const temperaturaMax = (Math.random() * 10 + 20).toFixed(2);
        const ph = (Math.random() * 2 + 5).toFixed(2);
        const radiacion = Math.floor(Math.random() * 800 + 200);

        data.push({
            fecha: date.toISOString().split('T')[0],
            humedad: (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(2),
            humedadPorHora: humedades,
            temperatura: `${temperaturaMin} - ${temperaturaMax}`,
            ph,
            radiacion,
            comentario: '',
            anormal: false
        });
    }
    return data;
};

export default function TablaMensual() {
    const { zonas } = useZonas();
    const [selectedZone, setSelectedZone] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleZoneChange = (event) => {
        const selected = zonas.find(z => z.nombre === event.target.value);
        setSelectedZone(selected);
        const data = generateRandomData(30);
        setHistoricalData(data);
        setPage(0);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

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
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
                        <InputLabel id="zone-select-label">Selecciona una Zona</InputLabel>
                        <Select
                            labelId="zone-select-label"
                            value={selectedZone ? selectedZone.nombre : ''}
                            onChange={handleZoneChange}
                            label="Selecciona una Zona"
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            {zonas.map((zona) => (
                                <MenuItem key={zona.id} value={zona.nombre}>
                                    {zona.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                            {(rowsPerPage > 0
                                ? historicalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : historicalData
                            ).map((row, idx) => (
                                <TableRow key={idx} hover onClick={() => handleRowClick(row)}>
                                    <TableCell>{row.fecha}</TableCell>
                                    <TableCell align="right">{row.humedad}</TableCell>
                                    <TableCell align="right">{row.temperatura}</TableCell>
                                    <TableCell align="right">{row.ph}</TableCell>
                                    <TableCell align="right">{row.radiacion}</TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
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
                    <DialogTitle>Detalles del día {selectedRow?.fecha}</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">Humedad por hora</Typography>
                        <Box height={250}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={selectedRow?.humedadPorHora.map((h, i) => ({ hora: `${i}:00`, humedad: h }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hora" />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Line type="monotone" dataKey="humedad" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Comentarios"
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
