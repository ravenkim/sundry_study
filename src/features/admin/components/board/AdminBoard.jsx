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

                >보드 추가</SSbutton>


                <SSbutton

                >새로고침</SSbutton>
                
                  <SSbutton

                >배치 순서 변경</SSbutton>


            </div>

            <div>
                <AdminBoardTable/>
            </div>






        </div>
    );
};

export default AdminBoard;
