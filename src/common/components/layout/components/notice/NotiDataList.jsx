import SStext from "../../../text/SStext.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Tag} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";



const NotiDataList = ({
    open,
    deletedNotiIds
                      }) => {

    const dispatch = useDispatch()

    const {
        user,
        notificationsData,

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            notificationsData: profileReducer.notifications.data,
        }),
        shallowEqual
    )


    return (
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
    )
}

export default NotiDataList
