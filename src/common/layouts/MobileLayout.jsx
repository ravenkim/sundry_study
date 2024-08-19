const MobileLayout = ({ children }) => {
    return (
        //todo class로 글로벌 css로 변경

        <div
            id={'mobileLayout'}
            style={{
                background: 'linear-gradient(270deg, #D9F5FD 0%, #B1DDE3 100%)',
                width: '100dvw',
                height: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            }}
        >
            <div
                className={'leftSpace'}
                style={{
                    flexGrow: 1,
                    height: '100%',
                    // backgroundColor: 'tomato'
                }}
            ></div>
            <div
                className="
                bg-background
                "
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: 500,
                    zIndex:888
                }}
            >
                {children}
            </div>

            <div
                className={'leftSpace'}
                style={{
                    height: '100%',
                    // backgroundColor: 'tomato',
                    flexGrow: 1,
                }}
            ></div>
        </div>
    )
}

export default MobileLayout
