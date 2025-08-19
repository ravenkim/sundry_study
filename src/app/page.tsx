import { MobileLayout } from '@/shared/layout'
import ResizableTextBox from '@/shared/components/text/ResizableTextBox'

export default function Home() {
    return (
        <MobileLayout>
            <div className={'h-60 w-80 bg-red-500'}>
                <ResizableTextBox maxFontSize={200}>
                    ㅁㄴㅇㅁㅇㄴㅁㅁㄴㅇㅁㄴㅇㄴㅁㅇ
                </ResizableTextBox>
            </div>

            {/*<SpeechBubbleArea/>*/}
        </MobileLayout>
    )
}
