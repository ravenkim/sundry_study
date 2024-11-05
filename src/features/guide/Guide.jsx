import { Button } from 'src/assets/shadcn/components/ui/button.jsx'
import { sampleAction } from 'src/features/sample/sampleReducer.jsx'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { authAction } from 'src/features/auth/authReducer.jsx'
import client from 'src/api/client.jsx'

const Guide = () => {
    const dispatch = useDispatch()



    return (
        <div>
            <Button onClick={() => {
                client
                    .post('/auth/login', {
                        loginId: 'aaa',
                        password: 'asd',
                    })
                    .then((response) => {
                        console.log('Data:', response.data)
                    })

            }}>
                aaaaaaaa
            </Button>
        </div>
    )
}

export default Guide
