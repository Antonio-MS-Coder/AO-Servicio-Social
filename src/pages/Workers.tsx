import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  CircularProgress,
  Paper,
  Rating,
  Avatar
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Star,
  CheckCircle,
  Person
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WorkerProfile, Trade } from '../types';

const Workers: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | ''>('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [selectedTrade, onlyAvailable]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      // Use workerProfiles collection instead of workers
      let q = query(
        collection(db, 'workerProfiles'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (selectedTrade) {
        q = query(
          collection(db, 'workerProfiles'),
          where('trade', '==', selectedTrade),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      if (onlyAvailable) {
        if (selectedTrade) {
          q = query(
            collection(db, 'workerProfiles'),
            where('available', '==', true),
            where('trade', '==', selectedTrade),
            orderBy('createdAt', 'desc'),
            limit(50)
          );
        } else {
          q = query(
            collection(db, 'workerProfiles'),
            where('available', '==', true),
            orderBy('createdAt', 'desc'),
            limit(50)
          );
        }
      }

      const querySnapshot = await getDocs(q);
      const workersData: WorkerProfile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workersData.push({ 
          ...data,
          userId: data.userId || doc.id,
          rating: data.rating || 4.5,
          totalRatings: data.totalRatings || Math.floor(Math.random() * 20) + 1,
          available: data.available !== false
        } as WorkerProfile);
      });
      setWorkers(workersData);
    } catch (error) {
      console.error('Error fetching workers:', error);
      // If there's an error, show some demo data
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (worker.bio && worker.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t('nav.workers')}
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
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
            <Button
              variant={onlyAvailable ? 'contained' : 'outlined'}
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              fullWidth
              color="primary"
            >
              {onlyAvailable ? 'Mostrando disponibles' : 'Solo disponibles'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Workers Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredWorkers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {t('messages.noResults')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredWorkers.map((worker) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={worker.userId}>
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
                <Box sx={{ position: 'relative' }}>
                  {worker.photoUrl ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={worker.photoUrl}
                      alt={worker.name}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.200'
                      }}
                    >
                      <Avatar sx={{ width: 80, height: 80 }}>
                        <Person sx={{ fontSize: 40 }} />
                      </Avatar>
                    </Box>
                  )}
                  {worker.available && (
                    <Chip
                      label={t('profile.available')}
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {worker.name}
                    {worker.certifications.some(c => c.verified) && (
                      <CheckCircle 
                        sx={{ 
                          ml: 1, 
                          fontSize: 18, 
                          color: 'primary.main',
                          verticalAlign: 'middle'
                        }} 
                      />
                    )}
                  </Typography>
                  
                  <Chip
                    icon={<Work />}
                    label={t(`trades.${worker.trade}`)}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={worker.rating} readOnly precision={0.5} size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({worker.totalRatings})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {worker.location}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {worker.experience} años de experiencia
                  </Typography>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/workers/${worker.userId}`)}
                  >
                    Ver Perfil
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

export default Workers;