'use client'

import React from 'react'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    localStorage.getItem('theme')

    return <>{children}</>
}

export default ThemeProvider
