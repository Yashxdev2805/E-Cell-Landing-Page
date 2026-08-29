import { useState, useCallback, useRef, useEffect } from 'react';

interface DraftEnvelope<T> {
  version: string;
  savedAt: number;
  data: T;
}

const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export function useLocalStorageDraft<T>(
  key: string,
  schemaVersion: string,
  defaultValue: T
): [T, (data: T) => void, () => void] {
  const defaultRef = useRef(defaultValue);

  const [data, setData] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      const envelope: DraftEnvelope<T> = JSON.parse(stored);
      if (envelope.version !== schemaVersion || Date.now() - envelope.savedAt > DRAFT_TTL_MS) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      return envelope.data;
    } catch {
      localStorage.removeItem(key);
      return defaultValue;
    }
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const saveDraft = useCallback(
    (newData: T) => {
      setData(newData);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const envelope: DraftEnvelope<T> = {
          version: schemaVersion,
          savedAt: Date.now(),
          data: newData,
        };
        try {
          localStorage.setItem(key, JSON.stringify(envelope));
        } catch {
          /* full */
        }
      }, 500);
    },
    [key, schemaVersion]
  );

  const clearDraft = useCallback(() => {
    setData(defaultRef.current);
    localStorage.removeItem(key);
    clearTimeout(debounceTimer.current);
  }, [key]);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  return [data, saveDraft, clearDraft];
}
