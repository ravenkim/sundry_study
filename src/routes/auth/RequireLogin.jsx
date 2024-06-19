import { Navigate } from 'react-router-dom'

const RequireLogin = ({ children }) => {

    const  isAuthenticated  = true

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    return children
}

export default RequireLogin

