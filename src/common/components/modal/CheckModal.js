import {Modal} from "antd";
import SStext from "../text/SStext.jsx";
import React, { useState } from 'react';
import Swal from "sweetalert2/src/sweetalert2.js";
import 'sweetalert2/src/sweetalert2.scss'

// icon : warning, error, success, info, question

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",

  },
  buttonsStyling: true,
	confirmButtonColor:'#4F5FF5',
	confirmButtonText:'닫기'
});

const CheckModal = (title,text,icon,okFn,html) => {
    Swal.fire({
        title:title,
        text:text,
        icon:icon,
        showCancelButton:true,
        confirmButtonText:'확인',
        cancelButtonText:'취소',
		confirmButtonColor:'#4F5FF5',
		cancelButtonColor:'#ff4d4f',
        reverseButtons:true,
        html:html,
		position:'center',

    }).then((result)=> {
        if(result.isConfirmed) {
			okFn()
            /*swalWithBootstrapButtons.fire({
                title:'성공하였습니다.',
                icon:'success'
            });*/
        }
    })
}
export default CheckModal


/*const CheckModal = ({
                        className,
                        onClick,
                        onOk,
                        onCancel,
                        okText,
                        cancelText,
                        open,
                        ...otherProps
                    }) => {
    return (
        <>
            <Modal
                open={open}
                okText={'확인'}
                cancelText={'취소'}
                className={className}
                closeIcon={false}
                onOk={onOk}
                onCancel={onCancel}
                footer={(_,{OkBtn,CancelBtn})=>(
                    <>
                        <CancelBtn />
                        <OkBtn  />
                    </>
                )}
                {...otherProps}
            >
                <div className={'w-full flex flex-col box-border'}>
                    <h1 className={'mb-[16px]'}>정말 신청하시겠어요?</h1>
                    <SStext className={'text-[16px] font-[NotoSansKR-500] mb-[30px]'}>한번 더 확인해주세요.</SStext>
                    <div className={'flex flex-col gap-[16px]'}>
                        <div className={'flex flex-row gap-[8px]'}>
                            <img src="/src/assets/img/icon_warning.svg" alt="#"/>
                            <SStext className={'text-[16px] font-[NotoSansKR-400]'}>예약이 완료되면 알림으로 알려드려요. 꼭 시간 내에 반납해주세요.</SStext>
                        </div>
                        <div className={'flex flex-row gap-[8px]'}>
                            <img src="/src/assets/img/icon_check.svg" alt="#"/>
                            <SStext className={'text-[16px] font-[NotoSansKR-400]'}>언제든지 취소할 수 있어요, 예약 목록에서 확인해주세요.</SStext>
                        </div>
                        <div className={'flex flex-row justify-start items-start gap-[8px] mb-[32px]'}>
                            <img src="/src/assets/img/icon_info.svg" alt="#"/>
                            <SStext className={'text-[16px] font-[NotoSansKR-400]'}>문의사항이 있으면 언제든지 알려주세요. <br/>최대한 빠르게 확인할게요! :)</SStext>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CheckModal*/
