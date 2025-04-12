const storageKey = "editor-storage"; // ZUSTAND STORAGE KEY

function getThemeFromStorage() {
  try {
    const persistedStateJSON = window.localStorage.getItem(storageKey);
    if (persistedStateJSON) {
      let theme = JSON.parse(persistedStateJSON);
      return theme?.state?.themeState;
    }
  } catch (e) {
    console.warn("Theme initialization: Failed to read or parse localStorage:", e);
  }
  return null; // Not found or invalid
}

const themeState = getThemeFromStorage();
const root = document.documentElement;
const lightStyles = themeState?.styles?.light ?? {
  background: "#fff",
  foreground: "#000",
};
const darkStyles = themeState?.styles?.dark ?? {
  background: "#000",
  foreground: "#fff",
};

const mode =
  themeState?.currentMode ??
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

root.classList.remove("dark", "light");
if (mode === "dark") {
  root.classList.add("dark");
  root.style.setProperty("--background", darkStyles.background);
  root.style.setProperty("--foreground", darkStyles.foreground);
} else {
  root.classList.add("light");
  root.style.setProperty("--background", lightStyles.background);
  root.style.setProperty("--foreground", lightStyles.foreground);
}
