import React, {useEffect, useState} from 'react';

import {CloseOutlined} from "@ant-design/icons";
import MenuButtonWrap from "./components/MenuButtonWrap.jsx";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {push} from "redux-first-history";
import SubMenuButtonWrap from "./components/SubMenuButtonWrap.jsx";
import MobileButton from "./components/MobileButton.jsx";
import {cmsAction} from "src/features/cms/cmsReducer.jsx";


const Menu = ({
                  setMenuOpen,
                  menuOpen
              }) => {

    const dispatch = useDispatch()


    const {
        boardListData,
        user
    } = useSelector(({cmsReducer, userReducer}) => ({
            boardListData: cmsReducer.boardList.data?.boardList,
            user: userReducer.user
        }),
        shallowEqual
    );

     useEffect(() => {

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    useEffect(() => {
        if(user){
            dispatch(cmsAction.getBoardList())

        }
    }, [user]);




    // 선택된 대분류
    const [selectedButton, setSelectedButton] = useState('CONTENTS')
    /*
   myPage
   contents
   manager
     */


    const [boardList, setBoardList] = useState([])


    useEffect(() => {
        if (boardListData) {
            setBoardList(boardListData)
        }
    }, [boardListData]);


    return (
        <div
            style={{
                left: 0,
                top: 0,
                backgroundColor: "black",
                display: 'flex',
                flexDirection: 'row',
                opacity: '0.97'
            }}
            className={'w-full h-full fixed z-[99]'}

        >

            {/*tablet~pc*/}
            <div className={'hidden w-full h-full relative tablet:flex flex-row'}>
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
                            onClick={() => dispatch(push('/door'))}
                            onMouseOver={() => {
                                setSelectedButton('HOME')
                            }}
                            selected={
                                selectedButton === 'HOME'
                            }
                        />

                        <MenuButtonWrap
                            text={"MY PAGE"}
                            onMouseOver={() => {
                                setSelectedButton('MY PAGE')
                            }}
                            selected={
                                selectedButton === 'MY PAGE'
                            }


                        />
                        <MenuButtonWrap
                            text={"CONTENTS"}
                            onMouseOver={() => {
                                setSelectedButton('CONTENTS')
                            }}
                            selected={
                                selectedButton === 'CONTENTS'
                            }
                        />
                        <MenuButtonWrap
                            text={"MANAGER"}
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

                    {
                        selectedButton === 'CONTENTS' &&
                        <ul>
                            {
                                boardList.map((item) => (
                                    <SubMenuButtonWrap
                                        key = {item.boardId}
                                        text={item.boardNm}
                                        boardId = {item.boardId}
                                        setMenuOpen={setMenuOpen}
                                        selectedButton={selectedButton}
                                    />
                                ))
                            }
                        </ul>

                    }


                    {selectedButton === 'MY PAGE' &&
                        <ul>
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
                    }

                    {selectedButton === 'MANAGER' &&
                        <ul>
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
                    }

                </div>
            </div>
            {/*tablet~pc*/}

            {/*mobile*/}
            <div
                className={'w-full h-full z-99 flex tablet:hidden relative before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-[#161616] before:bg-opacity-95 before:-z-10 justify-center items-center'}>
                <div className={'box-border w-full h-full px-[20px] m-0 mx-auto flex justify-center items-center'}>
                    <ul className={'w-full h-auto flex flex-col justify-center items-center'}>
                        <MobileButton text={'HOME'} onClick={() => dispatch(push('/'))}/>
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
