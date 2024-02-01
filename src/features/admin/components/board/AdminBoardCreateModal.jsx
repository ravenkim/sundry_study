import React, {useEffect, useRef} from 'react';
import SSmodal from "src/common/components/modal/SSmodal.jsx";
import {Carousel} from 'antd';
import {CaretLeftOutlined, CaretRightOutlined, RightOutlined, RightSquareTwoTone} from "@ant-design/icons";


const AdminBoardCreateModal = ({
    modalVisible,
    setModalVisible
}) => {


    const onCancel = () => {
        //비지블 false
        setModalVisible(false)

        //데이터 초기화

    }


    const onOk = () => {

    }

    return (
        <SSmodal
            title={'보드 생성'}
            visible={modalVisible}
            onCancel={onCancel}
            onOk={onOk}
            okText={'Board 생성'}
            width={'1200px'}
            cancelText={'취소'}

        >



        </SSmodal>
    );
};

export default AdminBoardCreateModal;
