import React, {useEffect, useState} from 'react';
import SSsectionWrap from "../../common/components/wrapper/SSsectionWrap.jsx";
import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {Divider, Tabs} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import UserInfo from "./components/UserInfo.jsx";
import LikesInfo from "./components/LikesInfo.jsx";
import RentalsInfo from "./components/RentalsInfo.jsx";
import ReservationsInfo from "./components/ReservationsInfo.jsx";
import {profileAction} from "./profileReducer.jsx";

import {UserOutlined} from '@ant-design/icons';
import {Avatar, Space} from 'antd';
import {adminAction} from "../admin/adminReducer.jsx";


const Profile = () => {

    const dispatch = useDispatch()

    const {
        activeTab,
        userProfileImg,
        user,

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            activeTab: profileReducer.tab,
            userProfileImg: profileReducer.userProfileImg.data,

        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserProfileImg())
        if (!activeTab) dispatch(profileAction.setTab("userInfo"))

        return () => {
            dispatch(profileAction.initializeAll())

            // 페이지 나가면 초기화
        }
    }, [])


    return (
        <>
            <SSsectionWrap>
                <SSwrapper className={'w-full m-[0] bg-[#f5f5f5] bg-opacity-50 p-[16px] h-full'}>
                    <div className={'flex pb-[16px] items-center gap-[20px]'}>
                        {/*<img src="" alt="#" className={'desktop:max-w-[80px] desktop:max-h-[80px]'}/>*/}
                        {userProfileImg == null ? <Space wrap size={80}>
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
