import STh2 from 'src/common/components/typography/STh2.jsx'
import STb1 from 'src/common/components/typography/STb1.jsx'

const TitleWithSubtitle = ({ titles, description }) => {
    return (
        <div
            className={`flex h-[161px] w-full flex-col items-start justify-center`}
        >
            <div className={`mb-[12px]`}>
                {titles.map((title, index) => (
                    <div key={index} className={`w-max`}>
                        <STh2 >{title}</STh2>
                    </div>
                ))}
            </div>
            <STb1 center={true}>{description}</STb1>
        </div>
    )
}

export default TitleWithSubtitle