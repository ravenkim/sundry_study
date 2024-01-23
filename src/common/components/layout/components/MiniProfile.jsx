import React, {useEffect, useState} from 'react';
import SSbutton from "/src/common/components/button/SSbutton.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";
import {profileAction} from "/src/features/profile/profileReducer.jsx";
import {Avatar, Space} from 'antd';
import {LeftCircleOutlined, RightCircleOutlined, UserOutlined} from '@ant-design/icons';
import {adminAction} from "src/features/admin/adminReducer.jsx";
import CheckModal from "../../modal/CheckModal.js";
import NotiDataList from "./notice/NotiDataList.jsx";

const MiniProfile = () => {
    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        postNotiId

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            postNotiId: profileReducer.notiIds,
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserNotifications());
        dispatch(profileAction.getUserProfileImg());

        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);

    const [deletedNotiIds, setDeletedNotiIds] = useState([])

    useEffect(() => {
        if (postNotiId.loading) {
            dispatch(profileAction.getUserNotifications());
        }
    }, [postNotiId]);

    const log = (itemsNotiId) => {
        // 리스트를 제거해야 하는지 보이지 않게만 해야 하는지 확인 후 작업 진행
        // 논리적 제거로 진행중
        // post /notifications/update -> 미확인에서 확인으로 변경
        // {notiId : 1}
        CheckModal('정말 알림을 삭제하시겠어요?', '', 'warning', function () {
            dispatch(profileAction.postUserNotifications({notiId: itemsNotiId}))
            setDeletedNotiIds([...deletedNotiIds, itemsNotiId]);

        }, `문의사항이 있으면 언제든지 알려주세요.<br/> 최대한 빠르게 확인할게요! :)`)
    };

    const [open, setOpen] = useState(false);

    return (
        <div
            className={' tablet:right-[23px] text-[#000000] rounded-[10px] overflow-visible box-border w-[calc(100%-40px)] tablet:w-fit tablet:min-w-[400px] desktop:min-w-[300px] z-[90] bg-[#ffffff] '}
        >

            <div
                className={'relative w-full flex flex-col justify-center items-center bg-[#5565F6] bg-opacity-60 p-[20px] rounded-t-[10px] '}>
                <h4 className={'text-[#ffffff] pb-[50px]'}>{user?.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()}</h4>
                <div
                    className={'absolute rounded-full overflow-hidden border-[#ffffff] border-2 box-border border-solid -bottom-1/2 -translate-y-1/2 cursor-pointer bg-white'}>

                    {userProfileImg === false
                        ? <Space direction='vertical' wrap size={63} onClick={() => {
                            dispatch(push('/profile'))
                        }}>
                            <Avatar size={63} icon={<UserOutlined/>}/>
                        </Space>
                        : <img src={userProfileImg} alt="#" className={'max-w-[63px] h-auto'}
                               onClick={() => {
                                   dispatch(push('/profile'))
                               }}
                        />
                    }
                </div>
            </div>
            <div className={'flex flex-row-reverse relative overflow-visible w-full max-h-[340px]'}>
                <div className={'w-full desktop:min-w-[300px] max-w-[300px]'}>
                    <div className={'p-[20px] pt-[50px] flex flex-col justify-center items-center gap-[8px]'}>
                        <div className={'flex justify-center items-center flex-col mb-[20px]'}>
                            <h5>{user?.userNm}</h5>
                            <h5>{user?.userEmail}</h5>
                        </div>
                        <SSbutton onClick={() => {
                            dispatch(push('/profile'))
                            dispatch(profileAction.setTab('userInfo'))
                        }}
                                  className={'w-full'}
                        >
                            내 정보 수정
                        </SSbutton>

                        <SSbutton onClick={() => {
                            /*관심목록으로 이동*/
                            dispatch(push('/profile'))
                            dispatch(profileAction.setTab('likesInfo'))

                        }}
                                  className={'w-full'}
                        >
                            관심 목록
                        </SSbutton>

                        <SSbutton onClick={() => {
                            dispatch(push('/profile'))
                            dispatch(profileAction.setTab('rentalsInfo'))
                            /*대여 목록으로 이동*/
                        }}
                                  className={'w-full'}
                        >
                            대여 목록
                        </SSbutton>

                        {user.priority <= 4 &&
                            <SSbutton onClick={() => {
                                dispatch(push('/admin'))
                                dispatch(adminAction.setTab('member'))
                            }}
                                      className={'w-full'}
                            >
                                관리자 페이지로 이동
                            </SSbutton>
                        }

                        <SSbutton danger className={'w-full'} onClick={() => {
                            dispatch(userAction.logout())
                        }}>로그아웃</SSbutton>


                    </div>
                </div>
                <div className={'absolute -left-[10px] w-[30px] h-auto z-2 top-1/2 bg-[#ffffff] rounded-full'}
                     onClick={() => setOpen(!open)}>
                    {!open ? < LeftCircleOutlined className={'w-full cursor-pointer'} style={{fontSize: '20px'}}/> :
                        <RightCircleOutlined className={'w-full cursor-pointer'} style={{fontSize: '20px'}}/>}
                </div>

                <NotiDataList deletedNotiIds={deletedNotiIds} open={open}/>

            </div>
        </div>
    );
};

export default MiniProfile;
