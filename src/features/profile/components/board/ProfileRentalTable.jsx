import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SStable from "src/common/components/table/SStable.jsx";
import {profileAction} from "src/features/profile/profileReducer.jsx";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import CheckModal from "src/common/components/modal/CheckModal.js";
import Swal from "sweetalert2/src/sweetalert2.js";
import 'sweetalert2/src/sweetalert2.scss';
import {Spin} from "antd";

const ProfileRentalTable = () => {

    // post 요청으로 userId 값을 보내면 리턴으로 테이블에 대한 값이 옴
    const dispatch = useDispatch()

    const {
        BoardRentals,
        fullUserInfo,
        BoardRentalsReturn,
        userDataLoading
    } = useSelector(({profileReducer}) => ({
            BoardRentals: profileReducer.BoardRentals.data,
            fullUserInfo: profileReducer.fullUserInfo.data,
            BoardRentalsReturn: profileReducer.RentalsReturn,
            userDataLoading: profileReducer.fullUserInfo.loading
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
        setBoardList(BoardRentals?.rentalInfo)
    }, [boardList, BoardRentals?.rentalInfo?.rentalStatNm]);
    // 데이터 변경되면 다시 집어넣기

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
                        <div className={'flex flex-row '}>
                            <SSbutton
                                className={'mr-[6px]'}
                                disabled={true}
                            >반납</SSbutton>
                        </div>
                    ) : (
                        <div className={'flex flex-row '}>
                            <SSbutton
                                onClick={() => {
                                    CheckModal('정말 반납하시겠어요?', '', 'question', function () {
                                        dispatch(profileAction.putBoardRentalsReturn({
                                            contentId: BoardRentals?.rentalInfo[value]?.contentId,
                                            userId: fullUserInfo?.userInfo?.userId
                                        }));
                                        /*if (BoardRentalsReturn) {
                                            if (BoardRentalsReturn.res) {
                                                Swal.fire({
                                                    title: '반납에 성공했어요!',
                                                    icon: 'success',
                                                })
                                            } else {
                                                Swal.fire({
                                                    title: '알 수 없는 오류로 반납에 실패했어요.',
                                                    icon: 'error',
                                                })
                                            }
                                        }*/ // --> put 성공 시 res값을 돌려주지 않는 상태이다. 요청할 것

                                        if(BoardRentalsReturn) {
                                            if(BoardRentalsReturn.loading !== true && BoardRentalsReturn.data === true) {
                                                Swal.fire({
                                                    title: '반납에 성공했어요!',
                                                    icon: 'success',
                                                })
                                            } else {
                                                Swal.fire({
                                                    title: '알 수 없는 오류로 반납에 실패했어요.',
                                                    icon: 'error',
                                                })
                                            }
                                        }
                                    }, `문의사항이 있으면 언제든지 알려주세요.<br/> 최대한 빠르게 확인할게요! :)`)
                                }}
                                className={'mr-[6px]'}
                                type={'primary'}
                            >반납</SSbutton>
                        </div>
                    )
                    }

                </>
            )
        }, // 상태변경 버튼 추가

    ]


    return (<>
            <Spin
                spinning={userDataLoading}
            >
                <SStable
                    columns={columns}
                    dataSource={boardList}
                    useIndex={true}
                >

                </SStable>
            </Spin>
        </>
    );
};

export default ProfileRentalTable;
