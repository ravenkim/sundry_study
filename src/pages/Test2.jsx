import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Test2 = () => {
    const navigate = useNavigate()

    return <div onClick={() => navigate(-1)}>22222222222222</div>
}

export default Test2
