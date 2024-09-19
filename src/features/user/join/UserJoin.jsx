import { useState } from 'react'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import { useNavigate } from 'react-router-dom'
import SSprogressBar from 'src/common/components/progressbar/SSprogressBar.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import CreateAccount2Id from 'src/features/user/join/createAccount/CreateAccount2Id.jsx'
import CreateAccount1Terms from 'src/features/user/join/createAccount/CreateAccount1Terms.jsx'
import CreateAccount3Pwd from 'src/features/user/join/createAccount/CreateAccount3Pwd.jsx'
import CreateAccount4Email from 'src/features/user/join/createAccount/CreateAccount4Email.jsx'
import UserJoinVerificationTemp from 'src/features/user/join/verification/UserJoinVerificationTemp.jsx'

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

    const maxJoinState = 6
    // 현재 단계
    const [joinState, setJoinState] = useState(1)
    //통과 가능 여부
    const [canPassState, setCanPassState] = useState(false)

    return (
        <SSinnerWrapper>
            <SSinnerWrapper.Top>
                <SStopBar
                    onBackClick={() =>
                        navigate('/intro', {
                            state: {
                                to: 'userJoin',
                                from: 'userJoin'
                            },


                        })
                    }
                    onCloseClick={() => navigate('/')}
                />
                <SSprogressBar
                    currentValue={joinState - 1} //완료 한거 보여주기위해 -1
                    totalValue={maxJoinState}
                />

                {joinState === 1 && (
                    <CreateAccount1Terms setCanPassState={setCanPassState} />
                )}
                {joinState === 2 && (
                    <CreateAccount2Id setCanPassState={setCanPassState} />
                )}
                {joinState === 3 && (
                    <CreateAccount3Pwd setCanPassState={setCanPassState} />
                )}
                {joinState === 4 && (
                    <CreateAccount4Email setCanPassState={setCanPassState} />
                )}
                {joinState === 5 && (
                    <UserJoinVerificationTemp
                        setCanPassState={setCanPassState}
                    />
                )}
            </SSinnerWrapper.Top>

            <SSinnerWrapper.Bottom>
                <SSbutton
                    disabled={!canPassState}
                    text={'다음'}
                    onClick={() => {
                        setCanPassState(false)
                        setJoinState(
                            (currentPageNumber) => currentPageNumber + 1,
                        )
                    }}
                />
            </SSinnerWrapper.Bottom>
        </SSinnerWrapper>
    )
}

export default UserJoin
