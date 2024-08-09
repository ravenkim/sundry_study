const MobileLayout = ({
                          children,
                      }) => {
    return (

        //todo class로 글로벌 css로 변경

        <div
            style={{
                backgroundColor: '#000000',
                width: '100dvw',
                height: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="
                w-full
                h-full
                max-w-[400px]
                overflow-y-auto
                overflow-x-hidden
                bg-background"
            >
                {children}
            </div>


        </div>
    )
}

export default MobileLayout