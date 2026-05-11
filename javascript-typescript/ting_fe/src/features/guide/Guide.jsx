import { Button } from 'src/assets/shadcn/components/ui/button.jsx'
import { sampleAction } from 'src/features/sample/sampleReducer.jsx'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { authAction } from 'src/features/auth/authReducer.jsx'
import client from 'src/api/client.jsx'

const Guide = () => {
    const dispatch = useDispatch()

    return (
        <div>
            <Button
                onClick={() => {
                    dispatch(
                        authAction.login({
                            loginId: 'string',
                            password: 'string',
                        }),
                    )
                }}
            >
                aaaaaaaa
            </Button>
        </div>
    )
}

export default Guide
