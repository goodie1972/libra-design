import type { AsyncState } from '../lib/hooks/useAsync';
import { Spinner } from './spinner';
import { Empty } from './empty';

export interface AsyncBoundaryProps<T> {
  state: AsyncState<T>;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  errorFallback?: (error: Error, retry?: () => void) => React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function AsyncBoundary<T>({
  state,
  onRetry,
  loadingFallback,
  emptyFallback,
  errorFallback,
  children,
}: AsyncBoundaryProps<T>) {
  if (state.loading) {
    return <>{loadingFallback ?? <div className="flex items-center justify-center py-8"><Spinner size={24} /></div>}</>;
  }

  if (state.error) {
    if (errorFallback) return <>{errorFallback(state.error, onRetry)}</>;
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <span className="text-[13px] text-[var(--error)]">{state.error.message}</span>
        {onRetry && (
          <button onClick={onRetry} className="text-[12px] text-[var(--accent)] underline">
            重试
          </button>
        )}
      </div>
    );
  }

  if (state.empty || state.data == null) {
    return <>{emptyFallback ?? <Empty />}</>;
  }

  return <>{children(state.data)}</>;
}
