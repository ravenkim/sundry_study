import { useState } from 'react'

const UserJoin = () => {


    const [state, setState] = useState('intro')



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



        // 회원가입


        // 순차적으로
        // 1. intro
        // 2. 계정생성
        // 3. 본인 확인 - 나이스로 변경
        // 4. 로그인 페이지로

        // 카카오 싱크 추가  네이버 로그인 플러스






        <div>

        </div>
    )
}

export default UserJoin