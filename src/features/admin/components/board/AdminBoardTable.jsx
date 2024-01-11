import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {adminAction} from "../../adminReducer.jsx";
import showMessage from "../../../../common/components/notice/notice.js";

const AdminBoardTable = () => {

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


    const [boardList, setBoardList] = useState([])

    useEffect(() => {
        if (boardListData) setBoardList(boardListData)
    }, [boardListData]);


    useEffect(() => {
        if(setBoardPrioritiesStatus){
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

    ]





    return (
        <SStable
            columns={columns}
            dataSource={boardList}
        >

        </SStable>
    );
};

export default AdminBoardTable;
