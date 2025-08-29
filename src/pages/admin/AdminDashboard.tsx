import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
  Stack,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  Business,
  School,
  Assessment,
  Settings,
  Notifications,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
  Work,
  Assignment,
  SupervisorAccount,
  VerifiedUser,
  Block,
  ArrowUpward,
  ArrowDownward,
  CalendarMonth,
  LocationOn,
  Flag,
  CloudUpload
} from '@mui/icons-material';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalWorkers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalCertifications: number;
  verifiedCompanies: number;
  blockedUsers: number;
  todayRegistrations: number;
  weeklyGrowth: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalCertifications: 0,
    verifiedCompanies: 0,
    blockedUsers: 0,
    todayRegistrations: 0,
    weeklyGrowth: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (userData?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [userData, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all statistics
      const [
        workersSnapshot,
        employersSnapshot,
        jobsSnapshot,
        activeJobsSnapshot,
        applicationsSnapshot
      ] = await Promise.all([
        getDocs(collection(db, 'workers')),
        getDocs(collection(db, 'employers')),
        getDocs(collection(db, 'jobs')),
        getDocs(query(collection(db, 'jobs'), where('status', '==', 'open'))),
        getDocs(collection(db, 'applications'))
      ]);

      // Calculate today's registrations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let todayCount = 0;
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt?.toDate() >= today) {
          todayCount++;
        }
      });

      setStats({
        totalWorkers: workersSnapshot.size,
        totalEmployers: employersSnapshot.size,
        totalJobs: jobsSnapshot.size,
        activeJobs: activeJobsSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        totalCertifications: 6, // Hardcoded for now
        verifiedCompanies: Math.floor(employersSnapshot.size * 0.3), // Mock data
        blockedUsers: 0,
        todayRegistrations: todayCount,
        weeklyGrowth: 15.3 // Mock data
      });

      // Fetch recent activities (mock data for now)
      setRecentActivities([
        { type: 'registration', user: 'Juan Pérez', time: '5 minutos', icon: <People />, color: 'primary' },
        { type: 'job', company: 'Hotel Camino Real', title: 'Mesero', time: '15 minutos', icon: <Work />, color: 'success' },
        { type: 'certification', user: 'María González', cert: 'Inglés Básico', time: '1 hora', icon: <School />, color: 'info' },
        { type: 'application', user: 'Carlos Ruiz', job: 'Bartender', time: '2 horas', icon: <Assignment />, color: 'warning' },
        { type: 'verification', company: 'Restaurante El Cardenal', time: '3 horas', icon: <VerifiedUser />, color: 'success' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const registrationChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Trabajadores',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Empleadores',
        data: [5, 8, 6, 10, 9, 12, 11],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const jobsByTradeData = {
    labels: ['Meseros', 'Cocineros', 'Seguridad', 'Limpieza', 'Conductores', 'Otros'],
    datasets: [{
      data: [35, 25, 20, 15, 10, 15],
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main
      ]
    }]
  };

  const applicationStatusData = {
    labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
    datasets: [{
      label: 'Aplicaciones',
      data: [150, 89, 45],
      backgroundColor: [
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.error.main
      ]
    }]
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Panel de Administración - Alcaldía Álvaro Obregón
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sistema de Gestión DOOM - Mundial 2026
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalWorkers}
                  </Typography>
                  <Typography variant="body2">Trabajadores</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <ArrowUpward fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">
                  +{stats.weeklyGrowth}% esta semana
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalEmployers}
                  </Typography>
                  <Typography variant="body2">Empleadores</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Business />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <VerifiedUser fontSize="small" color="success" />
                <Typography variant="caption">
                  {stats.verifiedCompanies} verificados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.activeJobs}
                  </Typography>
                  <Typography variant="body2">Trabajos Activos</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Work />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="caption" color="text.secondary">
                  De {stats.totalJobs} totales
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalApplications}
                  </Typography>
                  <Typography variant="body2">Aplicaciones</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="caption">
                  {stats.todayRegistrations} hoy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<People />}
              onClick={() => navigate('/admin/users')}
            >
              Gestionar Usuarios
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<School />}
              onClick={() => navigate('/admin/certifications')}
            >
              Gestionar Certificaciones
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="warning"
              startIcon={<Assessment />}
              onClick={() => navigate('/admin/content')}
            >
              Gestionar Contenido
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              startIcon={<Business />}
              onClick={() => navigate('/admin/companies')}
            >
              Verificar Empresas
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => navigate('/admin/reports')}
            >
              Ver Reportes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Block />}
              onClick={() => navigate('/admin/blocked')}
            >
              Usuarios Bloqueados ({stats.blockedUsers})
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="info"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/admin/seed')}
            >
              Datos de Prueba
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Registration Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tendencia de Registros - Última Semana
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={registrationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Jobs by Trade */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Trabajos por Oficio
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={jobsByTradeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Actividad Reciente
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} divider={index < recentActivities.length - 1}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${activity.color}.light`, width: 36, height: 36 }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      activity.type === 'registration' ? `Nuevo registro: ${activity.user}` :
                      activity.type === 'job' ? `Nuevo trabajo: ${activity.title} - ${activity.company}` :
                      activity.type === 'certification' ? `${activity.user} se inscribió a ${activity.cert}` :
                      activity.type === 'application' ? `${activity.user} aplicó a ${activity.job}` :
                      `${activity.company} fue verificada`
                    }
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Application Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Estado de Aplicaciones
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar 
                data={applicationStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Mundial 2026 Countdown */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #007A33 0%, #f7991c 100%)',
            color: 'white'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Cuenta Regresiva Mundial 2026
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                  542 días
                </Typography>
                <Typography variant="subtitle1">
                  para el inicio del Mundial en México
                </Typography>
              </Box>
              <Flag sx={{ fontSize: 80, opacity: 0.5 }} />
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6">Meta de Trabajadores</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.totalWorkers / 5000) * 100}
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                  <Typography variant="caption">
                    {stats.totalWorkers} / 5,000
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6">Meta de Empleadores</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.totalEmployers / 500) * 100}
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                  <Typography variant="caption">
                    {stats.totalEmployers} / 500
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6">Meta de Certificaciones</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={30}
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                  <Typography variant="caption">
                    1,500 / 5,000
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6">Preparación General</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={45}
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                  <Typography variant="caption">
                    45% Completado
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;