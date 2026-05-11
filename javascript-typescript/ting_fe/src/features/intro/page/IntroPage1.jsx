import { shallowEqual, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import IntroExImage from 'src/assets/images/image/introExImage.svg'
import CarouselCard from 'src/features/intro/components/CarouselCard';

const IntroPage1 = () => {
    const titles = ['혼자 가긴 무섭고', '너무 진지한 소개팅이', '질렸다면?']
    const description = '친구랑 같이 편하게 시작해요'

    const navigate = useNavigate()

    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )

    return (
        <div className={'w-full'}>
            <CarouselCard titles={titles} description={description} imgUlr={IntroExImage}/>
            {/* <TitleWithSubtitle titles={titles} description={description} /> */}
        </div>
    )
}

export default IntroPage1
