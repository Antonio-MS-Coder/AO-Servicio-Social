import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  CircularProgress,
  Paper
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search,
  LocationOn,
  AttachMoney,
  Work,
  Schedule
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { JobPosting, Trade } from '../types';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | ''>('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [selectedTrade]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'jobs'),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (selectedTrade) {
        q = query(
          collection(db, 'jobs'),
          where('status', '==', 'open'),
          where('trade', '==', selectedTrade),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      const querySnapshot = await getDocs(q);
      const jobsData: JobPosting[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as JobPosting);
      });
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const formatSalary = (salary: JobPosting['salary']) => {
    const period = {
      hour: 'hora',
      day: 'día',
      week: 'semana',
      month: 'mes',
      project: 'proyecto'
    };
    return `$${salary.amount.toLocaleString()} / ${period[salary.period]}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t('nav.jobs')}
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('actions.search')}
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label={t('profile.trade')}
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value as Trade | '')}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.values(Trade).map((trade) => (
                <MenuItem key={trade} value={trade}>
                  {t(`trades.${trade}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Ubicación"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Job Listings */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {t('messages.noResults')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {job.employerName}
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <Chip
                      icon={<Work />}
                      label={t(`trades.${job.trade}`)}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<LocationOn />}
                      label={job.location}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {job.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {formatSalary(job.salary)}
                    </Typography>
                  </Box>

                  {job.duration && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.duration}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    {t('actions.viewDetails')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Jobs;