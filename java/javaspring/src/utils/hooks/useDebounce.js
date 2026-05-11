import { useEffect } from "react";

const useDebounce = (callback, timeout = 400, args = []) => {
  useEffect(() => {
    const handler = setTimeout(callback, timeout);
    return () => clearTimeout(handler);
  }, [timeout, ...args]);
};

export default useDebounce;
