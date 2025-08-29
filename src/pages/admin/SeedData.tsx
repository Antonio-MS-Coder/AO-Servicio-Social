import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  CloudUpload, 
  Delete, 
  CheckCircle,
  Warning,
  AdminPanelSettings,
  Person,
  Business,
  Work,
  School
} from '@mui/icons-material';
import { seedDatabase, seedDemoData, clearDatabase } from '../../utils/seedData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SeedData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | null; text: string }>({ type: null, text: '' });
  const navigate = useNavigate();
  const { userData } = useAuth();

  // Check if user is admin
  if (userData?.role !== 'admin') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">
          No tienes permisos para acceder a esta página.
        </Alert>
      </Container>
    );
  }

  const handleSeed = async () => {
    setLoading(true);
    setMessage({ type: null, text: '' });
    
    try {
      // Use the simplified demo data function that doesn't require auth
      const result = await seedDemoData();
      
      // Check the results and show appropriate message
      if (result.results && result.results.errors.length > 0) {
        setMessage({ 
          type: 'warning', 
          text: result.message + ' (Revisa la consola para ver detalles de errores)' 
        });
      } else {
        setMessage({ 
          type: 'success', 
          text: result.message || '¡Datos de demostración agregados exitosamente!' 
        });
      }
      
      // Open console to show details
      console.log('📊 Resultados de la inserción:', result.results);
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al poblar la base de datos. Revisa la consola para más detalles.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro? Esta acción eliminará TODOS los datos de la base de datos y no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });
    
    try {
      await clearDatabase();
      setMessage({ 
        type: 'warning', 
        text: 'Base de datos limpiada. Todos los datos han sido eliminados.' 
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al limpiar la base de datos. Revisa la consola para más detalles.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload sx={{ fontSize: 40, color: '#007A33' }} />
          Gestión de Datos de Prueba
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Utiliza esta herramienta para poblar la base de datos con datos de prueba o limpiarla completamente.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Los datos de prueba incluyen:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
              <ListItemText primary="1 Usuario Administrador" secondary="admin@alvaroobregon.gob.mx" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              <ListItemText primary="5 Trabajadores" secondary="Con perfiles completos y certificaciones" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Business fontSize="small" /></ListItemIcon>
              <ListItemText primary="3 Empleadores" secondary="Restaurantes, hoteles y organizadores de eventos" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Work fontSize="small" /></ListItemIcon>
              <ListItemText primary="5 Ofertas de Trabajo" secondary="Variadas para el Mundial 2026" />
            </ListItem>
            <ListItem>
              <ListItemIcon><School fontSize="small" /></ListItemIcon>
              <ListItemText primary="5 Certificaciones" secondary="Gratuitas y de pago" />
            </ListItem>
          </List>
        </Alert>

        {message.type && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
            onClick={handleSeed}
            disabled={loading}
            sx={{ 
              bgcolor: '#007A33',
              '&:hover': { bgcolor: '#005522' }
            }}
          >
            Agregar Datos Demo
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            color="error"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            onClick={handleClear}
            disabled={loading}
          >
            Limpiar Base de Datos
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Nota:</strong> Las credenciales de acceso se mostrarán en la consola del navegador después de poblar la base de datos.
          Presiona F12 para abrir las herramientas de desarrollo y ver la consola.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/admin')}
            sx={{ color: '#007A33' }}
          >
            ← Volver al Panel de Admin
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SeedData;