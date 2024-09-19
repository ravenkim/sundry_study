import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import LogoWithTitle from 'src/assets/images/logo/logoWithTitle.svg?react'
import SSinput from 'src/features/sample/Taaa.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'

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
            isLoggedIn: authReducer.isLoggedIn.data,
        }),
        shallowEqual,
    )

    // 로그아웃은 마이페이지 에서

    const dispatch = useDispatch()

    const loginHandler = (id, password) => {}

    return (
        <SSinnerWrapper>
            <SStopBar />


            {/*todo 크기 수정*/}
            <div className={` w-full h-[140px] flex items-center justify-center`}>
                <LogoWithTitle

                />


            </div>

            <SSinput
                className={` mb-[8px]`}
            />
            <SSinput
                className={` mb-[16px]`}

                type={`password`}
            />
            

            <SSbutton
                text={'로그인'}
            />



        </SSinnerWrapper>
    )
}

export default Login
