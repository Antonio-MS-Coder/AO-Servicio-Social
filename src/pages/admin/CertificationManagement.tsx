import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  School,
  Add,
  Edit,
  Delete,
  People,
  Timer,
  CheckCircle,
  Money,
  CalendarToday,
  LocationOn,
  Description,
  Verified,
  TrendingUp,
  Assignment,
  EmojiEvents,
  LocalOffer,
  Schedule,
  Group,
  AttachMoney
} from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Certification {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  duration: string;
  price: number;
  isFree: boolean;
  requirements: string[];
  benefits: string[];
  level: 'basic' | 'intermediate' | 'advanced';
  maxStudents: number;
  currentStudents: number;
  status: 'active' | 'inactive' | 'full';
  startDate?: any;
  endDate?: any;
  location?: string;
  online: boolean;
  certificateType: string;
  createdAt: any;
  updatedAt: any;
}

interface Enrollment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  certificationId: string;
  certificationName: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'cancelled';
  enrolledAt: any;
  completedAt?: any;
  grade?: number;
}

const CertificationManagement: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [enrollmentDialog, setEnrollmentDialog] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<Enrollment[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    description: '',
    provider: 'Alcaldía Álvaro Obregón',
    category: '',
    duration: '',
    price: 0,
    isFree: true,
    requirements: [],
    benefits: [],
    level: 'basic',
    maxStudents: 30,
    currentStudents: 0,
    status: 'active',
    online: false,
    certificateType: 'Certificado Oficial',
    location: 'Casa de Cultura AO'
  });

  const categories = [
    'Alimentos y Bebidas',
    'Seguridad',
    'Idiomas',
    'Tecnología',
    'Salud',
    'Servicios',
    'Construcción',
    'Turismo'
  ];

  useEffect(() => {
    fetchCertifications();
    fetchEnrollments();
  }, []);

  const fetchCertifications = async () => {
    try {
      const certsSnapshot = await getDocs(collection(db, 'certifications'));
      const certsData: Certification[] = certsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Certification));
      setCertifications(certsData);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      setSnackbar({ open: true, message: 'Error al cargar certificaciones', severity: 'error' });
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrollSnapshot = await getDocs(collection(db, 'certificationEnrollments'));
      const enrollData: Enrollment[] = enrollSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Enrollment));
      setEnrollments(enrollData);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode && selectedCert) {
        // Update existing certification
        await updateDoc(doc(db, 'certifications', selectedCert.id), {
          ...formData,
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Certificación actualizada exitosamente', severity: 'success' });
      } else {
        // Add new certification
        await addDoc(collection(db, 'certifications'), {
          ...formData,
          currentStudents: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        setSnackbar({ open: true, message: 'Certificación creada exitosamente', severity: 'success' });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchCertifications();
    } catch (error) {
      console.error('Error saving certification:', error);
      setSnackbar({ open: true, message: 'Error al guardar certificación', severity: 'error' });
    }
  };

  const handleDelete = async (certId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta certificación?')) {
      try {
        await deleteDoc(doc(db, 'certifications', certId));
        setSnackbar({ open: true, message: 'Certificación eliminada exitosamente', severity: 'success' });
        fetchCertifications();
      } catch (error) {
        console.error('Error deleting certification:', error);
        setSnackbar({ open: true, message: 'Error al eliminar certificación', severity: 'error' });
      }
    }
  };

  const handleEdit = (cert: Certification) => {
    setSelectedCert(cert);
    setFormData(cert);
    setEditMode(true);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      provider: 'Alcaldía Álvaro Obregón',
      category: '',
      duration: '',
      price: 0,
      isFree: true,
      requirements: [],
      benefits: [],
      level: 'basic',
      maxStudents: 30,
      currentStudents: 0,
      status: 'active',
      online: false,
      certificateType: 'Certificado Oficial',
      location: 'Casa de Cultura AO'
    });
    setEditMode(false);
    setSelectedCert(null);
  };

  const viewEnrollments = (cert: Certification) => {
    const certEnrollments = enrollments.filter(e => e.certificationId === cert.id);
    setSelectedCert(cert);
    setSelectedEnrollments(certEnrollments);
    setEnrollmentDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'full': return 'warning';
      default: return 'default';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#757575';
    }
  };

  // Statistics
  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === 'active').length,
    free: certifications.filter(c => c.isFree).length,
    totalEnrolled: enrollments.length,
    completed: enrollments.filter(e => e.status === 'completed').length
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School sx={{ fontSize: 40, color: '#007A33' }} />
            Gestión de Certificaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra las certificaciones y capacitaciones disponibles
          </Typography>
        </Box>
        <Fab
          color="primary"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          sx={{ bgcolor: '#007A33' }}
        >
          <Add />
        </Fab>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment />
                <Box>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2">Total Certificaciones</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle />
                <Box>
                  <Typography variant="h4">{stats.active}</Typography>
                  <Typography variant="body2">Activas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOffer />
                <Box>
                  <Typography variant="h4">{stats.free}</Typography>
                  <Typography variant="body2">Gratuitas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                <Box>
                  <Typography variant="h4">{stats.totalEnrolled}</Typography>
                  <Typography variant="body2">Inscritos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents />
                <Box>
                  <Typography variant="h4">{stats.completed}</Typography>
                  <Typography variant="body2">Completados</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Certifications Grid */}
      <Grid container spacing={3}>
        {certifications.map((cert) => (
          <Grid item xs={12} md={6} lg={4} key={cert.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {cert.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={cert.status}
                      color={getStatusColor(cert.status) as any}
                      size="small"
                    />
                    {cert.isFree && (
                      <Chip
                        label="GRATIS"
                        color="success"
                        size="small"
                        icon={<LocalOffer />}
                      />
                    )}
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {cert.description}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Verified sx={{ fontSize: 16, color: '#007A33' }} />
                    <Typography variant="caption">{cert.provider}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer sx={{ fontSize: 16, color: '#007A33' }} />
                    <Typography variant="caption">{cert.duration}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#007A33' }} />
                    <Typography variant="caption">
                      {cert.online ? 'En línea' : cert.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group sx={{ fontSize: 16, color: '#007A33' }} />
                    <Typography variant="caption">
                      {cert.currentStudents}/{cert.maxStudents} estudiantes
                    </Typography>
                  </Box>
                  {!cert.isFree && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney sx={{ fontSize: 16, color: '#007A33' }} />
                      <Typography variant="caption">
                        ${cert.price} MXN
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={cert.category}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={cert.level}
                    size="small"
                    sx={{ 
                      bgcolor: getLevelColor(cert.level),
                      color: 'white'
                    }}
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<People />}
                  onClick={() => viewEnrollments(cert)}
                >
                  Ver Inscritos ({enrollments.filter(e => e.certificationId === cert.id).length})
                </Button>
                <Box>
                  <IconButton size="small" onClick={() => handleEdit(cert)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(cert.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Certification Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Certificación' : 'Nueva Certificación'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Certificación"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Proveedor"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Categoría"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Duración"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="ej. 40 horas"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  label="Nivel"
                >
                  <MenuItem value="basic">Básico</MenuItem>
                  <MenuItem value="intermediate">Intermedio</MenuItem>
                  <MenuItem value="advanced">Avanzado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Máximo de Estudiantes"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  />
                }
                label="Certificación Gratuita"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.online}
                    onChange={(e) => setFormData({ ...formData, online: e.target.checked })}
                  />
                }
                label="Modalidad En Línea"
              />
            </Grid>
            {!formData.isFree && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio (MXN)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            )}
            {!formData.online && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requisitos (separados por coma)"
                value={formData.requirements?.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  requirements: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                })}
                placeholder="ej. Mayor de 18 años, Identificación oficial"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beneficios (separados por coma)"
                value={formData.benefits?.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b)
                })}
                placeholder="ej. Certificado oficial, Material incluido"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            resetForm();
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#007A33' }}>
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrollments Dialog */}
      <Dialog open={enrollmentDialog} onClose={() => setEnrollmentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Estudiantes Inscritos - {selectedCert?.name}
        </DialogTitle>
        <DialogContent>
          {selectedEnrollments.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Estudiante</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha Inscripción</TableCell>
                    <TableCell>Calificación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>{enrollment.userName}</TableCell>
                      <TableCell>{enrollment.userEmail}</TableCell>
                      <TableCell>
                        <Chip
                          label={enrollment.status}
                          color={enrollment.status === 'completed' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {enrollment.enrolledAt ? 
                          format(enrollment.enrolledAt.toDate(), 'dd/MM/yyyy') : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {enrollment.grade ? `${enrollment.grade}/100` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay estudiantes inscritos en esta certificación aún.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollmentDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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

export default CertificationManagement;