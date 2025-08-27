import React, {useEffect} from 'react';
import SSmodal from "src/common/components/modal/SSmodal.jsx";

const AdminBoardImageEditModal = ({
                                      rowInfo,
    boardImageModalVisible,
    setBoardImageModalVisible
                                  }) => {


    const onCancel = () => {
        //비지블 false
        setBoardImageModalVisible(false)

        //데이터 초기화
    }

    useEffect(() => {
        if(rowInfo){
            !(rowInfo?.boardNm) && setBoardImageModalVisible(false)
        }
    }, [rowInfo]);


    return (
        <SSmodal
            title={rowInfo?.boardNm}
            visible={boardImageModalVisible}
            onCancel={onCancel}
            okText={'이미지 변경'}
            cancelText={'취소'}
        >
            <div>
                기존 이미지
            </div>

            <div>
                이미지 추가
            </div>

        </SSmodal>
    );
};

export default AdminBoardImageEditModal;
