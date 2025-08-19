'use client'

import groupImage0 from '@/assets/images/img.png'
import SSimageMarker from '@/shared/components/image/SSimageMarker'

const SpeechBubbleArea = () => {

    // todo 디자인 앞으로 어떤식으로 받을지 논의 필요 - 지금 너무 일러스트 처럼 사용중임

    return (
        <>

            <SSimageMarker
                src={groupImage0}
                imageWidth={375}
                markers={[
                    {
                        position:{
                            x: 50,
                            y: 50,
                        },
                        size:{
                            x: 171,
                            y: 48,
                        },
                        text: "asdasdasd",

                    }
                ]}
            />

        </>
    )
}

export default SpeechBubbleArea
