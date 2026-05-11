import { Carousel } from 'src/assets/shadcn/components/ui/carousel'

import { createContext, useState, useEffect, useReducer } from 'react'

export const SSCarouselContext = createContext()

function SSCarouselProvider({ className, children, ...props }) {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    // useEffect(() => {
    //     setCount(React.Children.count(children))
    // }, [children])

    useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api, current])

    const clickNext = () => {
        setCurrent(api.scrollNext())
    }

    return (
        <SSCarouselContext.Provider
            value={{ count, current, setCurrent, api }}
            className={className}
        >
            <Carousel setApi={setApi} className={`h-full`}>
                {children}
            </Carousel>
        </SSCarouselContext.Provider>
    )
}

export default SSCarouselProvider
