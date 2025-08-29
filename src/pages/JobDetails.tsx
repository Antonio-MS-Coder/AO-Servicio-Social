import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  Schedule,
  Work,
  Person,
  Business,
  Star,
  ArrowBack,
  Share,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  Warning,
  CalendarToday,
  Group,
  Verified
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { JobPosting, Trade } from '../types';
import ApplicationManager from '../components/applications/ApplicationManager';
import ChatDialog from '../components/chat/ChatDialog';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [employerData, setEmployerData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
      checkIfSaved();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const jobDoc = await getDoc(doc(db, 'jobs', id));
      
      if (jobDoc.exists()) {
        const jobData = { id: jobDoc.id, ...jobDoc.data() } as JobPosting;
        setJob(jobData);
        
        // Fetch employer data
        if (jobData.employerId) {
          const employerDoc = await getDoc(doc(db, 'employers', jobData.employerId));
          if (employerDoc.exists()) {
            setEmployerData(employerDoc.data());
          }
        }
      } else {
        setError('Trabajo no encontrado');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Error al cargar los detalles del trabajo');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = () => {
    const savedJobs = localStorage.getItem('savedJobs');
    if (savedJobs && id) {
      const saved = JSON.parse(savedJobs);
      setSaved(saved.includes(id));
    }
  };

  const handleSaveJob = () => {
    if (!id) return;
    
    const savedJobs = localStorage.getItem('savedJobs');
    let saved = savedJobs ? JSON.parse(savedJobs) : [];
    
    if (saved.includes(id)) {
      saved = saved.filter((jobId: string) => jobId !== id);
      setSaved(false);
    } else {
      saved.push(id);
      setSaved(true);
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(saved));
  };

  const handleShare = () => {
    if (navigator.share && job) {
      navigator.share({
        title: job.title,
        text: `${job.title} - ${job.location}`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Trabajo no encontrado'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mt: 2 }}
        >
          Volver a trabajos
        </Button>
      </Container>
    );
  }

  const isEmployer = userData?.role === 'employer';
  const isOwner = job.employerId === currentUser?.uid;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Inicio
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/jobs');
          }}
        >
          Trabajos
        </Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Job Header */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {job.title}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip
                    icon={<Business />}
                    label={job.employerName || 'Empresa'}
                    variant="outlined"
                  />
                  {employerData?.rating > 0 && (
                    <Chip
                      icon={<Star />}
                      label={`${employerData.rating.toFixed(1)} (${employerData.totalRatings})`}
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  {employerData?.verified && (
                    <Chip
                      icon={<Verified />}
                      label="Verificado"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                  <Chip
                    icon={<LocationOn />}
                    label={job.location}
                    color="primary"
                  />
                  <Chip
                    icon={<AttachMoney />}
                    label={`$${job.salary.amount} / ${t(`salary.${job.salary.period}`)}`}
                    color="success"
                  />
                  {job.duration && (
                    <Chip
                      icon={<Schedule />}
                      label={job.duration}
                    />
                  )}
                  <Chip
                    icon={<Work />}
                    label={t(`trades.${job.trade}`)}
                  />
                </Box>
              </Box>

              <Box display="flex" gap={1}>
                <IconButton onClick={handleSaveJob} color="primary">
                  {saved ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Job Description */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Descripción del trabajo
              </Typography>
              <Typography variant="body1" paragraph>
                {job.description}
              </Typography>
            </Box>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Requisitos
                </Typography>
                <List dense>
                  {job.requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Job Status */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Estado:
              </Typography>
              <Chip
                label={job.status === 'open' ? 'Abierto' : 'Cerrado'}
                color={job.status === 'open' ? 'success' : 'default'}
                size="small"
              />
              {job.applicants && (
                <Chip
                  icon={<Group />}
                  label={`${job.applicants.length} aplicantes`}
                  size="small"
                  variant="outlined"
                />
              )}
              <Typography variant="body2" color="text.secondary">
                Publicado: {new Date(job.createdAt).toLocaleDateString('es-MX')}
              </Typography>
            </Box>
          </Paper>

          {/* Applications Section */}
          {(isOwner || !isEmployer) && (
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {isOwner ? 'Aplicaciones recibidas' : 'Tu aplicación'}
              </Typography>
              <ApplicationManager
                jobId={id}
                mode="job"
              />
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Action Card */}
          {!isEmployer && (
            <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ¿Interesado en este trabajo?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Aplica ahora y conecta directamente con el empleador
                </Typography>
                <ApplicationManager
                  jobId={id}
                  mode="job"
                />
              </CardContent>
            </Card>
          )}

          {/* Employer Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre el empleador
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar src={employerData?.logoUrl} sx={{ width: 56, height: 56 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {job.employerName}
                  </Typography>
                  {employerData?.businessType && (
                    <Typography variant="body2" color="text.secondary">
                      {employerData.businessType}
                    </Typography>
                  )}
                </Box>
              </Box>

              {employerData?.description && (
                <Typography variant="body2" paragraph>
                  {employerData.description}
                </Typography>
              )}

              {!isOwner && currentUser && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => setChatOpen(true)}
                >
                  Contactar empleador
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Warning color="warning" />
                <Typography variant="h6">Consejos de seguridad</Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Verifica la identidad del empleador"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Nunca pagues por adelantado"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reúnete en lugares públicos"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reporta actividades sospechosas"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chat Dialog */}
      {job && (
        <ChatDialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          recipientId={job.employerId}
          recipientName={job.employerName}
          recipientPhoto={employerData?.logoUrl}
          jobId={id}
          jobTitle={job.title}
        />
      )}
    </Container>
  );
};

export default JobDetails;