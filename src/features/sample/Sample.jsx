import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { sampleAction } from 'src/features/sample/sampleReducer.jsx'
import { useEffect } from 'react'
import SScollapsible from 'src/common/components/collapsible/SScollapsible.jsx'
import SSdivider from 'src/common/components/divider/SSdivider.jsx'
import { Trans } from 'react-i18next'
import { useTranslation } from 'react-i18next'

const Sample = () => {
    const dispatch = useDispatch()

    const { data } = useSelector(
        ({ sampleReducer }) => ({
            data: sampleReducer.commonCode.data,
        }),
        shallowEqual,
    )

    useEffect(() => {
        console.log(data)
    }, [data])

    const { t, i18n } = useTranslation()
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        // 언어 변경 시 로컬 스토리지에 저장
    }

    return (
        <div
            style={{
                padding: 50,
                display: 'flex',
                height: '100vh',
                width: '100vw',
                flexDirection: 'column',
            }}
        >
            <Trans>text.Welcome to React</Trans>
            <Trans>numbar.aaaaa</Trans>
            <SSbutton onClick={() => changeLanguage('en')}>English</SSbutton>
            <SSbutton onClick={() => changeLanguage('ko')}>English</SSbutton>

            <SSbutton onClick={() => dispatch(sampleAction.getCode())}>
                데이터 가져오기
            </SSbutton>

            <SScollapsible>sdsd</SScollapsible>

            <SSdivider text={'안녕'} />

            <div>asdasd</div>
            <div
                style={{
                    fontFamily: 'NanumSquareNeo',
                    fontWeight: '900',
                    fontSize: 32,
                }}
            >
                asdasd
            </div>
            <div
                style={{
                    fontFamily: 'NanumSquareNeo',
                }}
            >
                asdasd
            </div>
            <div
                style={{
                    fontFamily: 'NanumSquareNeo',
                    fontWeight: '500',
                }}
            >
                asdasd
            </div>
            <div>asdasd</div>

            {/*    본가의 업데이트*/}
        </div>
    )
}

export default Sample
