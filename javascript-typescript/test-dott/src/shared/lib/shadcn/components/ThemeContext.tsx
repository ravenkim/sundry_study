// src/shared/providers/ThemeContext.ts
import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export const STORAGE_KEY = 'vite-ui-theme'

export type ThemeContextType = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const initialState: ThemeContextType = {
    theme: 'dark',
    setTheme: () => null,
}

export const ThemeContext = createContext<ThemeContextType>(initialState)
