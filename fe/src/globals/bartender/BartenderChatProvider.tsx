import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import {
    BartenderChatContext,
    type BartenderChatContextValue,
    type LastExchangeDisplay,
} from 'src/globals/bartender/bartenderChatContext.ts'
import {
    createBartenderRoom,
    DEFAULT_BARTENDER_FEATURE_KEY,
    isBackendConfigured,
    sendBartenderRoomMessage,
    type BackendChatMessageRow,
    type FeatureKey,
} from 'src/pages/url/log/bartenderBackend.ts'
import { Role, type Message } from 'src/pages/url/log/types.ts'

/**
 * 첫 진입 / 새 대화 시작 시 화면 상단에 보일 인사말.
 * 백엔드의 feature 별 default_greeting 은 사용자가 feature 를 고른 **이후**에
 * 새 룸이 만들어질 때 BE 가 자동으로 첫 메시지로 적재합니다.
 */
const INITIAL_GREETING = '어서 오세요, 단골손님. 오늘 하루는 어떠셨어요?'

function makeGreetingMessage(): Message {
    return {
        id: crypto.randomUUID(),
        role: Role.MODEL,
        content: INITIAL_GREETING,
        timestamp: new Date(),
    }
}

function messageFromBackend(row: BackendChatMessageRow): Message {
    return {
        id: `srv:${row.id}`,
        role: row.role === 'assistant' ? Role.MODEL : Role.USER,
        content: row.content,
        timestamp: new Date(row.created_at),
    }
}

function deriveLastExchange(messages: Message[]): LastExchangeDisplay | null {
    const lastModel = [...messages].reverse().find((m) => m.role === Role.MODEL)
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
        typeof lastModel.content === 'string' ? lastModel.content.trim() : ''
    if (!lastModelContent) return null
    return {
        lastUserContent: lastUser?.content.trim() || null,
        lastModelContent,
    }
}

export function BartenderChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>(() => [makeGreetingMessage()])
    const [isTyping, setIsTyping] = useState(false)
    const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey | null>(null)
    const messagesRef = useRef<Message[]>([])
    const roomIdRef = useRef<number | null>(null)

    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    const resetConversation = useCallback(() => {
        roomIdRef.current = null
        setActiveFeatureKey(null)
        setMessages([makeGreetingMessage()])
        setIsTyping(false)
    }, [])

    /**
     * `featureKey` 로 **새 룸**을 만들고 첫 사용자 메시지를 보낸 뒤 응답까지 받는다.
     * 화면은 항상 깨끗한 상태(=user 메시지 1개 + assistant 응답 1개)로 시작.
     */
    const startConversation = useCallback(
        async (featureKey: FeatureKey, firstUserText: string) => {
            const trimmed = firstUserText.trim()
            if (!trimmed || isTyping) return
            if (!isBackendConfigured()) {
                toast.error('서버 주소가 설정돼 있지 않아 대화를 시작할 수 없어요.')
                return
            }

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: Role.USER,
                content: trimmed,
                timestamp: new Date(),
            }
            // 이전 messages 는 즉시 비우고 새 대화 화면으로 갈아치운다.
            setMessages([userMessage])
            setActiveFeatureKey(featureKey)
            setIsTyping(true)

            try {
                const { roomId } = await createBartenderRoom(featureKey)
                roomIdRef.current = roomId
                const { assistant_message } = await sendBartenderRoomMessage(
                    roomId,
                    trimmed,
                )
                const assistant = messageFromBackend(assistant_message)
                setMessages([userMessage, assistant])
            } catch {
                toast.error('서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.')
                roomIdRef.current = null
                setActiveFeatureKey(null)
                // 첫 인사 + 단축 버튼 상태로 되돌림.
                setMessages([makeGreetingMessage()])
            } finally {
                setIsTyping(false)
            }
        },
        [isTyping],
    )

    /**
     * 일반 입력창에서의 송신.
     * - 활성 룸이 있으면 그대로 이어간다.
     * - 활성 룸이 없으면 default feature 로 새 룸을 만들고 보낸다.
     */
    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim()
            if (!trimmed || isTyping) return
            if (!isBackendConfigured()) {
                toast.error('서버 주소가 설정돼 있지 않아 대화를 시작할 수 없어요.')
                return
            }

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: Role.USER,
                content: trimmed,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, userMessage])
            setIsTyping(true)

            try {
                let rid = roomIdRef.current
                if (rid == null) {
                    const featureKey: FeatureKey =
                        activeFeatureKey ?? DEFAULT_BARTENDER_FEATURE_KEY
                    const { roomId } = await createBartenderRoom(featureKey)
                    rid = roomId
                    roomIdRef.current = roomId
                    setActiveFeatureKey(featureKey)
                }

                const { assistant_message } = await sendBartenderRoomMessage(
                    rid,
                    trimmed,
                )
                const assistant = messageFromBackend(assistant_message)
                setMessages((prev) => [...prev, assistant])
            } catch {
                toast.error('응답을 받지 못했어요. 잠시 후 다시 보내 주세요.')
            } finally {
                setIsTyping(false)
            }
        },
        [isTyping, activeFeatureKey],
    )

    const lastExchange = useMemo(() => deriveLastExchange(messages), [messages])

    const value = useMemo<BartenderChatContextValue>(
        () => ({
            messages,
            // 부팅 자동 복원이 사라져 동기적으로 greeting 만 깔리므로 늘 false.
            bootstrapping: false,
            isTyping,
            activeFeatureKey,
            lastExchange,
            sendMessage,
            startConversation,
            resetConversation,
        }),
        [
            messages,
            isTyping,
            activeFeatureKey,
            lastExchange,
            sendMessage,
            startConversation,
            resetConversation,
        ],
    )

    return (
        <BartenderChatContext.Provider value={value}>
            {children}
        </BartenderChatContext.Provider>
    )
}
