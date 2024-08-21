const MobileLayout = ({ children }) => {
    return (
        //todo class로 글로벌 css로 변경

        <div
            id={'mobileLayout'}
            style={{
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
                    minHeight: 600
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
