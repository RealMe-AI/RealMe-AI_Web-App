import { useRef, useCallback, useEffect } from "react";

const CHARS_PER_TICK = 3;
const TICK_MS = 16;

export function useTypewriter(onUpdate: (text: string) => void) {
  const queueRef = useRef("");
  const shownRef = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      if (queueRef.current.length === 0) return;
      const take = queueRef.current.slice(0, CHARS_PER_TICK);
      queueRef.current = queueRef.current.slice(CHARS_PER_TICK);
      shownRef.current += take;
      onUpdateRef.current(shownRef.current);
    }, TICK_MS);
  }, []);

  const push = useCallback((chunk: string) => {
    queueRef.current += chunk;
    start();
  }, [start]);

  const flush = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    shownRef.current += queueRef.current;
    queueRef.current = "";
    onUpdateRef.current(shownRef.current);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    queueRef.current = "";
    shownRef.current = "";
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getShown = useCallback(() => shownRef.current, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { push, flush, stop, getShown, reset };
}
