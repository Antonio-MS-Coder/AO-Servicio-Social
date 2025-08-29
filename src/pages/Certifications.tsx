import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Badge,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  School,
  Restaurant,
  LocalHospital,
  Security,
  Translate,
  CleaningServices,
  DirectionsCar,
  WorkspacePremium,
  CheckCircle,
  Schedule,
  AttachMoney,
  CalendarMonth,
  Star,
  EmojiEvents,
  TrendingUp,
  Groups,
  Verified,
  Info,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Certification {
  id: string;
  name: string;
  provider: string;
  duration: string;
  price: string;
  icon: React.ReactElement;
  description: string;
  category: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  benefits: string[];
  requirements: string[];
  nextSession: string;
  enrolledCount: number;
  rating: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`certifications-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Certifications: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [enrollDialog, setEnrollDialog] = useState<Certification | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    fetchCertifications();
    if (currentUser) {
      fetchUserEnrollments();
    }
  }, [currentUser]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const certsSnapshot = await getDocs(collection(db, 'certifications'));
      const certsData: Certification[] = certsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Map category to icon
        const getIcon = (category: string) => {
          switch (category) {
            case 'Alimentos y Bebidas': return <Restaurant />;
            case 'Salud': return <LocalHospital />;
            case 'Seguridad': return <Security />;
            case 'Idiomas': return <Translate />;
            case 'Hospitalidad': return <CleaningServices />;
            default: return <School />;
          }
        };
        
        return {
          id: doc.id,
          name: data.name,
          provider: data.provider,
          duration: data.duration,
          price: data.isFree ? 'GRATIS' : `$${data.price}`,
          icon: getIcon(data.category),
          description: data.description,
          category: data.category,
          difficulty: data.level === 'basic' ? 'Básico' : data.level === 'intermediate' ? 'Intermedio' : 'Avanzado',
          benefits: data.benefits || [],
          requirements: data.requirements || [],
          nextSession: data.startDate ? new Date(data.startDate.seconds * 1000).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Próximamente',
          enrolledCount: data.currentStudents || 0,
          rating: 4.5 + Math.random() * 0.5 // Random rating for demo
        };
      });
      setCertifications(certsData);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    try {
      const enrollQuery = query(
        collection(db, 'certificationEnrollments'),
        where('userId', '==', currentUser?.uid)
      );
      const enrollSnapshot = await getDocs(enrollQuery);
      setEnrollments(enrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  // Keep the old hardcoded data as fallback
  const fallbackCertifications: Certification[] = [
    {
      id: 'food_handling',
      name: 'Manejo Higiénico de Alimentos',
      provider: 'COFEPRIS',
      duration: '8 horas',
      price: 'GRATIS',
      icon: <Restaurant />,
      description: 'Certificación obligatoria para trabajar en restaurantes, bares y hoteles. Aprende las normas de higiene y seguridad alimentaria.',
      category: 'Alimentos y Bebidas',
      difficulty: 'Básico',
      benefits: [
        'Certificación oficial COFEPRIS',
        'Válida en todo México',
        'Requisito para trabajar en cocinas',
        'Vigencia de 2 años'
      ],
      requirements: [
        'INE o identificación oficial',
        'Ser mayor de 18 años',
        'Saber leer y escribir'
      ],
      nextSession: '2 de Septiembre, 2025',
      enrolledCount: 156,
      rating: 4.8
    },
    {
      id: 'first_aid',
      name: 'Primeros Auxilios Básicos',
      provider: 'Cruz Roja Mexicana',
      duration: '16 horas',
      price: '$500',
      icon: <LocalHospital />,
      description: 'Aprende a responder en emergencias médicas. Certificación reconocida internacionalmente.',
      category: 'Salud y Seguridad',
      difficulty: 'Básico',
      benefits: [
        'Certificación Cruz Roja',
        'Técnicas de RCP',
        'Manejo de emergencias',
        'Válida 2 años'
      ],
      requirements: [
        'Mayor de 16 años',
        'Disponibilidad de 2 días completos'
      ],
      nextSession: '5 de Septiembre, 2025',
      enrolledCount: 89,
      rating: 4.9
    },
    {
      id: 'security_guard',
      name: 'Guardia de Seguridad Privada',
      provider: 'SSP CDMX',
      duration: '40 horas',
      price: '$1,200',
      icon: <Security />,
      description: 'Certificación oficial para trabajar como guardia de seguridad en eventos, hoteles y establecimientos.',
      category: 'Seguridad',
      difficulty: 'Intermedio',
      benefits: [
        'Registro oficial SSP',
        'Técnicas de seguridad',
        'Manejo de situaciones de riesgo',
        'Oportunidades en el Mundial 2026'
      ],
      requirements: [
        'Carta de no antecedentes penales',
        'Examen médico',
        'Mayor de 21 años',
        'Secundaria terminada'
      ],
      nextSession: '9 de Septiembre, 2025',
      enrolledCount: 234,
      rating: 4.7
    },
    {
      id: 'english_tourism',
      name: 'Inglés Básico para Turismo',
      provider: 'DOOM Academy',
      duration: '30 horas',
      price: 'GRATIS',
      icon: <Translate />,
      description: 'Frases esenciales en inglés para atender turistas durante el Mundial 2026.',
      category: 'Idiomas',
      difficulty: 'Básico',
      benefits: [
        'Material gratuito',
        'Práctica con hablantes nativos',
        'Certificado DOOM',
        'Mejores propinas con turistas'
      ],
      requirements: [
        'Ningún conocimiento previo de inglés',
        'Compromiso de asistencia'
      ],
      nextSession: '1 de Septiembre, 2025',
      enrolledCount: 412,
      rating: 4.6
    },
    {
      id: 'bartender',
      name: 'Bartender Profesional',
      provider: 'Asociación Mexicana de Bartenders',
      duration: '24 horas',
      price: '$1,500',
      icon: <Restaurant />,
      description: 'Aprende coctelería clásica y moderna. Ideal para trabajar en bares de hoteles y restaurantes.',
      category: 'Alimentos y Bebidas',
      difficulty: 'Intermedio',
      benefits: [
        'Recetario de 50+ cocteles',
        'Técnicas de flair básico',
        'Certificación AMB',
        'Kit de herramientas básicas'
      ],
      requirements: [
        'Mayor de 18 años',
        'Experiencia básica en servicio'
      ],
      nextSession: '7 de Septiembre, 2025',
      enrolledCount: 178,
      rating: 4.8
    },
    {
      id: 'cleaning_professional',
      name: 'Limpieza Profesional Hotelera',
      provider: 'ISSA México',
      duration: '20 horas',
      price: '$800',
      icon: <CleaningServices />,
      description: 'Estándares internacionales de limpieza para hoteles 5 estrellas.',
      category: 'Hospitalidad',
      difficulty: 'Básico',
      benefits: [
        'Certificación ISSA',
        'Uso correcto de químicos',
        'Protocolos COVID-19',
        'Demanda alta en hoteles'
      ],
      requirements: [
        'Saber leer y escribir',
        'Disponibilidad inmediata'
      ],
      nextSession: '3 de Septiembre, 2025',
      enrolledCount: 267,
      rating: 4.5
    }
  ];

  const categories = ['Todos', 'Alimentos y Bebidas', 'Salud y Seguridad', 'Seguridad', 'Idiomas', 'Hospitalidad'];

  const filteredCertifications = tabValue === 0 
    ? certifications 
    : certifications.filter(cert => cert.category === categories[tabValue]);

  const handleEnroll = (cert: Certification) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setEnrollDialog(cert);
  };

  const handleConfirmEnroll = async () => {
    if (enrollDialog && phoneNumber && currentUser) {
      try {
        // Save enrollment to Firebase
        await addDoc(collection(db, 'certificationEnrollments'), {
          userId: currentUser.uid,
          userName: userData?.displayName || currentUser.email,
          userEmail: currentUser.email,
          certificationId: enrollDialog.id,
          certificationName: enrollDialog.name,
          status: 'enrolled',
          enrolledAt: Timestamp.now(),
          phoneNumber: phoneNumber
        });
        
        alert(`¡Te has inscrito exitosamente a ${enrollDialog.name}! Te contactaremos al ${phoneNumber} con más información.`);
        setEnrollDialog(null);
        setPhoneNumber('');
        fetchUserEnrollments(); // Refresh enrollments
      } catch (error) {
        console.error('Error enrolling:', error);
        alert('Error al inscribirse. Por favor intenta de nuevo.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Centro de Certificaciones DOOM
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Prepárate para el Mundial 2026 con certificaciones profesionales
        </Typography>
        
        {/* Stats */}
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 3, mb: 4 }}>
          <Grid item>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h4" fontWeight="bold">
                {certifications.reduce((acc, cert) => acc + cert.enrolledCount, 0)}
              </Typography>
              <Typography variant="body2">Trabajadores Certificados</Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h4" fontWeight="bold">{certifications.length}</Typography>
              <Typography variant="body2">Certificaciones Disponibles</Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="h4" fontWeight="bold">95%</Typography>
              <Typography variant="body2">Tasa de Empleo</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Alert for non-logged users */}
      {!currentUser && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>¡Regístrate para inscribirte!</strong> Crea tu cuenta gratuita para acceder a todas las certificaciones.
        </Alert>
      )}

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </Paper>

      {/* Certifications Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <Skeleton variant="circular" width={56} height={56} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="80%" height={32} />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="70%" />
                  <Box mt={2}>
                    <Skeleton variant="rectangular" height={40} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredCertifications.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No hay certificaciones disponibles en esta categoría
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredCertifications.map((cert) => (
          <Grid item xs={12} md={6} lg={4} key={cert.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                {/* Header */}
                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {cert.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {cert.name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={cert.provider} size="small" />
                      <Chip 
                        label={cert.difficulty} 
                        size="small" 
                        color={cert.difficulty === 'Básico' ? 'success' : cert.difficulty === 'Intermedio' ? 'warning' : 'error'}
                      />
                    </Stack>
                  </Box>
                </Box>

                {/* Price and Duration */}
                <Box display="flex" gap={2} mb={2}>
                  <Chip
                    icon={<AttachMoney />}
                    label={cert.price}
                    color={cert.price === 'GRATIS' ? 'success' : 'default'}
                  />
                  <Chip
                    icon={<Schedule />}
                    label={cert.duration}
                    variant="outlined"
                  />
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {cert.description}
                </Typography>

                {/* Stats */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Groups fontSize="small" />
                    <Typography variant="caption">
                      {cert.enrolledCount} inscritos
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Star fontSize="small" color="warning" />
                    <Typography variant="caption">
                      {cert.rating}
                    </Typography>
                  </Box>
                </Box>

                {/* Benefits */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Beneficios:
                  </Typography>
                  <List dense>
                    {cert.benefits.slice(0, 3).map((benefit, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="caption">{benefit}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Next Session */}
                <Alert severity="info" icon={<CalendarMonth />} sx={{ py: 0.5 }}>
                  <Typography variant="caption">
                    Próxima sesión: <strong>{cert.nextSession}</strong>
                  </Typography>
                </Alert>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  startIcon={<School />}
                  onClick={() => handleEnroll(cert)}
                >
                  Inscribirse
                </Button>
              </CardActions>
            </Card>
          </Grid>
          ))
        )}
      </Grid>

      {/* Why Get Certified Section */}
      <Paper sx={{ mt: 6, p: 4, bgcolor: 'primary.light' }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.contrastText">
          ¿Por qué certificarte con DOOM?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={2}>
              <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" color="primary.contrastText">
                  Oportunidades Mundial 2026
                </Typography>
                <Typography variant="body2" color="primary.contrastText" sx={{ opacity: 0.9 }}>
                  Miles de empleos temporales en hoteles, restaurantes y eventos
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={2}>
              <Verified sx={{ fontSize: 40, color: 'success.main' }} />
              <Box>
                <Typography variant="h6" color="primary.contrastText">
                  Certificaciones Oficiales
                </Typography>
                <Typography variant="body2" color="primary.contrastText" sx={{ opacity: 0.9 }}>
                  Reconocidas por el gobierno y empresas internacionales
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={2}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" color="primary.contrastText">
                  Mejores Salarios
                </Typography>
                <Typography variant="body2" color="primary.contrastText" sx={{ opacity: 0.9 }}>
                  Trabajadores certificados ganan hasta 40% más
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Enrollment Dialog */}
      <Dialog open={Boolean(enrollDialog)} onClose={() => setEnrollDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Inscripción a {enrollDialog?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              ¡Felicidades por dar este paso! Esta certificación te abrirá muchas puertas.
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom>
              Información del curso:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Proveedor" secondary={enrollDialog?.provider} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Duración" secondary={enrollDialog?.duration} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Precio" secondary={enrollDialog?.price} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Próxima sesión" secondary={enrollDialog?.nextSession} />
              </ListItem>
            </List>

            <TextField
              fullWidth
              label="Número de WhatsApp"
              placeholder="55 1234 5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mt: 2 }}
              helperText="Te contactaremos con los detalles del curso"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialog(null)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmEnroll}
            disabled={!phoneNumber}
          >
            Confirmar Inscripción
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Certifications;