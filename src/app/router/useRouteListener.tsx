import { useLayoutEffect, useState } from 'react'
import { useAppDispatch } from 'src/app/store/redux/reduxHooks.tsx'
import { routerAction } from 'src/app/router/routerReducer.tsx'

const useRouteListener = () => {
    const dispatch = useAppDispatch()

    const [route, setRoute] = useState({
        path: window.location.pathname || null,
        state: window.history.state?.usr || null,
    })

    useLayoutEffect(() => {
        const originalPushState = window.history.pushState
        const originalReplaceState = window.history.replaceState

        const handleStateChange = (
            method: typeof originalPushState,
            ...args: Parameters<typeof originalPushState>
        ) => {
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

    useLayoutEffect(() => {
        dispatch(routerAction.locationChange(route))
    }, [route])
}

export default useRouteListener
