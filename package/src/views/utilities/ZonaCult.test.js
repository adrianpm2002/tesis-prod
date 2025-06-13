import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZonaCultivo from './ZonaCult';
import { useZonas } from '../../context/ZonaContext';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../context/ZonaContext', () => ({
  useZonas: vi.fn(),
}));

describe('ZonaCultivo Component', () => {
  const handleAddZoneMock = vi.fn();
  const handleRemoveZoneMock = vi.fn();
  const handleUpdateZoneMock = vi.fn();

  const mockZonas = [
    {
      id: 1,
      nombre: 'Cultivo 1',
      cantidad_plantas: 10,
      fecha_cultivo: '2024-12-31',
      tiempo_cultivo: 30,
      acidez_min: 5,
      acidez_max: 7,
      temperatura_min: 20,
      temperatura_max: 30,
      humedad_min: 40,
      humedad_max: 60,
      radiacion_min: 200,
      radiacion_max: 800,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useZonas.mockReturnValue({
      zonas: mockZonas,
      handleAddZone: handleAddZoneMock,
      handleRemoveZone: handleRemoveZoneMock,
      handleUpdateZone: handleUpdateZoneMock,
      error: null,
    });
  });

  test('renderiza correctamente el componente', () => {
    render(<ZonaCultivo />);
    expect(screen.getByText(/Zonas de Cultivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Agregar Zona de Cultivo/i)).toBeInTheDocument();
  });

  test('permite agregar una nueva zona', async () => {
    render(<ZonaCultivo />);
    fireEvent.click(screen.getByText(/Agregar Zona de Cultivo/i));

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Nuevo Cultivo' } });
    fireEvent.change(screen.getByLabelText(/Cantidad de Plantas/i), { target: { value: 100 } });
    fireEvent.change(screen.getByLabelText(/Fecha de Cultivo/i), { target: { value: '2025-06-01' } });
    fireEvent.change(screen.getByLabelText(/Tiempo de Cultivo/i), { target: { value: 60 } });
    fireEvent.click(screen.getByText(/Siguiente/i));

    await waitFor(() => screen.getByLabelText(/Acidez Mínima/i));
    fireEvent.change(screen.getByLabelText(/Acidez Mínima/i), { target: { value: 5 } });
    fireEvent.change(screen.getByLabelText(/Acidez Máxima/i), { target: { value: 7 } });

    fireEvent.click(screen.getByText(/Crear Zona/i));

    await waitFor(() => {
      expect(handleAddZoneMock).toHaveBeenCalled();
    });
  });

  test('permite eliminar una zona existente', async () => {
    render(<ZonaCultivo />);

    // Asegúrate de tener aria-label="Eliminar zona" en tu componente
    const deleteButton = screen.getByRole('button', { name: /eliminar zona/i });
    fireEvent.click(deleteButton);
    screen.debug();

    // Asegúrate de que el botón de confirmación tenga texto "Confirmar"
    const confirmButton = await screen.findByRole('button', { name: /eliminar/i });
fireEvent.click(confirmButton);


    await waitFor(() => {
      expect(handleRemoveZoneMock).toHaveBeenCalledWith(1);
    });
  });

  test('muestra errores de validación si se guarda sin completar datos', async () => {
    render(<ZonaCultivo />);
    fireEvent.click(screen.getByText(/Agregar Zona de Cultivo/i));
    fireEvent.click(screen.getByText(/Siguiente/i));

    await waitFor(() => {
      expect(screen.getAllByText(/obligatorio/i).length).toBeGreaterThan(0);
    });
  });

  test('permite abrir el modal de edición', async () => {
    render(<ZonaCultivo />);
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => btn.classList.contains('edit-button'));
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Cultivo 1/i)).toBeInTheDocument();
    });
  });

  test('muestra zonas existentes al renderizar', () => {
    render(<ZonaCultivo />);
    expect(screen.getByText(/Cultivo 1/i)).toBeInTheDocument();
  });
});






