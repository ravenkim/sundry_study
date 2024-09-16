import { shallowEqual, useSelector } from 'react-redux'
import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { useEffect, useState } from 'react'
import IntroPage1 from 'src/features/intro/page/IntroPage1.jsx'
import IntroPage2 from 'src/features/intro/page/IntroPage2.jsx'
import { useNavigate } from 'react-router-dom'

const Intro = () => {
    const maxPage = 4



    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )


    const navigate = useNavigate()


    const [pageNumber, setPageNumber] = useState(1)


    useEffect(() => {
        if(pageNumber === maxPage +1 ){
            navigate('/user/join')
        }

    }, [pageNumber])

    return (
        <SSinnerWrapper
        >
            <SSinnerWrapper.Top>

                {pageNumber === 1 && <IntroPage1 />}
                {pageNumber === 2 && <IntroPage2 />}
                {pageNumber === 3 && <IntroPage1 />}
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
