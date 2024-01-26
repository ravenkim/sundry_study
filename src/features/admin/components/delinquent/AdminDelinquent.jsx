import React from 'react';
import {useDispatch} from "react-redux";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import AdminDelinquentTable from "./AdminDelinquentTable.jsx";


const AdminDelinquent = () => {
        const dispatch = useDispatch();

    return (
       <div>


            <div className={'flex gap-[6px]'}>
                {/* todo 2차 기능 구현 예정*/}
                {/* 테이블 왼쪽에 select 추가후 버튼 누를시 메시지 입력 모달 */}
                <SSbutton
                    disabled = {true}
                >알림 보내기 (나중에 구현 일단 메타모스트로 연락하세요)</SSbutton>
            </div>

            <div>
                <AdminDelinquentTable/>
            </div>




        </div>
    );
};

export default AdminDelinquent;
