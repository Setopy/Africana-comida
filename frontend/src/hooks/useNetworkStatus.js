import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect network speed if available
    if ('connection' in navigator) {
      const updateNetworkInfo = () => {
        const connection = navigator.connection;
        setNetworkSpeed(connection.effectiveType || 'unknown');
      };

      updateNetworkInfo();
      navigator.connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return { isOnline, networkSpeed };
};