import React, { useState, useEffect, useCallback } from 'react';
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
  Paper,
  Rating,
  Avatar,
  useTheme,
  Fade,
  Slide,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Tooltip,
  alpha,
  Autocomplete,
  Slider,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search,
  LocationOn,
  AttachMoney,
  Work,
  Schedule,
  ViewModule,
  ViewList,
  FilterList,
  Clear,
  Bookmark,
  BookmarkBorder,
  TrendingUp,
  NewReleases,
  Verified,
  Business,
  CalendarToday,
  Groups,
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { JobPosting, Trade } from '../types';
import EmptyState from '../components/ui/EmptyState';
import { JobCardSkeleton, FilterSkeleton } from '../components/ui/SkeletonLoader';
import { TrustBadge } from '../components/ui/TrustBadges';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | ''>('');
  const [locationFilter, setLocationFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'popular'>('recent');
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 10000]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchJobs();
    setIsVisible(true);
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('savedJobs');
    if (saved) setSavedJobs(JSON.parse(saved));
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
      
      // Simulate some additional data for demonstration
      const enrichedJobs = jobsData.map(job => ({
        ...job,
        applicants: job.applicants || Array(Math.floor(Math.random() * 50)).fill(''),
        urgent: Math.random() > 0.7,
        verified: Math.random() > 0.5,
        featured: Math.random() > 0.8,
      }));
      
      setJobs(enrichedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Small delay for smooth transition
    }
  };

  const handleSaveJob = useCallback((jobId: string) => {
    const newSaved = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSaved);
    localStorage.setItem('savedJobs', JSON.stringify(newSaved));
  }, [savedJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSalary = job.salary.amount >= salaryRange[0] && job.salary.amount <= salaryRange[1];
    return matchesSearch && matchesLocation && matchesSalary;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'salary':
        return b.salary.amount - a.salary.amount;
      case 'popular':
        return (b.applicants?.length || 0) - (a.applicants?.length || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
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

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return `Hace ${Math.floor(days / 30)} meses`;
  };

  const JobCard = ({ job, index }: { job: any; index: number }) => (
    <Fade in={isVisible} timeout={300 + index * 50}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: job.featured ? '2px solid' : '1px solid',
          borderColor: job.featured ? theme.palette.secondary.main : 'divider',
          overflow: 'hidden',
          '&::before': job.featured ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
          } : {},
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {/* Badges */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
            zIndex: 1,
          }}
        >
          {job.urgent && (
            <Chip
              icon={<NewReleases />}
              label="Urgente"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.9),
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {job.featured && (
            <Chip
              icon={<TrendingUp />}
              label="Destacado"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.9),
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flex: 1, pb: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight={600}
                sx={{ 
                  flex: 1,
                  pr: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {job.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveJob(job.id);
                }}
                sx={{ ml: 1 }}
              >
                {savedJobs.includes(job.id) ? (
                  <Bookmark sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {job.employerName}
              </Typography>
              {job.verified && <TrustBadge type="verified" size="small" />}
            </Box>
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            <Chip
              icon={<Work sx={{ fontSize: 16 }} />}
              label={t(`trades.${job.trade}`)}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<LocationOn sx={{ fontSize: 16 }} />}
              label={job.location}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
          >
            {job.description}
          </Typography>

          {/* Footer Info */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ fontSize: 20, color: theme.palette.success.main, mr: 0.5 }} />
                <Typography variant="body1" fontWeight={600} color="success.main">
                  {formatSalary(job.salary)}
                </Typography>
              </Box>
              {job.duration && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {job.duration}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {getDaysAgo(job.createdAt)}
                </Typography>
              </Box>
              {job.applicants && job.applicants.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Groups sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {job.applicants.length} aplicantes
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>

        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/jobs/${job.id}`)}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
            }}
          >
            {t('actions.viewDetails')}
          </Button>
        </Box>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={600}>
          {t('nav.jobs')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {filteredJobs.length} oportunidades disponibles para el Mundial 2026
        </Typography>
      </Box>

      {/* Enhanced Filters */}
      <Slide direction="down" in={showFilters} mountOnEnter unmountOnExit>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          {loading ? (
            <FilterSkeleton />
          ) : (
            <>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Buscar empleos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={Object.values(Trade)}
                    value={selectedTrade || null}
                    onChange={(e, value) => setSelectedTrade(value as Trade | '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('profile.trade')}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Work />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    getOptionLabel={(option) => t(`trades.${option}`)}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
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
                      endAdornment: locationFilter && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setLocationFilter('')}>
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Ordenar por"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <MenuItem value="recent">Más recientes</MenuItem>
                    <MenuItem value="salary">Mayor salario</MenuItem>
                    <MenuItem value="popular">Más populares</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {/* Salary Range Slider */}
              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Rango salarial: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={salaryRange}
                  onChange={(e, value) => setSalaryRange(value as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={500}
                  sx={{ maxWidth: 400 }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Slide>

      {/* View Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          variant="outlined"
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, value) => value && setViewMode(value)}
          size="small"
        >
          <ToggleButton value="grid">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Job Listings */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={index}>
              <JobCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          type="search"
          title="No se encontraron empleos"
          description="Intenta ajustar los filtros o cambiar los términos de búsqueda"
          action={{
            label: 'Limpiar filtros',
            onClick: () => {
              setSearchTerm('');
              setSelectedTrade('');
              setLocationFilter('');
              setSalaryRange([0, 10000]);
            }
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job, index) => (
            <Grid 
              item 
              xs={12} 
              md={viewMode === 'grid' ? 6 : 12} 
              lg={viewMode === 'grid' ? 4 : 12} 
              key={job.id}
            >
              <JobCard job={job} index={index} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{ px: 6 }}
          >
            Cargar más empleos
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Jobs;