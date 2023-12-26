import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {getBoardList} from "../../adminAPI.jsx";
import {adminAction} from "../../adminReducer.jsx";

const AdminBoardTable = () => {

    const dispatch = useDispatch()

    const {
        boardListData
    } = useSelector(({adminReducer}) => ({
            boardListData: adminReducer.boardList.data?.boardList

        }),
        shallowEqual
    );


    const [boardList, setBoardList] = useState([])

    useEffect(() => {
        if (boardListData) setBoardList(boardListData)
    }, [boardListData]);


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
            useIndex={true}
        >

        </SStable>
    );
};

export default AdminBoardTable;
