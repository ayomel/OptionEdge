import { useEffect } from "react";

export function useDebounce(
  value: string,
  delay: number,
  setDebounced: (v: string) => void
) {
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay, setDebounced]);
}
