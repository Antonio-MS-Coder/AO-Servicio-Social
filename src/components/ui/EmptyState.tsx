import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  SearchOff,
  WorkOff,
  PersonOff,
  EventBusy,
  FolderOff,
  CloudOff,
} from '@mui/icons-material';

interface EmptyStateProps {
  type: 'search' | 'jobs' | 'workers' | 'applications' | 'general' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description, action }) => {
  const getIcon = () => {
    const iconProps = { sx: { fontSize: 80, color: 'text.secondary', opacity: 0.3 } };
    
    switch (type) {
      case 'search':
        return <SearchOff {...iconProps} />;
      case 'jobs':
        return <WorkOff {...iconProps} />;
      case 'workers':
        return <PersonOff {...iconProps} />;
      case 'applications':
        return <EventBusy {...iconProps} />;
      case 'error':
        return <CloudOff {...iconProps} />;
      default:
        return <FolderOff {...iconProps} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          title: 'No se encontraron resultados',
          description: 'Intenta ajustar los filtros o cambiar los términos de búsqueda'
        };
      case 'jobs':
        return {
          title: 'No hay empleos disponibles',
          description: 'Nuevas oportunidades aparecen todos los días. Vuelve pronto.'
        };
      case 'workers':
        return {
          title: 'No se encontraron trabajadores',
          description: 'Ajusta los filtros para ver más perfiles disponibles'
        };
      case 'applications':
        return {
          title: 'Sin aplicaciones',
          description: 'Aún no has aplicado a ningún empleo'
        };
      case 'error':
        return {
          title: 'Algo salió mal',
          description: 'Hubo un error al cargar la información. Por favor intenta de nuevo.'
        };
      default:
        return {
          title: 'No hay datos disponibles',
          description: 'No hay información para mostrar en este momento'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <Paper
      sx={{
        p: 8,
        textAlign: 'center',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(0, 122, 51, 0.02) 0%, rgba(247, 153, 28, 0.02) 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 122, 51, 0.05) 0%, transparent 70%)',
            },
          }}
        >
          {getIcon()}
        </Box>
        
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            color="text.primary"
          >
            {title || content.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            {description || content.description}
          </Typography>
        </Box>

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            sx={{
              mt: 2,
              background: 'linear-gradient(135deg, #007A33 0%, #00541E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00541E 0%, #007A33 100%)',
              },
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EmptyState;