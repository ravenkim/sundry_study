import { shallowEqual, useDispatch, useSelector } from 'react-redux'


const Login = () => {



    /*
    * 1. 로그인 여부 확인
    * 2. 비로그인시 로그인 페이지
    * 3. 로그인시 상세정보 yn 체크후
    * 4. n 이면 상세정보 입력
    * 5. y면 홈으로 이동
    *
    * */




    





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