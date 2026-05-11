import IntroExImage from 'src/assets/images/image/introExImage.svg'
import CarouselCard from 'src/features/intro/components/CarouselCard';

const IntroPage3 = ({ setPageNumber }) => {
    const titles = ['다 함께 즐기는 Ting!']
    const description = '장기 재학생도, 직장인도, 친구랑도'

    return (
        <div className={'w-full'}>
            <CarouselCard titles={titles} description={description} imgUlr={IntroExImage}/>
            {/* <TitleWithSubtitle titles={titles} description={description} /> */}
        </div>
    )
}

export default IntroPage3