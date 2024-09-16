import STh2 from 'src/common/components/typography/STh2.jsx'
import STb1 from 'src/common/components/typography/STb1.jsx'

const TitleWithSubtitle = ({ titles, description }) => {
    return (
        <div className={`flex h-[161px] w-full flex-col items-center justify-center`}>
            <div className={`mb-[12px] w-full`}>
                {titles.map((title, index) => (
                    <STh2 key={index}>{title}</STh2>
                ))}
            </div>
            <STb1 center={true}>{description}</STb1>
        </div>
    );
};

export default TitleWithSubtitle