import { UserProfile } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ProfilePage = () => (
    <UserAppLayout title="마이페이지">
        <UserProfile />
    </UserAppLayout>
)

export default ProfilePage
