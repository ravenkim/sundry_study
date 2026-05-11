import { useContext } from 'react'
import {
    BartenderChatContext,
    type BartenderChatContextValue,
} from 'src/globals/bartender/bartenderChatContext.ts'

export function useBartenderChat(): BartenderChatContextValue {
    const ctx = useContext(BartenderChatContext)
    if (!ctx) {
        throw new Error(
            'useBartenderChat must be used within BartenderChatProvider',
        )
    }
    return ctx
}
