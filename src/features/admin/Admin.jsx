import React from 'react';
import SSwrapper from "../../common/components/wrapper/SSwrapper.jsx";
import {Divider, Tabs} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {adminAction} from "./adminReducer.jsx";

const Admin = () => {

    const dispatch = useDispatch();

    const {
        activeTab

    } = useSelector(({adminReducer}) => ({
            activeTab: adminReducer.tab
        }),
        shallowEqual
    )


    return (
        <SSwrapper

            className={'w-2/3 p-[30px] box-border'}

        >
            <div>
                네임테그 들어가는곳
            </div>

            <Divider/>

            <Tabs
                type="card"
                size={'small'}
                activeKey={activeTab}
                onChange={(activeKey) => dispatch(adminAction.setTab(activeKey))}
                items={[
                    {
                        label: `회원 관리`,
                        key: `member`,
                        children: `member`,
                    },
                    {
                        label: `보드 관리`,
                        key: `board`,
                        children: `board`,
                    },
                    {
                        label: `연체자 관리`,
                        key: `delinquent`,
                        children: `delinquent`,

                    },
                    {
                        label: `권한 관리`,
                        key: `auth`,
                        children: `auth`,

                    }
                ]}
            />

        </SSwrapper>
    );
};

export default Admin;
