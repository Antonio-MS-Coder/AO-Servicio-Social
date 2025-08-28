import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import {
  Verified,
  Shield,
  Star,
  CheckCircle,
  WorkHistory,
  Groups,
  Gavel,
  Security,
  Badge,
  LocalPolice,
} from '@mui/icons-material';

interface BadgeProps {
  type: 'verified' | 'trusted' | 'top-rated' | 'experienced' | 'certified' | 'premium' | 'official';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const TrustBadge: React.FC<BadgeProps> = ({ type, size = 'small', showLabel = false }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'verified':
        return {
          icon: <Verified />,
          label: 'Verificado',
          color: '#007A33',
          tooltip: 'Identidad verificada con documento oficial',
        };
      case 'trusted':
        return {
          icon: <Shield />,
          label: 'Confiable',
          color: '#2196F3',
          tooltip: 'Usuario con excelente reputación',
        };
      case 'top-rated':
        return {
          icon: <Star />,
          label: 'Top',
          color: '#FFC107',
          tooltip: 'Calificación superior a 4.5 estrellas',
        };
      case 'experienced':
        return {
          icon: <WorkHistory />,
          label: '5+ años',
          color: '#9C27B0',
          tooltip: 'Más de 5 años de experiencia',
        };
      case 'certified':
        return {
          icon: <Badge />,
          label: 'Certificado',
          color: '#FF5722',
          tooltip: 'Certificaciones profesionales validadas',
        };
      case 'premium':
        return {
          icon: <LocalPolice />,
          label: 'Premium',
          color: '#F7991C',
          tooltip: 'Miembro premium de DOOM',
        };
      case 'official':
        return {
          icon: <Gavel />,
          label: 'Oficial',
          color: '#007A33',
          tooltip: 'Empresa verificada oficialmente',
        };
      default:
        return {
          icon: <CheckCircle />,
          label: 'Verificado',
          color: '#007A33',
          tooltip: 'Verificado',
        };
    }
  };

  const config = getBadgeConfig();
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  if (showLabel) {
    return (
      <Tooltip title={config.tooltip} arrow placement="top">
        <Chip
          icon={React.cloneElement(config.icon, { sx: { fontSize: iconSize } })}
          label={config.label}
          size={size === 'large' ? 'medium' : size}
          sx={{
            backgroundColor: `${config.color}15`,
            color: config.color,
            borderColor: config.color,
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: config.color,
            },
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={config.tooltip} arrow placement="top">
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          color: config.color,
          verticalAlign: 'middle',
        }}
      >
        {React.cloneElement(config.icon, { sx: { fontSize: iconSize } })}
      </Box>
    </Tooltip>
  );
};

interface TrustIndicatorsProps {
  verified?: boolean;
  rating?: number;
  totalRatings?: number;
  experience?: number;
  certifications?: number;
  premium?: boolean;
}

export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  verified,
  rating,
  totalRatings,
  experience,
  certifications,
  premium,
}) => {
  const badges = [];

  if (verified) badges.push('verified');
  if (rating && rating >= 4.5 && totalRatings && totalRatings >= 10) badges.push('top-rated');
  if (experience && experience >= 5) badges.push('experienced');
  if (certifications && certifications > 0) badges.push('certified');
  if (premium) badges.push('premium');
  if (rating && rating >= 4.0 && totalRatings && totalRatings >= 5) badges.push('trusted');

  if (badges.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
      {badges.map((badge) => (
        <TrustBadge key={badge} type={badge as any} size="small" />
      ))}
    </Box>
  );
};

interface TrustSectionProps {
  stats: {
    verifiedUsers: number;
    successfulJobs: number;
    averageRating: number;
    activeWorkers: number;
  };
}

export const TrustSection: React.FC<TrustSectionProps> = ({ stats }) => {
  // Enhanced visual hierarchy - most important stat gets prominence
  const getStatPriority = (statKey: string) => {
    switch (statKey) {
      case 'verifiedUsers': return 'primary'; // Highest priority
      case 'averageRating': return 'secondary'; // Second priority  
      case 'successfulJobs': return 'tertiary';
      case 'activeWorkers': return 'tertiary';
      default: return 'tertiary';
    }
  };

  const getStatSize = (priority: string) => {
    switch (priority) {
      case 'primary': return { icon: 56, textVariant: 'h3' as const, minWidth: 140 };
      case 'secondary': return { icon: 48, textVariant: 'h4' as const, minWidth: 120 };
      default: return { icon: 44, textVariant: 'h4' as const, minWidth: 110 };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, md: 4 },
        justifyContent: 'center',
        alignItems: 'flex-start', // Better alignment
        p: { xs: 4, md: 6 },
        borderRadius: 4, // More modern border radius
        background: {
          xs: 'linear-gradient(135deg, rgba(0, 122, 51, 0.03) 0%, rgba(247, 153, 28, 0.03) 100%)',
          md: 'linear-gradient(135deg, rgba(0, 122, 51, 0.06) 0%, rgba(247, 153, 28, 0.06) 100%)',
        },
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #007A33 0%, #f7991c 100%)',
        },
      }}
    >
      {/* Primary stat - Verified Users (highest priority) */}
      {(() => {
        const priority = getStatPriority('verifiedUsers');
        const size = getStatSize(priority);
        return (
          <Box sx={{ 
            textAlign: 'center', 
            minWidth: size.minWidth,
            position: 'relative',
            '&::after': priority === 'primary' ? {
              content: '""',
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
            } : {},
          }}>
            <Security sx={{ 
              fontSize: size.icon, 
              color: 'primary.main', 
              mb: 1.5,
              filter: 'drop-shadow(0 2px 4px rgba(0,122,51,0.2))'
            }} />
            <Typography variant={size.textVariant} fontWeight="bold" color="primary.main" sx={{ mb: 0.5 }}>
              {stats.verifiedUsers.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Usuarios Verificados
            </Typography>
          </Box>
        );
      })()}

      {/* Secondary stat - Average Rating */}
      {(() => {
        const priority = getStatPriority('averageRating');
        const size = getStatSize(priority);
        return (
          <Box sx={{ textAlign: 'center', minWidth: size.minWidth }}>
            <Star sx={{ 
              fontSize: size.icon, 
              color: 'warning.main', 
              mb: 1.5,
              filter: 'drop-shadow(0 2px 4px rgba(255,193,7,0.2))'
            }} />
            <Typography variant={size.textVariant} fontWeight="bold" color="warning.main" sx={{ mb: 0.5 }}>
              {stats.averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Calificación Promedio
            </Typography>
          </Box>
        );
      })()}

      {/* Tertiary stats */}
      <Box sx={{ textAlign: 'center', minWidth: 110 }}>
        <CheckCircle sx={{ 
          fontSize: 44, 
          color: 'success.main', 
          mb: 1.5,
          filter: 'drop-shadow(0 2px 4px rgba(56,142,60,0.2))'
        }} />
        <Typography variant="h4" fontWeight="bold" color="success.main" sx={{ mb: 0.5 }}>
          {stats.successfulJobs.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Trabajos Completados
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', minWidth: 110 }}>
        <Groups sx={{ 
          fontSize: 44, 
          color: 'secondary.main', 
          mb: 1.5,
          filter: 'drop-shadow(0 2px 4px rgba(247,153,28,0.2))'
        }} />
        <Typography variant="h4" fontWeight="bold" color="secondary.main" sx={{ mb: 0.5 }}>
          {stats.activeWorkers.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Trabajadores Activos
        </Typography>
      </Box>
    </Box>
  );
};

export default TrustBadge;