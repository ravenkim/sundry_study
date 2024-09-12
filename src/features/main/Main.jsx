import Logo from 'src/assets/images/logo/logo.svg?react'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import SSdivider from 'src/common/components/divider/SSdivider.jsx'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'

const Main = () => {
    return (
        <SSinnerWrapper>

                <div
                    className={
                        'w-full h-auto flex flex-col items-center pt-[210px] pb-[160px]'
                    }
                >
                    <Logo width={82} height={82} />

                </div>
                <div>
                    <SSbutton
                        text={'시작하기'}
                        className={'rounded-full'}
                        ></SSbutton>
                    <SSbutton
                        variant={'outline'}
                        text={'로그인'}
                        className={'rounded-full'}
                    ></SSbutton>
                </div>


            {/*<div*/}
            {/*    style={{*/}
            {/*        width: '100%',*/}
            {/*        height: '50%',*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'center',*/}
            {/*        flexDirection: 'column',*/}
            {/*    }}*/}
            {/*>*/}

            {/*    <Logo width={'150px'} height={'150px'} />*/}

            {/*    <h1*/}
            {/*        style={{*/}
            {/*            marginTop: 20,*/}
            {/*            fontSize: 50,*/}
            {/*            fontWeight: 'bolder',*/}
            {/*        }}*/}
            {/*        className={'text-primary'}*/}
            {/*    >*/}
            {/*        Ting*/}
            {/*    </h1>*/}
            {/*</div>*/}

            {/*<div*/}
            {/*    style={{*/}
            {/*        width: '100%',*/}
            {/*        height: '50%',*/}
            {/*        display:'flex',*/}
            {/*        alignItems:'center',*/}
            {/*        flexDirection:'column',*/}
            {/*        justifyContent: 'center',*/}

            {/*    }}*/}
            {/*>*/}
            {/*    <SSbutton*/}
            {/*        text={'회원가입'}*/}
            {/*    style={{marginBottom: 20}}*/}
            {/*    >*/}
            {/*    </SSbutton>*/}

            {/*    <SSbutton*/}
            {/*        text={'로그인'}*/}
            {/*        variant={'secondary'}*/}
            {/*        style={{marginBottom: 20}}*/}
            {/*    />*/}

            {/*    <SSdivider*/}
            {/*        text={'SNS로 로그인'}*/}
            {/*    />*/}
            {/*    <div>*/}
            {/*        가로로 아이콘으로 들어가자*/}

            {/*    </div>*/}
            {/*</div>*/}
        </SSinnerWrapper>
    )
}

export default Main
