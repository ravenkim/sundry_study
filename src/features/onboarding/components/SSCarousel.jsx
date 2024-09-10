import * as React from 'react'
import introExImage from 'src/assets/images/image/introExImage.svg'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
} from 'src/assets/shadcn/components/ui/carousel.jsx'
import CarouselContents from 'src/features/onboarding/components/CarouselContents'

const SSCarousel = () => {
    const [api, setApi] = React.useState()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api, current])

    return (
        <div>
            <Carousel setApi={setApi}>
                <CarouselContent>
                    <CarouselItem>
                        <CarouselContents
                            mainText={
                                '11혼자 가긴 무섭고\n 너무 진지한 소개팅이\n 질렸다면?'
                            }
                            subText={'친구랑 같이 편하게 시작해요'}
                            img={introExImage}
                        ></CarouselContents>
                    </CarouselItem>
                    <CarouselItem>
                        <CarouselContents
                            mainText={
                                '22혼자 가긴 무섭고\n 너무 진지한 소개팅이\n 질렸다면?'
                            }
                            subText={'친구랑 같이 편하게 시작해요'}
                            img={introExImage}
                        ></CarouselContents>
                    </CarouselItem>
                    <CarouselItem>
                        <CarouselContents
                            mainText={
                                '33혼자 가긴 무섭고\n 너무 진지한 소개팅이\n 질렸다면?'
                            }
                            subText={'친구랑 같이 편하게 시작해요'}
                            img={introExImage}
                        ></CarouselContents>
                    </CarouselItem>
                </CarouselContent>
                <div
                    style={{
                        width: '100%',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    {[...Array(parseInt(count))].map((_, index) => {
                        const isFocused = current - 1 === index
                        return (
                            <div
                                key={index}
                                style={{
                                    width: '7px',
                                    height: '7px',
                                    margin: '0px 5px',
                                    borderWidth: '1px',
                                    borderColor: 'black',
                                    backgroundColor: isFocused
                                        ? 'black'
                                        : 'white',
                                    borderRadius: '10px',
                                }}
                                onClick={() => api.scrollTo(index)}
                            />
                        )
                    })}
                </div>
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default SSCarousel
