import Logo from 'src/assets/images/logo/logo.svg?react'

const Main = () => {
    //
    //
    // const  mainLogoUrl= logoIconUrl
    // console.log(mainLogoUrl)

    console.log(Logo)
    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '75%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Logo width={'290px'} height={'290px'} />

                <h1
                    style={{
                        fontSize: 88,
                        fontWeight: 'bolder',
                    }}
                    className={'text-primary'}
                >
                    Ting
                </h1>
            </div>

            <div
                style={{
                    width: '100%',
                    height: '25%',
                }}
            ></div>
        </>
    )
}

export default Main
