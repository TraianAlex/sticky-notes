import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
/**
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */

export interface UseLocalStorageOptions<T> {
  storage?: Storage;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  crossTabSync?: boolean;
}

const useLocalStorageState = <T = unknown>(
  key: string,
  defaultValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  const {
    storage = window.localStorage,
    serialize = JSON.stringify as (v: T) => string,
    deserialize = JSON.parse as (raw: string) => T,
    crossTabSync = true,
  } = options;

  const [state, setState] = useState<T>(() => {
    const valueInLocalStorage = storage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      storage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    storage.setItem(key, serialize(state));
  }, [key, state, serialize, storage]);

  useEffect(() => {
    if (!crossTabSync || typeof window === 'undefined') {
      return;
    }

    const handleStorage = (ev: StorageEvent) => {
      if (ev.key !== key || ev.storageArea !== storage) return;
      if (ev.newValue === null) return; // key was removed elsewhere
      try {
        setState(deserialize(ev.newValue));
      } catch {
        // ignore malformed data
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, storage, crossTabSync, deserialize, setState]);

  return [state, setState];
};

export { useLocalStorageState };
