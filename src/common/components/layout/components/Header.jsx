import {CloseOutlined, MenuOutlined} from "@ant-design/icons";
import {shallowEqual, useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";
import React, {useEffect, useState} from "react";
import SSbutton from "../../button/SSbutton.jsx";

const Header = ({
                    setMenuOpen,
                    menuOpen
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
    const [profileOpen, setProfileOpen] = useState(false)

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
                onClick={() => dispatch(push('/'))}
            >

                <img
                    style={{
                        height: 34

                    }}
                    src={'/src/assets/logo/logo_main.png'} alt={'logo'}
                />


            </div>

            {/*프로필 영역*/}
            <div className={'w-[63px] h-[63px] flex justify-center items-center relative'}>
                <div className={'after:overflow-hidden rounded-full overflow-hidden max-w-[63px] max-h-[63px] flex justify-center items-center cursor-pointer bg-[#ffffff]'}
                     onClick={()=> setProfileOpen(!profileOpen)}
                >
                    <img src={imageSrc} alt="#" className={'max-w-[40px] max-h-[auto]'}/>
                </div>

            </div>
            {/*오픈영역*/}
                {profileOpen &&
                    <div className={'absolute top-[70px] right-[20px] tablet:right-[23px] text-[#000000] rounded-[10px] overflow-hidden shadow-[0px_1px_4px_rgba(0,0,0,0.3)] box-border w-[calc(100%-40px)] tablet:w-fit tablet:min-w-[400px] desktop:min-w-[300px] z-[100] bg-[#ffffff]'}>
                        <div className={'relative w-full flex flex-col justify-center items-center bg-[#5565F6] bg-opacity-60 p-[20px]'}>
                            <h4 className={'text-[#ffffff] pb-[50px]'}>일반 사용자</h4>
                            <div className={'absolute rounded-full overflow-hidden border-[#ffffff] border-2 box-border border-solid -bottom-1/2 -translate-y-1/2 cursor-pointer'}>
                                <img src={imageSrc} alt="#" className={'max-w-[63px] h-auto'}
                                     onClick={()=>{
                                         console.log('프로필 수정 화면으로 이동')
                                     }}
                                />
                            </div>
                        </div>
                        <div className={'p-[20px] pt-[50px] flex flex-col justify-center items-center gap-[8px]' }>
                            <div className={'flex justify-center items-center flex-col'}>
                                <h5>박찬민</h5>
                                <h5>cksals123@gmail.com</h5>
                            </div>
                            <SSbutton onClick={()=> {
                                /*내 정보 페이지로 이동*/
                            }}
                                      className={'w-full'}
                            >
                                내 정보 수정
                            </SSbutton>

                            <SSbutton  onClick={()=> {
                                /*관심목록으로 이동*/
                            }}
                                       className={'w-full'}
                            >
                                관심 목록
                            </SSbutton>

                            <SSbutton  onClick={()=> {
                                /*대여 목록으로 이동*/
                            }}
                                       className={'w-full'}
                            >
                                대여 목록
                            </SSbutton>

                            {/*<SSbutton  onClick={()=> {
                            }}>
                                관리자 페이지로 이동
                            </SSbutton>*/}

                            <SSbutton danger className={'w-full'} onClick={()=>{
                                console.log('로그아웃 후 메인 화면으로 이동')
                            }}>로그아웃</SSbutton>
                        </div>
                    </div>
                }


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
