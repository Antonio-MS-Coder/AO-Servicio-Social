import { createTheme, alpha } from '@mui/material/styles';

// Extend Material-UI theme type to include custom properties
declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }

  interface PaletteOptions {
    neutral?: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
    };
  }
}

// Enhanced theme with World Cup 2026 celebration and Mexican cultural identity
// Improved color system with semantic tokens and better contrast ratios
const theme = createTheme({
  palette: {
    primary: {
      main: '#007A33', // Mexico green - WCAG AA compliant
      light: '#4CAF50',
      dark: '#00541E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#f7991c', // Álvaro Obregón orange
      light: '#FFB74D', 
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5', 
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#388E3C',
      light: '#4CAF50',
      dark: '#2E7D32',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // High contrast for body text
      secondary: '#616161', // Medium contrast for supporting text
      disabled: '#9E9E9E', // Low contrast for disabled states
    },
    // Action colors with proper contrast ratios
    action: {
      active: '#007A33',
      hover: 'rgba(0, 122, 51, 0.04)',
      selected: 'rgba(0, 122, 51, 0.08)',
      disabled: '#BDBDBD',
      disabledBackground: '#F5F5F5',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.05)',
    '0px 8px 16px rgba(0,0,0,0.05)',
    '0px 12px 24px rgba(0,0,0,0.05)',
    '0px 16px 32px rgba(0,0,0,0.05)',
    '0px 20px 40px rgba(0,0,0,0.05)',
    '0px 24px 48px rgba(0,0,0,0.05)',
    '0px 28px 56px rgba(0,0,0,0.05)',
    '0px 32px 64px rgba(0,0,0,0.05)',
    '0px 36px 72px rgba(0,0,0,0.05)',
    '0px 40px 80px rgba(0,0,0,0.05)',
    '0px 44px 88px rgba(0,0,0,0.05)',
    '0px 48px 96px rgba(0,0,0,0.05)',
    '0px 52px 104px rgba(0,0,0,0.05)',
    '0px 56px 112px rgba(0,0,0,0.05)',
    '0px 60px 120px rgba(0,0,0,0.05)',
    '0px 64px 128px rgba(0,0,0,0.05)',
    '0px 68px 136px rgba(0,0,0,0.05)',
    '0px 72px 144px rgba(0,0,0,0.05)',
    '0px 76px 152px rgba(0,0,0,0.05)',
    '0px 80px 160px rgba(0,0,0,0.05)',
    '0px 84px 168px rgba(0,0,0,0.05)',
    '0px 88px 176px rgba(0,0,0,0.05)',
    '0px 92px 184px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          borderWidth: 2,
          fontWeight: 600,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha('#007A33', 0.06),
          },
          // High contrast outlined buttons for better visibility
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#007A33',
            color: '#007A33',
            '&:hover': {
              backgroundColor: alpha('#007A33', 0.08),
              borderColor: '#00541E',
            },
          },
          '&.MuiButton-outlinedSecondary': {
            borderColor: '#f7991c', 
            color: '#f7991c',
            '&:hover': {
              backgroundColor: alpha('#f7991c', 0.08),
              borderColor: '#F57C00',
            },
          },
        },
        // Enhanced text buttons with better contrast
        text: {
          fontWeight: 500,
          '&.MuiButton-textPrimary': {
            color: '#007A33',
            '&:hover': {
              backgroundColor: alpha('#007A33', 0.04),
            },
          },
          '&.MuiButton-textSecondary': {
            color: '#f7991c',
            '&:hover': {
              backgroundColor: alpha('#f7991c', 0.04),
            },
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #007A33 0%, #00541E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00541E 0%, #007A33 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f7991c 0%, #F57C00 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F57C00 0%, #f7991c 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 0 4px rgba(0, 122, 51, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(0, 122, 51, 0.12)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#FFFFFF', 0.95),
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: alpha('#007A33', 0.08),
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#FFC107',
        },
      },
    },
  },
});

export default theme;

// Custom animation keyframes for use in components
export const animations = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'fadeIn 0.6s ease-out',
  },
  slideUp: {
    '@keyframes slideUp': {
      from: { opacity: 0, transform: 'translateY(40px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  pulse: {
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
    animation: 'pulse 2s infinite',
  },
  float: {
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    animation: 'float 3s ease-in-out infinite',
  },
  shimmer: {
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-1000px 0' },
      '100%': { backgroundPosition: '1000px 0' },
    },
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
  },
};