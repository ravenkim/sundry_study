// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
// } from 'src/assets/shadcn/components/ui/carousel.jsx'

// import SSbutton from 'src/common/components/button/SSbutton.jsx'

// // 1. 캐러셀 구현
// // 2. 다른 페이지에서 캐러셀 있는 페이지 들어왔을 때 처음or마지막 보여주는 프로세스
// // 3. button에 어떤 기능 넣을건지 자식에서 받기
// // 4. 캐러셀에 들어갈 내용도 전달받기
// // 캐러셀 카드 / dot indicator / button 부분 export해서 조합해서 사용하도록

// const SSCarouselContext = createContext()

// function SSCarousel() {
//     const { current, setCurrent } = useSSCarousel()
// }

// function SSCarouselButton({ Nextpage }) {
//     const navigate = useNavigate()
//     const { count, current, setCurrent, api } = useSSCarousel()

//     const handleButtonClick = () => {
//         if (current == count) {
//             navigate(Nextpage)
//         } else {
//             setCurrent(api.scrollNext())
//         }
//     }

//     return <SSbutton text={'다음'} onClick={() => handleButtonClick()} />
// }

// function useSSCarousel() {
//     const context = useContext(SSCarouselContext)
//     if (!context) {
//         throw new Error(
//             'useSSCarousel must be used within a SSCarouselProviser',
//         )
//     }
//     return context
// }

// function SSCarouselProvider({ children }) {
//     const [api, setApi] = useState()
//     const [current, setCurrent] = useState(0)
//     const [count, setCount] = useState(0)

//     useEffect(() => {
//         setCount(React.Children.count(children))
//     }, [children])

//     useEffect(() => {
//         if (!api) {
//             return
//         }
//         setCount(api.scrollSnapList().length)
//         setCurrent(api.selectedScrollSnap() + 1)

//         api.on('select', () => {
//             setCurrent(api.selectedScrollSnap() + 1)
//         })
//     }, [api, current])

//     return (
//         <SSCarouselProvider value={{ count, current, setCurrent, api }}>
//             <Carousel setApi={setApi}>{children}</Carousel>
//         </SSCarouselProvider>
//     )
// }

// export default { SSCarousel, SSCarouselButton, SSCarouselProvider }
