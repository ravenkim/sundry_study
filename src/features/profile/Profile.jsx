import React, {useEffect} from 'react';
import SSsectionWrap from "src/common/components/wrapper/SSsectionWrap.jsx";
import SSwrapper from "src/common/components/wrapper/SSwrapper.jsx";
import {Avatar, Space, Tabs} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import UserInfo from "src/features/profile/components/UserInfo.jsx";
import LikesInfo from "src/features/profile/components/LikesInfo.jsx";
import RentalsInfo from "src/features/profile/components/RentalsInfo.jsx";
import ReservationsInfo from "src/features/profile/components/ReservationsInfo.jsx";
import {profileAction} from "src/features/profile/profileReducer.jsx";

import {UserOutlined} from '@ant-design/icons';
import {adminAction} from "src/features/admin/adminReducer.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";


const Profile = () => {

    const dispatch = useDispatch()

    const {
        activeTab,
        userProfileImg,
        user,

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            activeTab: profileReducer.tab,
            userProfileImg: userReducer.userProfileImg.data,

        }),
        shallowEqual
    )

    useEffect(() => {
        //유저 프로필 정보 들고오기
        dispatch(profileAction.getFullUserInfo())

        //탭설정
        if (!activeTab) dispatch(profileAction.setTab("userInfo"))

        return () => {
            dispatch(profileAction.initializeAll())
        }
    }, [])





    return (
        <>
            <SSsectionWrap>
                <SSwrapper className={'w-full m-[0] bg-[#f5f5f5] bg-opacity-50 p-[16px] h-full'}>
                    <div className={'flex pb-[16px] items-center gap-[20px]'}>
                        {userProfileImg === false ? <Space wrap size={80}>
                            <Avatar size={80} icon={<UserOutlined/>}/>
                        </Space> : <img src={userProfileImg} alt="#" className={'rounded-full w-[80px] h-full max-w-[80px] max-h-[80px]'}/>}


                        <h2>{user.userNm}님, 어서오세요!</h2>
                    </div>
                    <Tabs
                        type=""
                        size={'small'}
                        activeKey={activeTab}
                        onChange={(activeKey) => dispatch(profileAction.setTab(activeKey))}
                        items={[
                            {
                                label: `회원 정보`,
                                key: `userInfo`,
                                children: <UserInfo/>,
                            },
                            {
                                label: `대여 목록`,
                                key: `rentalsInfo`,
                                children: <RentalsInfo/>,
                            },
                            {
                                label: `관심 목록`,
                                key: `likesInfo`,
                                children: <LikesInfo/>,

                            },
                            {
                                label: `예약 목록`,
                                key: `reservationsInfo`,
                                children: <ReservationsInfo/>,

                            }
                        ]}
                        rootClassName={'border-t-[1px] border-solid border-t-[#111321] box-border '}
                    />
                </SSwrapper>
            </SSsectionWrap>
        </>
    )
}

export default Profile
