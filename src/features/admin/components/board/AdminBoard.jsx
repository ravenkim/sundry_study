import React from 'react';
import {useDispatch} from "react-redux";
import SSeditor from "../../../../common/components/editor/SSeditor.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import AdminMemberTable from "../member/AdminMemberTable.jsx";
import AdminMemberAddModal from "../member/AdminMemberAddModal.jsx";
import AdminBoardTable from "./AdminBoardTable.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    return (
            <div>


            <div>
                <SSbutton

                >회원 추가</SSbutton>


                {/* todo 2차 기능 구현 예정*/}
                {/* 테이블 왼쪽에 select 추가후 버튼 누를시 메시지 입력 모달 */}
                <SSbutton
                    disabled = {true}
                >알림 보내기</SSbutton>
            </div>

            <div>
                <AdminBoardTable/>
            </div>






        </div>
    );
};

export default AdminBoard;
