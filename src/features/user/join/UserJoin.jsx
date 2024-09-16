import { useState } from 'react'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import { useNavigate } from 'react-router-dom'

const UserJoin = () => {
    const navigate = useNavigate()

    //기본 유저 입력 정보
    const [userLoginId, setUserLoginId] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userEmail, setUserEmail] = useState('')

    //유저 본인인증을 통해서 얻는 정보
    const [userName, setUserName] = useState('')
    const [userGender, setUserGender] = useState()
    const [userBirth, setUserBirth] = useState()

    /*인증 방식
    1. 휴대폰 인증 ci 값 생성 불가 이거 처리로직을 백으로 옴겨서 ci 값을 받아 올 수 있게끔
    2. nice 인증 < ci 생성 가능 휴대폰 번호 불필요
    3. 카카오 인증 < ci 값 생성 가능

     */

    const [createAccountData, setCreateAccountData] = useState([])

    return (
        <SSinnerWrapper>
            <SSinnerWrapper.Top>
                <SStopBar
                    onBackClick={() =>
                        navigate('/intro', {
                            state: 'userJoin',
                        })
                    }
                    onCloseClick={() => navigate('/')}
                />
            </SSinnerWrapper.Top>

            <SSinnerWrapper.Bottom>


            </SSinnerWrapper.Bottom>
        </SSinnerWrapper>
    )
}

export default UserJoin
