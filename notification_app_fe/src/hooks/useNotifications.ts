import { useState, useEffect } from 'react';
import { fetchNotifications } from '../api/notificationApi';
import type { Notification } from '../api/notificationApi';
import { logger } from '../services/loggerService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      await logger.info('hook', 'useNotifications hook initialized');
      
      const data = await fetchNotifications();
      setNotifications(data);
      
      const unreadCount = data.filter(n => !n.read).length;
      await logger.info('state', `Loaded ${data.length} notifications (${unreadCount} unread)`);
      
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load notifications';
      setError(errorMsg);
      await logger.error('hook', `Error in useNotifications: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, error, refreshNotifications: loadNotifications };
}
