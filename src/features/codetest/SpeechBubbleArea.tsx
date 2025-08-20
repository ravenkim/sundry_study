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
                            y: 33.4,
                        },
                        size: {
                            x: 140,
                            y: 78,
                        },
                        component: (
                            <SSresizableTextBox maxFontSize={200}>
                                이제 본격적으로 00님의 사주팔자를 분석해볼 차례네요.
                            </SSresizableTextBox>
                        ),
                    },
                    {
                        position: {
                            x: 39,
                            y: 50.5,
                        },
                        size: {
                            x: 180,
                            y: 53,
                        },
                        component: (
                            <SSresizableTextBox maxFontSize={200}>
                                제가 00님의 사주를 보기 쉽게 표로 정리했어요
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
