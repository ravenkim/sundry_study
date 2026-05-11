import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/assets/shadcn/components/ui/button'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { useSSCarousel } from 'src/common/components/carousel/components/useSSCarousel'

function SSCarouselButton({ Nextpage }) {
    const navigate = useNavigate()
    const { count, current, setCurrent, api } = useSSCarousel()

    const [isMobile, setIsMobile] = useState(
        /iPhone|iPad|webOS|iPod|Android/i.test(navigator.userAgent),
    )
    const [hovered, setHovered] = useState(false)

    const handleTouch = () => {
        if (isMobile) {
            setHovered(true)
            setTimeout(() => {
                setHovered(false)
            }, 1000) // 1초 후 원래대로
        }
    }

    const handleButtonClick = () => {
        if (current === count) {
            handleTouch
            navigate(Nextpage)
        } else {
            handleTouch
            setCurrent(api.scrollNext())
        }
    }

    return (
        <SSbutton
            text={`${current === count ? '시작하기' : '다음'}`}
            onClick={() => handleButtonClick()}
            className={`h-[56px]`}
        />
    )
}

export default SSCarouselButton
