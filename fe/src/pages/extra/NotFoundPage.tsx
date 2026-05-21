import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Home } from 'lucide-react'
import { MascotBubble, MascotImage } from 'src/shared/components/mascort'
import { EcoButton, EcoCard } from 'src/shared/ui/eco'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-5 font-sans">
            <div className="flex w-full max-w-[390px] flex-col items-center gap-8">
                <header className="flex flex-col items-center gap-1">
                    <p className="text-primary/20 text-7xl leading-none font-black tracking-tight">
                        404
                    </p>
                    <h1 className="text-primary text-2xl font-black">
                        EcoReport
                    </h1>
                </header>

                <div className="relative flex w-full flex-col items-center gap-6">
                    <div className="bg-primary-container/20 ring-primary-container/30 rounded-full p-6 ring-4">
                        <MascotImage
                            emotion="question"
                            size="hero"
                            decorative
                        />
                    </div>

                    <MascotBubble
                        emotion="question"
                        size="md"
                        className="w-full max-w-[320px]"
                    >
                        여기는 빈 강의실이 아니라… 길을 잃은 것 같아요!
                    </MascotBubble>
                </div>

                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-on-surface text-xl font-black">
                        페이지를 찾을 수 없어요
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
                        <br />
                        아래 버튼으로 다시 이동해 보세요.
                    </p>
                </div>

                <EcoCard className="text-on-surface-variant w-full space-y-1.5 p-4 text-left text-sm">
                    <p className="text-on-surface text-xs font-bold tracking-wide uppercase">
                        이렇게 해보세요
                    </p>
                    <p>• 주소(URL)에 오타가 없는지 확인해 주세요.</p>
                    <p>• 홈에서 제보·이력 메뉴를 다시 선택해 주세요.</p>
                    <p>• 로그인이 필요한 페이지라면 먼저 로그인해 주세요.</p>
                </EcoCard>

                <div className="flex w-full flex-col gap-2">
                    <Link to="/" className="w-full">
                        <EcoButton className="w-full gap-2 py-4 text-base font-bold">
                            <Home className="h-5 w-5" />
                            홈으로 가기
                        </EcoButton>
                    </Link>
                    <EcoButton
                        type="button"
                        variant="outline"
                        className="w-full gap-2 py-3"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                        이전 페이지
                    </EcoButton>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
