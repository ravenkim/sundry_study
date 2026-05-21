import { Link } from 'react-router'
import { MascotEmptyState } from 'src/shared/components/mascort'
import { EcoButton } from 'src/shared/ui/eco'

const NotFoundPage = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <MascotEmptyState
            emotion="question"
            title="페이지를 찾을 수 없어요"
            description="주소가 바뀌었거나 삭제된 페이지일 수 있어요."
        >
            <Link to="/">
                <EcoButton className="px-8">홈으로 가기</EcoButton>
            </Link>
        </MascotEmptyState>
    </div>
)

export default NotFoundPage
