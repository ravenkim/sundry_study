import { useTranslation } from 'react-i18next'
import { AffiliationRankingBoard } from 'src/features/ranking/AffiliationRankingBoard'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const RankingPage = () => {
    const { t } = useTranslation('nav')

    return (
        <UserAppLayout title={t('pages.ranking')} showPoints={false}>
            <AffiliationRankingBoard />
        </UserAppLayout>
    )
}

export default RankingPage
