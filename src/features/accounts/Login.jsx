import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {Input} from "antd";
import SSbutton from "../../common/components/button/SSbutton.jsx";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import MainLogoSvg from "../../common/components/Svg/MainLogoSvg.jsx";
import axios from "axios";
import {userAction} from "./userReducer.jsx";
import {getCookie, setCookie} from "../../app/cookie.jsx";


const Login = () => {
    const dispatch = useDispatch()

    const [userID, setUserID] = useState("")
    const [userPassword, setUserPassword] = useState("")


    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(String(email).toLowerCase());
    }; // 이메일 형식 유효성 검사



    const loginHandler = async () => {

        if (!validateEmail(userID)) {
            alert("올바른 이메일 형식이 아닙니다.")
            return;
        } // 이메일 형식이 아닐 경우




        dispatch(userAction.login({
            userEmail: userID,
            password: userPassword,
        }))

        //todo 실패 매시지 띠우기




    };

    return (
        <div className='relative w-full h-full'>
            <div className='w-full absolute top-[16px] left-1/2 -translate-x-1/2 flex justify-center items-center'>
                <MainLogoSvg width={"162px"}/>
            </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <SSwrapper
                    className={`
                        w-full
                        mx-[20px] 
                        px-[40px] 
                        py-[30px]
                        tablet:max-w-[900px] 
                        tablet:px-[50px]
                        tablet:py-[40px]
                        desktop:px-[60px] 
                        desktop:py-[50px]
                        desktop:max-w-[900px] 
                `
                    }
                >
                    <div
                        style={{
                            width: '100%'
                        }}
                        className='pb-[30px]'
                    >
                        <h1 className=''>안녕하세요 :)</h1>
                        <h1 className=''>RMS 입니다.</h1>
                    </div>
                    <form action=""
                          onSubmit={(e) => {
                              e.preventDefault()
                              loginHandler()
                          }}
                    >
                        <Input
                            value={userID}
                            onChange={(e) => setUserID(e.target.value)}
                            prefix={<UserOutlined/>}
                            placeholder="아이디를 입력하세요."
                            style={{
                                marginBottom: '25px',
                                height: '40px',
                            }}
                        />

                        <Input.Password
                            prefix={<LockOutlined/>}
                            style={{
                                marginBottom: '50px',
                                height: '40px',
                            }}
                            onChange={(e) => setUserPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요."/>
                        <SSbutton
                            type='primary'
                            htmlType={"submit"}
                            block
                            className={`h-[60px] text-[20px] font-bold bg-[#4F5FF5] mb-[25px] text-[#ffffff] hover:bg-[#263BF2]`}
                        >
                            로그인
                        </SSbutton>
                    </form>
                    {/*<div className='flex w-full justify-center items-center'>*/}
                    {/*    <ul className='flex flex-row gap-[10px] tablet:gap-[16px] text-[#51525C] items-center justify-center'>*/}
                    {/*        <li onClick={() => dispatch(push("/searchId"))} className='cursor-pointer'>아이디 찾기</li>*/}
                    {/*        <div className='w-[1px] h-[14px] bg-[#51525C]'></div>*/}
                    {/*        <li onClick={() => dispatch(push("/searchPw"))} className='cursor-pointer'>비밀번호 찾기</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}


                </SSwrapper>
            </div>
        </div>
    );
};

export default Login;
