import React, {useState} from 'react';
import {Modal} from "antd";

const AdminMemberAddModal = ({
    setModalVisible,
    modalVisible
                             }) => {


    const [modalOpen, setModalOpen] = useState(false)


    const addHandler = () => {
        
        console.log('추가됨')
        setModalVisible(false)
    }

    const cancelHandler = () => {
        setModalVisible(false)
         console.log('취소됨')
    }



    return (
            <Modal
                title="사용자 추가"
                open={modalVisible}
                onOk={addHandler}
                onCancel={cancelHandler}
                okText="추가하기"
                cancelText="취소"
                width={800}
            >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
            </Modal>
    );
};

export default AdminMemberAddModal;
