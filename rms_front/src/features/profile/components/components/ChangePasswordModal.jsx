import React, {useEffect, useState} from 'react';
import SSmodal from "src/common/components/modal/SSmodal.jsx";
import SSinput from "src/common/components/input/SSinput.jsx";
import {validatePassword} from "src/common/utils/validateUtils.jsx";
import {useDispatch} from "react-redux";
import {profileAction} from "src/features/profile/profileReducer.jsx";

const ChangePasswordModal = ({
    setModalVisible,
    modalVisible
                             }) => {
    const dispatch = useDispatch()

    const onCancel = () => {
        setPassword1('')
        setPassword2('')
        setModalVisible(false)
    }


    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    const [valueCheack, setValueCheack] = useState(false)
    const [valueCheackMessage, setValueCheackMessage] = useState('')


    useEffect(() => {

        if (password1.length === 0 && password2.length === 0) {
            setValueCheack(false);
            setValueCheackMessage('')
            return;
        }

        // 비밀번호 형식 검증
        if (!validatePassword(password1)) {
            setValueCheack(false);
            setValueCheackMessage('비밀번호 형식이 올바르지 않습니다. 숫자, 영문자, 특수문자를 포함한 8자리 이상이어야 합니다.');
            return;
        }

        if (password1 !== password2) {
            setValueCheack(false);
            setValueCheackMessage('비밀번호가 일치하지 않습니다.');
            return;
        }


        setValueCheack(true);
        setValueCheackMessage('비밀번호가 일치합니다.');


    }, [password1, password2]);


    const onOk = () => {
        dispatch(profileAction.postUserPwStatus({ password: password1 === password2 && password1}))
        onCancel()
    }


    return (
        <SSmodal
            title={'비밀번호 변경'}
            visible={modalVisible}
            onCancel={onCancel}
            onOk={onOk}
              okText={'비밀번호 변경'}
                cancelText={'취소'}
            okButtonProps={{
                disabled: !valueCheack,
            }}
        >

            <SSinput
                label={'비밀번호:'}
                isPassword={true}
                onChange={(e) => setPassword1(e.target.value)}
                value={password1}
            >

            </SSinput>

            <SSinput
                isPassword={true}
                label={'비밀번호 확인:'}
                onChange={(e) => setPassword2(e.target.value)}
                value={password2}
            >

            </SSinput>
            {
                <div>{valueCheackMessage}</div>
            }


        </SSmodal>
    );
};

export default ChangePasswordModal;
