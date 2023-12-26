import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UserOutlined, UploadOutlined, InboxOutlined} from '@ant-design/icons';
import {Avatar, Space, Button, message, Upload} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";
import imgClient from "../../../api/imgClient.jsx";
import userClient from "../../../api/userClient.jsx";

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [postPwValue, setPostPwValue] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [userImg, setUserImg] = useState('')

    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        postUserProfileImg,
        fullUserInfo,
        postUserPW

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            postUserProfileImg: profileReducer.postUserProfileImg,
            fullUserInfo: profileReducer.fullUserInfo.data,
            postUserPW: profileReducer.userPW,
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserProfileImg())
        dispatch(profileAction.getFullUserInfo())

        if (!userProfileImg) dispatch(profileAction.getUserProfileImg(null))
        if (!fullUserInfo) dispatch(profileAction.getFullUserInfo(null))

    }, []);

    const validatePassword = (password) => {
    const MIN = 8;
    const MAX = 20;

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
        /*if (selectedImage) {

            dispatch(profileAction.postUserProfileImg(selectedImage)); // 이미지 업로드 액션
        } else {
            console.log('파일이 없습니다.');
        }*/

        if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file);
            });

            imgClient.post('/profile/user/save-img', formData) // imgClient.post 메소드를 사용하여 이미지를 업로드합니다.
                .then(response => {
                    message.success('이미지 업로드가 완료되었습니다.');
                    // 업로드 후 필요한 작업을 수행합니다.
                })
                .catch(error => {
                    message.error('이미지 업로드 중 오류가 발생했습니다.');
                    // 오류 처리를 수행합니다.
                    console.log('error', error)
                });
        }

        if (postPwValue.trim() !== '') {
            const passwordError = validatePassword(postPwValue);
            console.log('postPwValue',postPwValue)

            const postData = {
                password: postPwValue
            };

            if (passwordError) {
                message.error(passwordError);
                return; // 에러 발생 시 처리 중단
            }

            if(!passwordError) {
                /*userClient.post('/profile/user/save-pwd', postPwValue)
                .then(response => {
                    message.success('패스워드 변경이 성공했습니다.');
                    // 업로드 후 필요한 작업을 수행합니다.
                })
                .catch(error => {
                    message.error('비밀번호 변경에 실패했습니다.');
                    // 오류 처리를 수행합니다.
                    console.log('error', error)
                });*/
                dispatch(profileAction.postUserPW(postData));
                userClient.post('/profile/user/save-pwd', postData)
                .then(response => {
                    message.success('성공');
                    // 업로드 후 필요한 작업을 수행합니다.
                })
                .catch(error => {
                    message.error('실패');
                    // 오류 처리를 수행합니다.
                    console.log('error', error)
                });

                // 정규식 추가해야됨
                // REGEX = "^((?=.\\d)(?=.[a-zA-Z])(?=.*[\\W]).{" + MIN + "," + MAX + "})$"
            }
            /*if (validatePassword(postPwValue)) {
                userClient.post('/profile/user/save-pwd', postPwValue)
                .then(response => {
                    message.success('패스워드 변경이 성공했습니다.');
                    // 업로드 후 필요한 작업을 수행합니다.
                })
                .catch(error => {
                    message.error('비밀번호 변경에 실패했습니다.');
                    // 오류 처리를 수행합니다.
                    console.log('error', error)
                });
            } else {
                message.error('비밀번호는 영어, 숫자, 특수문자가 각각 하나 이상 포함되어야 하며, 8글자 이상 20글자 이하여야 합니다.');
            }*/
            /*if (validatePassword(postPwValue)) {
                // 유효한 비밀번호일 때 POST 요청 실행
                /!*dispatch(profileAction.postUserPW(postPwValue));*!/
                console.log('비밀번호 변경 실행')
            } else {
                message.error('비밀번호는 영어, 숫자, 특수문자가 각각 하나 이상 포함되어야 하며, 8글자 이상 20글자 이하여야 합니다.');
                // 유효하지 않은 비밀번호에 대한 에러 메시지 표시
            }*/
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////

    const [fileList, setFileList] = useState([]);

    const handleUpload = () => {

        /*if (fileList) {
            console.log('fileList', fileList)
            dispatch(profileAction.postUserProfileImg(fileList))
        }*/

    };

    const handleFileChange = ({fileList}) => {
        setFileList(fileList);
    };

    const props = {
        fileList,
        beforeUpload: file => {
            if (fileList.length >= 1) {
                message.warning('이미지는 한 개씩만 업로드할 수 있습니다.');
                return false;
            }
            setFileList([...fileList, file]);
            return false; // 업로드 전에 파일 리스트에 추가하고 업로드를 막습니다.
        },
    };


    return (
        <>
            <div className={'w-full'}>

                    <div className={'w-fit flex desktop:flex-row gap-[100px] desktop:m-0 desktop:mx-auto'}>

                        <div className={'flex flex-col items-center '}>
                            {/*<img src="" alt="#"/>*/}
                            {userProfileImg == null
                                ? <Space direction='vertical' wrap size={180}>
                                    <Avatar size={180} icon={<UserOutlined/>}/>
                                </Space>
                                : <img src={userProfileImg} alt="#"
                                       className={'rounded-full w-[180px] h-full max-w-[180px] max-h-[180px]'}/>
                            }

                            <form action="/item" method={'post'} encType={"multipart/form-data"}>
                            <Upload {...props} >
                                <Button icon={<UploadOutlined/>}>이미지 업로드</Button>
                            </Upload>
                            <Button onClick={handleUpload}>변경 이미지 저장</Button>
                            {/*나중에 버튼 ref로 묶어서 하단 저장버튼에서 함수 실행되도록 바꾸기 */}
                            </form>
                        </div>
                        <div className={'flex flex-col gap-[6px]'}>
                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[80px]'}>아이디</p>
                                <p className={''}>{fullUserInfo?.userInfo.userEmail}</p>
                            </div>

                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[80px]'}>이름</p>
                                <p>{fullUserInfo?.userInfo.userNm}</p>
                            </div>
                            <div
                                className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                                <p className={'desktop:min-w-[80px]'}>핸드폰 번호</p>
                                <p>{fullUserInfo?.userInfo.phoneNumber}</p>
                            </div>
                            <form action=""
                                  method={'post'}
                                  encType={"application/json"}
                            >
                                <div
                                    className={'flex gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] items-center '}>
                                    <div
                                        className={'h-fit desktop:h-[35.141px] desktop:max-h-[35.141px] self-start flex items-center'}>
                                        <p className={'desktop:min-w-[80px]'}>비밀번호변경</p>
                                    </div>
                                    <div className={'flex flex-col desktop:flex-col gap-[6px]'}>
                                        {/*<button
                                        className={'box-border bg-[#E3E4E8] text-[#51525c] px-[10px] py-[5px] rounded-[5px] min-w-fit w-fit desktop:max-w-[141.8px]'}
                                        onClick={() => setPasswordInput(!passwordInput)}>비밀번호 변경하기
                                    </button>*/}
                                        {/*{passwordInput && }*/}
                                        <SSinput className={'mb-[0]  desktop:max-w-[141.8px]'}
                                                 onChange={(e) => setPostPwValue(e.target.value)}
                                        />
                                        {/*input value값 post 요청하기 - 핸들러는 저장버튼 눌렀을 때 요청*/}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div
                        className={'w-full flex justify-center items-center gap-[16px] mt-[20px] tablet:mt-[40px] desktop:mt-[80px] '}>
                        <SSbutton danger className={'px-[60px]'}>취소</SSbutton>
                        <SSbutton type={'primary'} className={'px-[60px]'} onClick={onSave}>저장</SSbutton>
                    </div>

            </div>
        </>
    )
}

export default UserInfo
