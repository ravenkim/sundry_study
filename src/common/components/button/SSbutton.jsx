import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({ text, size='block', style = {}, onClick, variant, ...props }) => {
    return (
        <Button

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
