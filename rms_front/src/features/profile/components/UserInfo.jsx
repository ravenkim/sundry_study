import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "src/features/profile/profileReducer.jsx";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {UploadOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Space, Spin, Upload} from 'antd';
import SSbutton from "src/common/components/button/SSbutton.jsx";
import showMessage from "src/common/components/notice/notice.js";
import ChangePasswordModal from "src/features/profile/components/components/ChangePasswordModal.jsx";
import SSlabel from "../../../common/components/label/SSlabel.jsx";

const UserInfo = () => {

    const dispatch = useDispatch()

    const {
        userProfileImg,
        postUserProfileImgStatus,
        fullUserInfo,
        postUserPwStatus,
        userDataLoading

    } = useSelector(({profileReducer, userReducer}) => ({
            userProfileImg: userReducer.userProfileImg.data,
            postUserProfileImgStatus: profileReducer.postUserProfileImgStatus.data,
            fullUserInfo: profileReducer.fullUserInfo.data,
            userDataLoading: userReducer.userProfileImg.loading,
            postUserPwStatus: profileReducer.postUserPwStatus.data,
        }),
        shallowEqual
    )


    useEffect(() => {
        if (postUserPwStatus) {
            showMessage('success', '비밀번호가 성공적으로 저장되었습니다.')
            dispatch(profileAction.initialize('postUserPwStatus'))
        }
    }, [postUserPwStatus]);


    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        dispatch(profileAction.getFullUserInfo())

        // 요청 초기화 작성
        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);


    const onSave = () => {

        if (fileList.length > 0) { // 파일리스트에 이미지를 올렸을 때 실행
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file);
            }); // form data 형식으로 img post 요청 보내기

            dispatch(profileAction.postUserProfileImg(formData));
        }


    };


    // 이미지 변경시 메세지와 초기화 처리
    useEffect(() => {
        if (postUserProfileImgStatus) {
            setFileList([]);
            showMessage('success', '이미지가 성공적으로 저장되었습니다.');
            dispatch(userAction.getUserProfileImg());
            dispatch(profileAction.initialize('postUserProfileImgStatus'))
        }
    }, [postUserProfileImgStatus]);

    const handleSave = () => {
        onSave();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    } // 엔터 및 클릭시 폼 제출

    const handleCancel = () => {
        setFileList([]); // 이미지 초기화
    }; // 취소버튼 클릭 시 초기화

    ///////////////////////////////////////////////////////////////////////////////////


    const props = {
        action: 'http://110.35.15.168:8088/swagger-ui/index.html#/ProfileController/saveProfileImg',

        beforeUpload: file => {
            if (fileList.length >= 1) {
                showMessage('error', '이미지는 한 개씩만 업로드할 수 있습니다.');
                return false; // 두개 이상 올리려고 하면 리턴
            }
            setFileList([...fileList, file]);
            return false; // 업로드 전에 파일 리스트에 추가하고 업로드 막기
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        fileList,
    };

    const [modalVisible, setModalVisible] = useState(false)


    return (
        <>
            <Spin
                spinning={userDataLoading}
            >
                <div className={'w-full'}>
                    <div className={'w-fit flex desktop:flex-row gap-[100px] desktop:m-0 desktop:mx-auto'}>
                        <div className={'flex flex-col items-center gap-[8px]'}>
                            {userProfileImg === false
                                ?
                                <Space
                                    direction='vertical'
                                    wrap size={180}
                                >
                                    <Avatar
                                        size={180}
                                        icon={<UserOutlined/>}
                                    />
                                </Space>
                                :
                                <img
                                    src={userProfileImg}
                                    alt="#"
                                    className={'rounded-full w-[180px] h-full max-w-[180px] max-h-[180px]'}
                                />
                            }

                            <form action="/item" method={'post'} encType={"multipart/form-data"}>
                                <Upload {...props} defaultFileList={[...fileList]}
                                        className={'flex flex-col justify-center items-center'}>
                                    {fileList.length > 0 ? (
                                        <></>
                                    ) : (
                                        <Button icon={<UploadOutlined/>}>프로필 변경</Button>
                                    )}
                                </Upload>
                                {fileList.length > 0 && (
                                    <>
                                        <SSbutton danger className={'px-[60px] mr-2'}
                                                  onClick={handleCancel}>취소</SSbutton>
                                        <SSbutton type={'primary'} className={'px-[30px]'} onClick={handleSave}>이미지
                                            변경하기</SSbutton>
                                    </>
                                )}
                            </form>
                        </div>
                        <div className={'flex flex-col gap-[6px]'}>

                            <SSlabel
                                label={'아이디'}
                                children={<p className={''}>{fullUserInfo?.userInfo?.userEmail}</p>}
                            />
                            <SSlabel
                                label={'이름'}
                                children={<p>{fullUserInfo?.userInfo?.userNm}</p>}
                            />
                            <SSlabel
                                label={'핸드폰 번호'}
                                children={<p>{fullUserInfo?.userInfo?.phoneNumber}</p>}
                            />
                            <SSlabel
                                label={' 비밀번호변경'}
                                children={<SSbutton
                                    onClick={() => {
                                        setModalVisible(true)
                                    }}
                                >비밀번호 변경하기</SSbutton>
                                }
                            />

                            <ChangePasswordModal
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />



                        </div>
                    </div>


                </div>


            </Spin>
        </>
    )
}

export default UserInfo
