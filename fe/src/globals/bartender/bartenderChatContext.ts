import { createContext } from 'react'
import type { Message } from 'src/pages/url/log/types.ts'

export type LastExchangeDisplay = {
    lastUserContent: string | null
    lastModelContent: string
}

export type BartenderChatContextValue = {
    messages: Message[]
    bootstrapping: boolean
    isTyping: boolean
    lastExchange: LastExchangeDisplay | null
    sendMessage: (text: string) => Promise<void>
}

export const BartenderChatContext =
    createContext<BartenderChatContextValue | null>(null)
