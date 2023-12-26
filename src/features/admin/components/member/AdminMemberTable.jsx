import React, {useEffect, useState} from 'react';
import SStable from "src/common/components/table/SStable.jsx";
import {removeRole} from "src/common/utils/dataProcessingUtils.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {adminAction} from "../../adminReducer.jsx";
import {Spin} from 'antd';
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import showMessage from "../../../../common/components/notice/notice.js";

const AdminMemberTable = () => {
    const dispatch = useDispatch()
    const {
        users,
        usersDataLoading,
        resetPasswordStatus

    } = useSelector(({adminReducer}) => ({
            users: adminReducer.users.data?.userList,
            usersDataLoading: adminReducer.users.loading,
             resetPasswordStatus: adminReducer.resetPasswordStatus?.data
        }),
        shallowEqual
    );


    const [usersData, setUsersData] = useState()


    useEffect(() => {
        if(users)setUsersData(removeRole(users))
    }, [users]);



    //비밀번호 초기화 완료시
    useEffect(() => {
        if(resetPasswordStatus){
            if (resetPasswordStatus.res){
                showMessage('success', resetPasswordStatus.msg )
            } else {
                showMessage('error', resetPasswordStatus.msg )
            }
            dispatch(adminAction.initialize('resetPasswordStatus'))
        }
    }, [resetPasswordStatus]);





    useEffect(() => {
        dispatch(adminAction.getUsers())
        dispatch(adminAction.getAuthList())

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
            title: '전화번호',
            dataIndex: 'phoneNumber',
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
        },
        {
            title: '비밀번호',
            dataIndex: 'userId',
            render: (text, record, value) => (
                <SSbutton

                    onClick={ () =>
                        dispatch(adminAction.resetPassword({userId:value}))
                }
                >초기화</SSbutton>
            )
        }
    ]


    return (

        <Spin
            spinning={usersDataLoading}
        >
            <SStable
                columns={columns}
                dataSource={usersData}
                useIndex ={true}
            >

            </SStable>
        </Spin>


    );
};

export default AdminMemberTable;
