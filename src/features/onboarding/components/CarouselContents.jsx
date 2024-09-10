const CarouselContents = ({ mainText, subText, img, ...props }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '400px',
                margin: '4px 0',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ margin: '48px 0' }}>
                <h2 style={{ whiteSpace: 'pre-line' }}>{mainText}</h2>
                <h6>{subText}</h6>
            </div>
            <div
                style={{
                    display: 'flex',

                    justifyContent: 'center',
                    alignContent: 'center',
                }}
            >
                <img src={img} alt="이미지" style={{ width: '180px' }} />
            </div>
        </div>
    )
}

export default CarouselContents
