import { useTranslation } from 'react-i18next'
import { AboutUsPage } from 'src/features/about/AboutUsPage'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const AboutUsRoutePage = () => {
    const { t } = useTranslation('nav')

    return (
        <UserAppLayout title={t('pages.aboutUs')} showPoints={false}>
            <AboutUsPage />
        </UserAppLayout>
    )
}

export default AboutUsRoutePage
