import React from 'react';
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
                                    text={"회원 정보"}
                                    tab={'userInfo'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"대여 목록"}
                                    tab={'rentalsInfo'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"관심 목록"}
                                    tab={'likesInfo'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"예약 목록"}
                                    tab={'reservationsInfo'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                            </ul>

                     : null }

                {selectedButton === 'MANAGER' && selected ?

                            <ul className={`w-full flex justify-center items-center flex-col transition-all overflow-hidden ` + (selectedButton === 'MANAGER' && selected ? 'h-auto' : '')}>
                                <SubMenuButtonWrap
                                    text={"회원 관리"}
                                    tab={'member'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"보드 관리"}
                                    tab={'board'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"연체자 관리"}
                                    tab={'delinquent'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                                <SubMenuButtonWrap
                                    text={"권한 관리"}
                                    tab={'auth'}
                                    setMenuOpen={setMenuOpen}
                                    selectedButton={selectedButton}
                                />
                            </ul>

                     : null }
            </li>
        </>
    )
}

export default MobileButton
