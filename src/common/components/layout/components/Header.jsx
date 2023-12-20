import {MenuOutlined} from "@ant-design/icons";
import {shallowEqual, useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";
import React, {useEffect, useState} from "react";
import MiniProfile from "./MiniProfile.jsx";
import {Popover} from "antd";

const Header = ({
                    setMenuOpen,
                    menuOpen,
                    onClick,
                    modalRef
                }) => {

    const dispatch = useDispatch()

    const {
        bgcolor1
    } = useSelector(({assetsReducer}) => ({
            bgcolor1: assetsReducer.colors.bgcolor,
        }),
        shallowEqual
    );

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        setImageSrc('/src/assets/img/profile_example.png')
    }, []);


    return (
        <header
            style={{
                width: '100%',
                height: '63px',
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
            }}
            ref={modalRef}
            onClick={onClick}
        >
            {/*메뉴 버튼*/}
            <div
                style={{
                    width: '63px',
                    height: '63px',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                className={'cursor-pointer'}
                onClick={() => setMenuOpen(true)}
            >
                {!menuOpen &&
                    <MenuOutlined

                    />
                }

            </div>
            {/*로고 이미지*/}
            <div

                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                }}
                onClick={() => dispatch(push('/door'))}
            >

                <img
                    style={{
                        height: 34

                    }}
                    src={'/src/assets/logo/logo_main.png'} alt={'logo'}
                />


            </div>


            {/*프로필 영역*/}

            {/*상세정보*/}
            <Popover  content={ <MiniProfile/>} trigger="click" placement="bottomRight"  arrow={{pointAtCenter: true}}>

                {/*프로필 사진 부분*/}
                <div className={'w-[63px] h-[63px] flex justify-center items-center relative'}>
                    <div
                        className={'after:overflow-hidden rounded-full overflow-hidden max-w-[63px] max-h-[63px] flex justify-center items-center cursor-pointer bg-[#ffffff]'}
                    >
                        <img src={imageSrc} alt="#" className={'max-w-[40px] max-h-[auto]'}/>
                    </div>

                </div>
            </Popover>





        </header>
        // ussPath = {
        //     pages : '',
        // }
        // <div style={(ussPath ? 'bg-white' : 'gray')}>
        //
        // </div>
    );
};

export default Header;
