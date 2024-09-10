import { shallowEqual, useDispatch, useSelector } from 'react-redux'


const Login = () => {


    const { isLoggedIn } = useSelector(
        ({ authReducer }) => ({
            isLoggedIn: authReducer.isLoggedIn.data
        }),
        shallowEqual,
    )



    // 로그아웃은 마이페이지 에서



    const dispatch = useDispatch()




    const loginHandler = (id, password) => {

    }


    return (
        <div>

        </div>
    )
}

export default Login