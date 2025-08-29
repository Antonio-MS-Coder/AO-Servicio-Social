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
  Alert
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  PhotoCamera,
  Upload,
  Delete,
  Save,
  CheckCircle
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { WorkerProfile, EmployerProfile, Trade, Certification } from '../types';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Worker profile state
  const [workerProfile, setWorkerProfile] = useState<Partial<WorkerProfile>>({
    name: '',
    trade: Trade.OTHER,
    experience: 0,
    location: '',
    bio: '',
    available: true,
    certifications: []
  });
  
  // Employer profile state
  const [employerProfile, setEmployerProfile] = useState<Partial<EmployerProfile>>({
    companyName: '',
    contactName: '',
    businessType: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    // Redirect workers to their dedicated profile page
    if (userData?.role === 'worker') {
      navigate('/worker-profile-edit');
      return;
    }
    
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, userData, navigate]);

  const fetchProfile = async () => {
    try {
      const collectionName = userData?.role === 'worker' ? 'workers' : 'employers';
      const profileDoc = await getDoc(doc(db, collectionName, currentUser!.uid));
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        if (userData?.role === 'worker') {
          setWorkerProfile(profileData as WorkerProfile);
        } else {
          setEmployerProfile(profileData as EmployerProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const storageRef = ref(storage, `profile-photos/${currentUser!.uid}`);
      
      try {
        setSaving(true);
        const snapshot = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(snapshot.ref);
        
        if (userData?.role === 'worker') {
          setWorkerProfile({ ...workerProfile, photoUrl: photoURL });
        } else {
          setEmployerProfile({ ...employerProfile, logoUrl: photoURL });
        }
        
        setMessage({ type: 'success', text: 'Foto actualizada' });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setMessage({ type: 'error', text: 'Error al subir la foto' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCertificationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && userData?.role === 'worker') {
      const file = event.target.files[0];
      const certId = Date.now().toString();
      const storageRef = ref(storage, `certifications/${currentUser!.uid}/${certId}`);
      
      try {
        setSaving(true);
        const snapshot = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(snapshot.ref);
        
        const newCert: Certification = {
          id: certId,
          name: file.name,
          issuer: '',
          issueDate: new Date(),
          fileUrl: fileUrl,
          verified: false
        };
        
        const updatedCerts = [...(workerProfile.certifications || []), newCert];
        setWorkerProfile({ ...workerProfile, certifications: updatedCerts });
        
        setMessage({ type: 'success', text: 'Certificación agregada' });
      } catch (error) {
        console.error('Error uploading certification:', error);
        setMessage({ type: 'error', text: 'Error al subir la certificación' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const collectionName = userData?.role === 'worker' ? 'workers' : 'employers';
      const profileData = userData?.role === 'worker' ? workerProfile : employerProfile;
      
      await updateDoc(doc(db, collectionName, currentUser!.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      
      setMessage({ type: 'success', text: t('messages.profileUpdated') });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Error al guardar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('nav.profile')}
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={userData?.role === 'worker' ? workerProfile.photoUrl : employerProfile.logoUrl}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
            />
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
              >
                {t('profile.uploadPhoto')}
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} md={8}>
            {userData?.role === 'worker' ? (
              <>
                <TextField
                  fullWidth
                  label={t('profile.name')}
                  value={workerProfile.name}
                  onChange={(e) => setWorkerProfile({ ...workerProfile, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  select
                  label={t('profile.trade')}
                  value={workerProfile.trade}
                  onChange={(e) => setWorkerProfile({ ...workerProfile, trade: e.target.value as Trade })}
                  sx={{ mb: 2 }}
                >
                  {Object.values(Trade).map((trade) => (
                    <MenuItem key={trade} value={trade}>
                      {t(`trades.${trade}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                  label={t('profile.experience')}
                  value={workerProfile.experience}
                  onChange={(e) => setWorkerProfile({ ...workerProfile, experience: parseInt(e.target.value) })}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={workerProfile.available}
                      onChange={(e) => setWorkerProfile({ ...workerProfile, available: e.target.checked })}
                    />
                  }
                  label={workerProfile.available ? t('profile.available') : t('profile.notAvailable')}
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Nombre de la Empresa"
                  value={employerProfile.companyName}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, companyName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Nombre del Contacto"
                  value={employerProfile.contactName}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, contactName: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Tipo de Negocio"
                  value={employerProfile.businessType}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, businessType: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <TextField
              fullWidth
              label={t('profile.location')}
              value={userData?.role === 'worker' ? workerProfile.location : employerProfile.location}
              onChange={(e) => {
                if (userData?.role === 'worker') {
                  setWorkerProfile({ ...workerProfile, location: e.target.value });
                } else {
                  setEmployerProfile({ ...employerProfile, location: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('profile.bio')}
              value={userData?.role === 'worker' ? workerProfile.bio : employerProfile.description}
              onChange={(e) => {
                if (userData?.role === 'worker') {
                  setWorkerProfile({ ...workerProfile, bio: e.target.value });
                } else {
                  setEmployerProfile({ ...employerProfile, description: e.target.value });
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {userData?.role === 'worker' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t('profile.certifications')}
            </Typography>
            <input
              accept=".pdf,.jpg,.jpeg,.png"
              type="file"
              id="cert-upload"
              hidden
              onChange={handleCertificationUpload}
            />
            <label htmlFor="cert-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
                disabled={saving}
              >
                {t('profile.uploadCertification')}
              </Button>
            </label>
          </Box>

          <List>
            {workerProfile.certifications?.map((cert) => (
              <ListItem key={cert.id}>
                <ListItemText
                  primary={cert.name}
                  secondary={cert.issuer || 'Sin emisor'}
                />
                {cert.verified && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Verificado"
                    color="success"
                    size="small"
                    sx={{ mr: 2 }}
                  />
                )}
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : t('actions.save')}
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;