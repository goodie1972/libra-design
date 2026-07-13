import { useState, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  empty: boolean;
}

export type UseAsyncReturn<T> = AsyncState<T> & {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
};

export function useAsync<T>(
  fn: (...args: any[]) => Promise<T>,
  immediate = false,
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
    empty: true,
  });
  const mounted = useRef(true);

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fn(...args);
        if (mounted.current) {
          setState({
            data: result,
            loading: false,
            error: null,
            empty: result == null || (Array.isArray(result) && result.length === 0),
          });
        }
        return result;
      } catch (err) {
        if (mounted.current) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
            empty: true,
          });
        }
        throw err;
      }
    },
    [fn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, empty: true });
  }, []);

  return { ...state, execute, reset };
}
