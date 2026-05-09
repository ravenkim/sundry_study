import { Loader2, Palette, User, FileText, Scroll, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router'
import { useBartenderChat } from 'src/globals/bartender/useBartenderChat.ts'
import SScolorDrawer from 'src/shared/components/theme/SScolorDrawer.tsx'

const HomePage = () => {
    const [inputValue, setInputValue] = useState('')
    const {
        bootstrapping,
        isTyping,
        lastExchange,
        sendMessage,
    } = useBartenderChat()

    const canSend =
        inputValue.trim().length > 0 && !bootstrapping && !isTyping

    const handleSend = () => {
        if (!canSend) return
        const text = inputValue.trim()
        setInputValue('')
        void sendMessage(text)
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

            {/* Bottom Chat Input Area */}
            <footer className="border-border bg-card/95 fixed bottom-0 left-0 z-50 w-full border-t px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <div className="mx-auto flex max-w-3xl items-center gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={inputValue}
                            disabled={bootstrapping || isTyping}
                            onChange={(e) => setInputValue(e.target.value)}
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
            </footer>
        </div>
    )
}

export default HomePage
