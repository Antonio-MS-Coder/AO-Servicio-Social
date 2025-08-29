import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import {
  Star,
  StarBorder,
  ThumbUp,
  Work,
  CheckCircle
} from '@mui/icons-material';
import { addDoc, collection, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  targetUserPhoto?: string;
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  targetUserId,
  targetUserName,
  targetUserPhoto,
  jobId,
  jobTitle,
  onSuccess
}) => {
  const { currentUser, userData } = useAuth();
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const ratingLabels: { [key: number]: string } = {
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente'
  };

  const handleSubmit = async () => {
    if (!currentUser || !rating) return;

    setSubmitting(true);
    setError('');

    try {
      // Add the review
      await addDoc(collection(db, 'reviews'), {
        fromUserId: currentUser.uid,
        fromUserName: userData?.displayName || userData?.email || 'Usuario',
        toUserId: targetUserId,
        jobId,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });

      // Update the target user's rating
      const targetUserRole = userData?.role === 'worker' ? 'employers' : 'workers';
      const targetUserRef = doc(db, targetUserRole, targetUserId);
      const targetUserDoc = await getDoc(targetUserRef);

      if (targetUserDoc.exists()) {
        const currentData = targetUserDoc.data();
        const currentRating = currentData.rating || 0;
        const totalRatings = currentData.totalRatings || 0;
        
        // Calculate new average rating
        const newTotalRatings = totalRatings + 1;
        const newRating = ((currentRating * totalRatings) + rating) / newTotalRatings;

        await updateDoc(targetUserRef, {
          rating: newRating,
          totalRatings: newTotalRatings,
          updatedAt: serverTimestamp()
        });
      }

      // Mark the job as completed if needed
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Error al enviar la calificación. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircle color="success" />
          <Typography variant="h6">Calificar servicio</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Job Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Trabajo completado:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {jobTitle}
          </Typography>
        </Box>

        {/* User to Rate */}
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Avatar src={targetUserPhoto} alt={targetUserName} sx={{ width: 56, height: 56 }}>
            {targetUserName[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {targetUserName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData?.role === 'worker' ? 'Empleador' : 'Trabajador'}
            </Typography>
          </Box>
        </Box>

        {/* Rating Stars */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            ¿Cómo calificarías el servicio?
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<StarBorder fontSize="inherit" />}
            />
            {rating && (
              <Chip
                label={ratingLabels[rating]}
                color={rating >= 4 ? 'success' : rating >= 3 ? 'warning' : 'error'}
                size="small"
              />
            )}
          </Box>
        </Box>

        {/* Comment */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Comentarios (opcional)"
          placeholder="Comparte tu experiencia..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
        />

        {/* Quick Feedback Options */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Feedback rápido:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
            <Chip
              label="Puntual"
              size="small"
              onClick={() => setComment(prev => prev + ' Muy puntual.')}
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
            />
            <Chip
              label="Profesional"
              size="small"
              onClick={() => setComment(prev => prev + ' Muy profesional.')}
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
            />
            <Chip
              label="Buen trabajo"
              size="small"
              onClick={() => setComment(prev => prev + ' Excelente trabajo.')}
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
            />
            <Chip
              label="Recomendado"
              size="small"
              onClick={() => setComment(prev => prev + ' Lo recomiendo.')}
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!rating || submitting}
          startIcon={<Star />}
        >
          {submitting ? 'Enviando...' : 'Enviar calificación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;