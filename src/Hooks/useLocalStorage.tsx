import { useEffect, useState } from "react";

const useLocalStorage = (currentValue: any, key: string) =>
{
  
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const useGetLocalStorageValue = (key: string) => {
  const [value] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return !storedValue || storedValue === "null"
      ? undefined
      : JSON.parse(storedValue);
  });

  return [value];
};

const useSetLocalStorageValue = (key?: string, currentValue?: any) => {
  if(key && currentValue) localStorage.setItem(key, JSON.stringify(currentValue));
};

const useClearLocalStorageValue = (key: string) => {
  window.localStorage.removeItem(key);
};

export {
  useLocalStorage,
  useGetLocalStorageValue,
  useSetLocalStorageValue,
  useClearLocalStorageValue,
};
