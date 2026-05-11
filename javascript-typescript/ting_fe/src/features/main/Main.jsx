import Logo from 'src/assets/images/logo/logo.svg?react'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import SSdivider from 'src/common/components/divider/SSdivider.jsx'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Main = () => {
    const navigate = useNavigate()

    const [introVisible, setIntroVisible] = useState(false)

    return (
        <SSinnerWrapper>
            {!introVisible && (
                <>
                    <div
                        className={
                            'flex h-auto w-full flex-col items-center pb-[160px] pt-[210px]'
                        }
                    >
                        <Logo width={82} height={82} />
                    </div>
                    <div>
                        <SSbutton
                            onClick={() =>
                                navigate('/intro', {
                                    state: { to: 'userJoin' },
                                })
                            }
                            text={'시작하기'}
                            className={'rounded-full'}
                        ></SSbutton>
                        <SSbutton
                            variant={'outline'}
                            text={'로그인'}
                            onClick={() => navigate('/login')}
                            className={'rounded-full'}
                        ></SSbutton>
                    </div>

                    <SSdivider text={'또는'} />
                </>
            )}
        </SSinnerWrapper>
    )
}

export default Main
