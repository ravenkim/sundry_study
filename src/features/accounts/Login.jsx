import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {Input} from "antd";
import SSbutton from "../../common/components/button/SSbutton.jsx";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";




const Login = () => {



    const [userID, setUserID] = useState("")
    const [userPassword, setUserPassword] = useState("")



    const loginHandler = () => {

    }


    useEffect(() => {
        console.log(userID)
    }, [userID]);

    return (
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
                widht= '900px'
                style={{
                    width: '900px',
                    alignItems: 'center'
                }}
            >


                <div
                    style={{
                        width: '100%',
                        marginBottom: '20px'

                }}
                >
                    <h2>안녕하세요 :)</h2>
                    <h2>RMS 입니다.</h2>
                </div>
                    <Input
                        value ={userID}
                        onChange ={(e) => setUserID(e.value)}
                        prefix={<UserOutlined />}
                        placeholder="아이디를 입력하세요"
                           style = {{
                            marginBottom: '10px'
                        }}
                    />

                    <Input.Password
                        prefix={<LockOutlined />}
                        style = {{
                            marginBottom: '20px'
                        }}
                        placeholder="비밀번호를 입력하세요" />
                    <SSbutton
                        type = 'primary'
                        block
                    >
                        로그인
                    </SSbutton>




            </SSwrapper>




        </div>
    );
};

export default Login;
