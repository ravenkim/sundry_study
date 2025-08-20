import { MobileLayout } from '@/shared/layout'
import SpeechBubbleArea from '@/features/codetest/SpeechBubbleArea'
import TableArea from '@/features/codetest/TableArea'
export default function Home() {
    return (
        <MobileLayout>
            <SpeechBubbleArea />

            <TableArea />
        </MobileLayout>
    )
}
