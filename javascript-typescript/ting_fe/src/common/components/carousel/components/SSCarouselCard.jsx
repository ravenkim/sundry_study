import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from 'src/assets/shadcn/components/ui/carousel.jsx'
import IntroPage1 from 'src/features/intro/page/IntroPage1.jsx'
import IntroPage2 from 'src/features/intro/page/IntroPage2.jsx'
import IntroPage3 from 'src/features/intro/page/IntroPage3.jsx'
import IntroPage4 from 'src/features/intro/page/IntroPage4.jsx'
import { useSSCarousel } from './useSSCarousel'

function SSCarouselCard() {
    const { count, current, setCurrent, api } = useSSCarousel()

    return (
        <div>
            <CarouselContent>
                <CarouselItem>
                    <IntroPage1 />
                </CarouselItem>

                <CarouselItem>
                    <IntroPage2 />
                </CarouselItem>

                <CarouselItem>
                    <IntroPage3 />
                </CarouselItem>

                <CarouselItem>
                    <IntroPage4 />
                </CarouselItem>
            </CarouselContent>

            <div
                className={`flex w-full grow items-end justify-center pb-[64px]`}
            >
                {[...Array(parseInt(count))].map((_, index) => {
                    const isFocused = current - 1 === index
                    return (
                        <div
                            key={index}
                            className={`${isFocused ? 'w-[20px] bg-primary' : 'w-[10px] bg-muted'} mx-[4px] h-[10px] rounded`}
                            onClick={() => api.scrollTo(index)}
                        ></div>
                    )
                })}
            </div>
        </div>
    )
}

export default SSCarouselCard
