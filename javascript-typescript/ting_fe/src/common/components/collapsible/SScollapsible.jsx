import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from 'src/assets/shadcn/components/ui/collapsible.jsx'

const SScollapsible = ({ children }) => {
    return (
        <Collapsible>
            타이틀이 들어갈 공간
            <CollapsibleTrigger>버튼이 들어갈 공간</CollapsibleTrigger>
            <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
    )
}

export default SScollapsible