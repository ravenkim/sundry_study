import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {profileAction} from "../profileReducer.jsx";
import {UserOutlined} from '@ant-design/icons';
import {Avatar, Space} from 'antd';
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import SSinput from "../../../common/components/input/SSinput.jsx";

const UserInfo = () => {
    const [passwordInput, setPasswordInput] = useState(false)
    const [img, setImg] = useState(null)
    const inputRef= useRef(null)

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
            test:profileReducer.test
        }),
        shallowEqual
    )

    useEffect(() => {
        dispatch(profileAction.getUserProfileImg())

        if (!userProfileImg) dispatch(profileAction.getUserProfileImg(null))
    }, []);

    /*데이터 폼을 넣어서 이미지를 드래그해서 저장 버튼을 누르면 핸들러가 실행되고, 핸들러 안에는 그 인풋의 value 값을 가지고 가서 post 요청하기*/

    const onUploadImage = useCallback((e)=> {
        if(!e.target.files) {
            return;
        }

        const formData = new FormData();
        formData.append('image', e.target.files[0])
        console.log(formData)

    },[])

    const onSave =()=> {
        if(inputRef.current && inputRef.current.files.length > 0) {
            const formData = new FormData();
            formData.append('image', inputRef.current.files[0]);

            dispatch(profileAction.postUserProfileImg(formData))
        } else {
            console.log('파일이 없습니다.')
        }
    }

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
                        <label htmlFor="profileImgSet">프로필 이미지 변경</label>
                        <input
                            type="file"
                            id='profileImgSet'
                            accept='image/*'
                            name='profileImgSet'
                            onChange={onUploadImage}
                            ref={inputRef}
                        />

                    </div>
                    <div className={'flex flex-col gap-[6px]'}>
                        <div className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>아이디</p>
                            <p className={''}>{user?.userEmail}</p>
                        </div>
                        <div className={'flex gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] items-center '}>
                            <p className={'desktop:min-w-[80px]'}>비밀번호</p>
                            <div className={'flex flex-col desktop:flex-row gap-[6px]'}>
                            <button className={'box-border bg-[#E3E4E8] text-[#51525c] px-[10px] py-[5px] rounded-[5px] min-w-fit w-fit'} onClick={() => setPasswordInput(!passwordInput)}>비밀번호 변경하기</button>
                            {passwordInput && <SSinput className={'mb-[0]'}/>}
                            {/*input value값 post 요청하기 - 핸들러는 저장버튼 눌렀을 때 요청*/}
                            </div>
                        </div>
                        <div className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>이름</p>
                            <p>{user?.userNm}</p>
                        </div>
                        <div className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] '}>
                            <p className={'desktop:min-w-[80px]'}>핸드폰 번호</p>
                            <p>010-9866-2951</p>
                            {/*<p>{user.phone}</p>*/}
                        </div>
                    </div>
                </div>

                <div className={'w-full flex justify-center items-center gap-[16px] mt-[20px] tablet:mt-[40px] desktop:mt-[80px] '}>
                    <SSbutton danger className={'px-[60px]'}>취소</SSbutton>
                    <SSbutton type={'primary'} className={'px-[60px]'} onClick={onSave}>저장</SSbutton>
                </div>
            </div>
        </>
    )
}

export default UserInfo
