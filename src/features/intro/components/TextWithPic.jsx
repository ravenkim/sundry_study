import STh2 from 'src/common/components/typography/STh2.jsx'
import STb1 from 'src/common/components/typography/STb1.jsx'

const TextWithPic = ({ title, subTitle, children }) => {
    return (
        <div className={'w-full'}>
            <STh2>{title}</STh2>

            <STb1>{subTitle}</STb1>

            {children}
        </div>
    )
}

export default TextWithPic
