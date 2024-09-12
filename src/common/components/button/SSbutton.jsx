import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({ text, size='block', style = {}, onClick, variant,className, ...props }) => {
    return (
        <Button
            className={`mb-[12px] ${className}`}
            onClick={onClick}
            size={size}
            variant={variant}
            {...props}
        >
            {text}
        </Button>
    )
}

export default SSbutton
