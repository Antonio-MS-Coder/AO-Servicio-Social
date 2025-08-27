import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4">Detalles del Empleo</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>ID: {id}</Typography>
          <Typography color="text.secondary">
            Esta página mostrará los detalles completos del empleo
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetails;