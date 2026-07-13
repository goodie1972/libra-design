import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: string) => string | null;
}

export function useFormValidation<T extends Record<string, string>>(
  initial: T,
  rules: Partial<Record<keyof T, ValidationRule[]>>,
) {
  const [values, setValuesRaw] = useState<T>(initial);
  const [dirty, setDirty] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, val: string): string | null => {
      const fieldRules = rules[name];
      if (!fieldRules) return null;
      for (const rule of fieldRules) {
        if (rule.required && !val.trim()) return rule.message || '此字段为必填';
        if (rule.min != null && val.length < rule.min) return rule.message || `最少 ${rule.min} 个字符`;
        if (rule.max != null && val.length > rule.max) return rule.message || `最多 ${rule.max} 个字符`;
        if (rule.pattern && !rule.pattern.test(val)) return rule.message || '格式不正确';
        if (rule.custom) {
          const result = rule.custom(val);
          if (result) return result;
        }
      }
      return null;
    },
    [rules],
  );

  const errors = Object.fromEntries(
    Object.keys(values).map((key) => [key, dirty[key] ? validateField(key as keyof T, values[key as keyof T]) : null]),
  ) as Partial<Record<keyof T, string | null>>;

  const isValid = Object.values(errors).every((e) => e == null);
  const hasError = Object.values(errors).some((e) => e != null);

  const setValue = useCallback(
    (name: keyof T, value: string) => {
      setValuesRaw((prev) => ({ ...prev, [name]: value }));
      if (!dirty[name]) setDirty((prev) => ({ ...prev, [name]: true }));
    },
    [dirty],
  );

  const setValues = useCallback(
    (values: Partial<T>) => {
      setValuesRaw((prev) => ({ ...prev, ...values }));
      setDirty((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(values)) next[key as keyof T] = true;
        return next;
      });
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const allDirty: Partial<Record<keyof T, boolean>> = {};
    for (const key of Object.keys(values)) allDirty[key as keyof T] = true;
    setDirty(allDirty);
    return !Object.keys(values).some(
      (key) => validateField(key as keyof T, values[key as keyof T]) != null,
    );
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValuesRaw(initial);
    setDirty({});
  }, [initial]);

  return { values, errors, dirty, setValue, setValues, validate, reset, isValid, hasError };
}
