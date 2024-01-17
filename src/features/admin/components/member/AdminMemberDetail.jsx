import React, {useEffect, useState} from 'react';
import SSlabelForInput from "../../../../common/components/label/SSlabelForInput.jsx";
import {Avatar, Input, Modal, Space} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {shallowEqual, useSelector} from "react-redux";

const AdminMemberDetail = ({

                               modalVisible,
                               setModalVisible

                           }) => {


    const {
        userDetail,

    } = useSelector(({adminReducer}) => ({
            userDetail: adminReducer.userDetail.data,
        }),
        shallowEqual
    );


    const resetHandler = () => {
        setUserNm(null)
        setUserEmail(null)
        setPhoneNumber(null)
        setAuthNm(null)
    }


    const [userNm, setUserNm] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const [authNm, setAuthNm] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)


    useEffect(() => {
        if (userDetail) {
            const data = userDetail?.userInfo
            setUserNm(data?.userNm)
            setUserEmail(data?.userEmail)
            setPhoneNumber(data?.phoneNumber)
                        //     todo data 정제
            setAuthNm(data?.authNm)


        }

    }, [userDetail]);


    const addHandler = () => {
        //     인풋 초기화
    }


    const cancelHandler = () => {
        setModalVisible(false)

        //     인풋 초기화

    }


    const [userProfileImg, setUserProfileImg] = useState()

    return (


        <Modal
            title={<h1>사용자 정보 수정</h1>}
            open={modalVisible}
            onOk={addHandler}
            onCancel={cancelHandler}
            okText="추가하기"
            cancelText="취소"
            width={800}
        >
            <div className={'w-full flex flex-row'}>

                <div
                    style={{
                        width: '200px',
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '40px',
                    }}
                >

                    {userProfileImg === false
                        ? <Space direction='vertical' wrap size={180}>
                            <Avatar size={180} icon={<UserOutlined/>}/>
                        </Space>
                        : <img src={userProfileImg} alt="#"
                               className={'rounded-full w-[180px] h-full max-w-[180px] max-h-[180px]'}/>
                    }
                </div>


                <div>
                    <SSlabelForInput label={'이름'}>
                        <Input
                            value={userNm}
                        />
                    </SSlabelForInput>
                    <SSlabelForInput label={'이메일'}>
                        <Input
                            value={userEmail}
                        />
                    </SSlabelForInput>


                    <SSlabelForInput label={'전화번호'}>
                        <Input
                            value={phoneNumber}
                        />
                    </SSlabelForInput>
                    <SSlabelForInput label={'권한'}>
                        <Input
                            value={authNm}
                        />
                    </SSlabelForInput>


                </div>


            </div>

        </Modal>
    );
};

export default AdminMemberDetail;
