import { render, screen, fireEvent } from '@testing-library/react';
import ZonaCultivo from './ZonaCult'; 
import { useZonas } from '../../context/ZonaContext';
import { vi } from 'vitest'; 
import '@testing-library/jest-dom'; 

vi.mock('../../context/ZonaContext', () => ({
  useZonas: vi.fn(),
}));

describe('ZonaCultivo Component', () => {
  const handleAddZoneMock = vi.fn();

  beforeEach(() => {
    useZonas.mockReturnValue({ handleAddZone: handleAddZoneMock });
    localStorage.clear(); // Limpiar localStorage antes de cada prueba
  });

  test('debe renderizar correctamente el componente', () => {
    render(<ZonaCultivo />);
    expect(screen.getByText(/Zona de Cultivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Agregar Zona de Cultivo/i)).toBeInTheDocument();
  });

  test('debe agregar una nueva zona al hacer clic en el botón', () => {
    render(<ZonaCultivo />);
    const addButton = screen.getByText(/Agregar Zona de Cultivo/i);
    fireEvent.click(addButton);

    // Verificar que se haya agregado una nueva zona
    expect(screen.getByLabelText(/Nombre del Cultivo/i)).toBeInTheDocument();
  });

  test('debe eliminar una zona existente', () => {
    const initialZones = [
      {
        id: 1,
        nombre: 'Cultivo 1',
        suelo: 'arena',
        cantidadPlantas: '10',
        acidezMin: '5',
        acidezMax: '7',
        temperaturaMin: '20',
        temperaturaMax: '30',
        humedadMin: '40',
        humedadMax: '60',
        riego: 'goteo',
        insumos: 'fertilizante',
        fechaCultivo: '2025-01-01',
        tiempoCultivo: '30',
      },
    ];

    localStorage.setItem('zonas', JSON.stringify(initialZones));
    render(<ZonaCultivo />);

    expect(screen.getByText(/Cultivo 1/i)).toBeInTheDocument();

    const deleteButton = screen.getByText(/Eliminar/i);
    fireEvent.click(deleteButton);

    // Verificar que la zona ha sido eliminada
    expect(screen.queryByText(/Cultivo 1/i)).not.toBeInTheDocument();
  });

  test('debe mostrar errores de validación al guardar una zona sin datos', () => {
    render(<ZonaCultivo />);
    const addButton = screen.getByText(/Agregar Zona de Cultivo/i);
    fireEvent.click(addButton);

    const saveButton = screen.getByText(/Guardar/i);
    fireEvent.click(saveButton);

    // Verificar que se muestran errores de validación
    const errorMessages = screen.getAllByText(/Campo vacío/i);
    expect(errorMessages.length).toBeGreaterThan(0); // Verifica que al menos un mensaje de error esté presente
  });

  test('debe recuperar zonas del localStorage', () => {
    const initialZones = [
      {
        id: 1,
        nombre: 'Cultivo 1',
        suelo: 'arena',
        cantidadPlantas: '10',
        acidezMin: '5',
        acidezMax: '7',
        temperaturaMin: '20',
        temperaturaMax: '30',
        humedadMin: '40',
        humedadMax: '60',
        riego: 'goteo',
        insumos: 'fertilizante',
        fechaCultivo: '2025-01-01',
        tiempoCultivo: '30',
      },
    ];

    localStorage.setItem('zonas', JSON.stringify(initialZones));
    render(<ZonaCultivo />);

    expect(screen.getByText(/Cultivo 1/i)).toBeInTheDocument();
  });
});






