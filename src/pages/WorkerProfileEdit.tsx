import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Rating,
  Divider,
  Stack,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  FormGroup,
  Checkbox
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  PhotoCamera,
  Upload,
  Delete,
  Save,
  CheckCircle,
  Work,
  School,
  LocationOn,
  AttachMoney,
  CalendarMonth,
  Language,
  Build,
  Star,
  Add,
  Edit,
  Verified,
  LocalHospital,
  Restaurant,
  DirectionsCar,
  Security,
  CleaningServices,
  Translate,
  WorkspacePremium,
  EmojiEvents,
  Person,
  Phone,
  Email as EmailIcon,
  WhatsApp,
  Facebook,
  Instagram,
  Schedule,
  Construction,
  Handyman,
  CleanHands
} from '@mui/icons-material';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Trade } from '../types';

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
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const WorkerProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [profileComplete, setProfileComplete] = useState(0);
  
  // Worker profile state - properly structured
  const [profile, setProfile] = useState({
    userId: '',
    name: '',
    trade: Trade.OTHER,
    secondaryTrades: [] as Trade[],
    experience: 0,
    location: '',
    bio: '',
    available: true,
    certifications: [],
    rating: 0,
    totalRatings: 0,
    photoUrl: '',
    phone: '',
    email: '',
    whatsapp: '',
    hourlyRate: 0,
    skills: [] as string[],
    languages: [] as string[],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    preferredAreas: [] as string[]
  });

  const allSkills = [
    'Atención al cliente',
    'Trabajo en equipo',
    'Puntualidad',
    'Responsabilidad',
    'Comunicación efectiva',
    'Resolución de problemas',
    'Manejo de efectivo',
    'Inventario',
    'Limpieza profunda',
    'Protocolos de seguridad',
    'Primeros auxilios',
    'Manejo de alimentos',
    'Coctelería',
    'Servicio de mesa',
    'Mantenimiento básico',
    'Herramientas eléctricas',
    'Plomería básica',
    'Pintura',
    'Carpintería',
    'Jardinería'
  ];

  const alvaroObregonAreas = [
    'Santa Fe',
    'San Ángel',
    'San Ángel Inn',
    'Florida',
    'Guadalupe Inn',
    'Chimalistac',
    'Tlacopac',
    'Las Águilas',
    'Olivar de los Padres',
    'Mixcoac',
    'Alfonso XIII',
    'Progreso Tizapán',
    'Barrio Norte',
    'Lomas de Plateros',
    'Merced Gómez'
  ];

  const availableCertifications = [
    { 
      id: 'food_handling',
      name: 'Manejo Higiénico de Alimentos',
      provider: 'COFEPRIS',
      duration: '8 horas',
      price: 'Gratis',
      icon: <Restaurant />,
      description: 'Certificación obligatoria para trabajar en restaurantes y bares'
    },
    {
      id: 'first_aid',
      name: 'Primeros Auxilios Básicos',
      provider: 'Cruz Roja',
      duration: '16 horas',
      price: '$500',
      icon: <LocalHospital />,
      description: 'Aprende a responder en emergencias médicas'
    },
    {
      id: 'security_guard',
      name: 'Guardia de Seguridad',
      provider: 'SSP CDMX',
      duration: '40 horas',
      price: '$1,200',
      icon: <Security />,
      description: 'Certificación para trabajar en seguridad privada'
    },
    {
      id: 'english_basic',
      name: 'Inglés Básico para Turismo',
      provider: 'DOOM Academy',
      duration: '30 horas',
      price: 'Gratis',
      icon: <Translate />,
      description: 'Frases esenciales en inglés para atender turistas'
    },
    {
      id: 'cleaning_professional',
      name: 'Limpieza Profesional',
      provider: 'ISSA México',
      duration: '20 horas',
      price: '$800',
      icon: <CleaningServices />,
      description: 'Técnicas profesionales de limpieza e higiene'
    },
    {
      id: 'bartender_basic',
      name: 'Bartender Básico',
      provider: 'Asociación Mexicana de Bartenders',
      duration: '24 horas',
      price: '$1,500',
      icon: <Restaurant />,
      description: 'Coctelería básica y servicio de bar'
    }
  ];

  useEffect(() => {
    if (currentUser && userData?.role === 'worker') {
      fetchProfile();
    } else if (userData?.role !== 'worker') {
      // Redirect if not a worker
      navigate('/profile');
    }
  }, [currentUser, userData, navigate]);

  useEffect(() => {
    calculateProfileComplete();
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileDoc = await getDoc(doc(db, 'workers', currentUser!.uid));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          ...profile,
          ...data,
          email: data.email || userData?.email || '',
          name: data.name || userData?.displayName || ''
        });
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          ...profile,
          userId: currentUser!.uid,
          name: userData?.displayName || '',
          email: userData?.email || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'workers', currentUser!.uid), initialProfile);
        setProfile(initialProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileComplete = () => {
    let complete = 0;
    const checks = [
      profile.name,
      profile.photoUrl,
      profile.trade !== Trade.OTHER,
      profile.experience > 0,
      profile.location,
      profile.bio,
      profile.phone || profile.whatsapp,
      profile.skills.length > 0,
      profile.hourlyRate > 0,
      profile.preferredAreas.length > 0
    ];
    
    checks.forEach(check => {
      if (check) complete += 10;
    });
    
    setProfileComplete(complete);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const storageRef = ref(storage, `profile-photos/${currentUser!.uid}`);
      
      try {
        setSaving(true);
        const snapshot = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(snapshot.ref);
        
        setProfile({ ...profile, photoUrl: photoURL });
        setMessage({ type: 'success', text: 'Foto actualizada correctamente' });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setMessage({ type: 'error', text: 'Error al subir la foto' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!profile.name || !profile.location || profile.trade === Trade.OTHER) {
        setMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos' });
        return;
      }
      
      await updateDoc(doc(db, 'workers', currentUser!.uid), {
        ...profile,
        updatedAt: new Date()
      });
      
      setMessage({ type: 'success', text: '✅ Perfil actualizado correctamente' });
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Error al guardar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (profile.skills.includes(skill)) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(s => s !== skill)
      });
    } else {
      setProfile({
        ...profile,
        skills: [...profile.skills, skill]
      });
    }
  };

  const toggleArea = (area: string) => {
    if (profile.preferredAreas.includes(area)) {
      setProfile({
        ...profile,
        preferredAreas: profile.preferredAreas.filter(a => a !== area)
      });
    } else {
      setProfile({
        ...profile,
        preferredAreas: [...profile.preferredAreas, area]
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando perfil...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mi Perfil de Trabajador
      </Typography>

      {/* Profile Completion Card */}
      <Card sx={{ mb: 3, bgcolor: profileComplete >= 80 ? 'success.light' : 'warning.light' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <CircularProgress 
              variant="determinate" 
              value={profileComplete}
              size={80}
              thickness={5}
              sx={{
                color: profileComplete >= 80 ? 'success.main' : 
                       profileComplete >= 50 ? 'warning.main' : 'error.main'
              }}
            />
            <Box flex={1}>
              <Typography variant="h6">
                Tu perfil está {profileComplete}% completo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileComplete < 100 
                  ? 'Completa tu perfil para tener más oportunidades de trabajo'
                  : '¡Excelente! Tu perfil está completo'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Información Personal" />
          <Tab label="Habilidades" />
          <Tab label="Certificaciones" />
          <Tab label="Disponibilidad" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar
                src={profile.photoUrl}
                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
              >
                {profile.name?.[0] || <Person />}
              </Avatar>
              <input
                accept="image/*"
                type="file"
                id="photo-upload"
                hidden
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={saving}
                  fullWidth
                >
                  Subir Foto
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                * Una buena foto aumenta tus oportunidades
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    error={!profile.name}
                    helperText={!profile.name ? 'Campo requerido' : ''}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Oficio Principal"
                    value={profile.trade}
                    onChange={(e) => setProfile({ ...profile, trade: e.target.value as Trade })}
                    required
                    error={profile.trade === Trade.OTHER}
                    helperText={profile.trade === Trade.OTHER ? 'Selecciona tu oficio principal' : ''}
                  >
                    {Object.values(Trade).map((trade) => (
                      <MenuItem key={trade} value={trade}>
                        {t(`trades.${trade}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Años de Experiencia"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                    InputProps={{
                      inputProps: { min: 0, max: 50 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación (Colonia)"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Ej: Santa Fe, Álvaro Obregón"
                    required
                    error={!profile.location}
                    helperText={!profile.location ? 'Campo requerido' : 'Indica tu colonia en Álvaro Obregón'}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tarifa por Hora"
                    value={profile.hourlyRate || ''}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Tu tarifa esperada por hora de trabajo"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Acerca de mí"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Describe tu experiencia, habilidades especiales y lo que te hace único..."
                    helperText={`${profile.bio.length}/500 caracteres`}
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Información de Contacto" size="small" />
                  </Divider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="55 1234 5678"
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="WhatsApp"
                    value={profile.whatsapp}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    placeholder="55 1234 5678"
                    InputProps={{
                      startAdornment: <WhatsApp sx={{ mr: 1, color: 'success.main' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.available}
                        onChange={(e) => setProfile({ ...profile, available: e.target.checked })}
                        color="success"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        {profile.available ? (
                          <>
                            <CheckCircle color="success" />
                            <Typography>Disponible para trabajar</Typography>
                          </>
                        ) : (
                          <>
                            <Schedule color="disabled" />
                            <Typography>No disponible actualmente</Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Selecciona tus habilidades
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Marca todas las habilidades que dominas. Esto ayudará a los empleadores a encontrarte.
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {allSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onClick={() => toggleSkill(skill)}
                color={profile.skills.includes(skill) ? 'primary' : 'default'}
                variant={profile.skills.includes(skill) ? 'filled' : 'outlined'}
                icon={profile.skills.includes(skill) ? <CheckCircle /> : undefined}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Idiomas
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox defaultChecked disabled />}
              label="Español (Nativo)"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={profile.languages.includes('english_basic')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile({ ...profile, languages: [...profile.languages, 'english_basic'] });
                    } else {
                      setProfile({ ...profile, languages: profile.languages.filter(l => l !== 'english_basic') });
                    }
                  }}
                />
              }
              label="Inglés Básico"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={profile.languages.includes('english_intermediate')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile({ ...profile, languages: [...profile.languages, 'english_intermediate'] });
                    } else {
                      setProfile({ ...profile, languages: profile.languages.filter(l => l !== 'english_intermediate') });
                    }
                  }}
                />
              }
              label="Inglés Intermedio"
            />
          </FormGroup>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Certificaciones Disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Obtén certificaciones gratuitas o de bajo costo para mejorar tu perfil
          </Typography>

          <Grid container spacing={2}>
            {availableCertifications.map((cert) => (
              <Grid item xs={12} md={6} key={cert.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {cert.icon}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {cert.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {cert.description}
                        </Typography>
                        <Stack direction="row" spacing={1} mb={1}>
                          <Chip label={cert.provider} size="small" />
                          <Chip label={cert.duration} size="small" variant="outlined" />
                          <Chip 
                            label={cert.price} 
                            size="small" 
                            color={cert.price === 'Gratis' ? 'success' : 'default'}
                          />
                        </Stack>
                        <Button 
                          variant="contained" 
                          size="small"
                          startIcon={<School />}
                          onClick={() => {
                            setMessage({ 
                              type: 'success', 
                              text: `Te hemos registrado para ${cert.name}. Recibirás más información por WhatsApp.` 
                            });
                          }}
                        >
                          Inscribirse
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Días Disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Marca los días que puedes trabajar
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { day: 'Lunes', key: 'monday' },
              { day: 'Martes', key: 'tuesday' },
              { day: 'Miércoles', key: 'wednesday' },
              { day: 'Jueves', key: 'thursday' },
              { day: 'Viernes', key: 'friday' },
              { day: 'Sábado', key: 'saturday' },
              { day: 'Domingo', key: 'sunday' }
            ].map(({ day, key }) => (
              <Grid item xs={6} sm={4} md={3} key={key}>
                <Card variant="outlined" sx={{ 
                  bgcolor: profile.availability[key as keyof typeof profile.availability] ? 'success.light' : 'grey.100' 
                }}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.availability[key as keyof typeof profile.availability]}
                          onChange={(e) => {
                            setProfile({
                              ...profile,
                              availability: {
                                ...profile.availability,
                                [key]: e.target.checked
                              }
                            });
                          }}
                          color="success"
                        />
                      }
                      label={day}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Zonas de Trabajo Preferidas
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecciona las colonias de Álvaro Obregón donde prefieres trabajar
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {alvaroObregonAreas.map((area) => (
              <Chip
                key={area}
                label={area}
                onClick={() => toggleArea(area)}
                color={profile.preferredAreas.includes(area) ? 'primary' : 'default'}
                variant={profile.preferredAreas.includes(area) ? 'filled' : 'outlined'}
                icon={profile.preferredAreas.includes(area) ? <LocationOn /> : undefined}
              />
            ))}
          </Box>
        </TabPanel>
      </Paper>

      {/* Save Actions */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving || profileComplete < 50}
        >
          {saving ? <CircularProgress size={24} /> : 'Guardar Perfil'}
        </Button>
      </Box>
    </Container>
  );
};

export default WorkerProfileEdit;