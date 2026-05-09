import { Loader2, Palette, User, FileText, Scroll, Send, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useBartenderChat } from 'src/globals/bartender/useBartenderChat.ts'
import { Button } from 'src/shared/lib/shadcn/components/ui/button.tsx'
import SScolorDrawer from 'src/shared/components/theme/SScolorDrawer.tsx'
import type { FeatureKey } from 'src/pages/url/log/bartenderBackend.ts'
import { Role } from 'src/pages/url/log/types.ts'

/**
 * 첫 번째 선택 전용 — 라벨 / 서버로 보낼 문장 / **새 룸을 만들 때 쓸 feature_key**.
 * `featureKey` 는 `be/app/ai/feature_registry.py` 와 1:1 매핑되어야 한다.
 */
const FIRST_TURN_CHOICES: ReadonlyArray<{
    featureKey: FeatureKey
    label: string
    text: string
}> = [
    {
        featureKey: 'late_night',
        label: '하루가 좀 무거워요',
        text: '오늘 하루가 좀 힘들었어요. 잠깐 이야기 들어줄 수 있어요?',
    },
    {
        featureKey: 'drink_recommend',
        label: '마실 거 추천해 주세요',
        text: '지금 분위기에 맞게 뭐 마시면 좋을지 하나만 추천해 줘요.',
    },
    {
        featureKey: 'fridge_recipe',
        label: '냉장고 재료로 안주',
        text: '집에 남은 재료로 혼자 먹기 괜찮은 안주 아이디어가 필요해요.',
    },
    {
        featureKey: 'bar_counter',
        label: '그냥 가볍게 잡담',
        text: '특별한 건 없어요. 가볍게 잡담만 할래요.',
    },
]

const HomePage = () => {
    const [inputValue, setInputValue] = useState('')
    const {
        messages,
        bootstrapping,
        isTyping,
        lastExchange,
        sendMessage,
        startConversation,
        resetConversation,
    } = useBartenderChat()

    const awaitingFirstPick = useMemo(
        () => !messages.some((m) => m.role === Role.USER),
        [messages],
    )

    const showChoiceButtons =
        !bootstrapping && !isTyping && awaitingFirstPick

    const canSend =
        inputValue.trim().length > 0 && !bootstrapping && !isTyping

    const handleSend = () => {
        if (!canSend) return
        const text = inputValue.trim()
        setInputValue('')
        void sendMessage(text)
    }

    const handleFirstChoice = (featureKey: FeatureKey, text: string) => {
        if (bootstrapping || isTyping || !awaitingFirstPick) return
        void startConversation(featureKey, text)
    }

    const handleResetConversation = () => {
        if (isTyping) return
        setInputValue('')
        resetConversation()
    }

    return (
        <div className="font-serif relative flex min-h-screen flex-col">
            {/* Background with Sepia Overlay */}
            <div className="sepia-overlay absolute inset-0 z-0 opacity-50" />

            {/* Top Header Navigation */}
            <header className="border-border bg-background/90 fixed top-0 z-50 w-full border-b backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-center p-4">
                    <nav className="flex items-center gap-8 md:gap-16">
                        <SScolorDrawer>
                            <button
                                type="button"
                                className="group flex flex-col items-center transition-transform hover:scale-105"
                            >
                                <Palette className="text-primary group-hover:brightness-110 h-6 w-6" />
                                <span className="text-muted-foreground mt-1 font-sans text-[10px] uppercase tracking-widest md:text-xs">
                                    테마
                                </span>
                            </button>
                        </SScolorDrawer>
                        <button
                            type="button"
                            className="group flex flex-col items-center transition-transform hover:scale-105"
                        >
                            <User className="text-primary group-hover:brightness-110 h-6 w-6" />
                            <span className="text-muted-foreground mt-1 font-sans text-[10px] uppercase tracking-widest md:text-xs">
                                캐릭터
                            </span>
                        </button>
                        <Link
                            to="/note"
                            className="group flex flex-col items-center transition-transform hover:scale-105"
                        >
                            <FileText className="text-primary group-hover:brightness-110 h-6 w-6" />
                            <span className="text-muted-foreground mt-1 font-sans text-[10px] uppercase tracking-widest md:text-xs">
                                노트
                            </span>
                        </Link>
                        <Link
                            to="/log"
                            className="group flex flex-col items-center transition-transform hover:scale-105"
                        >
                            <Scroll className="text-primary group-hover:brightness-110 h-6 w-6" />
                            <span className="text-muted-foreground mt-1 font-sans text-[10px] uppercase tracking-widest md:text-xs">
                                로그
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={handleResetConversation}
                            disabled={isTyping || awaitingFirstPick}
                            className="group flex flex-col items-center transition-transform enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="새 대화 시작"
                            title="새 대화 시작 (다른 feature 로 바꾸려면 먼저 누르세요)"
                        >
                            <RefreshCw className="text-primary group-hover:brightness-110 h-6 w-6" />
                            <span className="text-muted-foreground mt-1 font-sans text-[10px] uppercase tracking-widest md:text-xs">
                                새 대화
                            </span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Bar Scene */}
            <main className="relative flex flex-grow flex-col items-center justify-center px-4 pb-32 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex w-full max-w-lg flex-col items-center"
                >
                    {/* Speech Bubble — 마지막 주고받음만 */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 w-full"
                    >
                        <div className="bg-card/90 border-border border relative rounded-2xl p-6 text-center shadow-2xl backdrop-blur-lg md:p-8">
                            {bootstrapping ? (
                                <div className="text-muted-foreground flex flex-col items-center gap-3 py-4 font-sans text-sm">
                                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                                    바텐더가 자리에 앉는 중…
                                </div>
                            ) : isTyping ? (
                                <div className="text-muted-foreground flex flex-col items-center gap-3 py-6 font-sans text-sm md:py-8">
                                    <Loader2 className="text-primary h-10 w-10 animate-spin" />
                                    답을 적는 중…
                                </div>
                            ) : lastExchange ? (
                                <div className="space-y-4 text-left">
                                    {lastExchange.lastUserContent ? (
                                        <p className="text-muted-foreground border-border/60 font-sans text-sm leading-relaxed">
                                            <span className="text-primary/80 mr-2 font-medium">
                                                나
                                            </span>
                                            {lastExchange.lastUserContent}
                                        </p>
                                    ) : null}
                                    <div>
                                        <p className="text-primary/90 font-sans mb-2 text-xs font-medium uppercase tracking-widest">
                                            준
                                        </p>
                                        <p className="text-card-foreground text-lg font-light leading-relaxed md:text-xl">
                                            {lastExchange.lastModelContent}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                            {/* Bubble Pointer */}
                            <div className="border-border/40 bg-card absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-r border-b shadow-xl" />
                        </div>
                    </motion.div>

                    {/* Bartender Character Image */}
                    <div className="group relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="border-primary border-2 h-80 w-64 overflow-hidden rounded-t-full border-b-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] md:h-[28rem] md:w-80"
                        >
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgI2XN5bCZN9ocSu6W_9XNdswMg842wHYVpD9CoYnMcINXyMXJIItjVJmN-L7lsdksgs08mJHIhQUK-_O4n0-RT7KWb2WRdctA98uZNzHGI8R385WKf6taVEtm2Laa3EOm_DQ0kjTxAWs0nB3mW0AxowR89so_ypzP3X1Ghqm8ukxNU_4z2UGHyZth6oR2ujxS7nERylcswAQnAqG-w3r0C5YfJvKkdZ4yLuGuNzOMh4DD6lKj3yahqNIggUWiks8UmLRVO2mKgOQz"
                                alt="Jun the Bartender"
                                className="h-full w-full object-cover grayscale brightness-75 contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-90"
                            />
                        </motion.div>

                        {/* Ambient Lighting Glow */}
                        <div className="from-background absolute inset-0 rounded-t-full bg-gradient-to-t via-transparent to-transparent opacity-60" />
                    </div>
                </motion.div>
            </main>

            {/* Bottom: 첫 턴은 선택 버튼, 이후 텍스트 입력 */}
            <footer className="border-border bg-card/95 fixed bottom-0 left-0 z-50 w-full border-t px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <div className="mx-auto max-w-3xl">
                    {showChoiceButtons ? (
                        <div
                            className="flex flex-col gap-3"
                            role="group"
                            aria-label="첫 질문 선택"
                        >
                            <p className="text-muted-foreground text-center font-sans text-xs tracking-wide">
                                오늘은 어떤 이야기부터 할까요?
                            </p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {FIRST_TURN_CHOICES.map(({ featureKey, label, text }) => (
                                    <Button
                                        key={featureKey}
                                        type="button"
                                        variant="outline"
                                        className="border-primary/40 bg-background/60 text-card-foreground hover:bg-primary/10 h-auto min-h-[3rem] justify-center rounded-2xl px-4 py-3 text-center font-sans text-sm font-medium leading-snug whitespace-normal"
                                        onClick={() => handleFirstChoice(featureKey, text)}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={inputValue}
                                    disabled={bootstrapping || isTyping}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            !e.nativeEvent.isComposing
                                        ) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder={
                                        bootstrapping
                                            ? '잠시만요…'
                                            : '바텐더에게 말을 걸어보세요...'
                                    }
                                    className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary font-serif shadow-inner w-full rounded-full border-2 px-6 py-4 text-lg transition-all focus:outline-none disabled:opacity-60"
                                    aria-label="바텐더에게 메시지"
                                />
                            </div>
                            <button
                                type="button"
                                disabled={!canSend}
                                onClick={handleSend}
                                className="bg-primary text-primary-foreground group flex items-center justify-center rounded-full p-4 shadow-lg transition-all enabled:hover:scale-110 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="보내기"
                            >
                                <Send className="h-6 w-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default HomePage
