import {Navigate} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux'

const PrivateRoute = ({
                          children
                      }) => {
    const dispatch = useDispatch()


    const {
        user
    } = useSelector(({userReducer}) => ({
            user: userReducer.user
        }),
        shallowEqual
    )

    


    return user ? children : <Navigate to="/login"/>;
}

export default PrivateRoute;
