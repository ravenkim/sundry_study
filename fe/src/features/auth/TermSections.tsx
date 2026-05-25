import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from 'src/shared/lib/shadcn/components/ui/accordion'
import type { SignupTerm } from 'src/features/auth/useSignupTerms'

export function TermSections({ term }: { term: SignupTerm }) {
    return (
        <Accordion type="multiple" className="w-full">
            {term.sections.map((section) => (
                <AccordionItem key={section.title} value={section.title}>
                    <AccordionTrigger className="text-on-surface py-3 text-sm font-semibold hover:no-underline">
                        {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-on-surface-variant whitespace-pre-line text-sm leading-relaxed">
                            {section.content}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
