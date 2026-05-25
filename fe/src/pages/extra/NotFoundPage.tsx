import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Home } from 'lucide-react'
import { MascotBubble, MascotImage } from 'src/shared/components/mascort'
import { EcoButton, EcoCard } from 'src/shared/ui/eco'

const NotFoundPage = () => {
    const { t } = useTranslation(['notFound', 'common'])
    const navigate = useNavigate()

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-5 font-sans">
            <div className="flex w-full max-w-[390px] flex-col items-center gap-8">
                <header className="flex flex-col items-center gap-1">
                    <p className="text-primary/20 text-7xl leading-none font-black tracking-tight">
                        {t('notFound:code')}
                    </p>
                    <h1 className="text-primary text-2xl font-black">
                        {t('notFound:brand')}
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
                        {t('notFound:mascotBubble')}
                    </MascotBubble>
                </div>

                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-on-surface text-xl font-black">
                        {t('notFound:title')}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                        {t('notFound:descriptionLine1')}
                        <br />
                        {t('notFound:descriptionLine2')}
                    </p>
                </div>

                <EcoCard className="text-on-surface-variant w-full space-y-1.5 p-4 text-left text-sm">
                    <p className="text-on-surface text-xs font-bold tracking-wide uppercase">
                        {t('notFound:tipsTitle')}
                    </p>
                    <p>{t('notFound:tipUrlTypo')}</p>
                    <p>{t('notFound:tipUseMenu')}</p>
                    <p>{t('notFound:tipLogin')}</p>
                </EcoCard>

                <div className="flex w-full flex-col gap-2">
                    <Link to="/" className="w-full">
                        <EcoButton className="w-full gap-2 py-4 text-base font-bold">
                            <Home className="h-5 w-5" />
                            {t('notFound:goHome')}
                        </EcoButton>
                    </Link>
                    <EcoButton
                        type="button"
                        variant="outline"
                        className="w-full gap-2 py-3"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                        {t('notFound:goBack')}
                    </EcoButton>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
