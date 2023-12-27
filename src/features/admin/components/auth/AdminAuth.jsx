import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "/src/common/components/table/SStable.jsx";
import {adminAction} from "../../adminReducer.jsx";

const AdminAuth = () => {

    const dispatch = useDispatch();


      const {
        authListData,

    } = useSelector(({adminReducer}) => ({
            authListData: adminReducer.authList.data?.authenticationList,
        }),
        shallowEqual
    )


    useEffect(() => {
        dispatch(adminAction.getAuthList())
    }, []);

    const columns = [
        {
              title: 'id',
              dataIndex: 'authId',

        },
        {
              title: '권한',
              dataIndex: 'authNm',

        },
    ]


    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        if(authListData) setDataSource(authListData)
    }, [authListData]);


    return (
        <div>
            <SStable
                useIndex={true}
                dataSource = {dataSource}
                columns = {columns}
            />

        </div>
    );
};

export default AdminAuth;


