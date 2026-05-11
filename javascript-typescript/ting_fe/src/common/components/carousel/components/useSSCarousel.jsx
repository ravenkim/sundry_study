import { useContext } from 'react'
import { SSCarouselContext } from 'src/common/components/carousel/components/SSCarouselProvider'

export function useSSCarousel() {
    const context = useContext(SSCarouselContext)
    if (!context) {
        throw new Error(
            'useSSCarousel must be used within a SSCarouselProvider',
        )
    }
    return context
}
