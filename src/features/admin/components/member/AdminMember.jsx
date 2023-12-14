import React from 'react';
import {useDispatch} from "react-redux";
import SSsectionWrap from "../../../../common/components/wrapper/SSsectionWrap.jsx";
import SStable from "../../../../common/components/table/SStable.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import SStitleLabel from "../../../../common/components/label/SStitleLabel.jsx";

const AdminMember = () => {
    const dispatch = useDispatch();


    const columns = [
        {
            title: '이름',
            dataIndex: 'name',
            width: '30%',
            searchAllow: true

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
            <div>
                <SStitleLabel
                    title={'회원관리'}
                />
            </div>

            <div>
                <SSbutton>회원 추가</SSbutton>
                <SSbutton>알림 보내기</SSbutton>
            </div>

            <div>
                <SStable
                    dataSource = {dataSource}
                columns = {columns}
                />
            </div>


        </div>
    );
};

export default AdminMember;
