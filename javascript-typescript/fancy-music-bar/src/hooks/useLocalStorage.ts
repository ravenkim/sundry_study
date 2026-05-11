import {useCallback, useEffect, useState} from 'react'

function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
    // Helper to read value from localStorage
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)
            return initialValue
        }
    }, [key, initialValue])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue)

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        if (typeof window == 'undefined') {
            console.warn(
                `Tried setting localStorage key “${key}” even though environment is not a client`,
            )
        }

        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
            // Update state
            setStoredValue(valueToStore)

            // We dispatch a custom event so every useLocalStorage hook in this tab
            // that is subscribed to the same key can update its state
            window.dispatchEvent(
                new CustomEvent('localStorageChange', {
                    detail: { key, value: valueToStore },
                }),
            )
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue()) // Re-read value on mount

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key) {
                setStoredValue(readValue())
            }
        }

        const handleCustomStorageChange = (event: CustomEvent) => {
            if (event.detail.key === key) {
                setStoredValue(event.detail.value)
            }
        }

        // Listen for changes to localStorage across windows
        window.addEventListener('storage', handleStorageChange)
        // Listen for changes to localStorage within the same window (custom event)
        window.addEventListener(
            'localStorageChange',
            handleCustomStorageChange as EventListener,
        )

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener(
                'localStorageChange',
                handleCustomStorageChange as EventListener,
            )
        }
    }, [key, readValue]) // Add readValue to dependency array

    return [storedValue, setValue]
}

export default useLocalStorage
