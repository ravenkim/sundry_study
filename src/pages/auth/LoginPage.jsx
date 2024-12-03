//로그인 페이지

import SSlayout from 'src/common/layouts/SSlayout.jsx'
import Login from 'src/features/auth/Login.jsx'

const LoinPage = () => {
    return (
        <SSlayout
            useNav={false}

        >
            <Login/>
        </SSlayout>
    )
}

export default LoinPage