import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthLogin from './auth/AuthLogin';
import { describe, it, vi, expect, afterEach } from 'vitest';

// Mock del servicio
import * as authService from '../../../src/services/authService';
vi.mock('../../../src/services/authService', () => ({
  loginUser: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('AuthLogin - Validación de credenciales incorrectas', () => {
  it('muestra mensaje de error si las credenciales son inválidas', async () => {
    authService.loginUser.mockRejectedValue(new Error('Credenciales incorrectas'));

    render(
      <MemoryRouter>
        <AuthLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'correo@invalido.com' },
    });

    fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });
});
