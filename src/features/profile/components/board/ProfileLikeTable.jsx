import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {profileAction} from "../../profileReducer.jsx";
import {postBoardLikes} from "../../profileAPI.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";

const ProfileLikeTable = () => {

    const dispatch = useDispatch()

    const {

        BoardLikes,
        fullUserInfo,
    } = useSelector(({profileReducer}) => ({
            BoardLikes: profileReducer.BoardLikes.data,
            fullUserInfo: profileReducer.fullUserInfo.data,
            // 보드 post 요청으로 유저정보 넘겨주고 리턴값으로 보드 정보 가져오기
        }),
        shallowEqual
    );

    const [boardList, setBoardList] = useState([])
    const [userData, setUserData] = useState('')

    useEffect(() => {
        if (fullUserInfo) {
            setUserData(JSON.stringify(fullUserInfo?.userInfo?.userId).trim())
            const userIdString = fullUserInfo?.userInfo?.userId;
            dispatch(profileAction.postBoardLikes({userId: userIdString}))
            // 유저 키값 보내서 해당 유저에 대한 데이터 받아오기
        }
    }, [fullUserInfo]);

    useEffect(() => {
        dispatch(profileAction.getFullUserInfo())

        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);

    useEffect(() => {
        if(BoardLikes) {
                setBoardList(BoardLikes?.likeList)
            } // 강의 데이터 받아오기에 성공하면 테이블에 강의에 대한 데이터 넣기
    }, [BoardLikes]);

    const columns = [
        {
            title: '카테고리',
            dataIndex: 'cateNm',
        },
        {
            title: '컨텐츠 제목',
            dataIndex: 'contentNm',
        },
        {
            title: '관심표시일',
            dataIndex: 'regDt',
        },
        {
            title: '대여상태',
            dataIndex: 'rentalStatNm',
        },
        {
            title: '상태변경',
            dataIndex: 'rentalStatNm',
            render: (text, record, value) => (
                <SSbutton
                    onClick={() =>
                        dispatch(profileAction.BoardLikesDelete({contentId: BoardLikes?.likeList[value]?.contentId}))
                        /*console.log('value = '+ value + 'text = '+ text + 'record ='+ record);*/
                    }
                    danger
                >삭제</SSbutton>
            )
        }, // 좋아요 취소 버튼 추가
        // put /likes/delete
        // {
        //   "contentId": 1
        // }

    ]

    return(
        <>
            <SStable
                columns={columns}
                dataSource={boardList}
                useIndex={true}
            >

            </SStable>
        </>
    )
}

export default ProfileLikeTable;
