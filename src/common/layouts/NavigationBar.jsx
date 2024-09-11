import {
    ChatBubbleIcon,
    HomeIcon,
    MixIcon,
    PersonIcon,
    TextIcon,
} from '@radix-ui/react-icons'
import logoIconUrl from 'src/assets/images/logo/logo.svg'

const NavigationBar = ({ navBarSize }) => {
    return (
        <nav

            className={`w-full h-[calc(100% - (100%-${navBarSize}))] flex justify-around items-center box-border border-t`}
        >
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <HomeIcon
                    style={{
                        width: 35,
                        height: 35,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <MixIcon
                    style={{
                        width: 35,
                        height: 35,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={true} navBarSize={navBarSize}>
                <img src={logoIconUrl} alt={'logoIcon'} />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <ChatBubbleIcon
                    style={{
                        width: 35,
                        height: 35,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <PersonIcon
                    style={{
                        width: 35,
                        height: 35,
                    }}
                />
            </NavigationButton>
        </nav>
    )
}

export default NavigationBar

const NavigationButton = ({ navBarSize, children, isActive }) => {
    return (
        <div
            style={{
                width: navBarSize,
                height: navBarSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
            }}
            className={isActive ? 'text-primary' : 'text-muted'}
        >
            {children}
        </div>
    )
}
