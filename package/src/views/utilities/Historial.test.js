// src/views/utilities/Historial.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Historial from './GraficoTendencia';
import { ZonaProvider } from '../../context/ZonaContext';
import axios from 'axios';

vi.mock('axios');

const mockData = [
  {
    fecha: '2024-06-01T00:00:00.000Z',
    humedad: 55,
    temperatura_min: 20,
    temperatura_max: 30,
    ph: 6.5,
    radiacion: 300
  },
  {
    fecha: '2024-06-01T01:00:00.000Z',
    humedad: 60,
    temperatura_min: 21,
    temperatura_max: 31,
    ph: 6.7,
    radiacion: 310
  }
];

// Simulación de ResizeObserver para Recharts en entornos jsdom
global.ResizeObserver = class {
    constructor(callback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

describe('Historial - Visualización de datos históricos', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
  });

  it('renderiza correctamente y permite cambiar parámetros', async () => {
    render(
      <ZonaProvider>
        <Historial />
      </ZonaProvider>
    );

    // Esperar a que se cargue el gráfico
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/sensor-history');
    });

    // Verificar botones
    expect(screen.getByText('Humedad')).toBeInTheDocument();
    expect(screen.getByText('Temperatura')).toBeInTheDocument();
    expect(screen.getByText('pH')).toBeInTheDocument();
    expect(screen.getByText('Radiación Solar')).toBeInTheDocument();

    // Cambiar parámetro a "Temperatura"
    fireEvent.click(screen.getByText('Temperatura'));
    expect(screen.getByRole('button', { name: 'Temperatura' })).toHaveClass('MuiButton-contained');

    // Cambiar a "pH"
    fireEvent.click(screen.getByText('pH'));
    expect(screen.getByRole('button', { name: 'pH' })).toHaveClass('MuiButton-contained');
  });
});
