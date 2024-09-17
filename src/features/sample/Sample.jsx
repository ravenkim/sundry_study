import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SSinput from 'src/common/components/input/SSinput.jsx'

const Sample = () => {
    const dispatch = useDispatch()

    const { data } = useSelector(
        ({ sampleReducer }) => ({
            data: sampleReducer.commonCode.data,
        }),
        shallowEqual,
    )


    const { t, i18n } = useTranslation()
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    }


    const [aaaa, setAaaa] = useState('zzz')

    useEffect(() => {
        console.log(aaaa)
    }, [aaaa])


    return (
        <>
            <SSinput
                value={aaaa}
                onChange={(e) => setAaaa(e)}
            />
        </>

        // <SSinnerWrapper>
        //         <SSinnerWrapper.Top>
        //             asdasd
        //
        //             <SSbutton></SSbutton>
        //         </SSinnerWrapper.Top>
        //     <SSinnerWrapper.Bottom>
        //         asdasd
        //
        //         <SSbutton></SSbutton>
        //     </SSinnerWrapper.Bottom>
        //
        //     </SSinnerWrapper>

        // <div
        //     style={{
        //         padding: 50,
        //         display: 'flex',
        //         height: '100vh',
        //         width: '100vw',
        //         flexDirection: 'column',
        //     }}
        // >
        //     <Trans>text.Welcome to React</Trans>
        //     <Trans>numbar.aaaaa</Trans>
        //     <SSbutton onClick={() => changeLanguage('en')}>English</SSbutton>
        //     <SSbutton onClick={() => changeLanguage('ko')}>English</SSbutton>
        //
        //     <SSbutton onClick={() => dispatch(sampleAction.getCode())}>
        //         데이터 가져오기
        //     </SSbutton>
        //
        //     <SScollapsible>sdsd</SScollapsible>
        //
        //     <SSdivider text={'안녕'} />
        //
        //     <div>asdasd</div>
        //     <div
        //         style={{
        //             fontFamily: 'NanumSquareNeo',
        //             fontWeight: '900',
        //             fontSize: 32,
        //         }}
        //     >
        //         asdasd
        //     </div>
        //     <div
        //         style={{
        //             fontFamily: 'NanumSquareNeo',
        //         }}
        //     >
        //         asdasd
        //     </div>
        //     <div
        //         style={{
        //             fontFamily: 'NanumSquareNeo',
        //             fontWeight: '500',
        //         }}
        //     >
        //         asdasd
        //     </div>
        //     <div>asdasd</div>
        //
        //     {/*    본가의 업데이트*/}
        // </div>
    )
}

export default Sample
