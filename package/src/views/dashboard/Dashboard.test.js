import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { useZonas } from '../../context/ZonaContext';

// Mock de subcomponentes y hooks
vi.mock('./components/MonthlyEarnings', () => ({
  default: () => <div data-testid="monthly-earnings">MonthlyEarnings</div>
}));
vi.mock('./components/RecentTransactions', () => ({
  default: () => <div data-testid="recent-transactions">RecentTransactions</div>
}));
vi.mock('./components/YearlyBreakup', () => ({
  default: () => <div data-testid="yearly-breakup">YearlyBreakup</div>
}));
vi.mock('./components/ProductPerformance', () => ({
  default: () => <div data-testid="product-performance">ProductPerformance</div>
}));
vi.mock('../../context/ZonaContext', () => ({
  useZonas: vi.fn()
}));

describe('Dashboard - Componente principal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renderiza mensaje de bienvenida si no hay zonas', async () => {
    useZonas.mockReturnValue({ zonas: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/bienvenido al sistema de monitoreo agrícola/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /crear zona de cultivo/i })
    ).toBeInTheDocument();
  });

  it('renderiza datos del dashboard si hay zonas y sensores conectados', async () => {
    // Simula zonas disponibles
    useZonas.mockReturnValue({
      zonas: [{ id: 'zona-1', nombre: 'Zona Prueba' }]
    });

    // Simula fetch del estado del sensor como conectado
    global.fetch = vi.fn((url) => {
      if (url.includes('sensores-estado')) {
        return Promise.resolve({
          json: () => Promise.resolve({ sensoresConectados: true })
        });
      }
      if (url.includes('selected-zone')) {
        return Promise.resolve({ ok: true });
      }
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Espera que aparezca el selector de zonas y los componentes del dashboard
    expect(await screen.findByText('Zona Prueba')).toBeInTheDocument();
    expect(await screen.findByTestId('monthly-earnings')).toBeInTheDocument();
    expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
    expect(screen.getByTestId('yearly-breakup')).toBeInTheDocument();
    expect(screen.getByTestId('product-performance')).toBeInTheDocument();
  });
});
