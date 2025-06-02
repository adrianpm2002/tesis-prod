import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { loginUser } from '../../../services/authService'; // Importamos el servicio

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        console.log('Datos enviados:', formData);
    
        try {
            const data = await loginUser(formData);
    
            // ✅ Verificar el token recibido antes de guardarlo
            console.log("🔐 Token recibido del backend:", data.token);
    
            if (data.token && typeof data.token === 'string' && data.token.length > 10) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Guardar el usuario completo
                navigate('/dashboard'); // Redirigir a la página principal
            } else {
                setError('Credenciales incorrectas o token inválido');
                console.error("🚨 Token recibido es inválido:", data.token);
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            {title && (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            )}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px">
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
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px">
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
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Recordar Contraseña"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        to="/recuperar-password"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        ¿Recuperar Contraseña?
                    </Typography>
                </Stack>
            </Stack>

            {error && (
                <Typography color="error" variant="body2" mb={2}>
                    {error}
                </Typography>
            )}

            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </Box>

            {subtitle}
        </form>
    );
};

export default AuthLogin;
