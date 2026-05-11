import React, {useEffect, useState} from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import UserMenu from "features/accounts/components/avatar/UserMenu";
import {Helmet} from "react-helmet";
import {userAction} from "features/accounts/userReducer";
import {jwtDecodeHandler, setUserHandler} from "features/accounts/userUtils";
import {Modal} from "antd";
import {push} from "connected-react-router";
import {memberAction} from "features/admin/member/memberReducer";

const LimeHeader = ({pageTitle, siderChangeHandler}) => {
    const dispatch = useDispatch();

    const {user, location, confirmPwd} = useSelector(({userReducer, memberReducer, router}) => ({
        user: userReducer.user.data,
        confirmPwd : memberReducer.confirmPwd,
        location: router.location,
    }));

    // 회원정보 확인 후 없으면 LOGOUT
    useEffect(() => {
        let storageUser = JSON.parse(localStorage.getItem("user"));

        if (!storageUser) {
            dispatch(userAction.logout({refresh_token: user.refresh_token}));
        } else {
            // console.log("로컬스토리지 user정보있음");
            let decodeUser = jwtDecodeHandler(storageUser);
            if (user.id !== decodeUser.id) {
                setUserHandler();
            }
        }
    }, [location]);


    useEffect(()=>{
        if(user && user.isChangePwd==="N" && !confirmPwd){
            Modal.confirm({
                title : "비밀번호를 변경하세요.",
                content : "최초에 설정된 비밀번호입니다. 계정 보안을 위해 비밀번호를 변경하세요.",
                okText : "비밀번호 변경하러가기",
                onOk : (close) => {
                    dispatch(push("/profile"));
                    close();
                },
                cancelText : "취소",
                // onCancel : (close) => {
                //     close();
                // }
            })
            dispatch(memberAction.confirmPwd(true));
        }
    },[user])
    
    return (
        <>
            <Helmet title={pageTitle === undefined ? "TIPA" : pageTitle + "-TIPA"}/>
            <header>
                <a onClick={siderChangeHandler} className="nav-btn-40"><span className="mdi mdi-menu"></span></a>
                <h3 className="ml-8">{pageTitle}</h3>

                    <UserMenu userInfo={user}/>


            </header>

        </>
    );
};

export default LimeHeader;
