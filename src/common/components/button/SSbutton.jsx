import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({ children, style = {}, onClick, ...props }) => {
    return (
        <Button onClick={onClick} style={{ ...style }} {...props}>
            {children}
        </Button>
    )
}






export default SSbutton
