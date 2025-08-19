import { MobileLayout } from '@/shared/layout'
import SpeechBubbleArea from '@/features/codetest/SpeechBubbleArea'
import Image from 'next/image';
import groupImage from '@/assets/images/Group 1410141671.svg';

export default function Home() {
    return (
        <MobileLayout>

            <SpeechBubbleArea/>
        </MobileLayout>
    )
}
