const MobileLayout = ({ children }) => {
    return (
        //todo class로 글로벌 css로 변경

        <div className={'flex justify-center h-dvh w-dvw bg-primary bg-gradient-to-l from-primary-foreground via-primary to-primary-foreground'}>

            <div
                className={'w-full h-full max-w-screen-mobile bg-background'}
            >
                {children}
            </div>

        </div>
    )
}

export default MobileLayout
