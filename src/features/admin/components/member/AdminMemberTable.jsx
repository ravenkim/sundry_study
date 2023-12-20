import React, {useEffect, useState} from 'react';
import SStable from "src/common/components/table/SStable.jsx";
import {removeRole} from "src/common/utils/redux/dataProcessingUtils.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {adminAction} from "../../adminReducer.jsx";
import {Spin} from 'antd';

const AdminMemberTable = () => {
    const dispatch = useDispatch()
    const {
        usersData,
        usersDataLoading
    } = useSelector(({adminReducer}) => ({
            usersData: removeRole(adminReducer.users.data),
            usersDataLoading: adminReducer.users.loading
        }),
        shallowEqual
    );


    useEffect(() => {
        dispatch(adminAction.getUsers())
        
    }, []);


    const columns = [
        {
            title: '이름',
            dataIndex: 'userNm',
        },
        {
            title: '이메일',
            dataIndex: 'userEmail',
        },
        {
            title: '가입일',
            dataIndex: 'joinDt',
        },
        {
            title: '권한',
            dataIndex: 'authNm',
        },
        {
            title: '재직 상태',
            dataIndex: 'userStat',
        }
    ]


    return (

        <Spin
            spinning={usersDataLoading}
        >
            <SStable
                columns={columns}
                dataSource={usersData}
            >

            </SStable></Spin>


    );
};

export default AdminMemberTable;
