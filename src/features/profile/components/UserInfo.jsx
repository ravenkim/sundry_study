import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UserOutlined, UploadOutlined, InboxOutlined} from '@ant-design/icons';
import {Avatar, Space, Button, message, Upload} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";
import imgClient from "../../../api/imgClient.jsx";

const {Dragger} = Upload;

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null)
    const [userImg, setUserImg] = useState('')

    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        postUserProfileImg,
        fullUserInfo

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.userProfileImg.data,
            postUserProfileImg: profileReducer.postUserProfileImg,
            fullUserInfo: profileReducer.fullUserInfo.data,
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserProfileImg())
        dispatch(profileAction.getFullUserInfo())

        setUserImg(userProfileImg)
        console.log('userImg', userImg)

        if (!userProfileImg) dispatch(profileAction.getUserProfileImg(null))
        if (!fullUserInfo) dispatch(profileAction.getFullUserInfo(null))

    }, []);

    useEffect(()=> {
        console.log('getFullUser', fullUserInfo)
        console.log('userProfileImg',userProfileImg)
    },[fullUserInfo,userProfileImg])



    const onSave = () => {
        if (selectedImage) {

            dispatch(profileAction.postUserProfileImg(selectedImage)); // 이미지 업로드 액션
        } else {
            console.log('파일이 없습니다.');
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////

    const [fileList, setFileList] = useState([]);

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file);
          console.log('file', file)
        });


        imgClient.post('/profile/user/save-img', formData) // imgClient.post 메소드를 사용하여 이미지를 업로드합니다.
          .then(response => {
            message.success('이미지 업로드가 완료되었습니다.');
            // 업로드 후 필요한 작업을 수행합니다.
          })
          .catch(error => {
            message.error('이미지 업로드 중 오류가 발생했습니다.');
            // 오류 처리를 수행합니다.
              console.log('error',error)
          });
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
                            : <img src={userProfileImg} alt="#" className={'rounded-full w-[180px] h-full max-w-[180px] max-h-[180px]'}/>
                        }

                        <form action="/item" method={'post'} encType={"multipart/form-data"}>
                            <Upload {...props}>
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
                        <div
                            className={'flex gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] items-center '}>
                            <div className={'h-fit desktop:h-[35.141px] desktop:max-h-[35.141px] self-start flex items-center'}>
                                <p className={'desktop:min-w-[80px]'}>비밀번호</p>
                            </div>
                            <div className={'flex flex-col desktop:flex-col gap-[6px]'}>
                                <button
                                    className={'box-border bg-[#E3E4E8] text-[#51525c] px-[10px] py-[5px] rounded-[5px] min-w-fit w-fit desktop:max-w-[141.8px]'}
                                    onClick={() => setPasswordInput(!passwordInput)}>비밀번호 변경하기
                                </button>
                                {passwordInput && <SSinput className={'mb-[0]  desktop:max-w-[141.8px]'}/>}
                                {/*input value값 post 요청하기 - 핸들러는 저장버튼 눌렀을 때 요청*/}
                            </div>
                        </div>
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
