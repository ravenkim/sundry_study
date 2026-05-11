//회원가입 페이지

import SSlayout from 'src/common/layouts/SSlayout.jsx'
import UserJoin from 'src/features/user/join/UserJoin.jsx'

const UserJoinPage = () => {
    return (
        <SSlayout useNav={false}>
            <UserJoin />
        </SSlayout>
    )
}

export default UserJoinPage
