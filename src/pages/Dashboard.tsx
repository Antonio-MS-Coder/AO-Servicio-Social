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
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Work,
  People,
  Star,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { JobPosting, JobApplication } from '../types';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    completedJobs: 0,
    rating: 0
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    // Redirect workers to their dedicated dashboard
    if (userData?.role === 'worker') {
      navigate('/worker-dashboard');
      return;
    }
    
    if (currentUser) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser, userData, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (userData?.role === 'worker') {
        // Fetch worker statistics - simplified query to avoid index issues
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('workerId', '==', currentUser!.uid),
          limit(5)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery).catch(() => ({ size: 0, forEach: () => {} } as any));
        
        setStats({
          activeJobs: 0,
          applications: applicationsSnapshot.size,
          completedJobs: 0,
          rating: 4.5
        });
        
        const apps: any[] = [];
        applicationsSnapshot.forEach((doc: any) => {
          apps.push({ id: doc.id, ...doc.data() });
        });
        setRecentItems(apps);
      } else {
        // Fetch employer statistics - simplified query to avoid index issues
        const jobsQuery = query(
          collection(db, 'jobs'),
          where('employerId', '==', currentUser!.uid),
          limit(5)
        );
        const jobsSnapshot = await getDocs(jobsQuery).catch(() => ({ size: 0, forEach: () => {} } as any));
        
        setStats({
          activeJobs: jobsSnapshot.size,
          applications: 0,
          completedJobs: 0,
          rating: 4.5
        });
        
        const jobs: any[] = [];
        jobsSnapshot.forEach((doc: any) => {
          jobs.push({ id: doc.id, ...doc.data() });
        });
        setRecentItems(jobs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = userData?.role === 'worker' ? [
    { title: 'Aplicaciones Enviadas', value: stats.applications, icon: <Assignment />, color: '#1976d2' },
    { title: 'Trabajos Activos', value: stats.activeJobs, icon: <Work />, color: '#2e7d32' },
    { title: 'Trabajos Completados', value: stats.completedJobs, icon: <CheckCircle />, color: '#9c27b0' },
    { title: 'Calificación', value: `${stats.rating}/5`, icon: <Star />, color: '#ed6c02' }
  ] : [
    { title: 'Vacantes Activas', value: stats.activeJobs, icon: <Work />, color: '#1976d2' },
    { title: 'Aplicaciones Recibidas', value: stats.applications, icon: <People />, color: '#2e7d32' },
    { title: 'Contrataciones', value: stats.completedJobs, icon: <CheckCircle />, color: '#9c27b0' },
    { title: 'Calificación', value: `${stats.rating}/5`, icon: <Star />, color: '#ed6c02' }
  ];

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bienvenido, {userData?.email}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            
            {recentItems.length === 0 ? (
              <Typography color="text.secondary">
                No hay actividad reciente
              </Typography>
            ) : (
              <List>
                {recentItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title || item.jobTitle || 'Sin título'}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          {item.status && (
                            <Chip 
                              label={item.status} 
                              size="small"
                              color={item.status === 'open' ? 'success' : 'default'}
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {item.location}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {userData?.role === 'worker' ? (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/jobs')}
                  >
                    Buscar Empleos
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/profile')}
                  >
                    Actualizar Perfil
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/post-job')}
                  >
                    Publicar Empleo
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/workers')}
                  >
                    Buscar Trabajadores
                  </Button>
                </>
              )}
            </Box>
          </Paper>
          
          {/* Tips */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tips para el Mundial 2026
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Completa tu perfil"
                  secondary="Los perfiles completos tienen 3x más oportunidades"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Obtén certificaciones"
                  secondary="Los trabajadores certificados ganan 25% más"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Mantén tu disponibilidad actualizada"
                  secondary="Aparece en las búsquedas cuando estés disponible"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;