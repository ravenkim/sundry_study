import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
} from 'src/assets/shadcn/components/ui/carousel.jsx'

import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import IntroPage1 from 'src/features/intro/page/IntroPage1.jsx'
import IntroPage2 from 'src/features/intro/page/IntroPage2.jsx'
import IntroPage3 from 'src/features/intro/page/IntroPage3.jsx'
import IntroPage4 from 'src/features/intro/page/IntroPage4.jsx'

const Intro = () => {
    const maxPage = 4

    const navigate = useNavigate()

    const [pageNumber, setPageNumber] = useState(1)

    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)


    const { state } = useSelector(
        ({ routerReducer }) => ({
            state: routerReducer.location.state,
        }),
        shallowEqual,
    )

    useEffect(() => {
        if(pageNumber === maxPage + 1) {

            // todo 소셜 로그인 분기 처리
            if(state?.to === 'userJoin'){
                navigate('/user/join')
            }

        }
    }, [pageNumber])


    useEffect(() => {
        if(state?.from === 'userJoin'){
            setPageNumber(maxPage)
        }
    }, [state])


    useEffect(()=> {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap()+1)

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api, current])

    const ClickNext = () => {
        setCurrent(api.scrollNext())
    }

    return (
        <SSinnerWrapper>
            <SSinnerWrapper.Top>
                <div className={`flex flex-col h-full`}>

                <SStopBar
                useBackButton={false}
                    onCloseClick={() => navigate('/')}
                />

                <Carousel setApi={setApi} className={`flex flex-col grow`}>
                    <CarouselContent>
                        <CarouselItem>
                            <IntroPage1/>
                        </CarouselItem>

                        <CarouselItem>
                            <IntroPage2/>
                        </CarouselItem>

                        <CarouselItem>
                            <IntroPage3/>
                        </CarouselItem>

                        <CarouselItem>
                            <IntroPage4/>
                        </CarouselItem>
                    </CarouselContent>

                    {/* indicator */}
                    <div
                    className={`flex justify-center items-end grow w-full pb-[64px]`}>
                        {[...Array(parseInt(count))].map((_, index) => {
                            const isFocused = current - 1 === index
                            return(
                                <div key={index}
                                className={`${isFocused ? 'w-[20px] bg-primary' : 'w-[10px] bg-muted'} h-[10px] mx-[4px] rounded`}
                                onClick={()=>api.scrollTo(index)}
                                ></div>
                            )
                        })}
                    </div>
                </Carousel>
                </div>
            </SSinnerWrapper.Top>
            <SSinnerWrapper.Bottom>
                <SSbutton
                    text={'다음'}
                    onClick={()=>
                        ClickNext()
                    }
                />
            </SSinnerWrapper.Bottom>   
        </SSinnerWrapper>
    )
}

export default Intro



