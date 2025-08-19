'use client'

import cartoonImage from '@/assets/images/cartoon.svg'
import SSimageMarker from '@/shared/components/image/SSimageMarker'
import SSresizableTextBox from '@/shared/components/text/SSresizableTextBox'
import React from 'react'
import TableArea from '@/features/codetest/TableArea'

const SpeechBubbleArea = () => {
    // todo 디자인 앞으로 어떤식으로 받을지 논의 필요 - 지금 너무 일러스트 처럼 사용중임 + 그룹지정할때 공백좀 없애주세요 ㅠㅠ

    return (
        <>
            <SSimageMarker
                src={cartoonImage}
                imageWidth={375}
                markers={[
                    {
                        position: {
                            x: 35,
                            y: 33.2,
                        },
                        size: {
                            x: 134,
                            y: 72,
                        },
                        component: (
                            <SSresizableTextBox maxFontSize={200}>
                                asdasdasd
                            </SSresizableTextBox>
                        ),
                    },
                    {
                        position: {
                            x: 50,
                            y: 50,
                        },
                        size: {
                            x: 171,
                            y: 48,
                        },
                        component: (
                            <SSresizableTextBox maxFontSize={200}>
                                asdasdasd
                            </SSresizableTextBox>
                        ),
                    },
                    {
                        position: {
                            x: 50,
                            y: 83,
                        },
                        size: {
                            x: 351,
                            y: 621,
                        },
                        component: (
                            <TableArea/>

                        ),
                    },
                ]}
            />
        </>
    )
}

export default SpeechBubbleArea
