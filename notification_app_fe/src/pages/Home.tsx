import { useEffect, useState } from 'react';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Notification } from '../api/notificationApi';
import { markAsRead, deleteNotification } from '../api/notificationApi';
import { NotificationCard } from '../components/NotificationCard';
import { Navbar } from '../components/Navbar';
import { useNotifications } from '../hooks/useNotifications';
import { logger } from '../services/loggerService';

export function Home() {
  const { notifications, loading, error, refreshNotifications } = useNotifications();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [displayNotifications, setDisplayNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    void logger.info('page', 'Home page loaded');
    setDisplayNotifications(notifications);
  }, [notifications]);

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      const updated = displayNotifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      setDisplayNotifications(updated);
      void logger.info('state', `Marked notification ${id} as read`);
      showSnackbar('Marked as read');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error';
      void logger.error('component', `Failed to mark as read: ${errorMsg}`);
      showSnackbar('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      const updated = displayNotifications.filter(n => n.id !== id);
      setDisplayNotifications(updated);
      void logger.info('state', `Deleted notification ${id}`);
      showSnackbar('Notification deleted');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error';
      void logger.error('component', `Failed to delete: ${errorMsg}`);
      showSnackbar('Failed to delete notification');
    }
  };

  const handleRefresh = async () => {
    void logger.info('component', 'User clicked refresh button');
    await refreshNotifications();
    showSnackbar('Notifications refreshed');
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar unreadCount={unreadCount} />

      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Your Notifications
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            You have <strong>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && displayNotifications.length === 0 && (
          <Alert severity="info">
            No notifications yet. Check back later!
          </Alert>
        )}

        {/* Notifications List */}
        {!loading && !error && displayNotifications.length > 0 && (
          <Box>
            {displayNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDelete={handleDelete}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}
