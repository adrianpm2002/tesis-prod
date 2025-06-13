import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error from './Error';

// ✅ Mock correcto de imagen
vi.mock('src/assets/images/backgrounds/404-error-idea.gif', () => ({
  default: 'mocked-image.gif',
}));

describe('Error - Página de acceso denegado', () => {
  it('renderiza correctamente la imagen, los textos y el enlace de volver', () => {
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    // Imagen
    const image = screen.getByAltText('404');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('mocked-image.gif');

    // Títulos
    expect(screen.getByRole('heading', { name: /opps!!!/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /no puedes axeder a esta seccion sin autenticarte/i })
    ).toBeInTheDocument();

    // ✅ El enlace que parece botón
    const link = screen.getByRole('link', { name: /volver a registro/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});

