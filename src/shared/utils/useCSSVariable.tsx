import { useEffect, useState } from 'react'

const useCSSVariable = (
    variableName: string,
    element: HTMLElement = document.documentElement,
) => {
    const [value, setValue] = useState<string>('')

    useEffect(() => {
        const computedStyle = getComputedStyle(element)
        const rawValue = computedStyle.getPropertyValue(variableName).trim()
        setValue(rawValue)
    }, [variableName, element])

    return value
}
