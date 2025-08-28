import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Fade,
  Grow,
  Zoom,
  Avatar,
  Divider,
  alpha,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Work,
  People,
  Security,
  Star,
  SportsSoccer,
  LocationOn,
  ArrowForward,
  Construction,
  Restaurant,
  DirectionsCar,
  Translate,
  CleaningServices,
  EmojiEvents,
  Celebration,
  Public,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { TrustSection } from '../components/ui/TrustBadges';
import { animations } from '../theme';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setStatsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Work fontSize="large" />,
      title: 'Oportunidades Laborales',
      description: 'Conecta con empleos relacionados al Mundial 2026',
      color: theme.palette.primary.main,
      delay: 100,
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Perfiles Verificados',
      description: 'Sistema de certificaciones y validación de identidad',
      color: theme.palette.info.main,
      delay: 200,
    },
    {
      icon: <Star fontSize="large" />,
      title: 'Sistema de Reputación',
      description: 'Calificaciones y reseñas para generar confianza',
      color: theme.palette.warning.main,
      delay: 300,
    },
    {
      icon: <People fontSize="large" />,
      title: 'Red Local',
      description: 'Conecta con trabajadores y empleadores de Álvaro Obregón',
      color: theme.palette.secondary.main,
      delay: 400,
    }
  ];

  const popularTrades = [
    { icon: <Restaurant />, name: 'Meseros', count: 245, color: '#FF6B6B' },
    { icon: <Construction />, name: 'Construcción', count: 189, color: '#4ECDC4' },
    { icon: <DirectionsCar />, name: 'Conductores', count: 156, color: '#45B7D1' },
    { icon: <Translate />, name: 'Traductores', count: 134, color: '#96CEB4' },
    { icon: <Security />, name: 'Seguridad', count: 123, color: '#FFEAA7' },
    { icon: <CleaningServices />, name: 'Limpieza', count: 98, color: '#DDA0DD' },
  ];

  const trustStats = {
    verifiedUsers: 2847,
    successfulJobs: 1523,
    averageRating: 4.7,
    activeWorkers: 892,
  };

  const successStories = [
    {
      name: 'María González',
      role: 'Mesera',
      company: 'Restaurant Azteca',
      image: '/api/placeholder/60/60',
      quote: 'Gracias a DOOM encontré trabajo en menos de una semana. La plataforma es muy fácil de usar.',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Traductor',
      company: 'FIFA Events',
      image: '/api/placeholder/60/60',
      quote: 'Excelente plataforma para conectar con empleadores serios. Ya tengo contratos para el Mundial.',
    },
    {
      name: 'Ana Martínez',
      role: 'Coordinadora',
      company: 'Hotel Mundial',
      image: '/api/placeholder/60/60',
      quote: 'DOOM me ayudó a encontrar el equipo perfecto para nuestro hotel. Todos verificados y confiables.',
    },
  ];

  return (
    <>
      {/* Enhanced Hero Section with World Cup Theme */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 10, md: 16 },
          px: 2,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <EmojiEvents sx={{ fontSize: 40, mr: 2, color: theme.palette.warning.light }} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      Mundial FIFA 2026
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                      lineHeight: 1.2,
                      mb: 3,
                    }}
                  >
                    {t('app.name')}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.5rem' },
                      fontWeight: 300,
                      opacity: 0.95,
                      lineHeight: 1.6,
                    }}
                  >
                    {t('app.description')}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 4,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Álvaro Obregón, CDMX
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Public sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        México 2026
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                    {!currentUser ? (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/register')}
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: '#FFFFFF',
                            color: '#007A33',
                            px: 5,
                            py: 2,
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            minHeight: 56,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                            border: '3px solid #FFFFFF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            '&:hover': {
                              bgcolor: '#FFFFFF',
                              color: '#005522',
                              transform: 'translateY(-4px) scale(1.05)',
                              boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                              border: '3px solid rgba(255,255,255,0.9)',
                            },
                            '&:active': {
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          {t('nav.register')}
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/login')}
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.95)',
                            color: '#007A33', 
                            border: '3px solid #FFFFFF',
                            px: 5,
                            py: 2,
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            minHeight: 56,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            '&:hover': {
                              bgcolor: '#FFFFFF',
                              color: '#005522',
                              border: '3px solid #FFFFFF',
                              transform: 'translateY(-4px) scale(1.05)',
                              boxShadow: '0 12px 32px rgba(255,255,255,0.4)',
                            },
                            '&:active': {
                              transform: 'translateY(-1px)',
                            }
                          }}
                        >
                          {t('nav.login')}
                        </Button>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/jobs')}
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            minHeight: 48,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.common.white, 0.95),
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          Ver Empleos
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/profile')}
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.15)',
                            color: 'white', 
                            border: '2px solid rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            minHeight: 48,
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.25)',
                              border: '2px solid white',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            }
                          }}
                        >
                          Mi Perfil
                        </Button>
                      </React.Fragment>
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Zoom in={isVisible} timeout={1200}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      ...animations.float,
                    }}
                  >
                    <SportsSoccer 
                      sx={{ 
                        fontSize: { xs: 150, md: 250 },
                        opacity: 0.9,
                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                      }} 
                    />
                    <Celebration
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        fontSize: 60,
                        color: theme.palette.warning.light,
                        ...animations.pulse,
                      }}
                    />
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Statistics Section */}
      <Container maxWidth="lg" sx={{ mt: -8, mb: 4, position: 'relative', zIndex: 1 }}>
        <Fade in={statsVisible} timeout={1500}>
          <Box>
            <TrustSection stats={trustStats} />
          </Box>
        </Fade>
      </Container>

      {/* Popular Trades Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          fontWeight={600}
          sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Oficios más demandados
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          Prepárate para las oportunidades del Mundial
        </Typography>
        
        <Grid container spacing={3}>
          {popularTrades.map((trade, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Grow in={isVisible} timeout={1000 + index * 100}>
                <Card
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.05)',
                      borderColor: trade.color,
                      boxShadow: `0 12px 24px ${alpha(trade.color, 0.3)}`,
                    },
                  }}
                  onClick={() => navigate('/workers')}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: alpha(trade.color, 0.1),
                        color: trade.color,
                        width: 60,
                        height: 60,
                        margin: '0 auto 16px',
                      }}
                    >
                      {trade.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {trade.name}
                    </Typography>
                    <Typography variant="h4" color={trade.color} fontWeight="bold">
                      {trade.count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      disponibles
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            fontWeight={600}
          >
            ¿Por qué elegir DOOM?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6 }}
          >
            La plataforma oficial para el Mundial 2026 en Álvaro Obregón
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={isVisible} timeout={feature.delay}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid transparent',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${feature.color} 0%, ${alpha(feature.color, 0.5)} 100%)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        borderColor: feature.color,
                        boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar
                        sx={{ 
                          bgcolor: alpha(feature.color, 0.1),
                          color: feature.color,
                          width: 70,
                          height: 70,
                          margin: '0 auto 20px',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'rotate(360deg)',
                          }
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          fontWeight={600}
        >
          Historias de Éxito
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          Personas reales, oportunidades reales
        </Typography>
        
        <Grid container spacing={4}>
          {successStories.map((story, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in={isVisible} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={story.image}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {story.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {story.role}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {story.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        position: 'relative',
                        '&::before': {
                          content: '"""',
                          fontSize: '2rem',
                          color: theme.palette.primary.light,
                          position: 'absolute',
                          top: -10,
                          left: -10,
                        },
                      }}
                    >
                      {story.quote}
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFC107', fontSize: 20 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section with World Cup Theme */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '3px solid',
              borderColor: theme.palette.primary.main,
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <LocationOn sx={{ fontSize: 60, color: theme.palette.primary.main, mr: 2 }} />
                <SportsSoccer sx={{ fontSize: 60, color: theme.palette.secondary.main }} />
              </Box>
              
              <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                Álvaro Obregón se prepara para el Mundial
              </Typography>
              
              <Typography variant="h6" color="text.secondary" paragraph>
                Con ubicación estratégica cerca del Estadio Azteca, Santa Fe e Insurgentes, 
                nuestra alcaldía será clave en el Mundial 2026.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 4 }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    2026
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Año del Mundial
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="secondary.main">
                    48
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equipos participantes
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Empleos esperados
                  </Typography>
                </Box>
              </Box>
              
              {!currentUser && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    minHeight: 56, // Larger touch target for CTA
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 6px 16px rgba(0, 122, 51, 0.3)',
                    border: '2px solid transparent',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 12px 24px rgba(0, 122, 51, 0.4)',
                      border: '2px solid rgba(255,255,255,0.2)',
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(1.01)',
                    },
                  }}
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