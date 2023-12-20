import {Navigate} from 'react-router-dom';
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {push} from "redux-first-history";

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

    


    return true ? children : <Navigate to="/login"/>;
}

export default PrivateRoute;
