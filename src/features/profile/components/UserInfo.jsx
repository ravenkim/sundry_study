import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UserOutlined, UploadOutlined, InboxOutlined} from '@ant-design/icons';
import {Avatar, Space, Button, message, Upload} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";

const {Dragger} = Upload;

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [img, setImg] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null)

    const dispatch = useDispatch()

    const {
        user,
        userProfileImg,
        postUserProfileImg,
        test,

    } = useSelector(({userReducer, profileReducer}) => ({
            user: userReducer.user,
            userProfileImg: profileReducer.getUserProfileImg,
            postUserProfileImg: profileReducer.postUserProfileImg,
            test: profileReducer.test
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserProfileImg())

        if (!userProfileImg) dispatch(profileAction.getUserProfileImg(null))
    }, []);

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status, originFileObj } = info.file;
            if (status !== 'uploading' && status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                setSelectedImage(originFileObj); // 데이터 state에 저장

                /*console.log('status', originFileObj);*/
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(()=> { // 이미지 데이터 저장되면 실행
        /*console.log('selectedImage',selectedImage)*/
                },[selectedImage])

    const onSave = () => {
        if (selectedImage) {
            /*const formData = new FormData();
            formData.append('image', selectedImage);

            console.log('formData', formData);*/
            /*console.log('selectedImage', selectedImage)*/
            dispatch(profileAction.postUserProfileImg(selectedImage)); // 이미지 업로드 액션
        } else {
            console.log('파일이 없습니다.');
        }
    };

    return (
        <>
            <div className={'w-full'}>
                <div className={'w-fit flex desktop:flex-row gap-[60px] desktop:m-0 desktop:mx-auto'}>
                    <div className={'flex flex-col items-center'}>
                        {/*<img src="" alt="#"/>*/}
                        {userProfileImg?.data == null
                            ? <Space direction='vertical' wrap size={180}>
                                <Avatar size={180} icon={<UserOutlined/>}/>
                            </Space>
                            : <img src={userProfileImg?.data} alt="#"/>
                        }

                        {/*<img src={user.img} alt="#"/>*/}
                        {/*<label htmlFor="profileImgSet">프로필 이미지 변경</label>*/}
                        {/*<input
                            type="file"
                            id='profileImgSet'
                            accept='image/*'
                            name='profileImgSet'
                            onChange={onUploadImage}
                            ref={inputRef}
                        />*/}
                        <Dragger {...props}
                                 ref={inputRef}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">클릭 또는 파일 드래그로 <br/>프로필 이미지를 변경해보세요. </p>
                        </Dragger>

                    </div>
                    <div className={'flex flex-col gap-[6px]'}>
                        <div
                            className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>아이디</p>
                            <p className={''}>{user?.userEmail}</p>
                        </div>
                        <div
                            className={'flex gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] items-center '}>
                            <p className={'desktop:min-w-[80px]'}>비밀번호</p>
                            <div className={'flex flex-col desktop:flex-row gap-[6px]'}>
                                <button
                                    className={'box-border bg-[#E3E4E8] text-[#51525c] px-[10px] py-[5px] rounded-[5px] min-w-fit w-fit'}
                                    onClick={() => setPasswordInput(!passwordInput)}>비밀번호 변경하기
                                </button>
                                {passwordInput && <SSinput className={'mb-[0]'}/>}
                                {/*input value값 post 요청하기 - 핸들러는 저장버튼 눌렀을 때 요청*/}
                            </div>
                        </div>
                        <div
                            className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>이름</p>
                            <p>{user?.userNm}</p>
                        </div>
                        <div
                            className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>핸드폰 번호</p>
                            {/*<p>010-9866-2951</p>*/}
                            <p>{user?.phoneNumber}</p>
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
