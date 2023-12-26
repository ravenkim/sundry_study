import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import SSeditor from "../../../../common/components/editor/SSeditor.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import AdminMemberTable from "../member/AdminMemberTable.jsx";
import AdminMemberAddModal from "../member/AdminMemberAddModal.jsx";
import AdminBoardTable from "./AdminBoardTable.jsx";
import AdminBoardOrderModal from "./AdminBoardOrderModal.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    const [orderModalVisible, setOrderModalVisible] = useState(false)


    return (
        <div>


            <div>
                <SSbutton

                >보드 추가</SSbutton>


                <SSbutton

                >새로고침</SSbutton>

                <SSbutton
                    onClick={() => {
                        setOrderModalVisible(true)
                    }}
                >배치 순서 변경</SSbutton>


            </div>

            <div>
                <AdminBoardTable/>
            </div>


            <AdminBoardOrderModal
                modalVisible={orderModalVisible}
                setModalVisible={setOrderModalVisible}
            />


        </div>
    );
};

export default AdminBoard;
