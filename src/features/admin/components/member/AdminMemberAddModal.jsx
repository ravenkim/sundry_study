import React, {useEffect, useState} from 'react';
import {Divider, Input, Modal, Select} from "antd";
import SSlabelForInput from "src/common/components/label/SSlabelForInput.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {removeRole} from "src/common/utils/redux/dataProcessingUtils.jsx";
import showMessage from "src/common/components/notice/notice.js";
import {validateEmail} from "src/common/utils/redux/validateUtils.jsx";
import {adminAction} from "../../adminReducer.jsx";

const AdminMemberAddModal = ({
                                 setModalVisible,
                                 modalVisible
                             }) => {

    const dispatch = useDispatch()

    const {
        authListData,
        addUserStatus
    } = useSelector(({adminReducer}) => ({
            authListData: adminReducer.authList.data,
        addUserStatus:adminReducer.addUserStatus.data?.res
        }),
        shallowEqual
    )

    const [authList, setAuthList] = useState()

    useEffect(() => {
        if(authListData)setAuthList(removeRole(authListData))
    }, [authListData]);


    useEffect(() => {
        if(addUserStatus){
            dispatch(adminAction.getUsers())
            dispatch(adminAction.initialize('addUserStatus'))
            showMessage('success', '성공적으로 추가... 이거 리덕스 스토어 msg 에서 받게 변경')
            cancelHandler()
        }
    }, [addUserStatus]);






    const [userNm, setUserNm] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [authId, setAuthId] = useState(null)


    const addHandler = () => {


        if(userNm.length === 0){
            showMessage('warning', '이름은 필수 입니다')
            return
        }

        if(userNm.length > 20){
            showMessage('warning', '이름이 너무 깁니다')
            return
        }

        if(validateEmail(userEmail)){
            showMessage('warning', '올바르지 않은 형식의 이메일 입니다.')
            return
        }

        if(phoneNumber.length !== 11){
            showMessage('warning', '올바른 전화번호를 입력하세요.')
            return
        }

        if(authId === null){
            showMessage('warning', '권한을 설정해 주세요.')
            return
        }




        const finalData = {
            userNm : userNm,
            userEmail : userEmail,
            phoneNumber : phoneNumber,
            authId : authId

        }

        dispatch(adminAction.addUser(finalData))

    }

    const cancelHandler = () => {
        setModalVisible(false)

        //창 닫을시 값 초기화
        setUserNm('')
        setUserEmail('')
        setPhoneNumber('')
        setAuthId(null)
    }


    return (
        <Modal
            title={<h1>사용자 추가</h1>}
            open={modalVisible}
            onOk={addHandler}
            onCancel={cancelHandler}
            okText="추가하기"
            cancelText="취소"
            width={800}
        >
            <Divider></Divider>
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
                    onChange={e => setPhoneNumber(e.target.value.replace(/\s|-/g, ''))}
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
                    placeholder="권한을 선택해 주세요."
                />
            </SSlabelForInput>

        </Modal>
    );
};

export default AdminMemberAddModal;
