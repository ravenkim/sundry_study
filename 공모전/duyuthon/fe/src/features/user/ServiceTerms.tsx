import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from 'src/shared/lib/shadcn/components/ui/accordion'
import { TermSections } from 'src/features/auth/TermSections'
import { useSignupTerms } from 'src/features/auth/useSignupTerms'

function termTitle(label: string): string {
    return label.replace(/^\[.+?\]\s*/, '')
}

export function ServiceTerms() {
    const { t } = useTranslation(['user', 'legal'])
    const terms = useSignupTerms()

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/profile" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">
                    {t('user:terms.title')}
                </h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-6 p-5 pb-8">
                <div>
                    <h2 className="text-on-surface mb-1 text-xl font-bold">
                        {t('user:terms.sectionTitle')}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        {t('user:terms.sectionDescription')}
                    </p>
                </div>

                <Accordion type="single" collapsible className="flex flex-col gap-3">
                    {terms.map((term) => (
                        <AccordionItem
                            key={term.id}
                            value={term.id}
                            className="border-outline-variant bg-surface-container-lowest overflow-hidden rounded-xl border px-4"
                        >
                            <AccordionTrigger className="text-on-surface py-4 text-sm font-semibold hover:no-underline">
                                {termTitle(term.label)}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <p className="text-on-surface-variant mb-4 text-xs leading-relaxed">
                                    {term.summary}
                                </p>
                                <TermSections term={term} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <p className="text-on-surface-variant text-center text-xs leading-relaxed">
                    {t('user:terms.changeNotice')}
                    <br />
                    {t('user:terms.effectiveDate')}
                </p>
            </main>
        </div>
    )
}
