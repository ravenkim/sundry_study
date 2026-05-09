import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import {
    BartenderChatContext,
    type BartenderChatContextValue,
    type LastExchangeDisplay,
} from 'src/globals/bartender/bartenderChatContext.ts'
import { chatWithJun } from 'src/pages/url/log/chatService.ts'
import { Role, type Message } from 'src/pages/url/log/types.ts'

const FALLBACK_OPENING =
    '어서오세요, 단골손님! 오늘 어떤 분위기세요?'

function deriveLastExchange(messages: Message[]): LastExchangeDisplay | null {
    const lastModel = [...messages]
        .reverse()
        .find((m) => m.role === Role.MODEL)
    if (!lastModel) return null
    const idx = messages.findIndex((m) => m.id === lastModel.id)
    let lastUser: Message | undefined
    for (let i = idx - 1; i >= 0; i--) {
        if (messages[i]?.role === Role.USER) {
            lastUser = messages[i]
            break
        }
    }
    const lastModelContent =
        typeof lastModel.content === 'string'
            ? lastModel.content.trim()
            : ''
    if (!lastModelContent) return null
    return {
        lastUserContent: lastUser?.content.trim() || null,
        lastModelContent,
    }
}

export function BartenderChatProvider({
    children,
}: {
    children: ReactNode
}) {
    const [messages, setMessages] = useState<Message[]>([])
    const [bootstrapping, setBootstrapping] = useState(true)
    const [isTyping, setIsTyping] = useState(false)
    const messagesRef = useRef<Message[]>([])

    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const response = await chatWithJun([])
                if (cancelled) return
                setMessages([
                    {
                        id: crypto.randomUUID(),
                        role: Role.MODEL,
                        content: response.content,
                        timestamp: new Date(),
                        recommendation: response.recommendation,
                    },
                ])
            } catch {
                if (!cancelled) {
                    setMessages([
                        {
                            id: crypto.randomUUID(),
                            role: Role.MODEL,
                            content: FALLBACK_OPENING,
                            timestamp: new Date(),
                        },
                    ])
                }
            } finally {
                if (!cancelled) setBootstrapping(false)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim()
        if (!trimmed || isTyping || bootstrapping) return

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: Role.USER,
            content: trimmed,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        try {
            const historyForApi = [...messagesRef.current, userMessage].map(
                (m) => ({
                    role: m.role,
                    content: m.content,
                }),
            )
            const response = await chatWithJun(historyForApi)

            const botMessage: Message = {
                id: crypto.randomUUID(),
                role: Role.MODEL,
                content: response.content,
                timestamp: new Date(),
                recommendation: response.recommendation,
            }
            setMessages((prev) => [...prev, botMessage])
            if (response.safetyCutoffSuggested) {
                toast.info('오늘은 여기까지 천천히 마셔 보세요.')
            }
        } catch {
            toast.error('응답을 받지 못했어요. 잠시 후 다시 보내 주세요.')
        } finally {
            setIsTyping(false)
        }
    }, [bootstrapping, isTyping])

    const lastExchange = useMemo(
        () => deriveLastExchange(messages),
        [messages],
    )

    const value = useMemo<BartenderChatContextValue>(
        () => ({
            messages,
            bootstrapping,
            isTyping,
            lastExchange,
            sendMessage,
        }),
        [
            messages,
            bootstrapping,
            isTyping,
            lastExchange,
            sendMessage,
        ],
    )

    return (
        <BartenderChatContext.Provider value={value}>
            {children}
        </BartenderChatContext.Provider>
    )
}
