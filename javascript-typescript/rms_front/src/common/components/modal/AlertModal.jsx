import {Modal} from "antd";
import SStext from "src/common/components/text/SStext.jsx";

const AlertModal = ({
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
                okType={'danger'}
                closeIcon={false}
                onOk={onOk}
                onCancel={onCancel}
                footer={(_,{OkBtn,CancelBtn})=>(
                    <>
                        <CancelBtn />
                        <OkBtn type={'primary'} danger />
                    </>
                )}
                {...otherProps}
            >
                <div className={'w-full flex flex-col box-border '}>
                    <h1 className={'mb-[6px]'}>정말 취소하시겠어요?</h1>
                    <SStext className={'text-[16px] font-[NotoSansKR-500] mb-[30px]'}>한번 더 확인해주세요.</SStext>
                    <div>
                        <div className={'flex flex-row gap-[8px] mb-[16px]'}><img src="/src/assets/img/icon_caution.svg" alt="#"/> <SStext className={'text-[16px] font-[NotoSansKR-400]'}>취소하면 정보를 복구할 수 없어요.</SStext>
                        </div>
                        <div className={'flex flex-row justify-start items-start gap-[8px] mb-[32px]'}><img src="/src/assets/img/icon_info.svg" alt="#"/> <SStext className={'text-[16px] font-[NotoSansKR-400]'}>문의사항이 있으면 언제든지 알려주세요. <br/>최대한 빠르게 확인할게요! :)</SStext>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AlertModal
