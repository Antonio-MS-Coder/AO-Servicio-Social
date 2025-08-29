import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
  Divider,
  LinearProgress,
  Stack,
  Tooltip
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Work,
  People,
  Star,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  AttachMoney,
  LocationOn,
  Notifications,
  EmojiEvents,
  School,
  CalendarMonth,
  ArrowForward,
  Verified,
  Assessment,
  Restaurant,
  LocalHospital,
  Warning,
  Info,
  Search,
  Edit,
  Person
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { JobPosting, JobApplication } from '../types';

interface DashboardStats {
  profileComplete: number;
  activeApplications: number;
  jobsCompleted: number;
  rating: number;
  totalRatings: number;
  earnings: number;
  certifications: number;
}

const WorkerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    profileComplete: 0,
    activeApplications: 0,
    jobsCompleted: 0,
    rating: 0,
    totalRatings: 0,
    earnings: 0,
    certifications: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState<JobPosting[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [notifications] = useState([
    { id: 1, type: 'cert', message: 'Nueva certificación disponible: Inglés para Turismo', new: true },
    { id: 2, type: 'job', message: 'Tu aplicación fue vista por Hotel Camino Real', new: true },
    { id: 3, type: 'tip', message: 'Completa tu perfil para tener 3x más oportunidades', new: false }
  ]);

  useEffect(() => {
    if (currentUser && userData?.role === 'worker') {
      fetchDashboardData();
    } else if (userData?.role !== 'worker') {
      navigate('/dashboard');
    }
  }, [currentUser, userData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch worker profile
      const profileDoc = await getDoc(doc(db, 'workers', currentUser!.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setProfile(profileData);
        
        // Calculate profile completion
        let complete = 0;
        const checks = [
          profileData.name,
          profileData.photoUrl,
          profileData.trade,
          profileData.experience > 0,
          profileData.location,
          profileData.bio,
          profileData.phone || profileData.whatsapp,
          profileData.certifications?.length > 0,
          profileData.skills?.length > 0,
          profileData.hourlyRate > 0
        ];
        checks.forEach(check => { if (check) complete += 10; });
        
        // Fetch applications
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('workerId', '==', currentUser!.uid),
          orderBy('appliedAt', 'desc'),
          limit(5)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const apps: JobApplication[] = [];
        applicationsSnapshot.forEach((doc) => {
          apps.push({ id: doc.id, ...doc.data() } as JobApplication);
        });
        setMyApplications(apps);
        
        // Fetch recommended jobs based on worker's trade
        if (profileData.trade) {
          const jobsQuery = query(
            collection(db, 'jobs'),
            where('status', '==', 'open'),
            where('trade', '==', profileData.trade),
            orderBy('createdAt', 'desc'),
            limit(3)
          );
          const jobsSnapshot = await getDocs(jobsQuery);
          const jobs: JobPosting[] = [];
          jobsSnapshot.forEach((doc) => {
            jobs.push({ id: doc.id, ...doc.data() } as JobPosting);
          });
          setRecommendedJobs(jobs);
        }
        
        setStats({
          profileComplete: complete,
          activeApplications: apps.filter(a => a.status === 'pending').length,
          jobsCompleted: apps.filter(a => a.status === 'accepted').length,
          rating: profileData.rating || 0,
          totalRatings: profileData.totalRatings || 0,
          earnings: 0,
          certifications: profileData.certifications?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En revisión';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'No seleccionada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          ¡Hola, {profile?.name || userData?.displayName || 'Trabajador'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Profile Completion Alert */}
      {stats.profileComplete < 100 && (
        <Alert 
          severity="info" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/worker-profile-edit')}>
              Completar Perfil
            </Button>
          }
          sx={{ mb: 3 }}
        >
          <strong>Tu perfil está {stats.profileComplete}% completo.</strong> Complétalo para tener 3x más oportunidades de trabajo.
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.activeApplications}
                  </Typography>
                  <Typography variant="body2">
                    Aplicaciones Activas
                  </Typography>
                </Box>
                <Assignment fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.jobsCompleted}
                  </Typography>
                  <Typography variant="body2">
                    Trabajos Completados
                  </Typography>
                </Box>
                <CheckCircle fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.rating > 0 ? stats.rating.toFixed(1) : '0.0'}
                  </Typography>
                  <Typography variant="body2">
                    Calificación
                  </Typography>
                </Box>
                <Star fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.certifications}
                  </Typography>
                  <Typography variant="body2">
                    Certificaciones
                  </Typography>
                </Box>
                <School fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Recommended Jobs */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Trabajos Recomendados para Ti
              </Typography>
              <Button 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/jobs')}
              >
                Ver Todos
              </Button>
            </Box>

            {recommendedJobs.length > 0 ? (
              <Grid container spacing={2}>
                {recommendedJobs.map((job) => (
                  <Grid item xs={12} key={job.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                          <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {job.employerName}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                              <Chip 
                                icon={<LocationOn />} 
                                label={job.location} 
                                size="small" 
                              />
                              <Chip 
                                icon={<AttachMoney />} 
                                label={`$${job.salary.amount}/${job.salary.period}`} 
                                size="small" 
                                color="success"
                              />
                              {job.duration && (
                                <Chip 
                                  icon={<Schedule />} 
                                  label={job.duration} 
                                  size="small" 
                                />
                              )}
                            </Stack>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            Ver Detalles
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No hay trabajos recomendados en este momento
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/jobs')}
                  startIcon={<Search />}
                >
                  Buscar Trabajos
                </Button>
              </Box>
            )}
          </Paper>

          {/* My Applications */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Mis Aplicaciones Recientes
              </Typography>
              <Button 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/dashboard')}
              >
                Ver Todas
              </Button>
            </Box>

            {myApplications.length > 0 ? (
              <List>
                {myApplications.map((application) => (
                  <ListItem key={application.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            Aplicación #{application.id.slice(-6)}
                          </Typography>
                          <Chip
                            label={getApplicationStatusText(application.status)}
                            color={getApplicationStatusColor(application.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption">
                          Aplicado el {new Date(application.appliedAt).toLocaleDateString('es-MX')}
                        </Typography>
                      }
                    />
                    <Button size="small" onClick={() => navigate(`/jobs/${application.jobId}`)}>
                      Ver Trabajo
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No has aplicado a ningún trabajo aún
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/jobs')}
                  startIcon={<Search />}
                >
                  Buscar Trabajos
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar 
                  src={profile?.photoUrl}
                  sx={{ width: 60, height: 60 }}
                >
                  <Person />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {profile?.name || 'Completa tu perfil'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile?.trade ? t(`trades.${profile.trade}`) : 'Sin oficio definido'}
                  </Typography>
                </Box>
              </Box>
              
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Perfil Completo</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.profileComplete}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.profileComplete}
                  sx={{ height: 8, borderRadius: 4 }}
                  color={stats.profileComplete >= 80 ? 'success' : 'warning'}
                />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/worker-profile-edit')}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Notificaciones
                </Typography>
                <Badge badgeContent={notifications.filter(n => n.new).length} color="error">
                  <Notifications />
                </Badge>
              </Box>
              
              <List dense>
                {notifications.map((notif) => (
                  <ListItem key={notif.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: notif.new ? 'primary.light' : 'grey.300' }}>
                        {notif.type === 'cert' ? <School fontSize="small" /> :
                         notif.type === 'job' ? <Work fontSize="small" /> :
                         <Info fontSize="small" />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={notif.new ? 'bold' : 'normal'}>
                          {notif.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={() => navigate('/jobs')}
                >
                  Buscar Trabajos
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<School />}
                  onClick={() => navigate('/worker-profile-edit')}
                >
                  Ver Certificaciones
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  onClick={() => navigate('/worker-profile-edit')}
                >
                  Actualizar Disponibilidad
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WorkerDashboard;