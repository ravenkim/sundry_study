import React from 'react';
import {useDispatch} from "react-redux";
import SStable from "/src/common/components/table/SStable.jsx";

const AdminAuth = () => {

    const dispatch = useDispatch();

    const columns = [
        {
              title: '이름',
              dataIndex: 'name',
              width: '30%',
              searchAllow : true

        },
        {
              title: '팀',
              dataIndex: 'team',
              width: '30%',

        },
        {
              title: '나이',
              dataIndex: 'age',
              width: '30%',

        }
    ]



    const dataSource = [
     {
        name: '해준Raven',
        team: 'front',
        age: 27,
    },
    {
        name: '민교',
        team: 'back',
        age: '??',
    },
    {
        name: '찬민',
        team: 'front',
        age: '28',
    },
    {
        name: '소현',
        team: 'back',
        age: 28,
    },
    {
        name: '효진',
        team: 'back',
        age: 23,
    },
]

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


