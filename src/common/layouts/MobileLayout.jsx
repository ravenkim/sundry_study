const MobileLayout = ({ children }) => {
    return (
        //todo class로 글로벌 css로 변경

        <div className={'flex justify-center h-dvh w-vw min-h-[300px] min-w-[300px] bg-primary bg-gradient-to-l from-primary-foreground via-primary to-primary-foreground box-border'}>
            <div
                className={' w-full h-full max-w-screen-mobile bg-background flex flex-col justify-between'}
            >
                {children}
            </div>

        </div>
    )
}

export default MobileLayout
