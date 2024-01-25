import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UploadOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Space, Spin, Upload} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";
import showMessage from "src/common/components/notice/notice.js";
import {userAction} from "src/features/accounts/userReducer.jsx";
import ChangePasswordModal from "src/features/profile/components/components/ChangePasswordModal.jsx";

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [postPwValue, setPostPwValue] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [userImg, setUserImg] = useState('')

    const dispatch = useDispatch()

    const {
        userProfileImg,
        postUserProfileImgStatus,
        fullUserInfo,
        postUserPwStatus,
        userDataLoading

    } = useSelector(({profileReducer, userReducer}) => ({
            userProfileImg: userReducer.userProfileImg.data,
            postUserProfileImgStatus: profileReducer.postUserProfileImgStatus,
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

    useEffect(() => {
        if (postUserProfileImgStatus) { // 이미지 변경시 메세지와 초기화 처리
            /*if (postUserProfileImg.data.res) {
                setFileList([])
                showMessage('success', postUserProfileImg.data.msg)
                dispatch(profileAction.getUserProfileImg());
            } else {
                showMessage('error', postUserProfileImg.data.msg)
            }*/
            if (postUserProfileImgStatus.loading === false && postUserProfileImgStatus.data === false) {
                setFileList([]);
                showMessage('success', '이미지가 성공적으로 저장되었습니다.');
            } // 임시 data 성공시 로직 -> res 값으로 변경되면 다시 바꿔야 됨
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
        setPostPwValue(''); // 비밀번호 입력 값 초기화
    }; // 취소버튼 클릭 시 초기화

    ///////////////////////////////////////////////////////////////////////////////////

    const handleFileChange = ({fileList}) => {
        setFileList(fileList);
    };

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
                                    <Button icon={<UploadOutlined/>}>프로필 변경</Button>
                                </Upload>
                            </form>
                        </div>
                        <div className={'flex flex-col gap-[6px]'}>
                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[89px]'}>아이디</p>
                                <p className={''}>{fullUserInfo?.userInfo?.userEmail}</p>
                            </div>

                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[89px]'}>이름</p>
                                <p>{fullUserInfo?.userInfo?.userNm}</p>
                            </div>
                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[89px]'}>핸드폰 번호</p>
                                <p>{fullUserInfo?.userInfo?.phoneNumber}</p>
                            </div>
                            <form action=""
                                  method={'post'}
                                  encType={"application/json"}
                            >
                                <div
                                    className={'flex gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] items-center '}>
                                    <div
                                        className={'h-fit desktop:h-[35.141px] desktop:max-h-[35.141px] self-start flex items-center'}
                                    >
                                        <p
                                            className={'desktop:min-w-[89px]'}
                                        >
                                            비밀번호변경
                                        </p>
                                    </div>
                                    <div className={'flex flex-col desktop:flex-col gap-[6px]'}>
                                        <SSbutton
                                            onClick={() => {
                                                setModalVisible(true)
                                            }}
                                        >비밀번호 변경하기</SSbutton>
                                        <ChangePasswordModal
                                            modalVisible={modalVisible}
                                            setModalVisible={setModalVisible}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div
                        className={'w-full flex justify-center items-center gap-[16px] mt-[20px] tablet:mt-[40px] desktop:mt-[80px] '}>
                        <SSbutton danger className={'px-[60px]'} onClick={handleCancel}>취소</SSbutton>
                        <SSbutton type={'primary'} className={'px-[60px]'} onClick={handleSave}>이미지 변경하기</SSbutton>
                    </div>
                </div>


            </Spin>
        </>
    )
}

export default UserInfo
