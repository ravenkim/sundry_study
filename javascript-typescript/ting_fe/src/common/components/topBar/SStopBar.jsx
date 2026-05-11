import ChevronLeftIcon from 'src/assets/images/icon/chevronLeftIcon.svg?react'
import XIcon from 'src/assets/images/icon/xIcon.svg?react'

const SStopBar = ({
    useBackButton = true,
    useCloseButton = true,
    onBackClick = () => {},
    onCloseClick = () => {},
}) => {
    return (
        <div
            className={`mb-[32px] mt-[20px] flex h-[38px] w-full flex-row items-center justify-between`}
        >
            <div>
                {useBackButton && <ChevronLeftIcon onClick={onBackClick} />}
            </div>
            <div>{useCloseButton && <XIcon onClick={onCloseClick} />}</div>
        </div>
    )
}

export default SStopBar