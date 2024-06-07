// useAlert.ts
import { useState, useEffect } from 'react';

interface UseAlertReturn {
  alertMessage: string;
  triggerAlert: (message: string, duration?: number) => void;
  clearAlert: () => void;
}

const useAlert = (initialMessage: string = ''): UseAlertReturn => {
  const [alertMessage, setAlertMessage] = useState<string>(initialMessage);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const triggerAlert = (message: string, duration: number = 3000) => {
    if (timer) clearTimeout(timer);  // Clear any existing timers
    setAlertMessage(message);
    const newTimer = setTimeout(() => {
      setAlertMessage('');
    }, duration);
    setTimer(newTimer);
  };

  const clearAlert = () => {
    if (timer) clearTimeout(timer);
    setAlertMessage('');
  };

  // Clear timeout when component using this hook unmounts
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return { alertMessage, triggerAlert, clearAlert };
};

export default useAlert;
