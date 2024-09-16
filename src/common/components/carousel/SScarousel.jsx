import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from 'src/assets/shadcn/components/ui/carousel.jsx'

const SScarousel = ({ children }) => {
    //이런식으로 만들수 있지만 그러면 SSinnerWrapper 부분이 애매해 지기에 패스  >> SSinnerWrapper 안에 SSinnerWrapper 를 넣을지 이걸 위한 공간을 만들어주고 만들어야해서 이부분 생각이 필요하다고 생각함

    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(React.Children.count(children))
    }, [children])

    return (
        <div>
            <Carousel>
                <CarouselContent>{children}</CarouselContent>
            </Carousel>
        </div>
    )
}

SScarousel.displayName = 'SScarousel'

function Item({ children }) {
    return <CarouselItem>{children}</CarouselItem>
}

Item.displayName = 'SScarousel.Item'
SScarousel.Item = Item

export default SScarousel
