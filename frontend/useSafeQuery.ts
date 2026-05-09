import { useEffect, useRef } from "react";
import { UseQueryResult } from "@tanstack/react-query";

/**
 * Hook para proteção contra queries infinitas e loops de render
 * Detecta e previne comportamentos anormais
 */
export function useSafeQuery<TData, TError>(
  query: UseQueryResult<TData, TError>,
  options?: {
    maxRetries?: number;
    timeout?: number;
    onLoopDetected?: () => void;
  }
) {
  const queryCountRef = useRef(0);
  const lastStatusRef = useRef<string | null>(null);
  const loopDetectedRef = useRef(false);

  const { maxRetries = 5, timeout = 30000, onLoopDetected } = options || {};

  useEffect(() => {
    const status = query.status;

    // Detectar mudanças de status
    if (lastStatusRef.current !== status) {
      queryCountRef.current = 0;
      lastStatusRef.current = status;
    } else {
      queryCountRef.current++;
    }

    // Se muitas tentativas do mesmo status, pode ser loop
    if (queryCountRef.current > maxRetries && !loopDetectedRef.current) {
      console.warn(`[useSafeQuery] Possível loop detectado: ${maxRetries}+ tentativas de ${status}`);
      loopDetectedRef.current = true;

      if (onLoopDetected) {
        onLoopDetected();
      }

      // Desabilitar query automaticamente
      if (query.isLoading) {
        console.warn("[useSafeQuery] Query desabilitada para evitar loop");
      }
    }

    // Timeout de segurança
    const timer = setTimeout(() => {
      if (query.isLoading && queryCountRef.current > 3) {
        console.warn("[useSafeQuery] Query timeout - possível travamento");
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [query.status, query.isLoading, maxRetries, timeout, onLoopDetected]);

  return {
    ...query,
    isLoopDetected: loopDetectedRef.current,
    queryAttempts: queryCountRef.current,
  };
}
