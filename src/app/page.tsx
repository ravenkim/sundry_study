import { MobileLayout } from '@/shared/layout'
import SpeechBubbleArea from '@/features/codetest/SpeechBubbleArea'
import Image from 'next/image';
import groupImage from '@/assets/images/Group 1410141671.svg';
import ResizableTextBox from '@/shared/components/text/ResizableTextBox'

export default function Home() {
    return (
        <MobileLayout>

            <div
            className={'w-20 h-20 bg-red-500'}
            >
                <ResizableTextBox>
                    asddddddddddddddddddd asdasdjklasd
                    asdk;asldkalsd
                    asdasdsad

                </ResizableTextBox>

            </div>

            {/*<SpeechBubbleArea/>*/}
        </MobileLayout>
    )
}
