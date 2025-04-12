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

const stylesToApply = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "border",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "radius",
  "ring",
];

// element.setAttribute(
//   `style`,
//   `${element.getAttribute("style") || ""}--${key}: ${value};`
// );

if (mode === "dark") {
  stylesToApply.forEach((style) => {
    root.setAttribute(
      `style`,
      `${root.getAttribute("style") || ""}--${style}: ${darkStyles[style]};`
    );
  });
} else {
  stylesToApply.forEach((style) => {
    root.setAttribute(
      `style`,
      `${root.getAttribute("style") || ""}--${style}: ${lightStyles[style]};`
    );
  });
}
