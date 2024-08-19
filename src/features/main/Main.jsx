import logoIconUrl from 'src/assets/images/logo/logo.svg'

const Main = () => {



    const  mainLogoUrl= logoIconUrl
    console.log(mainLogoUrl)
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
                <img
                    width={'55%'}
                    height={'50%'}
                    src={`${mainLogoUrl}`}
                    alt={'메인 로고 '}
                />
                <img
                    width={'55%'}
                    height={'50%'}
                    src={mainLogoUrl}
                    alt={'메인 로고 '}
                />

                <h1>Ting</h1>
            </div>

            <div
                style={{
                    width: '100%',
                    height: '25%',
                    backgroundColor: 'tomato',
                }}
            ></div>
        </>
    )
}

export default Main
