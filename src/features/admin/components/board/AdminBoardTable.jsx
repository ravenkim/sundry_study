import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {adminAction} from "src/features/admin/adminReducer.jsx";
import showMessage from "src/common/components/notice/notice.js";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import AdminBoardImageEditModal from "./AdminBoardImageEditModal.jsx";

const AdminBoardTable = ({

                         }) => {

    const dispatch = useDispatch()

    const {
        boardListData,
        setBoardPrioritiesStatus
    } = useSelector(({adminReducer}) => ({
            boardListData: adminReducer.boardList.data?.boardList,
            setBoardPrioritiesStatus: adminReducer.setBoardPrioritiesStatus.data

        }),
        shallowEqual
    );

    const [boardImageModalVisible, setBoardImageModalVisible] = useState(false)
    const [rowInfo, setRowInfo] = useState({})


    const [boardList, setBoardList] = useState([])

    useEffect(() => {
        if (boardListData) setBoardList(boardListData)
    }, [boardListData]);


    useEffect(() => {
        if (setBoardPrioritiesStatus) {
            if (setBoardPrioritiesStatus.res) {
                showMessage('success', setBoardPrioritiesStatus.msg)
            } else {
                showMessage('error', setBoardPrioritiesStatus.msg)
            }
            dispatch(adminAction.getBoardList())
            dispatch(adminAction.initialize('setBoardPrioritiesStatus'))
        }
    }, [setBoardPrioritiesStatus]);


    useEffect(() => {
        dispatch(adminAction.getBoardList())
    }, []);



    const columns = [
        {
            title: '순서',
            dataIndex: 'boardSn',
        },
        {
            title: '이름',
            dataIndex: 'boardNm',
        },
        {
            title: '생성일',
            dataIndex: 'regDt',
        },
        {
            title: '게시물 수',
            dataIndex: 'contentNum',
        },
        {
            title: '상태',
            dataIndex: 'boardStat',
        },
        {
            title: '이미지 수정',
            dataIndex: 'boardId',
            render: (text, record, index) =>
                <SSbutton
                    onClick={() => {
                        setRowInfo(record)
                        setBoardImageModalVisible(true)
                    }}
                >
                    이미지 수정하기
                </SSbutton>
        },

    ]




    return (
        <>
            <SStable
                columns={columns}
                dataSource={boardList}
            >

            </SStable>


            <AdminBoardImageEditModal
                setBoardImageModalVisible = {setBoardImageModalVisible}
                boardImageModalVisible={boardImageModalVisible}
                rowInfo = {rowInfo}
            />
        </>

    );
};

export default AdminBoardTable;
