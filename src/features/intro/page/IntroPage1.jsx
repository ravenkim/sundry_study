import TitleWithSubtitle from 'src/features/intro/components/TitleWithSubtitle.jsx'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import { shallowEqual, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const IntroPage1 = () => {
    const titles = ['혼자 가긴 무섭고', '너무 진지한 소개팅이', '질렸다면?']
    const description = '친구랑 같이 편하게 시작해요'

    const navigate = useNavigate()

    const { from } = useSelector(
        ({ routerReducer }) => ({
            from: routerReducer.location.state,
        }),
        shallowEqual,
    )

    return (
        <div className={'w-full'}>
            <SStopBar
                onBackClick={() => navigate(-1)}
                onCloseClick={() => navigate('/')}
            />

            <TitleWithSubtitle titles={titles} description={description} />
        </div>
    )
}

export default IntroPage1
