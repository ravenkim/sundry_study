import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import SSbutton from 'src/common/components/button/SSbutton.jsx'
import { sampleAction } from 'src/features/sample/sampleReducer.jsx'

const Sample = () => {

    const dispatch = useDispatch()

    const {
        data,
    } = useSelector(({ sampleReducer }) => ({
            data: sampleReducer,
        }),
        shallowEqual,
    )


    return (
        <div>
            <SSbutton
                onClick={() => dispatch(sampleAction.getCode())}

            >데이터 가져오기</SSbutton>



            <div>
                이곳에 데이터가 표시됩니다
                <div>

                </div>
            </div>


            {/*    본가의 업데이트*/}

        </div>
    )
}

export default Sample