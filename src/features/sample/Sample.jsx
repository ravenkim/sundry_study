import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { sampleAction } from 'src/features/sample/sampleReducer.jsx'
import { useEffect } from 'react'
import SScollapsible from 'src/common/components/collapsible/SScollapsible.jsx'
import SSdivider from 'src/common/components/divider/SSdivider.jsx'

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

    return (
        <div
            style={{
                padding: 50,
                display: 'flex',
                height: '100vh',
                width: '100vw',
                flexDirection: 'column'
            }}
        >
            <SSbutton onClick={() => dispatch(sampleAction.getCode())}>
                데이터 가져오기
            </SSbutton>

            <SScollapsible>sdsd</SScollapsible>


            <SSdivider />

            <div>

                asdasd
            </div>
            <div
                style={{
                    fontFamily: "NanumSquareNeo",
                    fontWeight: '300'
                }}
            >

                asdasd
            </div>
            <div
                style={{
                    fontFamily: "NanumSquareNeo",
                }}
            >

                asdasd
            </div>
            <div
                style={{
                    fontFamily: "NanumSquareNeo",
                    fontWeight: '500'
                }}
            >

                asdasd
            </div>
            <div>

                asdasd
            </div>

            {/*    본가의 업데이트*/}
        </div>
    )
}

export default Sample
