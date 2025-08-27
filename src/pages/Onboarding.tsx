import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          ¡Bienvenido a DOOM!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Tu talento, nuestra sede
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography paragraph>
            Gracias por unirte a la plataforma que conectará a Álvaro Obregón con el Mundial 2026.
          </Typography>
          <Typography paragraph>
            {userData?.role === 'worker' 
              ? 'Como trabajador, podrás encontrar oportunidades laborales y mostrar tus habilidades.'
              : 'Como empleador, podrás publicar vacantes y encontrar el talento que necesitas.'}
          </Typography>
        </Box>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/profile')}
          >
            Completar Perfil
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Onboarding;