import IntroExImage from 'src/assets/images/image/introExImage.svg'
import CarouselCard from 'src/features/intro/components/CarouselCard';

const IntroPage2 = ({ setPageNumber }) => {
    const titles = ['소개팅은 하고 싶은데', '어색할까봐 걱정된다면?']
    const description = '친구와 함께라면 걱정없어요!'


    return (
        <div className={'w-full'}>
            <CarouselCard titles={titles} description={description} imgUlr={IntroExImage}/>
            {/* <TitleWithSubtitle titles={titles} description={description} /> */}
        </div>
    )
}

export default IntroPage2
