import React, {useState} from 'react';
import {Modal} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSorderDragTable from "../../../../common/components/table/SSorderDragTable.jsx";
import {adminAction} from "../../adminReducer.jsx";

const AdminBoardOrderModal = ({
                                  setModalVisible,
                                  modalVisible
                              }) => {

        const dispatch = useDispatch()



    const {
        boardListData

    } = useSelector(({adminReducer}) => ({
            boardListData: adminReducer.boardList.data?.boardList

        }),
        shallowEqual
    )


    const cancelHandler = () => {
        setModalVisible(false)
        //창 닫을시 값 초기화
    }


    const [finalData, setFinalData] = useState([])


    const submitHandler = () => {
        dispatch(adminAction.setBoardPriorities(finalData))
        setModalVisible(false)
    }


    const columns = [
        {
            title: '이전 순서',
            dataIndex: 'boardSn',
        },
        {
            title: '이름',
            dataIndex: 'boardNm',
        },
        {
            title: '상태',
            dataIndex: 'boardStat',
        },

    ]



    return (
        <Modal
            title={<h1>보드 순서 변경</h1>}
            open={modalVisible}
            onOk={submitHandler}
            onCancel={cancelHandler}
            okText="순서 변경"
            cancelText="취소"
        >
            <SSorderDragTable
                columns={columns}
                reset={modalVisible}
                data={boardListData}
                setFinalData={setFinalData}
            />

        </Modal>
    );
};

export default AdminBoardOrderModal;
