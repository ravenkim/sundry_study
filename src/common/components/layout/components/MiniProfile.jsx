import React, {useEffect, useState} from 'react';
import SSbutton from "/src/common/components/button/SSbutton.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";
import {profileAction} from "/src/features/profile/profileReducer.jsx";
import {Avatar, Space} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {removeRole} from "../../../utils/dataProcessingUtils.jsx";

const MiniProfile = () => {
    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        notificationsData

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            notificationsData:profileReducer.notifications.data
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserNotifications());

        if (userProfileImg === undefined) {
            dispatch(profileAction.getUserProfileImg(''));
        } else if (userProfileImg === '') {
            dispatch(profileAction.getUserProfileImg());
        }

        if(!notificationsData) dispatch(profileAction.getUserNotifications(null))

        if(notificationsData) {
            console.log('notifications',notificationsData)
        }


    }, []);

    return (
        <div
            className={' tablet:right-[23px] text-[#000000] rounded-[10px] overflow-hidden box-border w-[calc(100%-40px)] tablet:w-fit tablet:min-w-[400px] desktop:min-w-[300px] z-[90] bg-[#ffffff]'}
        >
            <div
                className={'relative w-full flex flex-col justify-center items-center bg-[#5565F6] bg-opacity-60 p-[20px]'}>
                <h4 className={'text-[#ffffff] pb-[50px]'}>{user?.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()}</h4>
                <div
                    className={'absolute rounded-full overflow-hidden border-[#ffffff] border-2 box-border border-solid -bottom-1/2 -translate-y-1/2 cursor-pointer bg-white'}>

                    {userProfileImg == null
                        ? <Space direction='vertical' wrap size={63} onClick={()=> { dispatch(push('/profile'))}}>
                            <Avatar size={63} icon={<UserOutlined/>}/>
                        </Space>
                        : <img src={userProfileImg} alt="#" className={'max-w-[63px] h-auto'}
                               onClick={() => {
                                   dispatch(push('/profile'))
                               }}
                        />
                    }
                </div>
            </div>
            <div className={'p-[20px] pt-[50px] flex flex-col justify-center items-center gap-[8px]'}>
                <div className={'flex justify-center items-center flex-col mb-[20px]'}>
                    <h5>{user?.userNm}</h5>
                    <h5>{user?.userEmail}</h5>
                </div>
                <SSbutton onClick={() => {
                    dispatch(push('/profile'))
                    dispatch(profileAction.setTab('userInfo'))
                }}
                          className={'w-full'}
                >
                    내 정보 수정
                </SSbutton>

                <SSbutton onClick={() => {
                    /*관심목록으로 이동*/
                    dispatch(push('/profile'))
                    dispatch(profileAction.setTab('likesInfo'))

                }}
                          className={'w-full'}
                >
                    관심 목록
                </SSbutton>

                <SSbutton onClick={() => {
                    dispatch(push('/profile'))
                    dispatch(profileAction.setTab('rentalsInfo'))
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

                {notificationsData?.notiList?.map((item, idx)=> (
                    <div key={idx}>
                        {item.notiContent}
                        {item.joinDt}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniProfile;
