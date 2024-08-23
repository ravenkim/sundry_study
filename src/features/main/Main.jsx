import Logo from 'src/assets/images/logo/logo.svg?react'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import SSdivider from 'src/common/components/divider/SSdivider.jsx'

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
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Logo width={'150px'} height={'150px'} />

                <h1
                    style={{
                        marginTop: 20,
                        fontSize: 50,
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
                    height: '50%',
                    display:'flex',
                    alignItems:'center',
                    flexDirection:'column',
                    justifyContent: 'center'
                }}
            >
                <SSbutton
                    text={'회원가입'}
                style={{marginBottom: 20}}
                >
                </SSbutton>

                <SSbutton
                    text={'로그인'}
                    variant={'secondary'}
                    style={{marginBottom: 20}}
                />

                <SSdivider
                    text={'SNS로 로그인'}
                />
                <div>
                    가로로 아이콘으로 들어가자

                    <SSbutton
                        text={'회원가입'}
                        style={{
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                    </SSbutton>


                    <SSbutton
                        text={'로그인'}
                        variant={'secondary'}
                        style={{ marginBottom: 20 }}
                    />
                    <SSbutton
                        text={'회원가입'}
                        style={{ marginBottom: 20 }}
                    >
                    </SSbutton>
                </div>
            </div>
        </>
    )
}

export default Main
