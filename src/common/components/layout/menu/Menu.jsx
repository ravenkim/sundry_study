import React, {useState} from 'react';

import {CloseOutlined} from "@ant-design/icons";
import MenuButtonWrap from "./components/MenuButtonWrap.jsx";
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {push} from "redux-first-history";


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
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: "black",
                display: 'flex',
                flexDirection: 'row',
                opacity: '0.9'
            }}
        >
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
                onClick={() => setMenuOpen(false)}

            >
                {menuOpen && <CloseOutlined/>}
            </div>


            {/*왼쪽 메뉴*/}
            <div
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: "rgba(22, 22, 22, 0.95)",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse"

                }}
            >
                <ul>

                    <MenuButtonWrap
                        text={"HOME"}
                        onClick={() => dispatch(push('/'))}
                    />

                    <MenuButtonWrap
                        text={"MY PAGE"}
                        url={'/asd'}
                        onClick = {() => {
                            setSelectedButton('MY PAGE')
                        }}
                        selected = {
                            selectedButton === 'MY PAGE'
                        }


                    />
                    <MenuButtonWrap
                        text={"CONTENTS"}
                        url={'/asd'}
                         onClick = {() => {
                            setSelectedButton('CONTENTS')
                        }}
                        selected = {
                            selectedButton === 'CONTENTS'
                        }
                    />
                    <MenuButtonWrap
                        text={"MANAGER"}
                        url={'/asd'}
                        onClick = {() => {
                            setSelectedButton('MANAGER')
                        }}
                        selected = {
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
                    backgroundColor: "rgba(0, 0, 0, 0.2)"

                }}
            >

            </div>



        </div>
    );
};

export default Menu;
