import { useTranslation } from 'react-i18next'
import { UserPointShop } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ShopPage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.shop')}>
            <UserPointShop />
        </UserAppLayout>
    )
}

export default ShopPage
