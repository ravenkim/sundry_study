import { Button } from 'src/assets/shadcn/components/ui/button.jsx'

const SSbutton = ({children, style = {}, ...props }) => {




    return (
        <Button style={{ ...style }} {...props}>
            {children}
        </Button>
    )
}






export default SSbutton
