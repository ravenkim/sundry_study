import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { routerAction } from 'src/routes/routerReducer.jsx'

const useRouteListener = () => {
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
    }, [dispatch, route])
}

export default useRouteListener