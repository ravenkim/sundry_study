import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({ text = '', children, style = {}, ...props }) => {
    return (
        <Button style={{ width: 500, ...style }} {...props}>
            {children}
        </Button>
    )
}

export default SSbutton
