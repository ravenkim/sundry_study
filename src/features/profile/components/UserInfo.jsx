import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UserOutlined, UploadOutlined, InboxOutlined} from '@ant-design/icons';
import {Avatar, Space, Button, message, Upload, Spin} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";
import imgClient from "../../../api/imgClient.jsx";
import client from "../../../api/client.jsx";
import showMessage from "src/common/components/notice/notice.js";
import {postUserProfileImg} from "../profileAPI.jsx";
import AlertModal from "/src/common/components/modal/AlertModal.jsx";
import CheckModal from "/src/common/components/modal/CheckModal.js";

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [postPwValue, setPostPwValue] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [userImg, setUserImg] = useState('')

    const dispatch = useDispatch()

    const {
        userProfileImg,
        postUserProfileImg,
        fullUserInfo,
        postUserPW,
        userDataLoading

    } = useSelector(({profileReducer}) => ({
            userProfileImg: profileReducer.userProfileImg.data,
            postUserProfileImg: profileReducer.postUserProfileImg,
            fullUserInfo: profileReducer.fullUserInfo.data,
            userDataLoading: profileReducer.userProfileImg.loading,
            postUserPW: profileReducer.userPW,
        }),
        shallowEqual
    )

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        dispatch(profileAction.getFullUserInfo())

        // 요청 초기화 작성
        return () => {
            dispatch(profileAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);

    const validatePassword = (password) => {
        const MIN = 8; // 최소값
        const MAX = 20; // 최대값

        const hasDigit = /[0-9]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialChar = /[\W_]/.test(password);
        const isLengthValid = password.length >= MIN && password.length <= MAX;
        /*const pwPattern = /^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[\\W])(?!.*(.)\\1\\1)(?!.*\\d\\d\\d)(?!.*[a-zA-Z]\\1\\1)[\\da-zA-Z\\W]{8,20}$/;
        return pwPattern.test(password);*/

        if (!hasDigit) {
            return '비밀번호에 숫자가 포함되어야 합니다.';
        }
        if (!hasLetter) {
            return '비밀번호에 영문자가 포함되어야 합니다.';
        }
        if (!hasSpecialChar) {
            return '비밀번호에 특수문자가 포함되어야 합니다.';
        }
        if (!isLengthValid) {
            return '비밀번호는 8자에서 20자 사이여야 합니다.';
        }
        /*if (!pwPattern) {
            return '유효한 비밀번호 형식이 아닙니다.';
        }*/

        return null; // 유효한 경우
    };

    const onSave = () => {

        if (fileList.length > 0) { // 파일리스트에 이미지를 올렸을 때 실행
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file);
            }); // form data 형식으로 img post 요청 보내기

            dispatch(profileAction.postUserProfileImg(formData));
        }

        if (postPwValue.trim() !== '') { // 비밀번호 변경하려는 시도일 때 실행
            const passwordError = validatePassword(postPwValue);

            const postData = {
                password: postPwValue
            };

            if (passwordError) {
                showMessage('error', passwordError);
                return; // 에러 발생 시 처리 중단
            }

            if (!passwordError) { // 에러가 아니면 pw post 요청 처리
                dispatch(profileAction.postUserPW(postData));
                showMessage('success', '성공적으로 저장되었습니다.');
                setPostPwValue('')
                /*client.post('/profile/user/save-pwd', postData)
                    .then(response => {
                        showMessage('success', response.data.msg)
                        /!*message.success('성공적으로 패스워드를 변경하였습니다.');*!/
                        console.log(response.data.msg)
                        setPostPwValue('') // 성공하면 인풋 값 초기화

                        dispatch(profileAction.initialize('postUserPW'))
                    })
                    .catch(error => {
                        showMessage('error', '비밀번호 변경 중 알 수 없는 오류가 발생하였습니다.')
                        console.log('error', error) // 에러 로그 보기
                    });*/

                if (postUserPW) {
                    if (postUserPW.loading !== true) {
                        dispatch(profileAction.initialize('postUserPW'));
                    }
                } // 성공해서 로딩에 대한 값이 변하면 초기화
                // 정규식 추가해야됨
                // REGEX = "^((?=.\\d)(?=.[a-zA-Z])(?=.*[\\W]).{" + MIN + "," + MAX + "})$"
            }
        }
    };

    useEffect(() => {
        if (postUserProfileImg) { // 이미지 변경시 메세지와 초기화 처리
            if (postUserProfileImg.data.res) {
                setFileList([])
                showMessage('success', postUserProfileImg.data.msg)
                dispatch(profileAction.getUserProfileImg());
            } else {
                showMessage('error', postUserProfileImg.data.msg)
            }
        }
    }, [postUserProfileImg]);

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

    const [modal, setModal] = useState(false)

    return (
        <>
            <Spin
                spinning={userDataLoading}
            >
                <div className={'w-full'}>
                    <div className={'w-fit flex desktop:flex-row gap-[100px] desktop:m-0 desktop:mx-auto'}>
                        <div className={'flex flex-col items-center gap-[8px]'}>
                            {userProfileImg === null
                                ? <Space direction='vertical' wrap size={180}>
                                    <Avatar size={180} icon={<UserOutlined/>}/>
                                </Space>
                                : <img src={userProfileImg} alt="#"
                                       className={'rounded-full w-[180px] h-full max-w-[180px] max-h-[180px]'}/>
                            }

                            <form action="/item" method={'post'} encType={"multipart/form-data"}>
                                <Upload {...props} defaultFileList={[...fileList]} className={'flex flex-col justify-center items-center'}>
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
                                        className={'h-fit desktop:h-[35.141px] desktop:max-h-[35.141px] self-start flex items-center'}>
                                        <p className={'desktop:min-w-[89px]'}>비밀번호변경</p>
                                    </div>
                                    <div className={'flex flex-col desktop:flex-col gap-[6px]'}>
                                        <SSinput className={'mb-[0]  desktop:max-w-[141.8px]'}
                                                 onChange={(e) => setPostPwValue(e.target.value)}
                                                 value={postPwValue}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div
                        className={'w-full flex justify-center items-center gap-[16px] mt-[20px] tablet:mt-[40px] desktop:mt-[80px] '}>
                        <SSbutton danger className={'px-[60px]'} onClick={handleCancel}>취소</SSbutton>
                        <SSbutton type={'primary'} className={'px-[60px]'} onClick={handleSave}>저장</SSbutton>
                    </div>
                </div>
            </Spin>

            <button
                onClick={()=>CheckModal('안녕하세요', '이사입니다', 'warning', function () {
                    console.log('success')
                })}
            >확인버튼</button>
        </>
    )
}

export default UserInfo
