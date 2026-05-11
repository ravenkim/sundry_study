import React, { useState} from "react";

import {logoutHandler} from "features/accounts/userUtils";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";

const UserMenu = ({userInfo, menuClickHandler}) => {

    const dispatch = useDispatch();

    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const userMenuClickHandler = () => {
        setUserMenuVisible(!userMenuVisible);
    }

    const closePopoverHandler = () => {
        setUserMenuVisible(false);
    }
    const profileClickHandler = (path) => {
        dispatch(push(path));
    };

    return (
        <>
            <div className="right-items">
                <a onClick={userMenuClickHandler}><span
                    className="mdi mdi-account-circle-outline"></span>{userInfo.name}({userInfo.username})</a>


            </div>
            <div className={`popover-small ${userMenuVisible ? "show" : ""}`} id="popover">
                <div className="pop-list">

                    <a onClick={(e)=>profileClickHandler("profile")}>
                        <span className="mdi mdi-account-box-outline"></span><span>내 프로필</span>
                    </a>
                    
                    <a onClick={logoutHandler}>
                        <span className="mdi mdi-logout"></span><span>로그아웃</span>
                    </a>
                    {/*<a href="javascript:void(0);">*/}
                    {/*    <span className="mdi mdi-face-man"></span><span>마이페이지</span>*/}
                    {/*</a>*/}
                </div>
            </div>
        </>
    );
};

export default UserMenu;
