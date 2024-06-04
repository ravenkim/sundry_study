import { ThemeProvider } from 'src/assets/shadcn/ThemeProvider.jsx'

import 'src/styles/shadcn.css'
import { router } from 'src/routes/router.jsx'
import { RouterProvider } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { routerAction } from 'src/routes/routerReducer.jsx'

function App() {
    const dispatch = useDispatch()

    const [route, setRoute] = useState({
        path: window.location.pathname || null,
        state: window.history.state?.usr || null,
    })

    useEffect(() => {
        const originalPushState = window.history.pushState
        const originalReplaceState = window.history.replaceState

        const handleStateChange = (method, ...args) => {
            const event = new CustomEvent('locationChange')
            method.apply(window.history, args)
            window.dispatchEvent(event)
        }

        window.history.pushState = (...args) =>
            handleStateChange(originalPushState, ...args)
        window.history.replaceState = (...args) =>
            handleStateChange(originalReplaceState, ...args)

        const handleLocationChange = () => {
            setRoute({
                path: window.location.pathname || null,
                state: window.history.state?.usr || null,
            })
        }

        window.addEventListener('locationChange', handleLocationChange)
        window.addEventListener('popstate', handleLocationChange)

        return () => {
            window.history.pushState = originalPushState
            window.history.replaceState = originalReplaceState
            window.removeEventListener('locationChange', handleLocationChange)
            window.removeEventListener('popstate', handleLocationChange)
        }
    }, [])

    useEffect(() => {
        dispatch(routerAction.locationChange(route))
    }, [route])

    // const [count, setCount] = useState(0)
    //
    // useEffect(() => {
    //     console.log(`You clicked ${count} times`)
    // }, [])

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
