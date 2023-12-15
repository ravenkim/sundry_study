import React from 'react';
import {useDispatch} from "react-redux";
import SSsectionWrap from "../../../../common/components/wrapper/SSsectionWrap.jsx";
import SStable from "../../../../common/components/table/SStable.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import SStitleLabel from "../../../../common/components/label/SStitleLabel.jsx";

const AdminMember = () => {
    const dispatch = useDispatch();



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

            </div>


        </div>
    );
};

export default AdminMember;
