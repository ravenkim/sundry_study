import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import SSinput from 'src/common/components/input/SSinput.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import LogoWithTitle from 'src/assets/images/logo/logoWithTitle.svg?react'
import IconEye from 'src/assets/images/icon/Icon_eye.svg?react'
import IconEyeOff from 'src/assets/images/icon/Icon_eyeOff.svg?react'
import IconCheck from 'src/assets/images/icon/Icon_check.svg?react'

const Login = () => {
    /*
     * todo
     * 1. 로그인 여부 확인
     * 2. 비로그인시 로그인 페이지
     * 3. 로그인시 상세정보 yn 체크후
     * 4. n 이면 상세정보 입력
     * 5. y면 홈으로 이동
     *
     * 6. 로그인 유지 기능 추가
     * */

    // const { isLoggedIn } = useSelector(
    //     ({ authReducer }) => ({
    //         isLoggedIn: authReducer.isLoggedIn.data,
    //     }),
    //     shallowEqual,
    // )

    // 로그아웃은 마이페이지 에서

    const dispatch = useDispatch()

    const loginHandler = (id, password) => {}

    const navigate = useNavigate()

    const [isShowPw, setShowPw] = useState(false)
    const handleShowPwChecked = () => {
        setShowPw(!isShowPw)
    }

    const [isKeepLogin, setKeepLogin] = useState(false)
    const handleKeepLogin = () => {
        setKeepLogin(!isKeepLogin)
    }

    return (
        <SSinnerWrapper>
            <SStopBar useCloseButton={false} onBackClick={() => navigate(-1)} />

            {/*todo 크기 수정*/}
            <div
                className={`flex h-[140px] w-full items-center justify-center`}
            >
                <LogoWithTitle />
            </div>

            <SSinput className={`mb-[8px]`} placeholder={'아이디'} />
            <div className="flex-grow">
                <div className="relative w-full">
                    <SSinput
                        className={`mb-[16px]`}
                        placeholder={'비밀번호'}
                        type={isShowPw ? `text` : `password`}
                    />
                    {isShowPw ? (
                        <div className="absolute right-3 top-2 h-6 w-6 bg-white">
                            <IconEye
                                className="stroke-muted"
                                onClick={handleShowPwChecked}
                            />
                        </div>
                    ) : (
                        <div className="absolute right-3 top-2 h-6 w-6 bg-white">
                            <IconEyeOff
                                className="stroke-muted"
                                onClick={handleShowPwChecked}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 로그인 유지 toggle */}
            <div>
                <label className="relative flex">
                    <input
                        type="checkbox"
                        className="absolute m-[2px] w-0 overflow-hidden"
                        onChange={handleKeepLogin}
                    />
                    <div className="mb-4 flex">
                        <div
                            className={`mr-2 flex h-[16px] w-[16px] items-center justify-center rounded-sm ${isKeepLogin ? 'bg-border' : 'bg-muted'}`}
                        >
                            <IconCheck />
                        </div>
                        <span className="flex items-center text-input">
                            로그인 상태 유지하기
                        </span>
                    </div>
                </label>
            </div>

            {/* todo 로그인 기능 추가 */}
            <SSbutton
                className={'h-[48px]'}
                text={'로그인'}
                onClick={loginHandler}
            />

            {/* 아이디, 비번 찾기, 회원가입 */}
            {/* todo 링크 걸기 */}
            <section className="flex w-full items-center justify-center">
                <span
                    className="text-sm text-muted-foreground"
                    onClick={() => navigate('/findId')}
                >
                    아이디 찾기
                </span>
                <span className="m-2 h-[12px] border-[1px] border-muted"></span>
                <span
                    className="text-sm text-muted-foreground"
                    onClick={() => navigate('/findPwd')}
                >
                    비밀번호 찾기
                </span>
                <span className="m-2 h-[12px] border-[1px] border-muted"></span>
                <span
                    className="text-sm text-muted-foreground"
                    onClick={() => navigate('/join')}
                >
                    회원가입
                </span>
            </section>
        </SSinnerWrapper>
    )
}

export default Login
