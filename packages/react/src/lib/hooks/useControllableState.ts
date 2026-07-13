import { useState, useCallback } from 'react';

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}): [T, (v: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internal;

  const setState = useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  return [state, setState];
}
