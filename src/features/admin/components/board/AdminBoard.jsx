import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import AdminBoardTable from "./AdminBoardTable.jsx";
import AdminBoardOrderModal from "./AdminBoardOrderModal.jsx";
import {adminAction} from "src/features/admin/adminReducer.jsx";
import AdminBoardCreateModal from "src/features/admin/components/board/AdminBoardCreateModal.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const [boardCreateModalVisible, setBoardCreateModalVisible] = useState(false)

    return (
        <div>


            <div className={'flex gap-[6px]'}>
                <SSbutton
                    onClick={() => {
                        setBoardCreateModalVisible(true)
                    }}
                >보드 추가</SSbutton>


                <SSbutton
                    onClick={      () =>       dispatch(adminAction.getBoardList())
}
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


            
            {/*보드 추가*/}
            <AdminBoardCreateModal
                modalVisible = {boardCreateModalVisible}
                setModalVisible  = {setBoardCreateModalVisible}
            />
            
            
            {/* 보드 순서 변경*/}
            <AdminBoardOrderModal
                modalVisible={orderModalVisible}
                setModalVisible={setOrderModalVisible}
            />


        </div>
    );
};

export default AdminBoard;
