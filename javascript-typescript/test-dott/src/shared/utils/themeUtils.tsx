// src/shared/utils/themeUtils.tsx
import { useContext } from 'react'
import {
    Theme,
    ThemeContext,
} from 'src/shared/lib/shadcn/components/ThemeContext.tsx'
import store from 'src/app/store/redux/reduxStore.tsx'
import { themeAction } from 'src/shared/components/theme/themeReducer.tsx'

const VARS_KEY = 'vite-ui-theme-vars'

// 테마 확인, 테마 수정, 다크모드 여부 Hook
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    const { theme, setTheme } = context
    const isDarkTheme = theme === 'dark'
    return {
        theme,
        setTheme,
        isDarkTheme,
    }
}

// lightVars, darkVars 를 로컬 스토리지 에서 들고옴
export const getCustomVarsFromLocalStorage = (): {
    lightVars: Record<string, string>
    darkVars: Record<string, string>
} => {
    try {
        const raw = localStorage.getItem(VARS_KEY)
        if (!raw) {
            return { lightVars: {}, darkVars: {} }
        }
        const parsed = JSON.parse(raw)
        return {
            lightVars: parsed.lightVars || {},
            darkVars: parsed.darkVars || {},
        }
    } catch {
        console.warn('Invalid vite-ui-theme-vars format in localStorage')
        return { lightVars: {}, darkVars: {} }
    }
}

export const saveThemeVar = (theme: Theme, key: string, value: string) => {
    const raw = localStorage.getItem(VARS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const themeKey = `${theme}Vars`

    const updated = {
        ...parsed,
        [themeKey]: {
            ...(parsed[themeKey] || {}),
            [key]: value,
        },
    }

    localStorage.setItem(VARS_KEY, JSON.stringify(updated))
}

// 변경된 테마를 적용
export const applyThemeVariables = (theme: Theme) => {
    const root = document.documentElement

    const { lightVars = {}, darkVars = {} } = getCustomVarsFromLocalStorage()
    const vars = theme === 'dark' ? darkVars : lightVars

    // 적용 전에 변수에 값 있는 색 비우기
    clearThemeVariables()

    // localStorage에 해당 테마 정보가 없으면 CSS 기본값 그대로 유지
    if (!vars || Object.keys(vars).length === 0) {
        return
    }

    // localStorage에 있는 변수만 적용
    Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
    })
}

// 현재 css 청소
export const clearThemeVariables = () => {
    const root = document.documentElement
    const { lightVars, darkVars } = getCustomVarsFromLocalStorage()

    const allKeys = new Set([
        ...Object.keys(lightVars || {}),
        ...Object.keys(darkVars || {}),
    ])

    allKeys.forEach((key) => {
        root.style.removeProperty(key)
    })
}

// 특정 테마를 리셋함
export const handleReset = (theme: Theme) => {
    const raw = localStorage.getItem(VARS_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw)
    const themeKey = `${theme}Vars`

    const allKeys = new Set(Object.keys(parsed[themeKey] || {}))

    delete parsed[themeKey]
    localStorage.setItem(VARS_KEY, JSON.stringify(parsed))

    const currentTheme = localStorage.getItem('vite-ui-theme')
    if (currentTheme === theme) {
        const root = document.documentElement
        allKeys.forEach((key) => {
            root.style.removeProperty(key)
        })
        applyThemeVariables(theme)
    }

    store.dispatch(themeAction.setColors({}))
}
