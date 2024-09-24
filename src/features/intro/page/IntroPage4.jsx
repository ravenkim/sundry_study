import IntroExImage from 'src/assets/images/image/introExImage.svg'
import CarouselCard from 'src/features/intro/components/CarouselCard';

const IntroPage4 = ({ setPageNumber }) => {
    const titles = ['우리 같이 Ting 할래요?']
    const description = '시작은 가볍게, 인연은 특별하게!'

    return (
        <div className={'w-full'}>
            <CarouselCard titles={titles} description={description} imgUlr={IntroExImage}/>
            {/* <TitleWithSubtitle titles={titles} description={description} /> */}
        </div>
    )
}

export default IntroPage4
