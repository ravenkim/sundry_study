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
                className="w-full h-[100vh] bg-contain bg-no-repeat  bg-center"
                style={{ backgroundImage: `url(${tableBg.src})` }}
            >

                <div className="w-full h-[124px]  flex justify-center items-center flex-col ">

                    <div
                        className={'text-bold text-md'}

                    >
                    김로켓님의 사주
                    </div>
                    <div
                        className={'text-bold text-2xl'}
                    >
                       1980년 8월27일 08:10
                    </div>
                </div>

                <div className="w-full px-6 bg-amber-300">



                <Table className="border-b border-r border-black w-full table-fixed">
                    <colgroup>
                        <col className="w-[16.67%]" />
                        <col className="w-[20.83%]" />
                        <col className="w-[20.83%]" />
                        <col className="w-[20.83%]" />
                        <col className="w-[20.83%]" />
                    </colgroup>
                    <TableHeader>
                        <TableRow className="border-b border-black">
                            <TableHead className="border-r border-black">

                            </TableHead>
                            <TableHead className="border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <ChineseCharacterWithKorean

                                    />
                                </div>
                            </TableHead>
                            <TableHead className="border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableHead>
                            <TableHead className="border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableHead>
                            <TableHead className="text-right">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody>
                        <TableRow className="border-b border-black">
                            {/* 맨 왼쪽 셀: 배경 유지 */}
                            <TableCell className="border-r border-black font-medium">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                
                            {/* 나머지 셀: 흰색 배경 */}
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-gray-400 "> {/* 여기를 변경 */}
                            {/* 맨 왼쪽 셀: 배경 유지 */}
                            <TableCell className="border-r border-black font-medium">
                                <div className="w-full h-full grid place-items-center">
                
                                </div>
                            </TableCell>
                            {/* 나머지 셀: 흰색 배경 */}
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center overflow-auto">
                                    <ChineseCharacterWithKoreanInSquare/>
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="bg-white border-r border-black">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-black">
                            {/* 맨 왼쪽 셀: 배경 유지 */}
                            <TableCell className="border-r border-black font-medium">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                
                            {/* 나머지 셀: 흰색 배경 */}
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                
                        <TableRow className="border-b border-black">
                            {/* 맨 왼쪽 셀: 배경 유지 */}
                            <TableCell className="border-r border-black font-medium">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                
                            {/* 나머지 셀: 흰색 배경 */}
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[20px] h-[50px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                
                        <TableRow className="border-b border-black">
                            {/* 맨 왼쪽 셀: 배경 유지 */}
                            <TableCell className="border-r border-black font-medium">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                
                            {/* 나머지 셀: 흰색 배경 */}
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <ChineseCharacterWithKorean />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <ChineseCharacterWithKorean />
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-400 bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                            <TableCell className="bg-white">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div>
        </MobileLayout>
    )
}
