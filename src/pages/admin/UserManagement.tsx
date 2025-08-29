import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  Block,
  CheckCircle,
  Edit,
  Delete,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Verified,
  Warning,
  FilterList,
  Download,
  PersonAdd,
  AdminPanelSettings
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: 'worker' | 'employer' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  createdAt: any;
  lastLogin?: any;
  profileComplete?: number;
  verified?: boolean;
  // Worker specific
  trade?: string;
  experience?: number;
  rating?: number;
  certifications?: number;
  jobsCompleted?: number;
  // Employer specific
  companyName?: string;
  businessType?: string;
  jobsPosted?: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'delete' | 'verify'>('block');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];

      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        let additionalData = {};

        // Fetch additional profile data based on role
        if (userData.role === 'worker') {
          const workerQuery = query(collection(db, 'workerProfiles'), where('userId', '==', doc.id));
          const workerSnapshot = await getDocs(workerQuery);
          if (!workerSnapshot.empty) {
            const workerData = workerSnapshot.docs[0].data();
            additionalData = {
              trade: workerData.trade,
              experience: workerData.experience,
              rating: workerData.rating || 0,
              certifications: workerData.certifications?.length || 0
            };
          }
        } else if (userData.role === 'employer') {
          const employerQuery = query(collection(db, 'employerProfiles'), where('userId', '==', doc.id));
          const employerSnapshot = await getDocs(employerQuery);
          if (!employerSnapshot.empty) {
            const employerData = employerSnapshot.docs[0].data();
            additionalData = {
              companyName: employerData.companyName,
              businessType: employerData.businessType,
              verified: employerData.verified || false
            };
          }
        }

        usersData.push({
          id: doc.id,
          email: userData.email,
          displayName: userData.displayName,
          phone: userData.phone,
          role: userData.role,
          status: userData.status || 'active',
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin,
          profileComplete: userData.profileComplete,
          ...additionalData
        });
      }

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user as any).companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.id);

      switch (actionType) {
        case 'block':
          await updateDoc(userRef, { status: 'blocked' });
          setSnackbar({ open: true, message: 'Usuario bloqueado exitosamente', severity: 'success' });
          break;
        case 'unblock':
          await updateDoc(userRef, { status: 'active' });
          setSnackbar({ open: true, message: 'Usuario desbloqueado exitosamente', severity: 'success' });
          break;
        case 'verify':
          if (selectedUser.role === 'employer') {
            const employerQuery = query(collection(db, 'employerProfiles'), where('userId', '==', selectedUser.id));
            const employerSnapshot = await getDocs(employerQuery);
            if (!employerSnapshot.empty) {
              await updateDoc(doc(db, 'employerProfiles', employerSnapshot.docs[0].id), { verified: true });
            }
          }
          await updateDoc(userRef, { verified: true });
          setSnackbar({ open: true, message: 'Cuenta verificada exitosamente', severity: 'success' });
          break;
        case 'delete':
          // Delete user and related data
          await deleteDoc(userRef);
          // Also delete profile data
          if (selectedUser.role === 'worker') {
            const workerQuery = query(collection(db, 'workerProfiles'), where('userId', '==', selectedUser.id));
            const workerSnapshot = await getDocs(workerQuery);
            for (const doc of workerSnapshot.docs) {
              await deleteDoc(doc.ref);
            }
          } else if (selectedUser.role === 'employer') {
            const employerQuery = query(collection(db, 'employerProfiles'), where('userId', '==', selectedUser.id));
            const employerSnapshot = await getDocs(employerQuery);
            for (const doc of employerSnapshot.docs) {
              await deleteDoc(doc.ref);
            }
          }
          setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' });
          break;
      }

      setActionDialog(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error performing action:', error);
      setSnackbar({ open: true, message: 'Error al realizar la acción', severity: 'error' });
    }
  };

  const openActionDialog = (user: UserData, action: 'block' | 'unblock' | 'delete' | 'verify') => {
    setSelectedUser(user);
    setActionType(action);
    setActionDialog(true);
  };

  const openUserDetails = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const exportUsers = () => {
    const csvContent = [
      ['ID', 'Email', 'Nombre', 'Rol', 'Estado', 'Fecha Registro', 'Empresa', 'Oficio'],
      ...filteredUsers.map(user => [
        user.id,
        user.email,
        user.displayName || '',
        user.role,
        user.status,
        user.createdAt ? format(user.createdAt.toDate(), 'dd/MM/yyyy') : '',
        (user as any).companyName || '',
        user.trade || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

  const getRoleChip = (role: string) => {
    const roleConfig = {
      worker: { label: 'Trabajador', color: 'primary' as const },
      employer: { label: 'Empleador', color: 'secondary' as const },
      admin: { label: 'Admin', color: 'error' as const }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, color: 'default' as const };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      active: { label: 'Activo', color: 'success' as const, icon: <CheckCircle /> },
      blocked: { label: 'Bloqueado', color: 'error' as const, icon: <Block /> },
      pending: { label: 'Pendiente', color: 'warning' as const, icon: <Warning /> }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' as const };
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettings sx={{ fontSize: 40, color: '#007A33' }} />
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra usuarios, verifica empresas y gestiona permisos
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Typography color="white" variant="h6">Total Usuarios</Typography>
              <Typography color="white" variant="h3">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Typography color="white" variant="h6">Trabajadores</Typography>
              <Typography color="white" variant="h3">
                {users.filter(u => u.role === 'worker').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Typography color="white" variant="h6">Empleadores</Typography>
              <Typography color="white" variant="h3">
                {users.filter(u => u.role === 'employer').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Typography color="white" variant="h6">Activos</Typography>
              <Typography color="white" variant="h3">
                {users.filter(u => u.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por email, nombre o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Rol"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="worker">Trabajadores</MenuItem>
                <MenuItem value="employer">Empleadores</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="blocked">Bloqueados</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              Limpiar Filtros
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Download />}
              onClick={exportUsers}
              sx={{ bgcolor: '#007A33' }}
            >
              Exportar CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#007A33' }}>
                          {user.displayName?.[0] || user.email[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {user.displayName || 'Sin nombre'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                          {user.phone && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              📱 {user.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell>
                      {user.role === 'worker' && (
                        <Box>
                          <Typography variant="caption" display="block">
                            Oficio: {user.trade || 'No especificado'}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Exp: {user.experience || 0} años
                          </Typography>
                          <Typography variant="caption" display="block">
                            ⭐ {user.rating?.toFixed(1) || '0.0'}
                          </Typography>
                        </Box>
                      )}
                      {user.role === 'employer' && (
                        <Box>
                          <Typography variant="caption" display="block">
                            {(user as any).companyName || 'Sin empresa'}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {user.businessType || 'No especificado'}
                          </Typography>
                          {user.verified && <Chip label="Verificado" size="small" color="success" icon={<Verified />} />}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {user.createdAt ? format(user.createdAt.toDate(), 'dd/MM/yyyy', { locale: es }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" onClick={() => openUserDetails(user)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      {user.status === 'active' ? (
                        <Tooltip title="Bloquear">
                          <IconButton size="small" color="error" onClick={() => openActionDialog(user, 'block')}>
                            <Block />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Desbloquear">
                          <IconButton size="small" color="success" onClick={() => openActionDialog(user, 'unblock')}>
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      )}
                      {user.role === 'employer' && !user.verified && (
                        <Tooltip title="Verificar empresa">
                          <IconButton size="small" color="primary" onClick={() => openActionDialog(user, 'verify')}>
                            <Verified />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => openActionDialog(user, 'delete')}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles del Usuario
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.displayName || 'No especificado'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.phone || 'No especificado'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Rol</Typography>
                  <Box sx={{ mt: 0.5 }}>{getRoleChip(selectedUser.role)}</Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                  <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedUser.status)}</Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Fecha de Registro</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.createdAt ? format(selectedUser.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A'}
                  </Typography>
                </Grid>
                {selectedUser.role === 'worker' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Oficio</Typography>
                      <Typography variant="body1" gutterBottom>{selectedUser.trade || 'No especificado'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Experiencia</Typography>
                      <Typography variant="body1" gutterBottom>{selectedUser.experience || 0} años</Typography>
                    </Grid>
                  </>
                )}
                {selectedUser.role === 'employer' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Empresa</Typography>
                      <Typography variant="body1" gutterBottom>{(selectedUser as any).companyName || 'No especificado'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tipo de Negocio</Typography>
                      <Typography variant="body1" gutterBottom>{selectedUser.businessType || 'No especificado'}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog} onClose={() => setActionDialog(false)}>
        <DialogTitle>
          Confirmar Acción
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'block' && `¿Estás seguro de que quieres bloquear a ${selectedUser?.email}?`}
            {actionType === 'unblock' && `¿Estás seguro de que quieres desbloquear a ${selectedUser?.email}?`}
            {actionType === 'delete' && `¿Estás seguro de que quieres eliminar permanentemente a ${selectedUser?.email}? Esta acción no se puede deshacer.`}
            {actionType === 'verify' && `¿Estás seguro de que quieres verificar la empresa de ${selectedUser?.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>Cancelar</Button>
          <Button onClick={handleUserAction} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default UserManagement;