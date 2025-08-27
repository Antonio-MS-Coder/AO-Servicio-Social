import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Trade, JobPosting } from '../types';

const PostJob: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    trade: Trade.OTHER,
    salary: {
      amount: 0,
      period: 'hour' as const
    },
    duration: '',
    location: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const employerDoc = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        employerId: currentUser!.uid,
        employerName: userData?.email || 'Empresa',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        applicants: [],
        requirements: jobData.requirements.split('\n').filter(r => r.trim())
      });
      
      navigate(`/jobs/${employerDoc.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('job.postJob')}
      </Typography>
      
      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label={t('job.title')}
            value={jobData.title}
            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label={t('job.description')}
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            required
            select
            label={t('profile.trade')}
            value={jobData.trade}
            onChange={(e) => setJobData({ ...jobData, trade: e.target.value as Trade })}
            sx={{ mb: 2 }}
          >
            {Object.values(Trade).map((trade) => (
              <MenuItem key={trade} value={trade}>
                {t(`trades.${trade}`)}
              </MenuItem>
            ))}
          </TextField>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              required
              type="number"
              label={t('job.salary')}
              value={jobData.salary.amount}
              onChange={(e) => setJobData({ 
                ...jobData, 
                salary: { ...jobData.salary, amount: parseFloat(e.target.value) } 
              })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            
            <TextField
              required
              select
              label="Periodo"
              value={jobData.salary.period}
              onChange={(e) => setJobData({ 
                ...jobData, 
                salary: { ...jobData.salary, period: e.target.value as any } 
              })}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="hour">Por hora</MenuItem>
              <MenuItem value="day">Por día</MenuItem>
              <MenuItem value="week">Por semana</MenuItem>
              <MenuItem value="month">Por mes</MenuItem>
              <MenuItem value="project">Por proyecto</MenuItem>
            </TextField>
          </Box>
          
          <TextField
            fullWidth
            label={t('job.duration')}
            value={jobData.duration}
            onChange={(e) => setJobData({ ...jobData, duration: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            required
            label={t('job.location')}
            value={jobData.location}
            onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('job.requirements')}
            helperText="Escribe un requisito por línea"
            value={jobData.requirements}
            onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : t('job.postJob')}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
              fullWidth
            >
              {t('actions.cancel')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PostJob;