import { AppBar, Toolbar, Typography, Badge, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect } from 'react';
import { logger } from '../services/loggerService';

interface NavbarProps {
  unreadCount: number;
  onNotificationClick?: () => void;
}

export function Navbar({ unreadCount, onNotificationClick }: NavbarProps) {
  useEffect(() => {
    logger.info('component', 'Navbar component mounted');
    
    return () => {
      logger.info('component', 'Navbar component unmounted');
    };
  }, []);

  const handleNotificationClick = async () => {
    await logger.info('component', `Navbar notification button clicked (${unreadCount} unread)`);
    onNotificationClick?.();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Notification Dashboard
        </Typography>
        <Box>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
