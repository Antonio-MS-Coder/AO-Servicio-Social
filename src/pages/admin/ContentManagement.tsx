import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Fab
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Save,
  Cancel,
  Star,
  TrendingUp,
  EmojiEvents,
  Verified,
  Person,
  AttachMoney,
  Work,
  CalendarToday,
  ContentCopy,
  Preview
} from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SuccessStory, WeeklyStory } from '../../types/content';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [weeklyStory, setWeeklyStory] = useState<WeeklyStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Success Story Form Data
  const [storyForm, setStoryForm] = useState<Partial<SuccessStory>>({
    name: '',
    initials: '',
    role: '',
    company: '',
    testimonial: '',
    rating: 5,
    verified: true,
    order: 0
  });

  // Weekly Story Form Data
  const [weeklyForm, setWeeklyForm] = useState<Partial<WeeklyStory>>({
    name: '',
    initials: '',
    beforeTitle: '',
    afterTitle: '',
    story: '',
    beforeSalary: 0,
    afterSalary: 0,
    jobsCompleted: 0,
    rating: 5,
    timeFrame: 'En solo 6 meses',
    isActive: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch success stories
      const storiesQuery = query(collection(db, 'successStories'), orderBy('order', 'asc'));
      const storiesSnapshot = await getDocs(storiesQuery);
      const storiesData: SuccessStory[] = storiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SuccessStory));
      setSuccessStories(storiesData);

      // Fetch active weekly story
      const weeklyQuery = query(collection(db, 'weeklyStories'), where('isActive', '==', true));
      const weeklySnapshot = await getDocs(weeklyQuery);
      if (!weeklySnapshot.empty) {
        setWeeklyStory({
          id: weeklySnapshot.docs[0].id,
          ...weeklySnapshot.docs[0].data()
        } as WeeklyStory);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setSnackbar({ open: true, message: 'Error al cargar contenido', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Success Story CRUD Operations
  const handleSaveStory = async () => {
    try {
      if (editMode && storyForm.id) {
        await updateDoc(doc(db, 'successStories', storyForm.id), {
          ...storyForm,
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Historia actualizada exitosamente', severity: 'success' });
      } else {
        await addDoc(collection(db, 'successStories'), {
          ...storyForm,
          order: successStories.length,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Historia creada exitosamente', severity: 'success' });
      }
      setDialogOpen(false);
      resetStoryForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving story:', error);
      setSnackbar({ open: true, message: 'Error al guardar historia', severity: 'error' });
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta historia?')) {
      try {
        await deleteDoc(doc(db, 'successStories', storyId));
        setSnackbar({ open: true, message: 'Historia eliminada exitosamente', severity: 'success' });
        fetchContent();
      } catch (error) {
        console.error('Error deleting story:', error);
        setSnackbar({ open: true, message: 'Error al eliminar historia', severity: 'error' });
      }
    }
  };

  const handleEditStory = (story: SuccessStory) => {
    setStoryForm(story);
    setEditMode(true);
    setDialogOpen(true);
  };

  const resetStoryForm = () => {
    setStoryForm({
      name: '',
      initials: '',
      role: '',
      company: '',
      testimonial: '',
      rating: 5,
      verified: true,
      order: 0
    });
    setEditMode(false);
  };

  // Weekly Story CRUD Operations
  const handleSaveWeeklyStory = async () => {
    try {
      // Deactivate all other weekly stories
      const allWeeklyQuery = query(collection(db, 'weeklyStories'));
      const allWeeklySnapshot = await getDocs(allWeeklyQuery);
      for (const doc of allWeeklySnapshot.docs) {
        await updateDoc(doc.ref, { isActive: false });
      }

      if (weeklyStory && editMode) {
        await updateDoc(doc(db, 'weeklyStories', weeklyStory.id), {
          ...weeklyForm,
          isActive: true,
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Historia de la semana actualizada', severity: 'success' });
      } else {
        await addDoc(collection(db, 'weeklyStories'), {
          ...weeklyForm,
          isActive: true,
          weekStartDate: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Historia de la semana creada', severity: 'success' });
      }
      setWeeklyDialogOpen(false);
      resetWeeklyForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving weekly story:', error);
      setSnackbar({ open: true, message: 'Error al guardar historia de la semana', severity: 'error' });
    }
  };

  const handleEditWeeklyStory = () => {
    if (weeklyStory) {
      setWeeklyForm(weeklyStory);
      setEditMode(true);
    }
    setWeeklyDialogOpen(true);
  };

  const resetWeeklyForm = () => {
    setWeeklyForm({
      name: '',
      initials: '',
      beforeTitle: '',
      afterTitle: '',
      story: '',
      beforeSalary: 0,
      afterSalary: 0,
      jobsCompleted: 0,
      rating: 5,
      timeFrame: 'En solo 6 meses',
      isActive: true
    });
    setEditMode(false);
  };

  // Auto-generate initials
  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContentCopy sx={{ fontSize: 40, color: '#007A33' }} />
          Gestión de Contenido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las historias de éxito y la historia de la semana
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Historias de Éxito" icon={<EmojiEvents />} iconPosition="start" />
          <Tab label="Historia de la Semana" icon={<TrendingUp />} iconPosition="start" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Box>
          {/* Success Stories Management */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Historias de Éxito</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetStoryForm();
                setDialogOpen(true);
              }}
              sx={{ bgcolor: '#007A33' }}
            >
              Nueva Historia
            </Button>
          </Box>

          <Grid container spacing={3}>
            {successStories.map((story) => (
              <Grid item xs={12} md={6} lg={4} key={story.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#007A33', width: 56, height: 56 }}>
                        {story.initials}
                      </Avatar>
                      <Box flex={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{story.name}</Typography>
                          {story.verified && <Verified sx={{ fontSize: 20, color: '#007A33' }} />}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {story.role}
                        </Typography>
                        <Chip label={story.company} size="small" color="primary" />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                      "{story.testimonial}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Rating value={story.rating} readOnly size="small" />
                      <Box>
                        <IconButton size="small" onClick={() => handleEditStory(story)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteStory(story.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Success Story Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editMode ? 'Editar Historia de Éxito' : 'Nueva Historia de Éxito'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    value={storyForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setStoryForm({ 
                        ...storyForm, 
                        name,
                        initials: generateInitials(name)
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Iniciales"
                    value={storyForm.initials}
                    onChange={(e) => setStoryForm({ ...storyForm, initials: e.target.value })}
                    inputProps={{ maxLength: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Puesto/Rol"
                    value={storyForm.role}
                    onChange={(e) => setStoryForm({ ...storyForm, role: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    value={storyForm.company}
                    onChange={(e) => setStoryForm({ ...storyForm, company: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Testimonio"
                    value={storyForm.testimonial}
                    onChange={(e) => setStoryForm({ ...storyForm, testimonial: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography component="legend">Calificación</Typography>
                    <Rating
                      value={storyForm.rating}
                      onChange={(e, value) => setStoryForm({ ...storyForm, rating: value || 5 })}
                      size="large"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storyForm.verified}
                        onChange={(e) => setStoryForm({ ...storyForm, verified: e.target.checked })}
                      />
                    }
                    label="Verificado"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveStory} variant="contained" sx={{ bgcolor: '#007A33' }}>
                {editMode ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Weekly Story Management */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Historia de la Semana</Typography>
            <Button
              variant="contained"
              startIcon={weeklyStory ? <Edit /> : <Add />}
              onClick={handleEditWeeklyStory}
              sx={{ bgcolor: '#007A33' }}
            >
              {weeklyStory ? 'Editar Historia' : 'Nueva Historia'}
            </Button>
          </Box>

          {weeklyStory ? (
            <Card sx={{ bgcolor: '#FFF3E0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#007A33', width: 80, height: 80, fontSize: '2rem' }}>
                    {weeklyStory.initials}
                  </Avatar>
                  <Box>
                    <Chip label="HISTORIA DE LA SEMANA" color="warning" size="small" sx={{ mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">{weeklyStory.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      De {weeklyStory.beforeTitle} a {weeklyStory.afterTitle}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "{weeklyStory.story}"
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">ANTES</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${weeklyStory.beforeSalary.toLocaleString()}/mes
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">AHORA</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      ${weeklyStory.afterSalary.toLocaleString()}/mes
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">TRABAJOS</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {weeklyStory.jobsCompleted}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">CALIFICACIÓN</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold">{weeklyStory.rating}</Typography>
                      <Star sx={{ color: '#FFC107' }} />
                    </Box>
                  </Grid>
                </Grid>

                <Chip 
                  label={weeklyStory.timeFrame} 
                  sx={{ mt: 2, bgcolor: '#007A33', color: 'white' }}
                />
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No hay historia de la semana activa
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  resetWeeklyForm();
                  setWeeklyDialogOpen(true);
                }}
                sx={{ mt: 2, bgcolor: '#007A33' }}
              >
                Crear Historia de la Semana
              </Button>
            </Paper>
          )}

          {/* Weekly Story Dialog */}
          <Dialog open={weeklyDialogOpen} onClose={() => setWeeklyDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editMode ? 'Editar Historia de la Semana' : 'Nueva Historia de la Semana'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    value={weeklyForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setWeeklyForm({ 
                        ...weeklyForm, 
                        name,
                        initials: generateInitials(name)
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Iniciales"
                    value={weeklyForm.initials}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, initials: e.target.value })}
                    inputProps={{ maxLength: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Puesto Anterior"
                    value={weeklyForm.beforeTitle}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, beforeTitle: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Puesto Actual"
                    value={weeklyForm.afterTitle}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, afterTitle: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Historia"
                    value={weeklyForm.story}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, story: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Salario Anterior"
                    value={weeklyForm.beforeSalary}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, beforeSalary: parseInt(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Salario Actual"
                    value={weeklyForm.afterSalary}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, afterSalary: parseInt(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Trabajos Completados"
                    value={weeklyForm.jobsCompleted}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, jobsCompleted: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Tiempo"
                    value={weeklyForm.timeFrame}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, timeFrame: e.target.value })}
                    placeholder="En solo 6 meses"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography component="legend">Calificación</Typography>
                    <Rating
                      value={weeklyForm.rating}
                      onChange={(e, value) => setWeeklyForm({ ...weeklyForm, rating: value || 5 })}
                      size="large"
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWeeklyDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveWeeklyStory} variant="contained" sx={{ bgcolor: '#007A33' }}>
                {editMode ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContentManagement;