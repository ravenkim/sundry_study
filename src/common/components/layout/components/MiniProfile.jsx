import React, {useEffect, useState} from 'react';
import SSbutton from "/src/common/components/button/SSbutton.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";
import {profileAction} from "/src/features/profile/profileReducer.jsx";
import {Avatar, Space, Tag} from 'antd';
import {
    CloseCircleOutlined,
    LeftCircleOutlined,
    RightCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import {adminAction} from "../../../../features/admin/adminReducer.jsx";
import SStext from "../../text/SStext.jsx";

const MiniProfile = () => {
    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        notificationsData

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            notificationsData: profileReducer.notifications.data
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserNotifications());
        dispatch(profileAction.getUserProfileImg());

        if (!notificationsData) dispatch(profileAction.getUserNotifications(null))
        if (!userProfileImg) dispatch(profileAction.getUserProfileImg(null))


        console.log('userProfileImg', userProfileImg)
        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);

    const log = (e) => {
        console.log(e);
        // 리스트를 제거해야 하는지 보이지 않게만 해야 하는지 확인 후 작업 진행
        // post /notifications/update -> 미확인에서 확인으로 변경
        // {notiId : 1}
    };

    const [open, setOpen] = useState(true);

    useEffect(() => {
        console.log('open', open)
    }, [open]);

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
            <div className={'flex flex-row-reverse relative overflow-visible w-full'}>
                <div className={'w-full desktop:min-w-[300px]'}>
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
                <div className={'pt-[50px] w-auto flex-auto max-w-[300px] ' + (open ? 'pl-[20px] ' : ' ')}>
                    <div
                        className={'max-h-[520px] flex flex-col gap-[6px] overflow-hidden overflow-y-auto box-border px-[4px] transition-all duration-300 ' + (open ? ' w-full opacity-100 visible' : ' w-0 opacity-0 hidden')}>
                        {notificationsData?.notiList?.map((item, idx) => {
                            return (
                                <Tag closeIcon={<CloseCircleOutlined/>} onClose={log}
                                     className={'bg-white w-full mx-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] flex flex-row gap-[8px]'}
                                     key={idx}
                                >
                                    <div
                                        className={'flex flex-row w-full justify-between gap-[8px] flex-wrap flex-auto'}>
                                        <div className={'text-wrap w-full'}>
                                            {user?.userNm}님! 알림이 도착했어요.
                                            <br/>
                                             <p className={'w-auto text-wrap text-ellipsis break-all'}>{item.notiContent}</p>
                                            <SStext>
                                                대여중인 컨텐츠 'MS Azure 애저 클라우드 서비스 구축 이해와 보안'의 반납 기한이 지났습니다. 빠른 시일 내에 반납
                                                    해주시길 바랍니다.
                                            </SStext>

                                            <p className={'w-auto text-wrap text-ellipsis break-all'}></p>
                                        </div>
                                        <div className={'flex-auto'}>
                                            {item.joinDt}
                                        </div>
                                    </div>
                                </Tag>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MiniProfile;
