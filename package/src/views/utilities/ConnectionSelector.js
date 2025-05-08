import React, { useState, useEffect } from 'react';
import { Button, Select, Typography, Paper, Stack, Box, CircularProgress, Alert } from '@mui/material';

// 1. Define el componente PRIMERO
const ConnectionSelector = () => {
  // 2. Hooks después de la definición
  const [serialPorts, setSerialPorts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  // 3. Funciones internas definidas después de hooks
  const fetchConnections = async () => {
    // ... lógica
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* JSX */}
    </Paper>
  );
};

// 4. Exporta al final
export default ConnectionSelector;