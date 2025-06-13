// src/views/user/UserProfileForm.test.jsx
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfileForm from './TypographyPage';
import { UserProvider } from '../../context/userContext';
import { BrowserRouter } from 'react-router-dom';

describe('UserProfileForm - Actualización de perfil', () => {
  const mockUser = {
    name: 'Usuario Test',
    email: 'test@example.com',
    categoria: 'Ingeniero',
    avatar: '',
    provincia: 'La Habana',
    municipio: 'Centro Habana',
  };

  const setup = () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) + '.signature');

    return render(
      <UserProvider>
        <BrowserRouter>
          <UserProfileForm />
        </BrowserRouter>
      </UserProvider>
    );
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('guarda los cambios del usuario correctamente', async () => {
    const updatedUser = {
      ...mockUser,
      name: 'Nuevo Nombre',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedUser),
    });

    setup();

    const nameInput = await screen.findByLabelText('Nombre');
    fireEvent.change(nameInput, { target: { value: updatedUser.name } });

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/me'),
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              Authorization: expect.stringContaining('Bearer'),
              'Content-Type': 'application/json'
            }),
            body: expect.any(String)
          })
        );
      });

    // Verifica que el nombre actualizado fue guardado en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser.name).toBe('Nuevo Nombre');
  });
});
