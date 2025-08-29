import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Send,
  Close,
  AttachFile,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientPhoto?: string;
  jobId?: string;
  jobTitle?: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: any;
  read: boolean;
  jobId?: string;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  open,
  onClose,
  recipientId,
  recipientName,
  recipientPhoto,
  jobId,
  jobTitle
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !currentUser) return;

    setLoading(true);
    
    // Create conversation ID (sorted user IDs to ensure consistency)
    const conversationId = [currentUser.uid, recipientId].sort().join('_');
    
    // Subscribe to messages
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messageList);
      setLoading(false);
      
      // Mark messages as read
      markMessagesAsRead();
    });

    return () => unsubscribe();
  }, [open, currentUser, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markMessagesAsRead = async () => {
    if (!currentUser) return;
    
    const unreadQuery = query(
      collection(db, 'messages'),
      where('recipientId', '==', currentUser.uid),
      where('senderId', '==', recipientId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(unreadQuery);
    snapshot.forEach(async (document) => {
      await updateDoc(doc(db, 'messages', document.id), { read: true });
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || sending) return;

    setSending(true);
    try {
      const conversationId = [currentUser.uid, recipientId].sort().join('_');
      
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: currentUser.uid,
        recipientId,
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false,
        jobId: jobId || null
      });

      // Also create/update conversation document for easy listing
      await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, recipientId],
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        jobId: jobId || null,
        jobTitle: jobTitle || null
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { height: '70vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={recipientPhoto} alt={recipientName}>
              {recipientName[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">{recipientName}</Typography>
              {jobTitle && (
                <Typography variant="caption" color="text.secondary">
                  {jobTitle}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography color="text.secondary">
              Inicia la conversación con un mensaje
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser?.uid;
              return (
                <Box
                  key={message.id}
                  display="flex"
                  justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
                  mb={2}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                      color: isOwnMessage ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          color: isOwnMessage ? 'white' : 'text.secondary'
                        }}
                      >
                        {formatMessageTime(message.timestamp)}
                      </Typography>
                      {isOwnMessage && (
                        message.read ? (
                          <CheckCircle sx={{ fontSize: 14 }} />
                        ) : (
                          <Schedule sx={{ fontSize: 14 }} />
                        )
                      )}
                    </Box>
                  </Paper>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={3}
          disabled={sending}
          InputProps={{
            endAdornment: (
              <IconButton 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sending}
                color="primary"
              >
                <Send />
              </IconButton>
            )
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ChatDialog;