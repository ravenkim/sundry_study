import React, {useEffect, useState} from 'react';
import SSbutton from "/src/common/components/button/SSbutton.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";
import {profileAction} from "/src/features/profile/profileReducer.jsx";
import {Avatar, Space, Tag} from 'antd';
import {CloseCircleOutlined, LeftCircleOutlined, RightCircleOutlined, UserOutlined} from '@ant-design/icons';
import {adminAction} from "src/features/admin/adminReducer.jsx";
import SStext from "src/common/components/text/SStext.jsx";
import CheckModal from "../../modal/CheckModal.js";

const MiniProfile = () => {
    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        notificationsData,
        postNotiId

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            notificationsData: profileReducer.notifications.data,
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

                    {userProfileImg == null
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
                <div
                    className={'mt-[50px] w-auto flex-auto max-w-[300px] mb-[20px] overflow-auto ' + (open ? 'pl-[20px] ' : ' ')}>

                    {notificationsData?.notiList && notificationsData.notiList.length > 0 ? (
                        <div
                            className={'flex flex-col gap-[6px] overflow-hidden overflow-y-auto box-border px-[4px] transition-all duration-300 pb-[6px] ' + (open ? ' w-full opacity-100 visible' : ' w-0 opacity-0 hidden')}>
                            {notificationsData.notiList.filter(item => !deletedNotiIds.includes(item.notiId)) // 삭제된 알림 필터링
                                .map((item) => (
                                <Tag
                                    closeIcon={<CloseCircleOutlined/>}
                                    onClose={() => log(item.notiId)}
                                    className={'bg-white w-full mx-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] flex flex-row gap-[8px] box-border p-[6px]'}
                                    key={item.notiId}
                                >
                                    <div
                                        className={'flex flex-row w-full justify-between gap-[8px] flex-wrap flex-auto'}>
                                        <div className={'text-wrap w-full'}>
                                            {user?.userNm}님! 알림이 도착했어요.
                                            <br/>
                                            <SStext
                                                className={'w-full text-wrap text-ellipsis break-all font-[NotoSansKR-700]'}>
                                                {item.notiContent}
                                            </SStext>
                                        </div>
                                        <div className={'flex-auto h-fit'}>
                                            {item.joinDt}
                                        </div>
                                    </div>
                                </Tag>
                            ))}
                        </div>
                    ) : (
                        <div
                            className={'flex flex-col gap-[6px] overflow-hidden overflow-y-auto box-border px-[4px] transition-all duration-300 pb-[6px] justify-center items-center h-full w-full ' + (open ? ' w-full opacity-100 visible' : ' w-0 opacity-0 hidden')}>
                            <div
                                className={'box-border bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] p-[6px] px-[20px] rounded-[5px] w-full mb-[30px]'}>
                                알림이 없습니다.
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MiniProfile;
