import {
    ChatBubbleIcon,
    HomeIcon,
    MixIcon,
    PersonIcon,
} from '@radix-ui/react-icons'
import Logo from 'src/assets/images/logo/logo.svg?react'

const NavigationBar = ({ navBarSize }) => {
    return (
        <nav
            className={`h-[calc(100% - w-full (100%-${navBarSize}))] box-border flex justify-around border-t py-[12]`}
        >
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <HomeIcon
                    style={{
                        width: 44,
                        height: 44,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <MixIcon
                    style={{
                        width: 44,
                        height: 44,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={true} navBarSize={navBarSize}>
                <Logo width={44} height={44} />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <ChatBubbleIcon
                    style={{
                        width: 44,
                        height: 44,
                    }}
                />
            </NavigationButton>
            <NavigationButton isActive={false} navBarSize={navBarSize}>
                <PersonIcon
                    style={{
                        width: 44,
                        height: 44,
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
                cursor: 'pointer',
            }}
            className={isActive ? 'text-primary' : 'text-muted'}
        >
            {children}
        </div>
    )
}
