import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    ArrowLeft,
    ChevronRight,
    Loader2,
    Music,
    Send,
    Star,
    Utensils,
    Wine,
} from 'lucide-react'
import { Role, type Message } from 'src/pages/url/log/types.ts'
import { chatWithJun } from 'src/pages/url/log/chatService.ts'
import { Button } from 'src/shared/lib/shadcn/components/ui/button.tsx'
import { Input } from 'src/shared/lib/shadcn/components/ui/input.tsx'
import { Card, CardContent } from 'src/shared/lib/shadcn/components/ui/card.tsx'
import { cn } from 'src/shared/lib/shadcn/lib/utils.ts'
import { toast } from 'react-toastify'

const FALLBACK_OPENING =
    '어서오세요, 단골손님! 오늘 어떤 분위기세요?'

const LogPage = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [bootstrapping, setBootstrapping] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

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

    const handleSend = useCallback(async () => {
        if (!inputValue.trim() || isTyping || bootstrapping) return

        const text = inputValue.trim()
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: Role.USER,
            content: text,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            const historyForApi = [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
            }))
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
    }, [messages, inputValue, isTyping, bootstrapping])

    const handleMusicOpen = useCallback((url: string | undefined, q: string) => {
        if (url?.trim()) {
            window.open(url, '_blank', 'noopener,noreferrer')
        } else {
            const query = encodeURIComponent(q)
            window.open(
                `https://www.youtube.com/results?search_query=${query}`,
                '_blank',
                'noopener,noreferrer',
            )
        }
    }, [])

    return (
        <div className="font-serif relative flex min-h-screen flex-col">
            <div className="sepia-overlay pointer-events-none absolute inset-0 z-0 opacity-50" />

            <header className="border-border bg-background/90 fixed top-0 z-50 w-full border-b backdrop-blur-md">
                <div className="relative mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                window.history.length > 1
                                    ? navigate(-1)
                                    : navigate('/')
                            }
                            className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors"
                            aria-label="뒤로가기"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-muted-foreground hover:text-primary font-sans text-sm font-medium tracking-wide transition-colors"
                        >
                            홈
                        </button>
                    </div>
                    <h1 className="text-primary font-display pointer-events-none absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-tight sm:text-2xl">
                        대화 내역
                    </h1>
            
                </div>
            </header>

            <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col border-x border-border bg-background shadow-xl">
                <div
                    ref={scrollRef}
                    className="flex-1 space-y-8 overflow-y-auto px-5 py-6 pb-28 pt-[4.75rem] [scrollbar-width:thin] sm:px-6 sm:pt-20"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-border h-px flex-1" />
                        <span className="text-muted-foreground font-sans text-[10px] font-medium tracking-[0.3em] uppercase">
                            단골 바
                        </span>
                        <Star className="text-primary/60 h-3 w-3" />
                        <div className="bg-border h-px flex-1" />
                    </div>

                    {bootstrapping ? (
                        <div className="text-muted-foreground flex justify-center gap-2 py-12 font-sans text-sm">
                            <Loader2 className="text-primary h-5 w-5 animate-spin" />
                            바텐더가 자리에 앉는 중…
                        </div>
                    ) : null}

                    <AnimatePresence initial={false}>
                        {messages.map((message) => {
                            const rec = message.recommendation
                            return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    'flex flex-col',
                                    message.role === Role.USER
                                        ? 'items-end'
                                        : 'items-start',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex max-w-[min(100%,28rem)] gap-3',
                                        message.role === Role.USER
                                            ? 'flex-row-reverse'
                                            : 'flex-row',
                                    )}
                                >
                                    {message.role === Role.MODEL && (
                                        <div className="shrink-0">
                                            <div className="border-border bg-muted h-12 w-12 overflow-hidden rounded-full border-2 shadow-md">
                                                <img
                                                    src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200"
                                                    alt="바텐더 준"
                                                    className="h-full w-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="min-w-0 space-y-1">
                                        {message.role === Role.MODEL && (
                                            <span className="text-primary/90 ml-1 font-sans text-sm font-medium">
                                                준
                                            </span>
                                        )}
                                        <div
                                            className={cn(
                                                'rounded-2xl px-4 py-3 shadow-sm',
                                                message.role === Role.USER
                                                    ? 'bg-primary text-primary-foreground rounded-br-md'
                                                    : 'border-border bg-card text-card-foreground rounded-bl-md border',
                                            )}
                                        >
                                            <p className="text-base leading-relaxed">
                                                {message.content}
                                            </p>
                                        </div>
                                        <div
                                            className={cn(
                                                'mt-1 flex',
                                                message.role === Role.USER
                                                    ? 'justify-end'
                                                    : 'justify-start',
                                            )}
                                        >
                                            <span className="text-muted-foreground font-sans text-[10px] uppercase tracking-widest">
                                                {message.timestamp.toLocaleTimeString(
                                                    'ko-KR',
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    },
                                                )}
                                            </span>
                                        </div>

                                        {rec ? (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.98,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{ delay: 0.12 }}
                                                className="mt-3"
                                            >
                                                <Card className="border-primary/25 bg-card/95 overflow-hidden backdrop-blur-md">
                                                    <CardContent className="space-y-4 pt-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
                                                                <Wine className="text-primary h-8 w-8" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="text-primary font-display text-lg font-bold tracking-tight sm:text-xl">
                                                                    {rec.title}{' '}
                                                                    추천
                                                                </h3>
                                                                {rec.description ? (
                                                                    <p className="text-muted-foreground mt-1 font-sans text-sm italic">
                                                                        {
                                                                            rec.description
                                                                        }
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="bg-border relative my-2 h-px w-full">
                                                            <div className="bg-primary/30 absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="text-card-foreground flex items-start gap-3 text-sm">
                                                                <Utensils className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
                                                                <span>
                                                                    <span className="text-muted-foreground mr-2 font-sans text-xs uppercase tracking-widest">
                                                                        안주
                                                                    </span>
                                                                    {
                                                                        rec.foodPairing
                                                                    }
                                                                </span>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="border-primary/30 hover:bg-primary/5 w-full rounded-lg"
                                                                onClick={() =>
                                                                    handleMusicOpen(
                                                                        rec.musicUrl,
                                                                        rec.musicLabel,
                                                                    )
                                                                }
                                                            >
                                                                <Music className="text-primary/70 mr-2 h-4 w-4" />
                                                                <span className="font-sans text-sm tracking-wide">
                                                                    {
                                                                        rec.musicLabel
                                                                    }{' '}
                                                                    검색하기
                                                                </span>
                                                                <ChevronRight className="text-muted-foreground ml-auto h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.div>
                            )
                        })}
                    </AnimatePresence>

                    {isTyping ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted-foreground flex items-center gap-2 pl-14 font-sans text-sm"
                        >
                            <Loader2 className="text-primary h-4 w-4 animate-spin" />
                            준이 답을 적는 중…
                        </motion.div>
                    ) : null}
                </div>

                <div className="border-border bg-background/95 fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 backdrop-blur-md">
                    <div className="mx-auto flex max-w-2xl gap-2">
                        <Input
                            value={inputValue}
                            disabled={bootstrapping || isTyping}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing)
                                    void handleSend()
                            }}
                            placeholder="오늘 기분을 살짝만 이야기해 주세요…"
                            className="font-sans"
                            aria-label="메시지 입력"
                        />
                        <Button
                            type="button"
                            size="icon"
                            disabled={
                                bootstrapping ||
                                isTyping ||
                                !inputValue.trim()
                            }
                            onClick={() => void handleSend()}
                            aria-label="보내기"
                            className="shrink-0 rounded-full"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LogPage
