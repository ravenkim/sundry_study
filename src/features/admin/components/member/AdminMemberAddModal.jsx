import React, {useEffect, useState} from 'react';
import {Input, Modal, Select} from "antd";
import SSlabelForInput from "../../../../common/components/label/SSlabelForInput.jsx";
import {shallowEqual, useSelector} from "react-redux";
import {removeRole} from "../../../../common/utils/redux/dataProcessingUtils.jsx";
import showMessage from "../../../../common/components/notice/notice.js";
import {validateEmail} from "../../../../common/utils/redux/validateUtils.jsx";

const AdminMemberAddModal = ({
                                 setModalVisible,
                                 modalVisible
                             }) => {


    const {
        authList

    } = useSelector(({adminReducer}) => ({
            authList: removeRole(adminReducer.authList.data)
        }),
        shallowEqual
    )





    const verification = () => {

    }


        const [userNm, setUserNm] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [authId, setAuthId] = useState('')


    const addHandler = () => {


        if(userNm.length === 0){
            showMessage('warning', '이름은 필수 입니다')
            return
        }

        if(validateEmail(userEmail)){
            showMessage('warning', '올바르지 않은 형식의 이메일 입니다.')
            return
        }




        const finalData = {
            userNm : userNm,
            userEmail : userEmail,
            phoneNumber : phoneNumber,
            authId : authId

        }

        console.log(finalData)
        // setModalVisible(false)
    }

    const cancelHandler = () => {
        setModalVisible(false)
    }




    return (
        <Modal
            title="사용자 추가"
            open={modalVisible}
            onOk={addHandler}
            onCancel={cancelHandler}
            okText="추가하기"
            cancelText="취소"
            width={800}
        >
            <SSlabelForInput
                label={'이름'}
            >
                <Input
                    placeholder="홍길동"
                    value={userNm}
                    onChange={e => setUserNm(e.target.value)}
                />
            </SSlabelForInput>
            <SSlabelForInput
                label={'이메일'}
            >
                <Input
                    placeholder="example@euclidsoft.co.kr"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                />
            </SSlabelForInput>
            <SSlabelForInput
                label={'전화번호'}
            >
                <Input
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="01012345678"
                />
            </SSlabelForInput>
            <SSlabelForInput
                label={'권한'}
            >
                <Select
                    style={{
                        width: '100%',
                    }}
                    value={authId}
                    onChange={value => setAuthId(value)}
                    options={authList}
                    fieldNames={{label: 'authNm', value: 'authId'}}
                />
            </SSlabelForInput>

        </Modal>
    );
};

export default AdminMemberAddModal;
