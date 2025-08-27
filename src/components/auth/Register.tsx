import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Work, Business } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (event: React.MouseEvent<HTMLElement>, newRole: UserRole | null) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, role);
      navigate('/onboarding');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {t('auth.registerTitle')}
          </Typography>
          
          <Typography variant="h6" align="center" color="primary" gutterBottom>
            {t('app.slogan')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                {t('auth.registerAs')}:
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRoleChange}
                aria-label="user role"
                sx={{ mt: 1 }}
              >
                <ToggleButton value="worker" aria-label="worker">
                  <Work sx={{ mr: 1 }} />
                  {t('auth.worker')}
                </ToggleButton>
                <ToggleButton value="employer" aria-label="employer">
                  <Business sx={{ mr: 1 }} />
                  {t('auth.employer')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label={t('auth.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('nav.register')
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login">
                  {t('nav.login')}
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;