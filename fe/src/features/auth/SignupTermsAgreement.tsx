import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from 'src/shared/lib/shadcn/components/ui/accordion'
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from 'src/shared/lib/shadcn/components/ui/drawer'
import { ScrollArea } from 'src/shared/lib/shadcn/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from 'src/shared/lib/shadcn/components/ui/sheet'
import { EcoButton } from 'src/shared/ui/eco'
import { TermSections } from 'src/features/auth/TermSections'
import { SIGNUP_TERMS, SignupTerm } from 'src/features/auth/signupTermsData'

interface SignupTermsAgreementProps {
    onRequiredChange: (agreed: boolean) => void
}

export function SignupTermsAgreement({
    onRequiredChange,
}: SignupTermsAgreementProps) {
    const [termsAgreed, setTermsAgreed] = useState(() =>
        SIGNUP_TERMS.map(() => false),
    )
    const [drawerTermId, setDrawerTermId] = useState<string | null>(null)
    const [sheetTermId, setSheetTermId] = useState<string | null>(null)
    const [inlineExpandedId, setInlineExpandedId] = useState<string | null>(
        null,
    )

    const allTermsAgreed = termsAgreed.every(Boolean)
    const requiredTermsAgreed = SIGNUP_TERMS.every(
        (term, index) => !term.required || termsAgreed[index],
    )

    const drawerTerm = SIGNUP_TERMS.find((t) => t.id === drawerTermId)
    const sheetTerm = SIGNUP_TERMS.find((t) => t.id === sheetTermId)

    useEffect(() => {
        onRequiredChange(requiredTermsAgreed)
    }, [requiredTermsAgreed, onRequiredChange])

    const handleToggleAllTerms = () => {
        const next = !allTermsAgreed
        setTermsAgreed(SIGNUP_TERMS.map(() => next))
    }

    const handleToggleTerm = (index: number) => {
        setTermsAgreed((prev) => {
            const next = [...prev]
            next[index] = !next[index]
            return next
        })
    }

    const openTermViewer = (term: SignupTerm) => {
        if (term.viewer === 'drawer') {
            setDrawerTermId(term.id)
        } else if (term.viewer === 'sheet') {
            setSheetTermId(term.id)
        } else {
            setInlineExpandedId((prev) =>
                prev === term.id ? null : term.id,
            )
        }
    }

    const agreeFromViewer = (termId: string) => {
        const index = SIGNUP_TERMS.findIndex((t) => t.id === termId)
        if (index >= 0) {
            setTermsAgreed((prev) => {
                const next = [...prev]
                next[index] = true
                return next
            })
        }
        setDrawerTermId(null)
        setSheetTermId(null)
    }

    return (
        <>
            <div className="border-surface-container-high mt-2 flex flex-col gap-3 border-t pt-4">
                <label className="flex cursor-pointer items-center gap-3 font-bold">
                    <input
                        type="checkbox"
                        checked={allTermsAgreed}
                        onChange={handleToggleAllTerms}
                        className="border-outline-variant text-primary focus:ring-primary h-5 w-5 rounded"
                    />
                    <span>전체 약관 동의</span>
                </label>

                <Accordion type="single" collapsible className="rounded-lg border">
                    <AccordionItem value="summary" className="border-none">
                        <AccordionTrigger className="text-on-surface-variant px-3 py-2.5 text-xs font-semibold hover:no-underline">
                            약관 요약 보기
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="flex flex-col gap-2">
                                {SIGNUP_TERMS.map((term) => (
                                    <div
                                        key={term.id}
                                        className="bg-surface-container-low rounded-md p-2.5"
                                    >
                                        <p className="text-on-surface text-xs font-bold">
                                            {term.label}
                                        </p>
                                        <p className="text-on-surface-variant mt-1 text-xs leading-relaxed">
                                            {term.summary}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {SIGNUP_TERMS.map((term, i) => (
                    <div key={term.id} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <label className="text-on-surface-variant flex flex-1 cursor-pointer items-center gap-3 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={termsAgreed[i]}
                                    onChange={() => handleToggleTerm(i)}
                                    className="border-outline-variant text-primary focus:ring-primary h-5 w-5 shrink-0 rounded"
                                />
                                <span>{term.label}</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => openTermViewer(term)}
                                className="text-primary flex shrink-0 items-center gap-0.5 text-xs font-semibold hover:underline"
                            >
                                {term.viewer === 'accordion'
                                    ? '펼치기'
                                    : '전문 보기'}
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {term.viewer === 'accordion' &&
                            inlineExpandedId === term.id && (
                                <div className="border-outline-variant bg-surface-container-low ml-8 rounded-lg border p-3">
                                    <TermSections term={term} />
                                </div>
                            )}
                    </div>
                ))}
            </div>

            <Drawer
                open={drawerTermId !== null}
                onOpenChange={(open) => !open && setDrawerTermId(null)}
            >
                <DrawerContent className="mx-auto max-h-[85vh] max-w-[390px]">
                    {drawerTerm && (
                        <>
                            <DrawerHeader className="border-outline-variant border-b text-left">
                                <DrawerTitle className="text-primary text-base">
                                    {drawerTerm.label.replace(/^\[.+?\]\s*/, '')}
                                </DrawerTitle>
                                <p className="text-on-surface-variant text-xs leading-relaxed">
                                    {drawerTerm.summary}
                                </p>
                            </DrawerHeader>
                            <ScrollArea className="max-h-[50vh] px-4">
                                <TermSections term={drawerTerm} />
                            </ScrollArea>
                            <DrawerFooter className="border-outline-variant border-t">
                                <EcoButton
                                    type="button"
                                    className="w-full py-3 font-bold"
                                    onClick={() =>
                                        agreeFromViewer(drawerTerm.id)
                                    }
                                >
                                    내용을 확인했으며 동의합니다
                                </EcoButton>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Sheet
                open={sheetTermId !== null}
                onOpenChange={(open) => !open && setSheetTermId(null)}
            >
                <SheetContent
                    side="right"
                    className="flex w-full flex-col sm:max-w-[390px]"
                >
                    {sheetTerm && (
                        <>
                            <SheetHeader className="border-outline-variant border-b pb-4 text-left">
                                <SheetTitle className="text-primary text-base">
                                    {sheetTerm.label.replace(/^\[.+?\]\s*/, '')}
                                </SheetTitle>
                                <p className="text-on-surface-variant text-xs leading-relaxed">
                                    {sheetTerm.summary}
                                </p>
                            </SheetHeader>
                            <ScrollArea className="flex-1 pr-2">
                                <TermSections term={sheetTerm} />
                            </ScrollArea>
                            <SheetFooter className="border-outline-variant mt-auto border-t pt-4">
                                <EcoButton
                                    type="button"
                                    className="w-full py-3 font-bold"
                                    onClick={() =>
                                        agreeFromViewer(sheetTerm.id)
                                    }
                                >
                                    내용을 확인했으며 동의합니다
                                </EcoButton>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
