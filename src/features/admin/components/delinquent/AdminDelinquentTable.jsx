import React from 'react';

import {useDispatch} from "react-redux";
import SSorderDragTable from "../../../../common/components/table/SSorderDragTable.jsx";

const AdminDelinquentTable = () => {

         const dispatch = useDispatch()



        const columns = [
        {
            title: '이름',
            dataIndex: 'userNm',

        },


    ]




    return (
        <></>
    );
};

export default AdminDelinquentTable;
