import React, {useState} from 'react';

import {CloseOutlined} from "@ant-design/icons";
import MenuButtonWrap from "./components/MenuButtonWrap.jsx";
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {push} from "redux-first-history";
import SubMenuButtonWrap from "./components/SubMenuButtonWrap.jsx";
import MobileButton from "./components/MobileButton.jsx";


const Menu = ({
                  setMenuOpen,
                  menuOpen
              }) => {

    const dispatch = useDispatch()


    // 선택된 대분류
    const [selectedButton, setSelectedButton] = useState('CONTENTS')
    /*
   myPage
   contents
   manager
     */


    return (
        <div
            style={{
                left: 0,
                top: 0,
                backgroundColor: "black",
                display: 'flex',
                flexDirection: 'row',
                opacity: '0.9'
            }}
            className={'w-full h-full fixed'}
        >

            {/*tablet~pc*/}
            <div className={'hidden tablet:block w-full h-full'}>
                {/*왼쪽 메뉴*/}
                <div
                    style={{
                        width: '50%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row-reverse"
                    }}
                    className={'relative z-99 before:absolute before:left-[0] before:top-[0] before:w-full before:h-full before:bg-[#161616] before:bg-opacity-95 before:-z-10'}
                >
                    <ul>

                        <MenuButtonWrap
                            cursor={'pointer'}
                            text={"HOME"}
                            onClick={() => dispatch(push('/'))}
                        />

                        <MenuButtonWrap
                            text={"MY PAGE"}
                            url={'/asd'}
                            onMouseOver={() => {
                                setSelectedButton('MY PAGE')
                            }}
                            selected={
                                selectedButton === 'MY PAGE'
                            }


                        />
                        <MenuButtonWrap
                            text={"CONTENTS"}
                            url={'/asd'}
                            onMouseOver={() => {
                                setSelectedButton('CONTENTS')
                            }}
                            selected={
                                selectedButton === 'CONTENTS'
                            }
                        />
                        <MenuButtonWrap
                            text={"MANAGER"}
                            url={'/asd'}
                            onMouseOver={() => {
                                setSelectedButton('MANAGER')
                            }}
                            selected={
                                selectedButton === 'MANAGER'
                            }
                        />

                    </ul>


                </div>

                {/*오른쪽 메뉴*/}
                <div
                    style={{
                        width: '50%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center"

                    }}
                    className={'relative z-99 before:absolute before:left-[0] before:top-[0] before:w-full before:h-full before:bg-[#161616] before:bg-opacity-95 before:-z-10'}
                >
                    {selectedButton === 'MANAGER' &&
                        <ul>
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
                    }
                </div>
            </div>
            {/*tablet~pc*/}

            {/*mobile*/}
            <div
                className={'w-full h-full z-99 flex tablet:hidden relative before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-[#161616] before:bg-opacity-95 before:-z-10 justify-center items-center'}>
                <div className={'box-border w-full h-full px-[20px] m-0 mx-auto flex justify-center items-center'}>
                    <ul className={'w-full h-auto flex flex-col justify-center items-center'}>
                        <MobileButton text={'HOME'} onClick={() => console.log('asdasdasd')}/>
                        <MobileButton text={'MY PAGE'}
                                      selectedButton={selectedButton}
                                      onClick={() => {
                                          setSelectedButton('MY PAGE')
                                      }}
                                      selected={
                                          selectedButton === 'MY PAGE'
                                      }
                        />
                        <MobileButton text={'CONTENTS'}
                                      selectedButton={selectedButton}
                                      onClick={() => {
                                          setSelectedButton('CONTENTS')
                                      }}
                                      selected={
                                          selectedButton === 'CONTENTS'
                                      }

                        />
                        <MobileButton text={'MANAGER'}
                                      selectedButton={selectedButton}
                                      onClick={() => {
                                          setSelectedButton('MANAGER')
                                      }}
                                      selected={
                                          selectedButton === 'MANAGER'
                                      }
                        >

                        </MobileButton>
                    </ul>
                </div>
            </div>
            {/*mobile*/}


            {/*닫기 버튼*/}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '63px',
                    width: '63px',
                    color: 'white',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center"
                }}


                onClick={
                    () => setMenuOpen(false)

                }
                className={'cursor-pointer z-99'}
            >
                {menuOpen && <CloseOutlined/>}
            </div>


        </div>
    );
};

export default Menu;
