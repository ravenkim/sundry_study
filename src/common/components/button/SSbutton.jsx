import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({ text, size='block', children, style = {}, onClick, variant, ...props }) => {
    return (
        <Button
            onClick={onClick}
            style={{
                height: '45px',
                width: '100%',

                ...style,
            }}
            variant={variant}
            {...props}
        >
            {text}
        </Button>
    )
}

export default SSbutton
