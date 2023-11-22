import { useState } from "react";

/**
 * Localstroage 관련 Custom 훅
 * @param key
 * @param initialValue
 * @returns {[storageValue, setValueHandler, removeHandler]}
 */
export default function useLocalStorage(key, initialValue) {
  const [localstorageValue, setLocalStorageValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // error 발생시 log 기록 및 initialvalue return
      console.warn(error);
      return initialValue;
    }
  });

  /**
   * Localstorage 저장 Handler
   * @param valueOrFunction
   */
  const setValue = (valueOrFunction) => {
    try {
      const storeTargetValue =
        valueOrFunction instanceof Function
          ? valueOrFunction(localstorageValue)
          : valueOrFunction;
      setLocalStorageValue(storeTargetValue);
      window.localStorage.setItem(key, JSON.stringify(storeTargetValue));
    } catch (error) {
      console.warn(error);
    }
  };

  /**
   * Localstorage 삭제 Handler
   * @param valueOrFunction
   */
  const removeHandler = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(error);
    }
  };

  return [localstorageValue, setValue, removeHandler];
}
