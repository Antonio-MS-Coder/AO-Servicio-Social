import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  useTheme
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Work,
  People,
  Security,
  Star,
  SportsSoccer,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Work fontSize="large" />,
      title: 'Oportunidades Laborales',
      description: 'Conecta con empleos relacionados al Mundial 2026'
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Perfiles Verificados',
      description: 'Sistema de certificaciones y validación de identidad'
    },
    {
      icon: <Star fontSize="large" />,
      title: 'Sistema de Reputación',
      description: 'Calificaciones y reseñas para generar confianza'
    },
    {
      icon: <People fontSize="large" />,
      title: 'Red Local',
      description: 'Conecta con trabajadores y empleadores de Álvaro Obregón'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          px: 2
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                {t('app.name')}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {t('app.description')}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontStyle: 'italic' }}>
                {t('app.slogan')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {!currentUser ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/register')}
                    >
                      {t('nav.register')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                      onClick={() => navigate('/login')}
                    >
                      {t('nav.login')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/jobs')}
                    >
                      Ver Empleos
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                      onClick={() => navigate('/profile')}
                    >
                      Mi Perfil
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <SportsSoccer sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          ¿Por qué DOOM?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          La plataforma diseñada para el Mundial 2026
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <CardContent>
                  <Box sx={{ 
                    color: theme.palette.primary.main,
                    mb: 2
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ 
        backgroundColor: theme.palette.secondary.light,
        py: 6
      }}>
        <Container maxWidth="md">
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <LocationOn sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Álvaro Obregón se prepara para el Mundial
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Con ubicación estratégica cerca del Estadio Azteca, Santa Fe e Insurgentes, 
                nuestra alcaldía será clave en el Mundial 2026. Únete a DOOM y sé parte de este momento histórico.
              </Typography>
              {!currentUser && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Únete Ahora
                </Button>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Home;