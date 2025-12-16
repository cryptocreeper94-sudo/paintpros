import { useState, useEffect, useCallback } from 'react';
import {
  registerServiceWorker,
  requestNotificationPermission,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getExistingSubscription,
  sendSubscriptionToServer,
  removeSubscriptionFromServer
} from '@/lib/notifications';

interface UseNotificationsReturn {
  permission: NotificationPermission | 'unsupported' | 'loading';
  isSubscribed: boolean;
  isLoading: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<boolean>;
  isSupported: boolean;
}

export function useNotifications(userId?: string): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported' | 'loading'>('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const init = async () => {
      const currentPermission = getNotificationPermission();
      setPermission(currentPermission);

      if (currentPermission === 'granted') {
        const reg = await registerServiceWorker();
        if (reg) {
          setRegistration(reg);
          const existingSub = await getExistingSubscription(reg);
          setIsSubscribed(!!existingSub);
        }
      }
    };

    init();
  }, []);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        return false;
      }

      let reg = registration;
      if (!reg) {
        reg = await registerServiceWorker();
        if (!reg) {
          return false;
        }
        setRegistration(reg);
      }

      const subscription = await subscribeToPush(reg);
      if (!subscription) {
        setIsSubscribed(false);
        return false;
      }

      const success = await sendSubscriptionToServer(subscription, userId);
      setIsSubscribed(success);
      return success;
    } finally {
      setIsLoading(false);
    }
  }, [registration, userId]);

  const disableNotifications = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!registration) {
        return false;
      }

      const existingSub = await getExistingSubscription(registration);
      if (existingSub) {
        await removeSubscriptionFromServer(existingSub.endpoint);
        await unsubscribeFromPush(registration);
      }

      setIsSubscribed(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [registration]);

  const isSupported = typeof window !== 'undefined' && 
    'Notification' in window && 
    'serviceWorker' in navigator &&
    'PushManager' in window;

  return {
    permission,
    isSubscribed,
    isLoading,
    enableNotifications,
    disableNotifications,
    isSupported
  };
}
