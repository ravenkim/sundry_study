import { createContext } from 'react'
import type { FeatureKey } from 'src/pages/url/log/bartenderBackend.ts'
import type { Message } from 'src/pages/url/log/types.ts'

export type LastExchangeDisplay = {
    lastUserContent: string | null
    lastModelContent: string
}

export type BartenderChatContextValue = {
    messages: Message[]
    bootstrapping: boolean
    isTyping: boolean
    /** 현재 활성 채팅방의 feature_key. 아직 시작 안 했으면 null. */
    activeFeatureKey: FeatureKey | null
    lastExchange: LastExchangeDisplay | null
    /** 일반 입력창에서의 메시지 전송. 룸이 없으면 기본 feature 로 새로 만든 뒤 보낸다. */
    sendMessage: (text: string) => Promise<void>
    /** 단축 버튼: 지정한 feature 로 **새 룸**을 만들고 첫 사용자 메시지까지 한 번에 보낸다. */
    startConversation: (featureKey: FeatureKey, firstUserText: string) => Promise<void>
    /** 새 대화 시작. 화면을 초기 greeting + 단축 버튼 상태로 되돌린다. */
    resetConversation: () => void
}

export const BartenderChatContext =
    createContext<BartenderChatContextValue | null>(null)
