import { shallowEqual, useSelector } from 'react-redux'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { useEffect, useState } from 'react'
import IconX from 'src/assets/images/icon/x.svg?react'
import IconChevronLeft from 'src/assets/images/icon/chevronLeft.svg?react'


const Intro = () => {


    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )

    const [pageNumber, setPageNumber] = useState(0)




    return (
        <SSinnerWrapper>
            <SSinnerWrapper.Top>{pageNumber}</SSinnerWrapper.Top>
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