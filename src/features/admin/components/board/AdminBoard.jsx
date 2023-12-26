import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import AdminBoardTable from "./AdminBoardTable.jsx";
import AdminBoardOrderModal from "./AdminBoardOrderModal.jsx";
import {adminAction} from "../../adminReducer.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    const [orderModalVisible, setOrderModalVisible] = useState(false)


    return (
        <div>


            <div>
                <SSbutton
                    disabled ={true}
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


            <AdminBoardOrderModal
                modalVisible={orderModalVisible}
                setModalVisible={setOrderModalVisible}
            />


        </div>
    );
};

export default AdminBoard;
