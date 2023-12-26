import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {adminAction} from "../../../admin/adminReducer.jsx";
import {getBoardList} from "../../../admin/adminAPI.jsx";

const ProfileBoardTable = () => {

    // post 요청으로 userId 값을 보내면 리턴으로 테이블에 대한 값이 옴


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

export default ProfileBoardTable;
