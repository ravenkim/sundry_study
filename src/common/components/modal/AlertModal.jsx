import {Button, Modal} from "antd";
import SSbutton from "../button/SSbutton.jsx";

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
                {...otherProps}
            >
                <div className={'w-full flex flex-col box-border'}>
                    <h1 className={'mb-[16px]'}>정말 취소하시겠어요?</h1>
                    <span className={'text-[#232433] text-[16px] mb-[30px]'}>한번 더 확인해주세요.</span>
                    <div>
                        <div className={'flex flex-row gap-[8px]'}><img src="/src/assets/img/icon_caution.svg" alt="#"/> <span>취소하면 정보를 복구할 수 없어요.</span>
                        </div>
                        <div className={'flex flex-row justify-start items-start gap-[8px]'}><img src="/src/assets/img/icon_info.svg" alt="#"/> <span>문의사항이 있으면 언제든지 알려주세요. <br/>최대한 빠르게 확인할게요! :)</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AlertModal
