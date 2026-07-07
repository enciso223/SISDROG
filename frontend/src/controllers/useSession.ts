/**
 * Hook de sesión.
 *
 * Escucha los eventos del sessionManager y expone el estado:
 *  - remainingMs:   ms restantes antes de auto-logout.
 *  - showWarning:   true cuando se acerca el vencimiento.
 *  - expired:       true cuando la sesión ya expiró.
 *  - extendSession: reinicia el conteo (llamar tras "Seguir conectado").
 */

import {useEffect, useRef, useState, useCallback} from 'react';
import {
  sessionManager,
  IDLE_TIMEOUT_MS,
  WARNING_BEFORE_MS,
} from '../security';

interface UseSessionOptions {
  enabled: boolean;
  onExpire: () => void;
}

interface UseSessionReturn {
  remainingMs: number;
  showWarning: boolean;
  expired: boolean;
  extendSession: () => void;
}

export const useSession = ({enabled, onExpire}: UseSessionOptions): UseSessionReturn => {
  const [remainingMs, setRemainingMs] = useState<number>(IDLE_TIMEOUT_MS);
  const [showWarning, setShowWarning] = useState(false);
  const [expired, setExpired] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Arranque/parada del gestor según autenticación
  useEffect(() => {
    if (!enabled) {
      sessionManager.stop();
      setShowWarning(false);
      setExpired(false);
      setRemainingMs(IDLE_TIMEOUT_MS);
      return;
    }
    sessionManager.start();
    return () => sessionManager.stop();
  }, [enabled]);

  // Suscripción a eventos
  useEffect(() => {
    if (!enabled) {return;}
    const unsub = sessionManager.subscribe((event, remaining) => {
      if (event === 'warn') {
        setShowWarning(true);
        setRemainingMs(remaining);
      } else if (event === 'expire') {
        setExpired(true);
        setShowWarning(false);
        onExpire();
      } else if (event === 'reset') {
        setShowWarning(false);
        setRemainingMs(remaining);
      }
    });
    return unsub;
  }, [enabled, onExpire]);

  // Tick de 1 s mientras se muestra la advertencia
  useEffect(() => {
    if (!showWarning) {
      if (tickRef.current) {clearInterval(tickRef.current);}
      return;
    }
    tickRef.current = setInterval(() => {
      const rem = sessionManager.remainingMs();
      setRemainingMs(rem);
      if (rem <= 0) {
        if (tickRef.current) {clearInterval(tickRef.current);}
      }
    }, 1000);
    return () => {
      if (tickRef.current) {clearInterval(tickRef.current);}
    };
  }, [showWarning]);

  const extendSession = useCallback(() => {
    setShowWarning(false);
    setRemainingMs(IDLE_TIMEOUT_MS);
    sessionManager.registerActivity();
  }, []);

  return {remainingMs, showWarning, expired, extendSession};
};

export const sessionConstants = {
  IDLE_TIMEOUT_MS,
  WARNING_BEFORE_MS,
};
