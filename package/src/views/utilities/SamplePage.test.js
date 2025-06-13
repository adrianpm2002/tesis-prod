import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SamplePage from '../utilities/MapaCult'; // Ajusta la ruta según tu estructura
import { ZonaProvider } from '../../context/ZonaContext';

// Mock de zonas de cultivo
const zonasMock = [
  {
    id: 1,
    nombre: 'Zona A',
    cantidad_plantas: 15,
    fecha_cultivo: '2024-05-01',
    tiempo_cultivo: 30,
  },
  {
    id: 2,
    nombre: 'Zona B',
    cantidad_plantas: 45,
    fecha_cultivo: '2024-05-10',
    tiempo_cultivo: 40,
  },
  {
    id: 3,
    nombre: 'Zona C',
    cantidad_plantas: 120,
    fecha_cultivo: '2024-04-20',
    tiempo_cultivo: 60,
  }
];

// Mock del contexto
vi.mock('../../context/ZonaContext', async () => {
  const actual = await vi.importActual('../../context/ZonaContext');
  return {
    ...actual,
    useZonas: () => ({
      zonas: zonasMock,
      loading: false,
    }),
  };
});

describe('SamplePage - Mapa de Casa de Cultivo', () => {
  it('renderiza los cuadrantes del mapa correctamente', () => {
    render(
      <ZonaProvider>
        <SamplePage />
      </ZonaProvider>
    );

    // Verifica que aparezca el título
    expect(screen.getByText('Mapa de la Casa de Cultivo')).toBeInTheDocument();

    // Verifica que se renderizan cuadrantes pequeños
    expect(screen.getAllByText('Zona A').length).toBeGreaterThan(0);
    
    // Verifica que se renderizan cuadrantes medianos
    expect(screen.getAllByText('Zona B').length).toBeGreaterThan(0);

    // Verifica que se renderizan cuadrantes grandes
    expect(screen.getAllByText('Zona C').length).toBeGreaterThan(0);

    // Verifica el texto final
    expect(screen.getByText(/Casa de Cultivo de 20m x 10m/i)).toBeInTheDocument();
  });
});
