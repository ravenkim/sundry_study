// src/shared/providers/ThemeProvider.tsx
import { ReactNode, useLayoutEffect, useState } from 'react'
import { applyThemeVariables } from 'src/shared/utils/themeUtils'
import {
    STORAGE_KEY,
    Theme,
    ThemeContext,
} from 'src/shared/lib/shadcn/components/ThemeContext.tsx'

export const ThemeProvider = ({
    children,
    defaultTheme,
}: {
    children: ReactNode
    defaultTheme?: Theme
}) => {
    const getInitialTheme = (): Theme => {
        // 1순위 - 스토리지에 값이 있으면 그것을 반환
        const stored = localStorage.getItem(STORAGE_KEY) as Theme
        if (stored === 'dark' || stored === 'light') return stored

        // 2순위 - 개발자가 지정해준 defaultTheme 을 반환
        if (defaultTheme === 'dark' || defaultTheme === 'light') {
            return defaultTheme
        }

        // 3순위 - defaultTheme이 없으면 시스템 테마를 반환
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    }

    const [theme, setThemeState] = useState<Theme>(getInitialTheme)

    const setTheme = (newTheme: 'light' | 'dark') => {
        localStorage.setItem(STORAGE_KEY, newTheme)
        setThemeState(newTheme)
    }

    useLayoutEffect(() => {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        applyThemeVariables(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
