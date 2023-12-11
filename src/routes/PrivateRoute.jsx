import {Navigate} from 'react-router-dom';

const PrivateRoute = ({
	children
}) => {

	const isAuthenticated = true
    //로그인 검증 하기


	return isAuthenticated ? children : <Navigate to="/login"/>;
}

export default PrivateRoute;
