import { Link } from 'react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Camera,
    Sparkles,
    Coins,
    RefreshCw,
    Building2,
    Mountain,
    GraduationCap,
    Leaf,
    Users,
    Zap,
    TreePine,
    Calculator,
    ExternalLink,
} from 'lucide-react'
import { MascotImage } from 'src/shared/components/mascort'
import { EcoBadge, EcoButton, EcoCard } from 'src/shared/ui/eco'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

const FLOW_ICONS = [Camera, Sparkles, Coins, RefreshCw] as const
const WHY_ICONS = [Building2, Mountain, GraduationCap] as const
const IMPACT_ICONS = [Zap, Leaf, TreePine] as const

export function AboutUsPage() {
    const { t } = useTranslation('about')

    const flowSteps = ['report', 'ai', 'reward', 'cycle'] as const
    const whyCards = ['management', 'physical', 'culture'] as const
    const impactStats = ['waste', 'saving', 'co2'] as const
    const culturePoints = ['experience', 'education', 'expansion'] as const
    const constantKeys = [
        'fluorescent',
        'led',
        'ac',
        'rate',
        'co2Factor',
        'tree',
    ] as const
    const formulaKeys = ['kwh', 'cost', 'co2', 'point', 'cap'] as const
    const referenceKeys = ['kses', 'pccs', 'keep', 'kpx', 'forest', 'kepco'] as const
    const exampleMetrics = ['kwh', 'cost', 'co2', 'points'] as const

    return (
        <div className="flex flex-col gap-8 p-5 pb-10">
            <section className="flex flex-col items-center gap-4 pt-2 text-center">
                <EcoBadge variant="yellow" className="px-3 py-1 text-xs font-bold">
                    {t('hero.badge')}
                </EcoBadge>
                <div className="bg-primary-container/20 ring-primary-container/30 rounded-full p-4 ring-4">
                    <MascotImage emotion="nomal" size="lg" decorative />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-2xl font-black tracking-tight">
                        {t('hero.title')}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                        {t('hero.subtitle')}
                    </p>
                </div>
            </section>

            <EcoCard className="border-primary-container/40 bg-primary-container/10 space-y-3 p-5">
                <p className="text-primary text-base leading-snug font-black">
                    {t('tagline.quote')}
                </p>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('tagline.description')}
                </p>
            </EcoCard>

            <section className="flex flex-col gap-4">
                <SectionTitle>{t('overview.title')}</SectionTitle>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('overview.description')}
                </p>
                <div className="flex flex-col gap-2">
                    {(['target', 'tech', 'platform'] as const).map((key) => (
                        <div
                            key={key}
                            className="border-outline-variant bg-surface-container-low flex gap-3 rounded-xl border p-3"
                        >
                            <span className="bg-secondary-container text-on-secondary-container mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black">
                                •
                            </span>
                            <p className="text-on-surface text-sm leading-relaxed">
                                {t(`overview.items.${key}`)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <SectionTitle>{t('flow.title')}</SectionTitle>
                <div className="flex flex-col gap-3">
                    {flowSteps.map((step, index) => {
                        const Icon = FLOW_ICONS[index]
                        return (
                            <div key={step} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="bg-primary-container text-on-primary-container flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    {index < flowSteps.length - 1 && (
                                        <div className="bg-outline-variant my-1 w-0.5 flex-1 min-h-4" />
                                    )}
                                </div>
                                <EcoCard className="flex-1 p-4">
                                    <p className="text-on-surface mb-1 text-sm font-bold">
                                        {t(`flow.steps.${step}.title`)}
                                    </p>
                                    <p className="text-on-surface-variant text-xs leading-relaxed">
                                        {t(`flow.steps.${step}.description`)}
                                    </p>
                                </EcoCard>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <SectionTitle>{t('whyUniversity.title')}</SectionTitle>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('whyUniversity.summary')}
                </p>
                <div className="grid grid-cols-1 gap-3">
                    {whyCards.map((key, index) => {
                        const Icon = WHY_ICONS[index]
                        const isCulture = key === 'culture'
                        return (
                            <EcoCard
                                key={key}
                                className={cn(
                                    'p-4',
                                    isCulture &&
                                        'border-secondary/40 bg-secondary-container/20',
                                )}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <Icon
                                        className={cn(
                                            'h-4 w-4',
                                            isCulture
                                                ? 'text-secondary'
                                                : 'text-primary',
                                        )}
                                    />
                                    <p className="text-on-surface text-sm font-bold">
                                        {t(`whyUniversity.cards.${key}.title`)}
                                    </p>
                                </div>
                                <p className="text-on-surface-variant text-xs leading-relaxed">
                                    {t(`whyUniversity.cards.${key}.description`)}
                                </p>
                            </EcoCard>
                        )
                    })}
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <EcoCard className="border-secondary/30 from-secondary-container/30 to-primary-container/10 space-y-4 bg-gradient-to-br p-5">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-secondary h-5 w-5" />
                        <h3 className="text-on-surface text-lg font-black">
                            {t('culturalDiffusion.title')}
                        </h3>
                    </div>
                    <p className="text-secondary text-sm font-bold">
                        {t('culturalDiffusion.lead')}
                    </p>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        {t('culturalDiffusion.body')}
                    </p>
                    <ul className="flex flex-col gap-2">
                        {culturePoints.map((key) => (
                            <li
                                key={key}
                                className="border-outline-variant/60 bg-surface/70 flex gap-2 rounded-lg border p-3"
                            >
                                <Leaf className="text-secondary mt-0.5 h-4 w-4 shrink-0 fill-current" />
                                <span className="text-on-surface text-xs leading-relaxed">
                                    {t(`culturalDiffusion.points.${key}`)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </EcoCard>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Calculator className="text-primary h-5 w-5" />
                    <SectionTitle>{t('savingsCriteria.title')}</SectionTitle>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('savingsCriteria.lead')}
                </p>

                <EcoCard className="border-outline-variant space-y-2 p-4">
                    <p className="text-on-surface text-sm font-bold">
                        {t('savingsCriteria.formula.title')}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                        {formulaKeys.map((key) => (
                            <li
                                key={key}
                                className="text-on-surface-variant font-mono text-xs leading-relaxed"
                            >
                                {t(`savingsCriteria.formula.${key}`)}
                            </li>
                        ))}
                    </ul>
                </EcoCard>

                <div className="flex flex-col gap-2">
                    <p className="text-on-surface text-sm font-bold">
                        {t('savingsCriteria.constants.title')}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {constantKeys.map((key) => (
                            <EcoCard key={key} className="p-3">
                                <div className="flex items-baseline justify-between gap-2">
                                    <p className="text-on-surface text-xs font-bold">
                                        {t(`savingsCriteria.constants.items.${key}.label`)}
                                    </p>
                                    <p className="text-primary shrink-0 text-sm font-black">
                                        {t(`savingsCriteria.constants.items.${key}.value`)}
                                    </p>
                                </div>
                                <p className="text-on-surface-variant mt-1 text-[11px] leading-relaxed">
                                    {t(`savingsCriteria.constants.items.${key}.source`)}
                                </p>
                            </EcoCard>
                        ))}
                    </div>
                </div>

                <EcoCard className="border-secondary/30 from-secondary-container/20 to-surface bg-gradient-to-br p-4">
                    <p className="text-on-surface mb-1 text-sm font-bold">
                        {t('savingsCriteria.example.title')}
                    </p>
                    <p className="text-on-surface-variant mb-3 text-xs leading-relaxed">
                        {t('savingsCriteria.example.scenario')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {exampleMetrics.map((key) => (
                            <div
                                key={key}
                                className="border-outline-variant/60 bg-surface/80 rounded-lg border px-3 py-2 text-center"
                            >
                                <p className="text-primary text-sm font-black">
                                    {t(`savingsCriteria.example.${key}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </EcoCard>

                <div className="flex flex-col gap-2">
                    <p className="text-on-surface text-sm font-bold">
                        {t('savingsCriteria.references.title')}
                    </p>
                    <div className="flex flex-col gap-2">
                        {referenceKeys.map((key) => {
                            const url = t(`savingsCriteria.references.items.${key}.url`)
                            return (
                                <a
                                    key={key}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border-outline-variant bg-surface-container-low hover:border-primary/40 hover:bg-primary-container/10 group flex gap-3 rounded-xl border p-3 transition-colors"
                                >
                                    <ExternalLink className="text-on-surface-variant group-hover:text-primary mt-0.5 h-4 w-4 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-on-surface text-xs font-bold">
                                            {t(`savingsCriteria.references.items.${key}.name`)}
                                        </p>
                                        <p className="text-on-surface-variant mt-0.5 text-[11px] leading-relaxed">
                                            {t(`savingsCriteria.references.items.${key}.detail`)}
                                        </p>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <SectionTitle>{t('impact.title')}</SectionTitle>
                <div className="grid grid-cols-1 gap-3">
                    {impactStats.map((key, index) => {
                        const Icon = IMPACT_ICONS[index]
                        return (
                            <EcoCard key={key} className="flex items-center gap-4 p-4">
                                <div className="bg-secondary-container/40 text-secondary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-primary text-xl font-black">
                                        {t(`impact.stats.${key}.value`)}
                                    </p>
                                    <p className="text-on-surface-variant text-xs leading-relaxed">
                                        {t(`impact.stats.${key}.label`)}
                                    </p>
                                </div>
                            </EcoCard>
                        )
                    })}
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>{t('team.title')}</SectionTitle>
                <EcoCard className="flex items-center gap-4 p-5">
                    <div className="bg-primary-container/30 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-on-surface text-base font-bold">
                            {t('team.members')}
                        </p>
                        <p className="text-on-surface-variant mt-1 text-xs leading-relaxed">
                            {t('team.description')}
                        </p>
                    </div>
                </EcoCard>
            </section>

            <section className="flex flex-col items-center gap-4 pt-2 text-center">
                <div>
                    <h3 className="text-on-surface text-lg font-black">
                        {t('cta.title')}
                    </h3>
                    <p className="text-on-surface-variant mt-1 text-sm">
                        {t('cta.description')}
                    </p>
                </div>
                <Link to="/report-form" className="w-full">
                    <EcoButton className="w-full gap-2 py-4 text-base font-bold shadow-md">
                        <Camera className="h-5 w-5" />
                        {t('cta.button')}
                    </EcoButton>
                </Link>
            </section>
        </div>
    )
}

function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h3 className="text-on-surface text-lg font-black tracking-tight">
            {children}
        </h3>
    )
}
