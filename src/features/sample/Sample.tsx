import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/app/store/redux/reduxHooks.tsx'
import { sampleAction } from 'src/features/sample/sampleReducer.ts'
import { toast } from 'react-toastify'

const Sample = () => {
    const navigate = useNavigate()

    const [cccc, setCccc] = useState(0)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(sampleAction.initialize('value'))

        return () => {
            dispatch(sampleAction.initialize('value'))
        }
    }, [dispatch])
    const notify = () => toast('Wow so easy !')

    return (
        <div>
            <div className={'bg-accent h-50 w-50'}></div>
            <button onClick={notify}>Notify !</button>
            <button
                onClick={() => {
                    navigate('/')
                }}
            >
                홈으로
            </button>
            <div>
                <button
                    onClick={() => {
                        navigate('/sample/sample')
                    }}
                >
                    sssssssssssss
                </button>
            </div>
            {cccc}
            <button
                onClick={() => {
                    setCccc((state) => state + 1)
                }}
            >
                bbbbbbbbbbbbbbbbbbbbbbb
            </button>
            sdfsdfd sdfsdfd
        </div>
    )
}

export default Sample
