import { useNavigate } from 'react-router-dom'
import SStopBar from 'src/common/components/topBar/SStopBar.jsx'
import TitleWithSubtitle from 'src/features/intro/components/TitleWithSubtitle.jsx'

const IntroPage4 = ({ setPageNumber }) => {
    const titles = ['혼자 가긴 무섭고', '너무 진지한 소개팅이', '질렸다면?']
    const description = '친구랑 같이 편하게 시작해요'

    const navigate = useNavigate()

    return (
        <div className={'w-full'}>
            <SStopBar
                onBackClick={() =>
                    setPageNumber((currentPageNumber) => currentPageNumber - 1)
                }
                onCloseClick={() => navigate('/')}
            />

            <TitleWithSubtitle titles={titles} description={description} />
        </div>
    )
}

export default IntroPage4
