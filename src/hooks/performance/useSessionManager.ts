
import { useEffect, useRef } from 'react';

export const useSessionManager = () => {
  const sessionIdRef = useRef<string>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  return {
    sessionId: sessionIdRef.current,
    startTime: startTimeRef.current
  };
};
