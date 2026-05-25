import { useTranslation } from 'react-i18next'
import { BuildingRankingBoard } from 'src/features/ranking/BuildingRankingBoard'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const RankingPage = () => {
    const { t } = useTranslation('nav')

    return (
        <UserAppLayout title={t('pages.ranking')} showPoints={false}>
            <BuildingRankingBoard />
        </UserAppLayout>
    )
}

export default RankingPage
