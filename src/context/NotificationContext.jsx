// AquaEquity Notification Context (JavaScript)
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

const getToastSignature = (notification) =>
  [notification.id, notification.type, notification.title, notification.message, notification.actionUrl].join('|');

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const shownToastSignatures = useRef(new Set());

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);

      const newestUnread = updated.find((notification) => !notification.read);
      if (!newestUnread) {
        setActiveToast(null);
        return;
      }

      const toastSignature = getToastSignature(newestUnread);
      if (!shownToastSignatures.current.has(toastSignature)) {
        shownToastSignatures.current.add(toastSignature);
        setActiveToast(newestUnread);
      }
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getNotifications());
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  };

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        activeToast,
        toggleDrawer,
        closeDrawer,
        markAsRead,
        markAllAsRead,
        dismissToast: () => {
          if (activeToast) {
            shownToastSignatures.current.add(getToastSignature(activeToast));
          }
          setActiveToast(null);
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
