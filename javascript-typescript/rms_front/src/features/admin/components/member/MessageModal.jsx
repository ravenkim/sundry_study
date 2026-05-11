import React, {useEffect, useState} from 'react';
import {Modal, Select, Checkbox} from "antd";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {removeRole} from "../../../../common/utils/dataProcessingUtils.jsx";

const MessageModal = ({modalVisible, setModalVisible}) => {

    const dispatch = useDispatch()

    const {
        users,
    } = useSelector(({adminReducer}) => ({
            users: adminReducer.users.data?.userList,
        }),
        shallowEqual
    )

    const [selectedValues, setSelectedValues] = useState([]); // 체크된 유저 리스트 관리

    const handleCheckboxChange = (value, checked) => {
        if (checked) {
            // 체크된 경우, 선택된 값들에 추가
            setSelectedValues(prevSelectedValues => [...prevSelectedValues, value]);
        } else {
            // 체크 해제된 경우, 해당 값을 선택된 값들에서 제거
            setSelectedValues(prevSelectedValues => prevSelectedValues.filter(val => val !== value));
        }

        console.log('selectedValues',selectedValues)
    };

    const cancelHandler = () => {
        // 창 닫을 때 visible false
        setModalVisible(false)

        // 창 닫을 때 값 초기화
        setSelectedValues([]);
    }

    return (
        <>
            <Modal
                title={<h1>알림 보내기</h1>}
                open={modalVisible}
                /*onOk={}*/
                /*onCancel={}*/
                okText={"보내기"}
                cancelText={"취소"}
                onCancel={cancelHandler}
                className={'w-[600px]'}
            >
                <div className={'box-border border-b-[1px] border-[#111321] border-solid pb-[16px]'}>
                    <span>작성 후 보내기 버튼을 눌러주세요.</span>
                </div>

                {/*텍스트 추가*/}
                <div className={'pt-[16px] flex flex-col gap-[8px]'}>

                    {/*사용자 선택 -- 중복선택 가능하도록*/}
                    <div className={'flex flex-col items-start gap-[6px]'}>
                        <p className={'break-keep'}>누구에게 보내실래요?</p>
                            <div
                                className={'flex flex-row flex-wrap max-h-[80px] overflow-auto box-border border-[1px] border-solid border-[#ACACBA] p-[6px] rounded-[5px] flex-auto justify-start items-center'}>
                                {users?.map(user => (
                                    <Checkbox
                                        key={user.userId}
                                        value={user.userId}
                                        checked={selectedValues.includes(user.userId)}
                                        onChange={(e) => handleCheckboxChange(user.userId, e.target.checked)}
                                    >
                                        {user.userNm}
                                    </Checkbox>
                                ))}
                            </div>

                    </div>

                    {/*알림으로 보낼 텍스트 선택 -- 최대값, 폼 같은거 백엔드랑 상의 */}
                    <div className={'flex flex-col items-start gap-[6px]'}>
                        <p className={'break-keep'}>뭐라고 보낼까요?</p>
                        <textarea name="" id="" cols="30" rows="10" className={'border-[1px] border-solid border-[#ACACBA] w-full rounded-[5px] message_textarea px-[4px] py-[2px]'} placeholder={'알림 내용을 입력해주세요.'}></textarea>
                    </div>
                </div>

                {/*예약기능 추가*/}
                <div>

                </div>
            </Modal>
        </>
    );
};

export default MessageModal;
