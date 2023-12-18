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

    
    const t = true
    //이거 지우고 밑에 t user로 바꾸기

    return t ? children : <Navigate to="/login"/>;
}

export default PrivateRoute;
