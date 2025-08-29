import React from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Avatar,
  Badge as MuiBadge,
  Typography,
  IconButton,
  Stack
} from '@mui/material';
import {
  Verified,
  School,
  WorkspacePremium,
  Security,
  LocalHospital,
  Restaurant,
  DirectionsCar,
  Build,
  CleaningServices,
  Translate,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { Certification } from '../../types';

interface CertificationBadgesProps {
  certifications: Certification[];
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  maxDisplay?: number;
}

// Certification type definitions
const certificationTypes = {
  'food_handling': {
    icon: <Restaurant />,
    color: '#FF6B6B',
    label: 'Manejo de Alimentos'
  },
  'first_aid': {
    icon: <LocalHospital />,
    color: '#4CAF50',
    label: 'Primeros Auxilios'
  },
  'driver_license': {
    icon: <DirectionsCar />,
    color: '#2196F3',
    label: 'Licencia de Conducir'
  },
  'security_guard': {
    icon: <Security />,
    color: '#9C27B0',
    label: 'Guardia de Seguridad'
  },
  'technical': {
    icon: <Build />,
    color: '#FF9800',
    label: 'Certificación Técnica'
  },
  'cleaning': {
    icon: <CleaningServices />,
    color: '#00BCD4',
    label: 'Limpieza Profesional'
  },
  'language': {
    icon: <Translate />,
    color: '#607D8B',
    label: 'Idiomas'
  },
  'professional': {
    icon: <WorkspacePremium />,
    color: '#795548',
    label: 'Certificación Profesional'
  },
  'education': {
    icon: <School />,
    color: '#3F51B5',
    label: 'Educación'
  },
  'verified': {
    icon: <Verified />,
    color: '#4CAF50',
    label: 'Verificado'
  }
};

const CertificationBadge: React.FC<{
  certification: Certification;
  size?: 'small' | 'medium' | 'large';
}> = ({ certification, size = 'medium' }) => {
  const certType = certificationTypes[certification.type as keyof typeof certificationTypes] || 
                   certificationTypes['professional'];
  
  const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
  const chipSize = size === 'large' ? 'medium' : 'small';

  if (size === 'small') {
    return (
      <Tooltip title={`${certType.label}: ${certification.name}`}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: certification.verified ? certType.color : 'grey.400',
            fontSize: iconSize
          }}
        >
          {React.cloneElement(certType.icon, { sx: { fontSize: iconSize } })}
        </Avatar>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {certification.name}
          </Typography>
          <Typography variant="caption" display="block">
            Emisor: {certification.issuer}
          </Typography>
          <Typography variant="caption" display="block">
            Fecha: {new Date(certification.issueDate).toLocaleDateString('es-MX')}
          </Typography>
          {certification.expiryDate && (
            <Typography variant="caption" display="block">
              Vence: {new Date(certification.expiryDate).toLocaleDateString('es-MX')}
            </Typography>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Estado: {certification.verified ? '✓ Verificado' : '⏳ Pendiente de verificación'}
          </Typography>
        </Box>
      }
    >
      <Chip
        icon={React.cloneElement(certType.icon, { sx: { fontSize: iconSize } })}
        label={certification.name}
        size={chipSize}
        sx={{
          bgcolor: certification.verified ? certType.color : 'grey.400',
          color: 'white',
          '& .MuiChip-icon': {
            color: 'white'
          }
        }}
      />
    </Tooltip>
  );
};

const CertificationBadges: React.FC<CertificationBadgesProps> = ({
  certifications,
  size = 'medium',
  showDetails = false,
  maxDisplay = 5
}) => {
  const displayCerts = certifications.slice(0, maxDisplay);
  const remainingCount = certifications.length - maxDisplay;

  if (certifications.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Sin certificaciones
      </Typography>
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {displayCerts.map((cert) => (
          <CertificationBadge
            key={cert.id}
            certification={cert}
            size={size}
          />
        ))}
        
        {remainingCount > 0 && (
          <Chip
            label={`+${remainingCount} más`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {showDetails && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Resumen de certificaciones:
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CheckCircle color="success" fontSize="small" />
              <Typography variant="body2">
                {certifications.filter(c => c.verified).length} verificadas
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Info color="warning" fontSize="small" />
              <Typography variant="body2">
                {certifications.filter(c => !c.verified).length} pendientes
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Component to display a single verification badge
export const VerificationBadge: React.FC<{
  verified: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}> = ({ verified, size = 'medium', showLabel = true }) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 28 : 20;
  
  if (!verified) return null;

  return (
    <Tooltip title="Perfil verificado">
      <Box display="inline-flex" alignItems="center" gap={0.5}>
        <Verified 
          color="primary" 
          sx={{ fontSize: iconSize }}
        />
        {showLabel && (
          <Typography variant="caption" color="primary">
            Verificado
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

// Component to display trust score
export const TrustScore: React.FC<{
  rating: number;
  totalRatings: number;
  certificationCount: number;
  verifiedCount: number;
}> = ({ rating, totalRatings, certificationCount, verifiedCount }) => {
  // Calculate trust score (0-100)
  const ratingScore = (rating / 5) * 40; // 40% weight
  const reviewScore = Math.min((totalRatings / 10) * 20, 20); // 20% weight
  const certScore = Math.min((certificationCount / 5) * 20, 20); // 20% weight
  const verifiedScore = Math.min((verifiedCount / 3) * 20, 20); // 20% weight
  
  const trustScore = Math.round(ratingScore + reviewScore + certScore + verifiedScore);
  
  const getColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            Puntaje de confianza: {trustScore}%
          </Typography>
          <Typography variant="caption" display="block">
            Calificación: {rating.toFixed(1)} ⭐ ({ratingScore.toFixed(0)}/40)
          </Typography>
          <Typography variant="caption" display="block">
            Reseñas: {totalRatings} ({reviewScore.toFixed(0)}/20)
          </Typography>
          <Typography variant="caption" display="block">
            Certificaciones: {certificationCount} ({certScore.toFixed(0)}/20)
          </Typography>
          <Typography variant="caption" display="block">
            Verificadas: {verifiedCount} ({verifiedScore.toFixed(0)}/20)
          </Typography>
        </Box>
      }
    >
      <Chip
        icon={<Security />}
        label={`${trustScore}% Confianza`}
        color={getColor(trustScore)}
        size="small"
      />
    </Tooltip>
  );
};

export default CertificationBadges;