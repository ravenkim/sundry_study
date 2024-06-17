import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { routerAction } from 'src/routes/routerReducer.jsx'
import SSbutton from 'src/common/components/button/SSbutton.jsx'

const Test1 = () => {
    const dispatch = useDispatch()

    const navigate = useNavigate()


    return (
        <div>
            <SSbutton
                onClick={() =>
                    navigate('/bb', {
                        state: {
                            aaa: 123,
                            state: [123, 23, 51],
                            vvv: 4456
                        }
                    })
                }
            >
                aaaaaa
            </SSbutton>
            <button onClick={() => dispatch(routerAction.initializeAll())}>
                bbbbbbbbbbbbbbbbbbbb
            </button>
            <button
                onClick={() =>
                    navigate('/bb', {
                        state: {
                            aaa: 123,
                            state: [123, 23, 51],
                            vvv: 4456
                        }
                    })
                }
            >
                bvvvvvvvvvvvvvvvvvvvvvvvvv
            </button>
            1111111111111111111111
        </div>
    )
}

export default Test1
