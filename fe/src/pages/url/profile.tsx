import { useTranslation } from 'react-i18next'
import { UserProfile } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ProfilePage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.profile')}>
            <UserProfile />
        </UserAppLayout>
    )
}

export default ProfilePage
