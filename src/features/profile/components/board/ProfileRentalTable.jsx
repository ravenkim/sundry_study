import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {adminAction} from "../../../admin/adminReducer.jsx";
import {getBoardList} from "../../../admin/adminAPI.jsx";
import {profileAction} from "../../profileReducer.jsx";
import {postBoardRentals, putBoardRentalsReturn} from "../../profileAPI.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";

const ProfileRentalTable = () => {

    // post 요청으로 userId 값을 보내면 리턴으로 테이블에 대한 값이 옴


    const dispatch = useDispatch()

    const {

        BoardRentals,
        fullUserInfo,
        BoardRentalsReturn

    } = useSelector(({profileReducer}) => ({
            BoardRentals: profileReducer.BoardRentals.data,
            fullUserInfo: profileReducer.fullUserInfo.data,
            // 보드 post 요청으로 유저정보 넘겨주고 리턴값으로 보드 정보 가져오기
            BoardRentalsReturn: profileReducer.RentalsReturn.data,
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


    useEffect(() => {
        dispatch(profileAction.getFullUserInfo())

        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);

    useEffect(() => {
        if (BoardRentals) {
            setBoardList(BoardRentals?.rentalInfo)
        } // 강의 데이터 받아오기에 성공하면 테이블에 강의에 대한 데이터 넣기
    }, [BoardRentals]);

    useEffect(() => {
    }, [boardList]);

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
        {
            title: '상태변경',
            dataIndex: 'rentalStatNm',
            render: (text, record, value) => (
                <>
                    {BoardRentals?.rentalInfo[value]?.rentalStatNm === '반납' ? (
                        <>
                            <SSbutton
                                onClick={() => {
                                    dispatch(profileAction.putBoardRentalsReturn({
                                        contentId: BoardRentals?.rentalInfo[value]?.contentId,
                                        userId: fullUserInfo?.userInfo?.userId
                                    })) // 반납 기능 구현 완료

                                }}
                                className={'mr-[6px]'}
                                disabled={true}
                            >반납</SSbutton>
                            <SSbutton
                                onClick={() =>
                                    console.log('bb')
                                    /*dispatch(adminAction.resetProfile({userId: value}))*/
                                }
                                disabled={true}
                            >연체</SSbutton>
                        </>
                    ) : (
                        <>
                            <SSbutton
                                onClick={() => {
                                    dispatch(profileAction.putBoardRentalsReturn({
                                        contentId: BoardRentals?.rentalInfo[value]?.contentId,
                                        userId: fullUserInfo?.userInfo?.userId
                                    })) // 반납 기능 구현 완료

                                }}
                                className={'mr-[6px]'}
                                type={'primary'}
                            >반납</SSbutton>
                            <SSbutton
                                onClick={() =>
                                    console.log('bb')
                                    /*dispatch(adminAction.resetProfile({userId: value}))*/
                                }
                                type={'primary'}
                            >연체</SSbutton>
                        </>
                    )
                    }

                </>
            )
        }, // 상태변경 버튼 추가

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
