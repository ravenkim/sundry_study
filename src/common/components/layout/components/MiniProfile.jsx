import React, {useEffect, useState} from 'react';
import SSbutton from "../../button/SSbutton.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {useDispatch} from "react-redux";

const MiniProfile = () => {
    const dispatch = useDispatch()


    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        setImageSrc('/src/assets/img/profile_example.png')
    }, []);


    return (


        <div
            className={' tablet:right-[23px] text-[#000000] rounded-[10px] overflow-hidden shadow-[0px_1px_4px_rgba(0,0,0,0.3)] box-border w-[calc(100%-40px)] tablet:w-fit tablet:min-w-[400px] desktop:min-w-[300px] z-[90] bg-[#ffffff]'}
        >
            <div
                className={'relative w-full flex flex-col justify-center items-center bg-[#5565F6] bg-opacity-60 p-[20px]'}>
                <h4 className={'text-[#ffffff] pb-[50px]'}>일반 사용자</h4>
                <div
                    className={'absolute rounded-full overflow-hidden border-[#ffffff] border-2 box-border border-solid -bottom-1/2 -translate-y-1/2 cursor-pointer'}>
                    <img src={imageSrc} alt="#" className={'max-w-[63px] h-auto'}
                         onClick={() => {
                             console.log('프로필 수정 화면으로 이동')
                         }}
                    />
                </div>
            </div>
            <div className={'p-[20px] pt-[50px] flex flex-col justify-center items-center gap-[8px]'}>
                <div className={'flex justify-center items-center flex-col mb-[20px]'}>
                    <h5>박찬민</h5>
                    <h5>cksals123@gmail.com</h5>
                </div>
                <SSbutton onClick={() => {
                    /*내 정보 페이지로 이동*/
                }}
                          className={'w-full'}
                >
                    내 정보 수정
                </SSbutton>

                <SSbutton onClick={() => {
                    /*관심목록으로 이동*/
                }}
                          className={'w-full'}
                >
                    관심 목록
                </SSbutton>

                <SSbutton onClick={() => {
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

                <SSbutton danger className={'w-full'} onClick={() => {
                    dispatch(userAction.logout())
                }}>로그아웃</SSbutton>
            </div>
        </div>
    );
};

export default MiniProfile;
