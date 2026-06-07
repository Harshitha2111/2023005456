import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import type { Notification } from '../api/notificationApi';
import { logger } from '../services/loggerService';

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const typeColorMap: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

export function NotificationCard({
  notification,
  onDelete,
  onMarkAsRead,
}: NotificationCardProps) {
  const handleDelete = async () => {
    void logger.info('component', `Delete clicked for notification ${notification.id}`);
    onDelete(notification.id);
  };

  const handleMarkAsRead = async () => {
    void logger.info('component', `Mark as read clicked for notification ${notification.id}`);
    onMarkAsRead(notification.id);
  };

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: notification.read ? '#f5f5f5' : '#ffffff',
        borderLeft: `4px solid ${
          typeColorMap[notification.type] === 'error'
            ? '#f44336'
            : typeColorMap[notification.type] === 'warning'
              ? '#ff9800'
              : typeColorMap[notification.type] === 'success'
                ? '#4caf50'
                : '#2196f3'
        }`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="div">
            {notification.title}
          </Typography>
          <Chip
            label={notification.type}
            color={typeColorMap[notification.type]}
            size="small"
            variant={notification.read ? 'outlined' : 'filled'}
          />
        </Box>

        <Typography color="textSecondary" sx={{ mb: 1 }}>
          {notification.message}
        </Typography>

        <Typography variant="caption" color="textSecondary">
          {new Date(notification.timestamp).toLocaleString()}
        </Typography>
      </CardContent>

      <CardActions>
        <Stack direction="row" spacing={1}>
          {!notification.read && (
            <Button
              size="small"
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAsRead}
              variant="outlined"
            >
              Mark as Read
            </Button>
          )}
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            variant="outlined"
          >
            Delete
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
