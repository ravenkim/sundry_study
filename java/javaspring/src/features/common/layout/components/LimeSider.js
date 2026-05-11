import React, {useEffect, useState} from 'react';
import {push} from "connected-react-router";
import {useDispatch, useSelector} from "react-redux";
import LimeMenuItem from "features/common/menu/LimeMenuItem";
import LimeSubMenu from "features/common/menu/LimeSubMenu";
import {ROLE} from "Constants";

const LimeSider = ({menuList, siderVisible, siderCloseHandler}) => {

    const dispatch = useDispatch();

    const {user} = useSelector(({userReducer}) => ({
        user: userReducer.user.data,
    }));

    const adminAuthCheckHandler = (checkAuth) => {
        let isAuth = false;
        if (checkAuth) {
            if (user.groups.includes(ROLE.ROLE_ADMIN) || user.isAdmin) {
                isAuth = true;
            }

        } else {
            isAuth = true;
        }
        return isAuth;
    };


    const menuClickHandler = (path) => {
        dispatch(push(path));
    };

    const isMenuIncludesAuth = (userAuth, menuAuth) => {
        let isAuth = false;
        userAuth.forEach((item) => {
            if (menuAuth.includes(item)) {
                isAuth = true;
            }
        })
        return isAuth;
    }

    return (
        <div className={`nav ${siderVisible ? "" : "no-show"}`} id={"navigation"} style={{zIndex: 99999}}>
            <div className={"nav-header"}>
                <img src="/images/symbol.png" alt="symbol"/>
                <button type="button" className="nav-closed" onClick={siderCloseHandler}></button>
            </div>

            {user && menuList.length > 0 &&
                menuList.map((item, idx) => {
                    if (isMenuIncludesAuth(user.groups, item.auth)) {
                        if (item.children.length > 0) {
                            return (
                                <LimeSubMenu key={idx} icon={item.iconNm} title={item.menuNm}>
                                    {
                                        item.children.map((item2, idx) =>{
                                                if (isMenuIncludesAuth(user.groups, item2.auth)) {
                                                    return (
                                                        <LimeMenuItem key={idx} title={item2.menuNm} path={item2.menuPath}
                                                                      menuClickHandler={menuClickHandler}/>
                                                    )

                                        }
                                    }

                                        )
                                    }
                                </LimeSubMenu>

                            )
                        } else {
                            return <LimeSubMenu key={idx} title={item.menuNm} icon={item.iconNm} path={item.menuPath}
                                                menuClickHandler={menuClickHandler}/>
                        }

                    }
                })

            }

            {/*<LimeSubMenu title={"평가위원추천"} icon={"mdi-account-box"} path={"/evaluator"} menuClickHandler={menuClickHandler}/>*/}
            {/*<LimeSubMenu title={"예비평가 모델"} icon={"mdi-chart-bar"} visible={true}>*/}
            {/*    <LimeMenuItem title={"신청과제 조회"} path={"/pre/appl"} menuClickHandler={menuClickHandler}/>*/}
            {/*    <LimeMenuItem title={"예비평가 결과분석"} path={"/pre/anal"} menuClickHandler={menuClickHandler}/>*/}
            {/*</LimeSubMenu>*/}
            {/*<LimeSubMenu title={"제품성능지표"} icon={"mdi-content-paste"} path={"/perf"} menuClickHandler={menuClickHandler}/>*/}

            {/*{*/}
            {/*    adminAuthCheckHandler(ROLE.ROLE_ADMIN) &&*/}
            {/*    <LimeSubMenu icon={"mdi-cog"} title={"시스템 관리"}>*/}
            {/*        <LimeMenuItem title={"메뉴/권한 그룹 관리"} path={"/admin/menu"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"사용자/권한관리"} path={"/admin/member"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"공통코드관리"} path={"/admin/code"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"용어관리"} path={"/admin/term"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"평가위원조건관리"} path={"/admin/cond"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"성능지표관리"} path={"/admin/perf"} menuClickHandler={menuClickHandler}/>*/}
            {/*        <LimeMenuItem title={"기초통계대시보드"} path={"/admin/stat"} menuClickHandler={menuClickHandler}/>*/}
            {/*    </LimeSubMenu>*/}

            {/*}*/}


        </div>
    );
};

export default LimeSider;