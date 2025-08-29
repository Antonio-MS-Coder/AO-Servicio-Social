import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Rating,
  Divider,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Check,
  Close,
  Chat,
  Star,
  Schedule,
  Work,
  LocationOn,
  AttachMoney,
  MoreVert,
  Person,
  Email,
  Phone,
  Verified
} from '@mui/icons-material';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplication, JobPosting } from '../../types';
import ChatDialog from '../chat/ChatDialog';

interface ApplicationManagerProps {
  jobId?: string;
  workerId?: string;
  mode: 'job' | 'worker' | 'dashboard';
}

const ApplicationManager: React.FC<ApplicationManagerProps> = ({ 
  jobId, 
  workerId,
  mode 
}) => {
  const { t } = useTranslation();
  const { currentUser, userData } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{id: string, name: string, photo?: string} | null>(null);
  const [jobDetails, setJobDetails] = useState<JobPosting | null>(null);

  useEffect(() => {
    fetchApplications();
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, workerId, currentUser]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    try {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (jobDoc.exists()) {
        setJobDetails({ id: jobDoc.id, ...jobDoc.data() } as JobPosting);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const fetchApplications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let q;
      if (mode === 'job' && jobId) {
        // Get applications for a specific job
        q = query(collection(db, 'applications'), where('jobId', '==', jobId));
      } else if (mode === 'worker' && workerId) {
        // Get applications by a specific worker
        q = query(collection(db, 'applications'), where('workerId', '==', workerId));
      } else if (mode === 'dashboard') {
        // Get all applications for current user
        if (userData?.role === 'worker') {
          q = query(collection(db, 'applications'), where('workerId', '==', currentUser.uid));
        } else {
          // For employers, get applications for their jobs
          const jobsQuery = query(collection(db, 'jobs'), where('employerId', '==', currentUser.uid));
          const jobsSnapshot = await getDocs(jobsQuery);
          const jobIds = jobsSnapshot.docs.map(doc => doc.id);
          
          if (jobIds.length > 0) {
            q = query(collection(db, 'applications'), where('jobId', 'in', jobIds));
          } else {
            setApplications([]);
            setLoading(false);
            return;
          }
        }
      } else {
        setApplications([]);
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(q);
      const apps: JobApplication[] = [];
      
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        // Fetch worker details
        const workerDoc = await getDoc(doc(db, 'workers', data.workerId));
        const workerData = workerDoc.exists() ? workerDoc.data() : {};
        
        apps.push({
          id: docSnapshot.id,
          ...data,
          workerName: workerData.name || data.workerName || 'Usuario',
          workerPhoto: workerData.photoUrl,
          workerRating: workerData.rating || 0,
          workerExperience: workerData.experience || 0,
          workerTrade: workerData.trade
        } as JobApplication);
      }
      
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Error al cargar las aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser || !jobId) return;
    
    setApplying(true);
    setError('');
    
    try {
      // Check if already applied
      const existingQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        where('workerId', '==', currentUser.uid)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        setError('Ya has aplicado a este trabajo');
        return;
      }

      // Create application
      await addDoc(collection(db, 'applications'), {
        jobId,
        workerId: currentUser.uid,
        workerName: userData?.displayName || userData?.email || 'Trabajador',
        coverLetter: coverLetter.trim(),
        status: 'pending',
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update job's applicants count
      const jobRef = doc(db, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);
      if (jobDoc.exists()) {
        const currentApplicants = jobDoc.data().applicants || [];
        await updateDoc(jobRef, {
          applicants: [...currentApplicants, currentUser.uid]
        });
      }

      setApplyDialogOpen(false);
      setCoverLetter('');
      fetchApplications();
    } catch (error) {
      console.error('Error applying to job:', error);
      setError('Error al enviar la aplicación');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      fetchApplications();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Error al actualizar el estado');
    }
  };

  const handleOpenChat = (application: JobApplication) => {
    setChatRecipient({
      id: application.workerId,
      name: application.workerName,
      photo: application.workerPhoto
    });
    setChatOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'accepted': return <Check />;
      case 'rejected': return <Close />;
      default: return <Schedule />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const canApply = userData?.role === 'worker' && jobId && mode === 'job';
  const canManage = userData?.role === 'employer';

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {canApply && (
        <Box mb={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Work />}
            onClick={() => setApplyDialogOpen(true)}
            fullWidth
          >
            Aplicar a este trabajo
          </Button>
        </Box>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {mode === 'job' ? 'No hay aplicaciones para este trabajo aún' :
               mode === 'worker' ? 'No has aplicado a ningún trabajo' :
               'No hay aplicaciones'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {applications.map((application) => (
            <Card key={application.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      application.workerRating && application.workerRating > 0 ? (
                        <Box display="flex" alignItems="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, px: 0.5 }}>
                          <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                          <Typography variant="caption">{application.workerRating}</Typography>
                        </Box>
                      ) : undefined
                    }
                  >
                    <Avatar src={application.workerPhoto} alt={application.workerName}>
                      <Person />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {application.workerName}
                      </Typography>
                      <Chip
                        size="small"
                        label={t(`application.status.${application.status}`)}
                        color={getStatusColor(application.status)}
                        icon={getStatusIcon(application.status)}
                      />
                      {application.workerExperience && application.workerExperience > 0 && (
                        <Chip
                          size="small"
                          label={`${application.workerExperience} años exp.`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {application.coverLetter && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          "{application.coverLetter}"
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Aplicó: {new Date(application.appliedAt).toLocaleDateString('es-MX')}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" gap={1}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenChat(application)}
                    >
                      <Chat />
                    </IconButton>
                    {canManage && application.status === 'pending' && (
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedApplication(application);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Aplicar al trabajo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {jobDetails && (
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{jobDetails.title}</Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip icon={<AttachMoney />} label={`$${jobDetails.salary.amount}/${jobDetails.salary.period}`} />
                    <Chip icon={<LocationOn />} label={jobDetails.location} />
                    {jobDetails.duration && <Chip icon={<Schedule />} label={jobDetails.duration} />}
                  </Box>
                </CardContent>
              </Card>
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Carta de presentación (opcional)"
              placeholder="Cuéntale al empleador por qué eres el candidato ideal..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleApply} 
            variant="contained" 
            disabled={applying}
            startIcon={applying ? <CircularProgress size={20} /> : <Work />}
          >
            {applying ? 'Enviando...' : 'Enviar aplicación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem 
          onClick={() => selectedApplication && handleUpdateStatus(selectedApplication.id, 'accepted')}
        >
          <Check sx={{ mr: 1 }} /> Aceptar
        </MenuItem>
        <MenuItem 
          onClick={() => selectedApplication && handleUpdateStatus(selectedApplication.id, 'rejected')}
        >
          <Close sx={{ mr: 1 }} /> Rechazar
        </MenuItem>
      </Menu>

      {/* Chat Dialog */}
      {chatRecipient && (
        <ChatDialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          recipientPhoto={chatRecipient.photo}
          jobId={jobId}
          jobTitle={jobDetails?.title}
        />
      )}
    </Box>
  );
};

export default ApplicationManager;