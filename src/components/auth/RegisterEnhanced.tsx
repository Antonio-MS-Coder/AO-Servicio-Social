import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormHelperText
} from '@mui/material';
import {
  Google as GoogleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Person,
  Business,
  Check
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle, setupRecaptcha, signInWithPhone } from '../../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { User, UserRole } from '../../types';

interface RegisterFormData {
  // Datos básicos
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  
  // Datos específicos del trabajador
  trade?: string;
  experience?: number;
  
  // Datos específicos del empleador
  companyName?: string;
  businessType?: string;
  
  // General
  location: string;
  acceptTerms: boolean;
}

const RegisterEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Método de registro', 'Tipo de cuenta', 'Información personal', 'Verificación'];
  
  // Método de registro
  const [authMethod, setAuthMethod] = useState(0); // 0: Email, 1: Phone, 2: Google
  
  // Form data
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'worker',
    trade: '',
    experience: 0,
    companyName: '',
    businessType: '',
    location: 'Álvaro Obregón',
    acceptTerms: false
  });
  
  // Phone auth state
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  
  // General state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Setup reCAPTCHA cuando el componente se monta
    if (!recaptchaVerifier && authMethod === 1) {
      const verifier = setupRecaptcha('register-recaptcha-container');
      setRecaptchaVerifier(verifier);
    }
  }, [recaptchaVerifier, authMethod]);

  // Validación de campos
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'fullName':
        return value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Email inválido' : '';
      case 'phone':
        return value.length < 10 ? 'El teléfono debe tener 10 dígitos' : '';
      case 'password':
        return value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Las contraseñas no coinciden' : '';
      case 'companyName':
        return formData.role === 'employer' && value.length < 2 
          ? 'El nombre de la empresa es requerido' : '';
      case 'trade':
        return formData.role === 'worker' && !value 
          ? 'Selecciona tu oficio principal' : '';
      case 'acceptTerms':
        return !value ? 'Debes aceptar los términos y condiciones' : '';
      default:
        return '';
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validar paso actual
  const validateCurrentStep = (): boolean => {
    let isValid = true;
    const errors: Record<string, string> = {};

    switch (activeStep) {
      case 0: // Método de registro
        // No requiere validación
        break;
      case 1: // Tipo de cuenta
        if (!formData.role) {
          errors.role = 'Selecciona un tipo de cuenta';
          isValid = false;
        }
        break;
      case 2: // Información personal
        if (authMethod === 0) { // Email
          ['fullName', 'email', 'password', 'confirmPassword'].forEach(field => {
            const error = validateField(field, formData[field as keyof RegisterFormData]);
            if (error) {
              errors[field] = error;
              isValid = false;
            }
          });
        } else if (authMethod === 1) { // Phone
          ['fullName', 'phone'].forEach(field => {
            const error = validateField(field, formData[field as keyof RegisterFormData]);
            if (error) {
              errors[field] = error;
              isValid = false;
            }
          });
        }
        
        // Validación específica por rol
        if (formData.role === 'worker' && !formData.trade) {
          errors.trade = 'Selecciona tu oficio principal';
          isValid = false;
        }
        if (formData.role === 'employer' && !formData.companyName) {
          errors.companyName = 'El nombre de la empresa es requerido';
          isValid = false;
        }
        
        if (!formData.acceptTerms) {
          errors.acceptTerms = 'Debes aceptar los términos y condiciones';
          isValid = false;
        }
        break;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Manejar siguiente paso
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (activeStep === steps.length - 2) {
      // Último paso antes de verificación, iniciar registro
      if (authMethod === 0) {
        await handleEmailRegister();
      } else if (authMethod === 1) {
        await handlePhoneRegister();
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  // Manejar paso anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  // Registro con email
  const handleEmailRegister = async () => {
    try {
      setError('');
      setLoading(true);

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Actualizar perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // Crear documento de usuario en Firestore
      await createUserProfile(userCredential.user.uid, {
        email: formData.email,
        displayName: formData.fullName
      });

      setActiveStep(prev => prev + 1);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado. Por favor inicia sesión.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es muy débil.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Registro con teléfono
  const handlePhoneRegister = async () => {
    try {
      setError('');
      setLoading(true);

      // Formatear número de teléfono para México
      let formattedPhone = formData.phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+52' + formattedPhone.replace(/\D/g, '');
      }

      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA no está configurado');
      }

      const confirmation = await signInWithPhone(formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setActiveStep(prev => prev + 1);

    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        setError('Número de teléfono inválido');
      } else {
        setError(error.message);
      }
      
      // Reset reCAPTCHA
      const verifier = setupRecaptcha('register-recaptcha-container');
      setRecaptchaVerifier(verifier);
    } finally {
      setLoading(false);
    }
  };

  // Verificar código SMS
  const handleVerifyCode = async () => {
    try {
      setError('');
      setLoading(true);

      if (!confirmationResult) {
        throw new Error('No hay verificación pendiente');
      }

      const result = await confirmationResult.confirm(verificationCode);

      // Actualizar perfil con el nombre
      await updateProfile(result.user, {
        displayName: formData.fullName
      });

      // Crear perfil de usuario
      await createUserProfile(result.user.uid, {
        phone: formData.phone,
        displayName: formData.fullName
      });

      // Redirigir a onboarding
      navigate('/onboarding');

    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        setError('Código de verificación incorrecto');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Registro con Google
  const handleGoogleRegister = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await signInWithGoogle();
      
      // Crear perfil de usuario
      await createUserProfile(result.user.uid, {
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || ''
      });

      navigate('/onboarding');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear perfil de usuario en Firestore
  const createUserProfile = async (uid: string, additionalData: any) => {
    const userData: User = {
      id: uid,
      email: additionalData.email || formData.email || '',
      phone: additionalData.phone || formData.phone || '',
      displayName: additionalData.displayName || formData.fullName || '',
      photoURL: additionalData.photoURL || '',
      role: formData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), userData);

    // Crear perfil específico según el rol
    if (formData.role === 'worker') {
      await setDoc(doc(db, 'workers', uid), {
        userId: uid,
        name: formData.fullName,
        phone: formData.phone,
        trade: formData.trade || '',
        experience: formData.experience || 0,
        location: formData.location,
        certifications: [],
        rating: 0,
        totalRatings: 0,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      await setDoc(doc(db, 'employers', uid), {
        userId: uid,
        companyName: formData.companyName || '',
        contactName: formData.fullName,
        phone: formData.phone,
        businessType: formData.businessType || '',
        location: formData.location,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Únete a DOOM
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Conecta con oportunidades para el Mundial 2026
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 0: Método de registro */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                ¿Cómo quieres registrarte?
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Paper
                  elevation={authMethod === 0 ? 4 : 1}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    border: authMethod === 0 ? '2px solid' : '2px solid transparent',
                    borderColor: authMethod === 0 ? 'primary.main' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 3,
                      borderColor: 'primary.light'
                    }
                  }}
                  onClick={() => setAuthMethod(0)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color={authMethod === 0 ? 'primary' : 'action'} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Correo electrónico
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Regístrate con tu email y contraseña
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper
                  elevation={authMethod === 1 ? 4 : 1}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    border: authMethod === 1 ? '2px solid' : '2px solid transparent',
                    borderColor: authMethod === 1 ? 'primary.main' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 3,
                      borderColor: 'primary.light'
                    }
                  }}
                  onClick={() => setAuthMethod(1)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon color={authMethod === 1 ? 'primary' : 'action'} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Número de teléfono
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recibe un código SMS para verificar
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper
                  elevation={authMethod === 2 ? 4 : 1}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    border: authMethod === 2 ? '2px solid' : '2px solid transparent',
                    borderColor: authMethod === 2 ? '#4285f4' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 3,
                      borderColor: '#357ae8'
                    }
                  }}
                  onClick={() => {
                    setAuthMethod(2);
                    handleGoogleRegister();
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GoogleIcon sx={{ color: authMethod === 2 ? '#4285f4' : 'action' }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Google
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Continúa con tu cuenta de Google
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Step 1: Tipo de cuenta */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                ¿Qué tipo de cuenta necesitas?
              </Typography>
              
              <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
                <RadioGroup
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControlLabel
                      value="worker"
                      control={<Radio />}
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Trabajador
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Busco oportunidades de empleo para el Mundial 2026
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper sx={{ p: 2 }}>
                    <FormControlLabel
                      value="employer"
                      control={<Radio />}
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business color="secondary" />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Empleador
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Busco contratar trabajadores calificados
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {/* Step 2: Información personal */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Información personal
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  error={!!fieldErrors.fullName}
                  helperText={fieldErrors.fullName}
                  sx={{ mb: 2 }}
                />

                {authMethod === 0 && (
                  <>
                    <TextField
                      fullWidth
                      type="email"
                      label="Correo electrónico"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Contraseña"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!fieldErrors.password}
                      helperText={fieldErrors.password || 'Mínimo 6 caracteres'}
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
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      error={!!fieldErrors.confirmPassword}
                      helperText={fieldErrors.confirmPassword}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                {authMethod === 1 && (
                  <TextField
                    fullWidth
                    label="Número de teléfono"
                    placeholder="5512345678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone || 'Número de 10 dígitos'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.secondary">+52</Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Campos específicos por rol */}
                {formData.role === 'worker' && (
                  <TextField
                    fullWidth
                    label="Oficio principal"
                    placeholder="Ej: Mesero, Electricista, Traductor"
                    value={formData.trade}
                    onChange={(e) => handleInputChange('trade', e.target.value)}
                    error={!!fieldErrors.trade}
                    helperText={fieldErrors.trade}
                    sx={{ mb: 2 }}
                  />
                )}

                {formData.role === 'employer' && (
                  <>
                    <TextField
                      fullWidth
                      label="Nombre de la empresa"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      error={!!fieldErrors.companyName}
                      helperText={fieldErrors.companyName}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Tipo de negocio"
                      placeholder="Ej: Restaurante, Construcción, Hotel"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  sx={{ mb: 3 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Acepto los{' '}
                      <Link to="/terms" target="_blank">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link to="/privacy" target="_blank">
                        política de privacidad
                      </Link>
                    </Typography>
                  }
                />
                {fieldErrors.acceptTerms && (
                  <FormHelperText error>{fieldErrors.acceptTerms}</FormHelperText>
                )}
              </Box>
            </Box>
          )}

          {/* Step 3: Verificación */}
          {activeStep === 3 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {authMethod === 1 && !confirmationResult ? (
                <CircularProgress size={60} />
              ) : authMethod === 1 ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Verifica tu número
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Enviamos un código de 6 dígitos a +52{formData.phone}
                  </Typography>
                  
                  <TextField
                    label="Código de verificación"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 3, minWidth: 200 }}
                  />
                  
                  <Box>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleVerifyCode}
                      disabled={loading || verificationCode.length < 6}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Verificar'}
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    ¡Registro exitoso!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bienvenido a DOOM. Redirigiendo...
                  </Typography>
                  <CircularProgress sx={{ mt: 3 }} />
                </>
              )}
            </Box>
          )}

          {/* Botones de navegación */}
          {activeStep < 3 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                startIcon={<ArrowBack />}
              >
                Atrás
              </Button>
              
              {activeStep < 2 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || (activeStep === 0 && authMethod === 2)}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || !formData.acceptTerms}
                >
                  {loading ? <CircularProgress size={24} /> : 'Registrarme'}
                </Button>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography component="span" color="primary" fontWeight="bold">
                  Inicia sesión aquí
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Hidden reCAPTCHA container */}
      <div id="register-recaptcha-container"></div>
    </Container>
  );
};

export default RegisterEnhanced;