import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {Form, Input, Modal} from "antd";
import {
    iris_issue_autc,
    iris_login_info,
    iris_validation_autc,
} from "../../userAPI";
import {userAction} from "../../userReducer";
import moment from "moment";
import {loginHandler} from "../../userUtils";

const LoginForm = () => {
    const dispatch = useDispatch();

    const {user,loginError} = useSelector(({userReducer}) => ({
        user: userReducer.user,
        loginError : userReducer.user.error
    }));

    useEffect(() => {
        if(user){
            if (user.data) {
                let pathname = "/";
                dispatch(push(pathname));
            }

            if (user.error) {

                let errorMessage = "로그인에 실패하였습니다. 다시 시도해주세요.";

                if(user.errorMessage && user.errorMessage.msg){
                    errorMessage = user.errorMessage.msg;
                }
                Modal.error({
                    title : "로그인 실패",
                    content : errorMessage,
                    okText : "확인",
                })

                dispatch(userAction.initialize("user"));
            }

        }


    }, [user]);




    const loginFormSubmitHandler = () => {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        loginHandler(username, password);

    };

    const keyDownHandler = (e) => {
        if(e.key==="Enter"){
            loginFormSubmitHandler()
        }
    }


    return (
        <div className="login-page">

            <div className="login-form">
                <img src={"/images/symbol_typo.svg"} alt="symbol_typo"/>
                <form>
                <input id={"username"} name={"username"} type="text" className="mtb-16" placeholder="아이디" onKeyDown={keyDownHandler}/>
                <input id={"password"} name={"password"} type="password" placeholder="비밀번호" autoComplete="on" onKeyDown={keyDownHandler}/>
                {/*helper-text 부분은 "show" / "no-show" class로 비교 확인*/}
                {/*<div className="helper-text-red no-show">아이디 또는 비밀번호가 틀렸습니다.</div>*/}
                </form>
                <button type="button" className="btn-primary-48 mt-16" onClick={loginFormSubmitHandler}>로그인</button>
            </div>

        </div>

    );
};

export default LoginForm;


// <div className="login-wrap">
//   <div className="login-box">
//     <Form onFinish={loginFormSubmitHandler}>
//       <h1>
//         <em className="hidden">iris 범부처통합연구지원시스템</em>
//       </h1>
//       <fieldset>
//         <legend id="login" className="hidden">
//           LOGIN
//         </legend>
//         <Form.Item
//             label="ID"
//             name="username"
//             rules={[
//               {
//                 required: true,
//                 message: "아이디를 입력하세요.",
//               },
//             ]}
//             className="id"
//         >
//           <Input placeholder="ID" />
//         </Form.Item>
//         <Form.Item
//             label="Password"
//             name="password"
//             rules={[
//               {
//                 required: true,
//                 message: "비밀번호를 입력하세요.",
//               },
//             ]}
//             className="id"
//         >
//           <Input type="password" placeholder="PW" />
//         </Form.Item>
//         <input type="submit" value="로그인" className="login" />
//
//       </fieldset>
//     </Form>
//   </div>
//
// </div>