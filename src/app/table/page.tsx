import { MobileLayout } from '@/shared/layout'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/lib/shadcn/components/ui/table'
import ChineseCharacterWithKorean from '@/shared/components/text/ChineseCharacterWithKorean'
import ChineseCharacterWithKoreanInSquare from '@/shared/components/text/ChineseCharacterWithKoreanInSquar'
import tableBg from '@/assets/images/tableBg.svg'

export default function TablePage() {
    /**  todo data 가 어떤 식으로 들어오는기 모르겠음
    만약 가로 세로 가 고정에 안쪽만 데이터로 들어오는건지
     다른 형태의 여러 테이블이 (이 디자인이 필요한건지 에 따라서 컴포넌트 공통화 묶음 단위가 달라짐 - 논의 필요 )
   **/

    return (
        <MobileLayout>
            <div
                className="h-[100vh] w-full bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${tableBg.src})` }}
            ></div>
        </MobileLayout>
    )
}
