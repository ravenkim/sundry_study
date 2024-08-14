import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from 'src/assets/shadcn/components/ui/card.jsx'

const SSwrapper = ({
    title='제목',
                       description='',
    children,
    footer,
                   }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                {footer}
            </CardFooter>
        </Card>
    )
}

export default SSwrapper
