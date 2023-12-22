import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";
import {adminAction} from "/src/features/admin/adminReducer.jsx";
import SubMenuButtonWrap from "./SubMenuButtonWrap.jsx";

const MobileButton = ({
    text,
    selected = false,
    tab,
    setMenuOpen,
    selectedButton,
    children,
    onClick,
    ...otherProps
}) => {

    return(
        <>
            <li className={'border-b-[1px] border-solid border-[#51525c] text-[#51525c] hover:border-[#ffffff] hover:text-[#ffffff] active:text-[#ffffff] active:border-[#ffffff] focus:border-[#ffffff] focus:text-[#ffffff] ' +
                            'text-[30px] w-full text-center font-[NotoSansKR-900] py-[20px] transition-all '}
                onClick={onClick}
            >

                {text}

                {selectedButton === 'MY PAGE' && selected ?

                            <ul className={`w-full flex justify-center items-center flex-col transition-all overflow-hidden ` + (selectedButton === 'MANAGER' && selected ? 'h-auto' : '')}>
                                <SubMenuButtonWrap
                                    text={"회원 관리"}
                                    tab={'userInfo'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"보드 관리"}
                                    tab={'rentalsInfo'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"연체자 관리"}
                                    tab={'likesInfo'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"권한 관리"}
                                    tab={'reservationsInfo'}
                                    setMenuOpen={setMenuOpen}
                                />
                            </ul>

                     : null }

                {selectedButton === 'MANAGER' && selected ?

                            <ul className={`w-full flex justify-center items-center flex-col transition-all overflow-hidden ` + (selectedButton === 'MANAGER' && selected ? 'h-auto' : '')}>
                                <SubMenuButtonWrap
                                    text={"회원 관리"}
                                    tab={'member'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"보드 관리"}
                                    tab={'board'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"연체자 관리"}
                                    tab={'delinquent'}
                                    setMenuOpen={setMenuOpen}
                                />
                                <SubMenuButtonWrap
                                    text={"권한 관리"}
                                    tab={'auth'}
                                    setMenuOpen={setMenuOpen}
                                />
                            </ul>

                     : null }
            </li>
        </>
    )
}

export default MobileButton
