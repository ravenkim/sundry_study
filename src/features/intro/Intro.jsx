import SSinnerWrapper from 'src/common/components/wrapper/SSinnerWrapper.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { useEffect, useState } from 'react'
import IntroPage1 from 'src/features/intro/page/IntroPage1.jsx'
import IntroPage2 from 'src/features/intro/page/IntroPage2.jsx'
import { useNavigate } from 'react-router-dom'
import IntroPage3 from 'src/features/intro/page/IntroPage3.jsx'
import IntroPage4 from 'src/features/intro/page/IntroPage4.jsx'
import { shallowEqual, useSelector } from 'react-redux'

const Intro = () => {
    const maxPage = 4

    const navigate = useNavigate()

    const [pageNumber, setPageNumber] = useState(1)



    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )

    useEffect(() => {
        if(pageNumber === maxPage + 1) {

            // todo 소셜 로그인 분기 처리

            if(from === 'userJoin'){
                navigate('/user/join')
            }
        }
    }, [pageNumber])



    return (
        
        
        <SSinnerWrapper>
            <SSinnerWrapper.Top>
                {pageNumber === 1 && <IntroPage1 />}
                {pageNumber === 2 && (
                    <IntroPage2 setPageNumber={setPageNumber} />
                )}
                {pageNumber === 3 && (
                    <IntroPage3 setPageNumber={setPageNumber} />
                )}
                {pageNumber === 4 && (
                    <IntroPage4 setPageNumber={setPageNumber} />
                )}
            </SSinnerWrapper.Top>
            <SSinnerWrapper.Bottom>
                <div>
                {/*    todo
                    라디오? 페이지네이션? 인디케이터
                    만들음

                    필요 props >> maxPage, 활성화된 페이지
                */}
                </div>


                <SSbutton
                    text={'다음'}
                    onClick={() =>
                        setPageNumber(
                            (currentPageNumber) => currentPageNumber + 1,
                        )
                    }
                />
            </SSinnerWrapper.Bottom>
        </SSinnerWrapper>
    )
}

export default Intro
