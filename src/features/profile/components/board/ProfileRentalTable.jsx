import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {adminAction} from "../../../admin/adminReducer.jsx";
import {getBoardList} from "../../../admin/adminAPI.jsx";
import {profileAction} from "../../profileReducer.jsx";
import {postBoardRentals} from "../../profileAPI.jsx";

const ProfileRentalTable = () => {

    // post 요청으로 userId 값을 보내면 리턴으로 테이블에 대한 값이 옴


    const dispatch = useDispatch()

    const {

        BoardRentals,
        fullUserInfo,
    } = useSelector(({profileReducer}) => ({
            BoardRentals: profileReducer.BoardRentals.data,
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
            dispatch(profileAction.postBoardRentals({userId: userIdString}))
            // 유저 키값 보내서 해당 유저에 대한 데이터 받아오기
        }
    }, [fullUserInfo]);

    /*const onClickAction = () => {

        if (userData) {
            dispatch(profileAction.postBoardRentals({
                userId: userData
            }));
        }
    }*/

    useEffect(() => {
        dispatch(profileAction.getFullUserInfo())
    }, []);

    useEffect(() => {
        if(BoardRentals) {
                setBoardList(BoardRentals?.rentalInfo)
            } // 강의 데이터 받아오기에 성공하면 테이블에 강의에 대한 데이터 넣기
    }, [BoardRentals]);

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
            title: '대여일',
            dataIndex: 'rentalDt',
        },
        {
            title: '반납예정일',
            dataIndex: 'predReturnDt',
        },
        {
            title: '대여상태',
            dataIndex: 'rentalStatNm',
        },
        /*{
            title: '상태변경',
            dataIndex: 'rentalStatNm',
            render: (text, record, value) => (
                <SSbutton
                    onClick={() =>
                        dispatch(adminAction.resetProfile({userId: value}))
                    }
                >삭제</SSbutton>
            )
        },*/ // 상태변경 버튼 추가

    ]


    return (<>
            <SStable
                columns={columns}
                dataSource={boardList}
                useIndex={true}
            >

            </SStable>
        </>
    );
};

export default ProfileRentalTable;
