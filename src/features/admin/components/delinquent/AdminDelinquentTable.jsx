import React from 'react';

import {useDispatch} from "react-redux";

const AdminDelinquentTable = () => {

         const dispatch = useDispatch()



        const columns = [
        {
            title: '이름',
            dataIndex: 'userNm',

        },


    ]




    return (
        <div>
            
        </div>
    );
};

export default AdminDelinquentTable;
