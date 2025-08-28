import React, { useState, useEffect } from 'react';
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
  Divider,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Google as GoogleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle, setupRecaptcha, signInWithPhone } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { User, UserRole } from '../../types';

const LoginEnhanced: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  
  // Tab state
  const [authMethod, setAuthMethod] = useState(0); // 0: Email, 1: Phone
  
  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  
  // Role selection dialog
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  
  // General state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');

  useEffect(() => {
    // Setup reCAPTCHA when component mounts
    if (!recaptchaVerifier) {
      const verifier = setupRecaptcha('recaptcha-container');
      setRecaptchaVerifier(verifier);
    }
  }, [recaptchaVerifier]);

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado. Por favor regístrate primero.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      
      const result = await signInWithGoogle();
      const user = result.user;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // New user, ask for role
        setPendingUser(user);
        setShowRoleDialog(true);
      } else {
        // Existing user, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Inicio de sesión cancelado.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle phone number submission
  const handlePhoneSubmit = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Format phone number for Mexico (+52)
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('52')) {
          formattedPhone = '+' + formattedPhone;
        } else {
          formattedPhone = '+52' + formattedPhone;
        }
      }
      
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA no está configurado');
      }
      
      const confirmation = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('verify');
      
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        setError('Número de teléfono inválido. Usa formato: 5512345678');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Por favor intenta más tarde.');
      } else {
        setError(error.message);
      }
      
      // Reset reCAPTCHA
      const verifier = setupRecaptcha('recaptcha-container');
      setRecaptchaVerifier(verifier);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    try {
      setError('');
      setLoading(true);
      
      if (!confirmationResult) {
        throw new Error('No hay verificación pendiente');
      }
      
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // New user, ask for role
        setPendingUser(user);
        setShowRoleDialog(true);
      } else {
        // Existing user, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        setError('Código de verificación incorrecto.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle role selection for new users
  const handleRoleSelection = async (role: UserRole) => {
    try {
      setLoading(true);
      
      if (!pendingUser) return;
      
      // Create user document
      const userData: User = {
        id: pendingUser.uid,
        email: pendingUser.email || '',
        phone: pendingUser.phoneNumber || '',
        displayName: pendingUser.displayName || '',
        photoURL: pendingUser.photoURL || '',
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', pendingUser.uid), userData);
      
      // Create profile document based on role
      if (role === 'worker') {
        await setDoc(doc(db, 'workers', pendingUser.uid), {
          userId: pendingUser.uid,
          name: pendingUser.displayName || '',
          phone: pendingUser.phoneNumber || '',
          trade: '',
          experience: 0,
          location: 'Álvaro Obregón',
          certifications: [],
          rating: 0,
          totalRatings: 0,
          available: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        await setDoc(doc(db, 'employers', pendingUser.uid), {
          userId: pendingUser.uid,
          companyName: '',
          contactName: pendingUser.displayName || '',
          phone: pendingUser.phoneNumber || '',
          businessType: '',
          location: 'Álvaro Obregón',
          rating: 0,
          totalRatings: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setShowRoleDialog(false);
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
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Bienvenido a DOOM
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Conectando talento con oportunidades para el Mundial 2026
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Tabs value={authMethod} onChange={(_, v) => setAuthMethod(v)} centered sx={{ mb: 3 }}>
            <Tab icon={<EmailIcon />} label="Email" />
            <Tab icon={<PhoneIcon />} label="Teléfono" />
          </Tabs>

          {/* Email Login */}
          {authMethod === 0 && (
            <Box>
              <form onSubmit={handleEmailLogin}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}

          {/* Phone Login */}
          {authMethod === 1 && (
            <Box>
              {step === 'input' ? (
                <>
                  <TextField
                    fullWidth
                    label="Número de teléfono"
                    placeholder="5512345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.secondary">+52</Typography>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Ingresa tu número de 10 dígitos"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePhoneSubmit}
                    disabled={loading || phoneNumber.length < 10}
                    sx={{ mb: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Enviar código'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => {
                      setStep('input');
                      setVerificationCode('');
                    }}
                    sx={{ mb: 2 }}
                  >
                    Cambiar número
                  </Button>

                  <TextField
                    fullWidth
                    label="Código de verificación"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                    helperText="Ingresa el código de 6 dígitos enviado a tu teléfono"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleVerifyCode}
                    disabled={loading || verificationCode.length < 6}
                    sx={{ mb: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verificar'
                    )}
                  </Button>
                </>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }}>O</Divider>

          {/* Google Sign In */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{ 
              mb: 2,
              borderColor: '#4285f4',
              color: '#4285f4',
              '&:hover': {
                borderColor: '#357ae8',
                backgroundColor: 'rgba(66, 133, 244, 0.04)'
              }
            }}
          >
            Continuar con Google
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography component="span" color="primary" fontWeight="bold">
                  Regístrate aquí
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {/* Role Selection Dialog */}
      <Dialog open={showRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            ¿Cómo quieres usar DOOM?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Selecciona tu perfil para personalizar tu experiencia
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleRoleSelection('worker')}
            >
              <Typography variant="h6" fontWeight="bold" color="primary">
                Soy Trabajador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Busco oportunidades de empleo para el Mundial 2026
              </Typography>
            </Paper>
            
            <Paper
              elevation={2}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  borderColor: 'secondary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleRoleSelection('employer')}
            >
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Soy Empleador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Busco contratar trabajadores calificados
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleDialog(false)} disabled={loading}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginEnhanced;