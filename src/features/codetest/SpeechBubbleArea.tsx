'use client'

import groupImage0 from '@/assets/images/Group 1410141690.svg'
import SSimageMarker from '@/shared/components/image/SSimageMarker'

const SpeechBubbleArea = () => {


    //todo 여기 데이터 어떤식으로 받아올지 에 따라서 [] 로 변경하거나, 하드코딩이면 어디서 받아올지 논의 필요


    // 이미지 넓이 375
    // 가로 넓이 171 세로 넓이 48


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
