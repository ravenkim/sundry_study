import { shallowEqual, useSelector } from 'react-redux'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { useEffect, useState } from 'react'
import IntroPage1 from 'src/features/intro/page/IntroPage1.jsx'

const Intro = () => {
    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )

    const [pageNumber, setPageNumber] = useState(1)

    return (
        <SSinnerWrapper
        >
            <SSinnerWrapper.Top>

                {pageNumber === 1 && <IntroPage1 />}
            </SSinnerWrapper.Top>
            <SSinnerWrapper.Bottom>
                <SSbutton
                    text={'다음'}
                    onClick={() => setPageNumber(pageNumber + 1)}
                />
            </SSinnerWrapper.Bottom>
        </SSinnerWrapper>
    )
}

export default Intro
