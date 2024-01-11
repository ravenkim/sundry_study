import React, {useEffect} from 'react';
import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {Tabs} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {adminAction} from "./adminReducer.jsx";
import AdminMember from "./components/member/AdminMember.jsx";
import AdminBoard from "./components/board/AdminBoard.jsx";
import AdminDelinquent from "./components/delinquent/AdminDelinquent.jsx";
import AdminAuth from "./components/auth/AdminAuth.jsx";

const Admin = () => {

    const dispatch = useDispatch();

    const {
        activeTab

    } = useSelector(({adminReducer}) => ({
            activeTab: adminReducer.tab
        }),
        shallowEqual
    )


    useEffect(() => {
        if(!activeTab)
            dispatch(adminAction.setTab("member"))
    }, []);








    return (
        <SSwrapper
            className={'w-2/3 p-[30px] box-border'}
        >




            <Tabs
                type=""
                size={'small'}
                activeKey={activeTab}
                onChange={(activeKey) => dispatch(adminAction.setTab(activeKey))}
                rootClassName={'border-t-[1px] border-solid border-t-[#111321] box-border '}
                items={[
                    {
                        label: `회원 관리`,
                        key: `member`,
                        children: <AdminMember/>,
                    },
                    {
                        label: `보드 관리`,
                        key: `board`,
                        children: <AdminBoard/>,
                    },
                    {
                        label: `연체자 관리`,
                        key: `delinquent`,
                        children: <AdminDelinquent/>,

                    },
                    {
                        label: `권한 관리`,
                        key: `auth`,
                        children: <AdminAuth/>,

                    }
                ]}
            />

        </SSwrapper>
    );
};

export default Admin;
