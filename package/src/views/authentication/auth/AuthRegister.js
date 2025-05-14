import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { registerUser } from '../../../services/authService'; // Importamos el servicio

const AuthRegister = ({ title, subtitle, subtext }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validaciones del cliente
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Formato de email inválido');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            const data = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Guardar token si el backend lo devuelve
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            navigate('/auth/login'); // Redirigir a login
        } catch (err) {
            setError(err.message || 'Error al registrar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {title && (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            )}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='name' mb="5px">
                        Nombre
                    </Typography>
                    <CustomTextField
                        id="name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">
                        Correo Electrónico
                    </Typography>
                    <CustomTextField
                        id="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">
                        Contraseña
                    </Typography>
                    <CustomTextField
                        id="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='confirmPassword' mb="5px" mt="25px">
                        Confirmar Contraseña
                    </Typography>
                    <CustomTextField
                        id="confirmPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Stack>

                {error && (
                    <Typography color="error" variant="body2" mb={2}>
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
            </Box>
            {subtitle}
        </form>
    );
};

export default AuthRegister;

