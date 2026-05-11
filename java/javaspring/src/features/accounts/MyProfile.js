import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LimeModal from "../common/modal/LimeModal";
import { Modal, notification } from 'antd'
import { memberAction } from 'features/admin/member/memberReducer'
import { perfAction } from 'features/perf/perfReducer'

const MyProfile = () => {
    const dispatch = useDispatch()

    const {
      memberProfileState,
    } = useSelector(({ memberReducer }) => ({
      memberProfileState: memberReducer.memberProfileState,
    }))

    const user = useSelector(({userReducer}) => ({
      user: userReducer.user.data,
    }));

    const [origin,setOrigin] = useState("")
    const [modify,setModify] = useState("")
    const [checkModify,setCheckModify] = useState("")
    const [modifyModalVisible, setModifyModalVisible] = useState(false);
    const showModal = () => {
      setModifyModalVisible(true)
    }

    const closeModal = () => {
      setOrigin("")
      setModify("")
      setCheckModify("")
      setModifyModalVisible(false)
    }

    const changePasswordHandler = () =>{
      const check = checkPasswordHandler()
      if(check)
        return
     dispatch(memberAction.updateMemberProfile({origin_password:origin,password:modify}))
    }

    const checkPasswordHandler =()=> {
      if(!origin)
        notification.warn({
          message:  '기존 비밀번호를 입력해주세요.',
          duration: 5,
          placement: 'bottomRight'
        })
      else if(!modify)
        notification.warn({
          message:  '새로운 비밀번호를 입력해주세요.',
          duration: 5,
          placement: 'bottomRight'
        })
      else if(!checkModify)
        notification.warn({
          message:  '비밀번호 확인을 위해 입력해주세요.',
          duration: 5,
          placement: 'bottomRight'
        })
      else  if(origin===modify)
        notification.warn({
          message:  '기존의 비밀번호와 동일합니다.',
          duration: 5,
          placement: 'bottomRight'
        })
      else  if(modify!==checkModify)
        notification.warn({
          message:  '변경할 비밀번호가 동일하지 않습니다.',
          duration: 5,
          placement: 'bottomRight'
        })
      return !origin||!modify || !checkModify || modify!==checkModify || origin===modify
    }

    useEffect(()=>{
      if(memberProfileState?.data?.state){
        notification.success({
          message: memberProfileState.data.msg,
          duration: 5,
          placement: 'bottomRight'
        })
        dispatch(memberAction.initialize('memberProfileState'))
        closeModal()
      } else if (memberProfileState?.data && !memberProfileState.data.state) {
        notification.warn({
          message: memberProfileState.data.msg,
          duration: 5,
          placement: 'bottomRight'
        })
        dispatch(memberAction.initialize('memberProfileState'))
      }
    },[memberProfileState])

    return (
      /*<main className="grid-col-full p-16">*/
        <div className="main-height-large overflow-auto">
          <div className="grid-col-3 gap-16 my-prorile">
            <div className=""></div>
            <div className="frame bg-white rounded-l shadow-lg">
              <div className="grid-col-6 ptb-40">
                <div className="col-span-1"></div>
                <div className="col-span-4">
                  <div className="mb-32">
                    <div className="form-label-text mb-8">사원번호</div>
                    <input type="text" className="bg-gray-100 text-gray-600" placeholder="사원번호" value={user.user.id} disabled={true}/>
                  </div>
                  <div className="mb-32">
                    <div className="form-label-text mb-8">이름</div>
                    <input type="text" className="bg-gray-100 text-gray-600" placeholder="이름" value={user.user.name} disabled={true}/>
                  </div>
                  <div className="mb-32">
                    <div className="form-label-text mb-8">이메일</div>
                    <input type="text" className="bg-gray-100 text-gray-600" placeholder="이메일" value={user.user.email} disabled={true}/>
                  </div>
                  <button type="button" className="btn-secondary-48 w-full" onClick={()=>showModal(modifyModalVisible)}>비밀번호 변경</button>
                </div>
              </div>
            </div>
          </div>

          {modifyModalVisible &&
          <LimeModal title={'비밀번호 변경'} visible={true} closable={false} closeHandler={closeModal}>
              {/*<div className="title mb-32">*/}
              {/*  <h3>비밀번호 변경</h3>*/}
              {/*  <button type="button" className="close" onClick={()=>closeModal()}></button>*/}
              {/*</div>*/}
              <div className="grid-col-3 items-center">
                <div className="form-label-text">현재 비밀번호</div>
                <div className="col-span-2">
                  <input type="password" value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="현재 비밀번호 입력"/>
                </div>
              </div>
              <div className="grid-col-3 items-center pt-16">
                <div className="form-label-text">새로운 비밀번호</div>
                <div className="col-span-2">
                  <input type="password" value={modify} onChange={e=>setModify(e.target.value)} placeholder="새로운 비밀번호 입력"/>
                </div>
              </div>
              <div className="grid-col-3 items-center pt-16">
                <div className="form-label-text">새로운 비밀번호 확인</div>
                <div className="col-span-2">
                  <input type="password" value={checkModify} onChange={e=>setCheckModify(e.target.value)}  placeholder="새로운 비밀번호 확인"/>
                </div>
              </div>

              <div className="modal-btn-2 mt-32">
                <button type="button" className="btn-tertiary-48" onClick={()=>closeModal()}>닫기</button>
                <button type="button" className="btn-primary-48 flex-1"  onClick={changePasswordHandler}>변경하기</button>
              </div>
          </LimeModal>
          }
        </div>
      /*</main>*/
    );
};

export default MyProfile;
