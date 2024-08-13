import { Navigate } from 'react-router-dom'

const RequireAuthority = ({ children }) => {
    const isAuthenticated = true

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default RequireAuthority
