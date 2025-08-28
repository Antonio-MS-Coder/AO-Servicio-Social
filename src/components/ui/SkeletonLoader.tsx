import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

// Skeleton loader for job cards
export const JobCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: 1 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={100} height={24} />
      </Box>
      
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={120} height={24} />
      </Box>
    </CardContent>
    
    <Box sx={{ p: 2, pt: 0 }}>
      <Skeleton variant="rounded" width="100%" height={40} />
    </Box>
  </Card>
);

// Skeleton loader for worker cards
export const WorkerCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="circular" width={18} height={18} sx={{ ml: 1 }} />
      </Box>
      
      <Skeleton variant="rounded" width={100} height={24} sx={{ mb: 1 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={30} height={20} sx={{ ml: 1 }} />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
        <Skeleton variant="text" width={120} height={20} />
      </Box>
      
      <Skeleton variant="text" width="80%" height={20} />
    </CardContent>
    
    <Box sx={{ p: 2, pt: 0 }}>
      <Skeleton variant="rounded" width="100%" height={40} />
    </Box>
  </Card>
);

// Skeleton loader for list views
export const ListSkeleton: React.FC<{ items?: number; type?: 'job' | 'worker' }> = ({ 
  items = 6, 
  type = 'job' 
}) => {
  const SkeletonComponent = type === 'job' ? JobCardSkeleton : WorkerCardSkeleton;
  const gridCols = type === 'job' ? { xs: 12, md: 6, lg: 4 } : { xs: 12, sm: 6, md: 4, lg: 3 };
  
  return (
    <Grid container spacing={3}>
      {[...Array(items)].map((_, index) => (
        <Grid item {...gridCols} key={index}>
          <SkeletonComponent />
        </Grid>
      ))}
    </Grid>
  );
};

// Skeleton loader for filters
export const FilterSkeleton: React.FC = () => (
  <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rounded" height={56} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rounded" height={56} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rounded" height={56} />
      </Grid>
    </Grid>
  </Box>
);

// Profile header skeleton
export const ProfileHeaderSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
    <Skeleton variant="circular" width={120} height={120} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
      </Box>
    </Box>
  </Box>
);

export default ListSkeleton;