import { useState, useEffect } from "react";

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return {
    isFullscreen,
    toggleFullscreen,
  };
};
