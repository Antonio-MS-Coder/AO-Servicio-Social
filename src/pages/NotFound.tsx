import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  SentimentDissatisfied,
  Home,
  Work,
  People,
  ArrowBack,
} from '@mui/icons-material';
import SEOHead from '../components/SEO/SEOHead';

const NotFound: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const suggestedPages = [
    {
      title: 'Buscar Empleos',
      description: 'Explora oportunidades laborales para el Mundial 2026',
      icon: <Work />,
      path: '/jobs',
      color: theme.palette.primary.main,
    },
    {
      title: 'Ver Trabajadores',
      description: 'Encuentra profesionales verificados',
      icon: <People />,
      path: '/workers',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Página Principal',
      description: 'Vuelve al inicio',
      icon: <Home />,
      path: '/',
      color: theme.palette.info.main,
    },
  ];

  return (
    <>
      <SEOHead
        title="Página no encontrada - Error 404"
        description="La página que buscas no existe. Encuentra empleos y trabajadores para el Mundial 2026 en Álvaro Obregón."
        noindex={true}
      />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '60vh',
            justifyContent: 'center',
          }}
        >
          {/* 404 Error Display */}
          <Box sx={{ mb: 4, position: 'relative' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '120px', md: '180px' },
                fontWeight: 900,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.05em',
                lineHeight: 1,
                mb: 0,
              }}
            >
              404
            </Typography>
            <SentimentDissatisfied
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: { xs: 60, md: 80 },
                opacity: 0.2,
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          {/* Error Message */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            ¡Página no encontrada!
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 5,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Pero no te preocupes, hay muchas oportunidades esperándote.
          </Typography>

          {/* Primary Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Página Anterior
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Ir al Inicio
            </Button>
          </Box>

          {/* Suggested Pages */}
          <Box sx={{ width: '100%', maxWidth: 800 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 500 }}
            >
              Páginas sugeridas
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
              {suggestedPages.map((page, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderTop: `4px solid ${page.color}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(page.path)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: `${page.color}15`,
                        color: page.color,
                        borderRadius: '50%',
                        p: 2,
                        mb: 2,
                      }}
                    >
                      {React.cloneElement(page.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {page.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {page.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Fun Message */}
          <Box
            sx={{
              mt: 6,
              p: 3,
              bgcolor: theme.palette.grey[100],
              borderRadius: 2,
              maxWidth: 600,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              💡 <strong>Dato curioso:</strong> El Mundial 2026 será el primero con 48 equipos participantes, 
              creando miles de nuevas oportunidades laborales en la Ciudad de México.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default NotFound;