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
  Paper,
  Avatar,
  useMediaQuery,
  Divider,
  alpha,
  Skeleton,
  Chip,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Work,
  People,
  Security,
  Star,
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
  TrendingUp,
  Favorite,
  WhatsApp,
  Schedule,
  VerifiedUser,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/SEO/SEOHead';
import { animations } from '../theme';

// Removed lazy loading for TrustSection as we're using custom implementation

// Image component with lazy loading
const LazyImage: React.FC<{ src: string; alt: string; sx?: any }> = ({ src, alt, sx }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {!loaded && !error && (
        <Skeleton variant="circular" width={60} height={60} />
      )}
      <Avatar
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sx={{
          ...sx,
          display: loaded || error ? 'flex' : 'none',
        }}
      />
      {error && (
        <Avatar sx={sx}>
          <People />
        </Avatar>
      )}
    </Box>
  );
};

const HomeOptimized: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
      title: t('features.jobOpportunities.title', 'Oportunidades Laborales'),
      description: t('features.jobOpportunities.description', 'Conecta con empleos relacionados al Mundial 2026'),
      color: theme.palette.primary.main,
      delay: 100,
      stats: '500+ empleos activos',
    },
    {
      icon: <Security fontSize="large" />,
      title: t('features.verifiedProfiles.title', 'Perfiles Verificados'),
      description: t('features.verifiedProfiles.description', 'Sistema de certificaciones y validación de identidad'),
      color: theme.palette.info.main,
      delay: 200,
      stats: '100% verificados',
    },
    {
      icon: <Star fontSize="large" />,
      title: t('features.reputation.title', 'Sistema de Reputación'),
      description: t('features.reputation.description', 'Calificaciones y reseñas para generar confianza'),
      color: theme.palette.warning.main,
      delay: 300,
      stats: '4.7/5 promedio',
    },
    {
      icon: <People fontSize="large" />,
      title: t('features.localNetwork.title', 'Red Local'),
      description: t('features.localNetwork.description', 'Conecta con trabajadores y empleadores de Álvaro Obregón'),
      color: theme.palette.secondary.main,
      delay: 400,
      stats: '2,000+ usuarios',
    }
  ];

  const popularTrades = [
    { 
      icon: <Restaurant />, 
      name: 'Meseros', 
      tagline: 'Los Anfitriones de México',
      count: '347 restaurantes buscan tu experiencia',
      color: '#FF6B6B',
      growth: '+12%',
      highlight: 'Esencial para el Mundial'
    },
    { 
      icon: <Construction />, 
      name: 'Construcción',
      tagline: 'Construyendo el Sueño',
      count: '189 proyectos activos',
      color: '#4ECDC4',
      growth: '+8%',
      highlight: 'Alta demanda'
    },
    { 
      icon: <DirectionsCar />, 
      name: 'Conductores',
      tagline: 'Moviendo al Mundial',
      count: '156 empresas contratando',
      color: '#45B7D1',
      growth: '+15%',
      highlight: 'Mejor pagado'
    },
    { 
      icon: <Translate />, 
      name: 'Traductores',
      tagline: 'La Voz del Mundial',
      count: '134 oportunidades FIFA',
      color: '#96CEB4',
      growth: '+20%',
      highlight: 'Más crecimiento'
    },
    { 
      icon: <Security />, 
      name: 'Seguridad',
      tagline: 'Protegiendo el Evento',
      count: '123 posiciones disponibles',
      color: '#FFEAA7',
      growth: '+10%',
      highlight: 'Certificación incluida'
    },
    { 
      icon: <CleaningServices />, 
      name: 'Limpieza',
      tagline: 'La Primera Impresión',
      count: '98 hoteles reclutando',
      color: '#DDA0DD',
      growth: '+5%',
      highlight: 'Horarios flexibles'
    },
  ];

  const trustStats = {
    verifiedUsers: 2847,
    successfulJobs: 1523,
    averageRating: 4.7,
    activeWorkers: 892,
  };

  // Story of the week
  const weeklyStory = {
    name: 'María González',
    role: 'De mesera a supervisora de eventos',
    image: 'MG',
    quote: 'DOOM me cambió la vida. Empecé sirviendo en eventos pequeños y ahora coordino equipos completos para eventos FIFA.',
    before: '$8,000/mes',
    after: '$22,000/mes',
    timeFrame: 'En solo 6 meses',
    jobsCompleted: 47,
    rating: 4.9,
  };

  const successStories = [
    {
      name: 'María González',
      role: t('roles.waitress', 'Mesera'),
      company: 'Restaurant Azteca',
      avatar: 'MG',
      quote: t('testimonials.maria', 'Gracias a DOOM encontré trabajo en menos de una semana. La plataforma es muy fácil de usar.'),
      rating: 5,
      verified: true,
    },
    {
      name: 'Carlos Rodríguez',
      role: t('roles.translator', 'Traductor'),
      company: 'FIFA Events',
      avatar: 'CR',
      quote: t('testimonials.carlos', 'Excelente plataforma para conectar con empleadores serios. Ya tengo contratos para el Mundial.'),
      rating: 5,
      verified: true,
    },
    {
      name: 'Ana Martínez',
      role: t('roles.coordinator', 'Coordinadora'),
      company: 'Hotel Mundial',
      avatar: 'AM',
      quote: t('testimonials.ana', 'DOOM me ayudó a encontrar el equipo perfecto para nuestro hotel. Todos verificados y confiables.'),
      rating: 5,
      verified: true,
    },
  ];

  // Countdown to World Cup
  const worldCupDate = new Date('2026-06-11');
  const today = new Date();
  const daysUntilWorldCup = Math.ceil((worldCupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <SEOHead
        title="Inicio"
        description="Plataforma oficial de empleos para el Mundial FIFA 2026 en Álvaro Obregón. Conecta con oportunidades laborales verificadas y seguras."
        keywords="portal empleos, Mundial 2026, Álvaro Obregón, trabajos CDMX"
      />
      
      {/* Enhanced Hero Section with Accessibility */}
      <Box
        component="section"
        aria-label="Hero Section"
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, #00953B 0%, #FFD700 100%)`,
          color: 'white',
          py: { xs: 8, md: 14 },
          px: 2,
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.1,
            animation: 'float 20s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '120%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.3 },
            '50%': { opacity: 0.6 },
          },
        }}
      >
        <Container maxWidth="lg" id="main-content">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box>
                  {/* Event Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Chip
                      icon={<EmojiEvents />}
                      label="Mundial FIFA 2026"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: '#006B2B',
                        fontWeight: 800,
                        fontSize: '1rem',
                        py: 3,
                        px: 1,
                        border: '2px solid white',
                        backdropFilter: 'blur(10px)',
                        '& .MuiChip-icon': {
                          color: '#FFD700',
                          fontSize: '1.5rem',
                        },
                        animation: 'glow 2s ease-in-out infinite',
                        '@keyframes glow': {
                          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)' },
                          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)' },
                        },
                      }}
                    />
                    <Chip
                      icon={<Schedule />}
                      label={`${daysUntilWorldCup} días`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: '#00953B',
                        fontWeight: 800,
                        fontSize: '1rem',
                        py: 3,
                        px: 1,
                        border: '2px solid white',
                        backdropFilter: 'blur(10px)',
                        '& .MuiChip-icon': {
                          animation: 'rotate 2s linear infinite',
                        },
                        '@keyframes rotate': {
                          from: { transform: 'rotate(0deg)' },
                          to: { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Main Title */}
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom 
                    fontWeight="900"
                    sx={{
                      textShadow: '3px 3px 6px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.2)',
                      lineHeight: 1,
                      fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                      letterSpacing: '2px',
                      background: 'linear-gradient(45deg, #FFFFFF 30%, #FFD700 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 2,
                      animation: 'slideInLeft 1s ease-out',
                      '@keyframes slideInLeft': {
                        from: { opacity: 0, transform: 'translateX(-50px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    {t('app.name')}
                  </Typography>
                  
                  {/* Subtitle */}
                  <Typography 
                    variant="h5" 
                    component="h2"
                    gutterBottom
                    sx={{ 
                      mb: 4,
                      fontWeight: 400,
                      opacity: 0.95,
                      fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      animation: 'slideInLeft 1.2s ease-out',
                      lineHeight: 1.4,
                    }}
                  >
                    {t('app.description')}
                  </Typography>
                  
                  {/* Location Info */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 4,
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                    role="region"
                    aria-label="Información de ubicación"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1 }} aria-hidden="true" />
                      <Typography variant="body1" fontWeight="medium">
                        Álvaro Obregón, CDMX
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Public sx={{ mr: 1 }} aria-hidden="true" />
                      <Typography variant="body1" fontWeight="medium">
                        México 2026
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* CTA Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }} role="navigation" aria-label="Acciones principales">
                    {!currentUser ? (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/register')}
                          endIcon={<ArrowForward />}
                          aria-label="Registrarse en DOOM"
                          sx={{
                            bgcolor: '#00953B',
                            color: 'white',
                            px: 5,
                            py: 2,
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            borderRadius: '50px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 4px 12px rgba(0, 149, 59, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              bgcolor: '#006B2B',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 20px rgba(0, 149, 59, 0.5)',
                            },
                            '&:active': {
                              transform: 'translateY(-2px) scale(1.02)',
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${theme.palette.warning.light}`,
                              outlineOffset: 2,
                            },
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)' },
                              '50%': { boxShadow: '0 8px 32px rgba(255, 215, 0, 0.8)' },
                              '100%': { boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)' },
                            },
                          }}
                        >
                          {t('nav.register')}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/login')}
                          aria-label="Iniciar sesión"
                          sx={{ 
                            color: '#006B2B', 
                            borderColor: 'white',
                            borderWidth: 2,
                            px: 5,
                            py: 2,
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            borderRadius: '50px',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'white',
                              borderWidth: 2,
                              backgroundColor: 'white',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 20px rgba(255,255,255,0.3)',
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${theme.palette.warning.light}`,
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Ya Soy Parte
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/jobs')}
                          endIcon={<ArrowForward />}
                          aria-label="Ver empleos disponibles"
                          sx={{
                            bgcolor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.common.white, 0.9),
                              transform: 'translateY(-2px)',
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${theme.palette.warning.light}`,
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Ver Empleos
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/profile')}
                          aria-label="Ir a mi perfil"
                          sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            borderWidth: 2,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: 'white',
                              borderWidth: 2,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${theme.palette.warning.light}`,
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Mi Perfil
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            {/* Hero Illustration */}
            <Grid item xs={12} md={6}>
              <Zoom in={isVisible} timeout={1200}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative',
                    minHeight: { xs: 200, md: 300 },
                  }}
                  aria-hidden="true"
                >
                  <Box
                    sx={{
                      position: 'relative',
                      ...animations.float,
                    }}
                  >
                    <Box
                      component="img"
                      src={`${process.env.PUBLIC_URL}/doom-icon.png`}
                      alt="DOOM Mundial 2026"
                      sx={{ 
                        width: { xs: 200, sm: 250, md: 300 },
                        height: { xs: 200, sm: 250, md: 300 },
                        opacity: 1,
                        filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.3))',
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
                        borderRadius: '50%',
                        padding: 2,
                        objectFit: 'contain',
                      }} 
                    />
                    <Celebration
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        fontSize: { xs: 40, md: 60 },
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

      {/* Humanized Trust Statistics Section */}
      <Container maxWidth="lg" sx={{ mt: 8, py: 4, position: 'relative', zIndex: 1 }}>
        <Fade in={statsVisible} timeout={1500}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 3.5, 
                background: 'white',
                border: '2px solid',
                borderColor: '#f0f0f0',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'transparent', width: 50, height: 50, fontSize: '2rem' }}>
                    🛡️
                  </Avatar>
                </Box>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#00953B' }}>
                  {trustStats.verifiedUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.95rem' }}>
                  Vecinos Ya Confían
                </Typography>
                <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  en DOOM
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 3.5,
                background: 'white',
                border: '2px solid',
                borderColor: '#f0f0f0',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'transparent', width: 50, height: 50, fontSize: '2rem' }}>
                    ⭐
                  </Avatar>
                </Box>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#00953B' }}>
                  {trustStats.averageRating}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.95rem' }}>
                  "Me cambió la vida"
                </Typography>
                <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  - Juan, Plomero
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 3.5,
                background: 'white',
                border: '2px solid',
                borderColor: '#f0f0f0',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'transparent', width: 50, height: 50, fontSize: '2rem' }}>
                    ✅
                  </Avatar>
                </Box>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#00953B' }}>
                  {trustStats.successfulJobs.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.95rem' }}>
                  Familias Beneficiadas
                </Typography>
                <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  este mes
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 3.5,
                background: 'white',
                border: '2px solid',
                borderColor: '#f0f0f0',
                borderRadius: '16px',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10,
                  width: 8,
                  height: 8,
                  bgcolor: '#4CAF50',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  }
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'transparent', width: 50, height: 50, fontSize: '2rem' }}>
                    👥
                  </Avatar>
                </Box>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#00953B' }}>
                  {trustStats.activeWorkers.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.95rem' }}>
                  Trabajando Ahora
                </Typography>
                <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  EN VIVO
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      </Container>

      {/* Story of the Week Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Zoom in={isVisible} timeout={1200}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8E1 100%)',
              border: '3px solid',
              borderColor: '#FFB300',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={7} sx={{ p: 4 }}>
                  <Chip
                    label="HISTORIA DE LA SEMANA"
                    sx={{
                      bgcolor: '#FFB300',
                      color: 'white',
                      fontWeight: 700,
                      mb: 3,
                    }}
                  />
                  <Typography variant="h3" fontWeight={800} gutterBottom color="primary.dark">
                    {weeklyStory.name}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    {weeklyStory.role}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontStyle: 'italic',
                      my: 3,
                      position: 'relative',
                      pl: 4,
                      color: 'text.primary',
                      '&::before': {
                        content: '"\u201C"',
                        position: 'absolute',
                        left: 0,
                        top: -10,
                        fontSize: '3rem',
                        color: '#FFB300',
                        fontFamily: 'Georgia, serif',
                      }
                    }}
                  >
                    {weeklyStory.quote}
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={3}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ANTES</Typography>
                        <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {weeklyStory.before}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AHORA</Typography>
                        <Typography variant="h6" fontWeight={700} color="success.main">
                          {weeklyStory.after}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TRABAJOS</Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          {weeklyStory.jobsCompleted}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CALIFICACIÓN</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="h6" fontWeight={700}>{weeklyStory.rating}</Typography>
                          <Star sx={{ color: '#FFB300', fontSize: 20 }} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      Conoce Más Historias Como Esta
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={5} sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  minHeight: 400,
                }}>
                  <Avatar
                    sx={{
                      width: 200,
                      height: 200,
                      fontSize: '5rem',
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      border: '4px solid white',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                  >
                    {weeklyStory.image}
                  </Avatar>
                  <Chip
                    label={weeklyStory.timeFrame}
                    sx={{
                      position: 'absolute',
                      bottom: 30,
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      px: 2,
                      py: 3,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Zoom>
      </Container>

      {/* Popular Trades Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} component="section" aria-labelledby="popular-trades-title">
        <Typography 
          id="popular-trades-title"
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Oficios que Construyen el Mundial
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          Cada trabajo cuenta, cada trabajador importa
        </Typography>
        
        <Grid container spacing={3}>
          {popularTrades.map((trade, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Grow in={isVisible} timeout={1000 + index * 100}>
                <Card
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver oportunidades de ${trade.name}`}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    position: 'relative',
                    background: `linear-gradient(135deg, ${alpha(trade.color, 0.05)} 0%, ${alpha(trade.color, 0.02)} 100%)`,
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: trade.color,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: trade.color,
                      boxShadow: `0 12px 24px ${alpha(trade.color, 0.2)}`,
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                      '& .trade-icon': {
                        transform: 'rotate(10deg) scale(1.1)',
                      },
                    },
                    '&:focus-visible': {
                      outline: `3px solid ${trade.color}`,
                      outlineOffset: 2,
                    },
                  }}
                  onClick={() => navigate('/workers')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/workers')}
                >
                  <CardContent sx={{ p: 2 }}>
                    {/* Highlight Badge */}
                    <Chip
                      label={trade.highlight}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: trade.color,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                    
                    <Avatar
                      className="trade-icon"
                      sx={{
                        bgcolor: alpha(trade.color, 0.15),
                        color: trade.color,
                        width: 56,
                        height: 56,
                        margin: '0 auto 12px',
                        transition: 'transform 0.3s ease',
                      }}
                      aria-hidden="true"
                    >
                      {trade.icon}
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 0.5 }}>
                      {trade.name}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: trade.color,
                        fontWeight: 600,
                        display: 'block',
                        mb: 1.5,
                      }}
                    >
                      {trade.tagline}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      {trade.count}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {trade.growth} esta semana
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }} component="section" aria-labelledby="features-title">
        <Container maxWidth="lg">
          <Typography 
            id="features-title"
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            {t('sections.features.title', '¿Por qué elegir DOOM?')}
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6 }}
          >
            {t('sections.features.subtitle', 'La plataforma oficial para el Mundial 2026 en Álvaro Obregón')}
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
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {feature.description}
                      </Typography>
                      <Chip 
                        label={feature.stats}
                        size="small"
                        sx={{
                          bgcolor: alpha(feature.color, 0.1),
                          color: feature.color,
                          fontWeight: 500,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} component="section" aria-labelledby="success-stories-title">
        <Typography 
          id="success-stories-title"
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          fontWeight={600}
          sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
        >
          {t('sections.successStories.title', 'Historias de Éxito')}
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          {t('sections.successStories.subtitle', 'Personas reales, oportunidades reales')}
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 2,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '1.25rem',
                          fontWeight: 600,
                        }}
                      >
                        {story.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {story.name}
                          </Typography>
                          {story.verified && (
                            <VerifiedUser 
                              sx={{ 
                                fontSize: 18, 
                                color: theme.palette.primary.main,
                              }}
                              titleAccess="Usuario verificado"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="primary">
                          {story.role}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {story.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        position: 'relative',
                        pl: 3,
                        '&::before': {
                          content: '"""',
                          fontSize: '2rem',
                          color: theme.palette.primary.light,
                          position: 'absolute',
                          top: -10,
                          left: 0,
                        },
                      }}
                    >
                      {story.quote}
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 2, alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex' }} aria-label={`Calificación: ${story.rating} estrellas`}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            sx={{ 
                              color: i < story.rating ? '#FFC107' : '#E0E0E0', 
                              fontSize: 20 
                            }} 
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#00953B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {story.rating}.0
                      </Typography>
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
        component="section"
        aria-labelledby="cta-title"
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
          py: 8,
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
            <CardContent sx={{ textAlign: 'center', p: { xs: 4, md: 6 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }} aria-hidden="true">
                <LocationOn sx={{ fontSize: 60, color: theme.palette.primary.main, mr: 2 }} />
                <Box
                  component="img"
                  src={`${process.env.PUBLIC_URL}/doom-icon.png`}
                  alt="DOOM"
                  sx={{ 
                    width: 60, 
                    height: 60,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </Box>
              
              <Typography 
                id="cta-title"
                variant="h3" 
                component="h2"
                gutterBottom 
                fontWeight="bold" 
                color="primary"
                sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
              >
                {t('cta.title', 'Álvaro Obregón se prepara para el Mundial')}
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                {t('cta.description', 'Con ubicación estratégica cerca del Estadio Azteca, Santa Fe e Insurgentes, nuestra alcaldía será clave en el Mundial 2026.')}
              </Typography>
              
              {/* Stats Grid */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: { xs: 2, md: 4 }, 
                  my: 4,
                  flexWrap: 'wrap',
                }}
                role="list"
                aria-label="Estadísticas del Mundial 2026"
              >
                <Box role="listitem">
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    2026
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('stats.year', 'Año del Mundial')}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                <Box role="listitem">
                  <Typography variant="h3" fontWeight="bold" color="secondary.main">
                    48
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('stats.teams', 'Equipos participantes')}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                <Box role="listitem">
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('stats.jobs', 'Empleos esperados')}
                  </Typography>
                </Box>
              </Box>
              
              {/* Countdown Timer */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Schedule sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    {daysUntilWorldCup} días para el Mundial
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('countdown.message', '¡Prepárate ahora para las oportunidades que vienen!')}
                </Typography>
              </Paper>
              
              {!currentUser && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                  aria-label="Únete ahora a DOOM"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'scale(1.05)',
                    },
                    '&:focus-visible': {
                      outline: `3px solid ${theme.palette.primary.light}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  {t('cta.button', 'Únete Ahora')}
                </Button>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default HomeOptimized;