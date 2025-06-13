import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register2 from './Register';
import { BrowserRouter } from 'react-router-dom';

// Mock de Logo para evitar errores si no tiene implementación real
vi.mock('src/layouts/full/shared/logo/Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock de AuthRegister con formulario funcional simulado
vi.mock('./auth/AuthRegister', () => ({
  default: ({ subtext, subtitle }) => (
    <div>
      {subtext}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const event = new CustomEvent('submitRegister');
          window.dispatchEvent(event);
        }}
      >
        <input placeholder="Nombre" name="name" />
        <input placeholder="Email" name="email" />
        <input placeholder="Contraseña" name="password" type="password" />
        <button type="submit">Registrarse</button>
      </form>
      {subtitle}
    </div>
  ),
}));

describe('Register2 - Página de Registro', () => {
  it('renderiza correctamente el formulario de registro y elementos principales', () => {
    render(
      <BrowserRouter>
        <Register2 />
      </BrowserRouter>
    );

    // Verifica elementos visibles
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesion/i)).toBeInTheDocument();
  });

  it('simula el registro del usuario correctamente', async () => {
    const handleRegister = vi.fn();
    window.addEventListener('submitRegister', handleRegister);

    render(
      <BrowserRouter>
        <Register2 />
      </BrowserRouter>
    );

    // Completa el formulario
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Nuevo Usuario' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'nuevo@usuario.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '12345678' },
    });

    // Envía el formulario
    fireEvent.click(screen.getByText(/registrarse/i));

    // Verifica que se haya ejecutado el evento simulado
    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalled();
    });

    window.removeEventListener('submitRegister', handleRegister);
  });
});
