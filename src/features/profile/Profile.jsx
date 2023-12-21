import React, {useEffect} from 'react';
import SSsectionWrap from "../../common/components/wrapper/SSsectionWrap.jsx";
import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {adminAction} from "../admin/adminReducer.jsx";
import AdminMember from "../admin/components/member/AdminMember.jsx";
import AdminBoard from "../admin/components/board/AdminBoard.jsx";
import AdminDelinquent from "../admin/components/delinquent/AdminDelinquent.jsx";
import AdminAuth from "../admin/components/auth/AdminAuth.jsx";
import {Divider, Tabs} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import UserInfo from "./components/UserInfo.jsx";
import LikesInfo from "./components/LikesInfo.jsx";
import RentalsInfo from "./components/RentalsInfo.jsx";
import ReservationsInfo from "./components/ReservationsInfo.jsx";


const Profile = () => {

    const dispatch = useDispatch()

    const {
        activeTab

    } = useSelector(({adminReducer}) => ({
            activeTab: adminReducer.tab
        }),
        shallowEqual
    )

    useEffect(() => {
        if(!activeTab) dispatch(adminAction.setTab("userInfo"))

    },[])

    return (
        <>
            <SSsectionWrap>
                <SSwrapper className={'w-full m-[0] bg-[#f5f5f5] bg-opacity-50 p-[16px]'}>
                    <div className={'flex pb-[16px] '}>
                        <img src="" alt="#" className={'desktop:max-w-[80px] desktop:max-h-[80px]'}/>
                        <h2>님, 어서오세요!</h2>
                    </div>
                    <Tabs
                        type="card"
                        size={'small'}
                        activeKey={activeTab}
                        onChange={(activeKey) => dispatch(adminAction.setTab(activeKey))}
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
