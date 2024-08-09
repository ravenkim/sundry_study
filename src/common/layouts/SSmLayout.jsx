const SSmLayout = ({
                       children,
                   }) => {
    return (
        <div
            style={{
                backgroundColor: '#000000',
                width: '100dvw',
                height: '100dvh',
                display: 'flex',
                alignItems:'center',
                justifyContent:'center'
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: 600,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {children}
            </div>


        </div>
    )
}

export default SSmLayout