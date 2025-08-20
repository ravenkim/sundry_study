"use client"

import tableBg from '@/assets/images/tableBg.svg'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/lib/shadcn/components/ui/table'
import ChineseCharacterWithKorean from '@/shared/components/text/ChineseCharacterWithKorean'
import ChineseCharacterWithKoreanInSquare from '@/shared/components/text/ChineseCharacterWithKoreanInSquar'


const TableArea = () => {
    // todo 진짜 배경 그냥 붙여넣기 할거면 누끼딴거면 투명부분 제거해서 추가해주세요 (피그마 작업 오래걸렸습니다)논의 필요

    /** todo 논의 필요 데이터 어떤식으로 받을지 아래 처럼 받는지 형태에 따라서 컴포넌트 수정 예정 (자동화 해서 쓰기 편하게)
    const columns =  ["구분", "時", "日", "月", "年"]
    const data = [
            {
                "구분": "十星",
                "時": "傷官(상관)",
                "日": "比肩(비견)",
                "月": "傷官(상관)",
                "年": "傷官(상관)"
            },
            {
                "구분": "천간",
                "時": "壬(임수 陽水)",
                "日": "丁(정화 陰火)",
                "月": "癸(계수 陰水)",
                "年": "癸(계수 陰水)"
            },
            {
                "구분": "지지",
                "時": "寅(인목 陽木)",
                "日": "巳(사화 陰火)",
                "月": "亥(해수 陰水)",
                "年": "酉(유금 陰金)"
            },
            {
                "구분": "십성",
                "時": "比肩(비견)",
                "日": "劫財(겁재)",
                "月": "食神(식신)",
                "年": "偏財(편재)"
            },
            {
                "구분": "십이운성",
                "時": "死(사)",
                "日": "帝旺(제왕)",
                "月": "胎(태)",
                "年": "長生(장생)"
            },
            {
                "구분": "십이신살",
                "時": "劫殺(겁살)",
                "日": "地殺(지살)",
                "月": "驛馬殺(역마살)",
                "年": "將星殺(장성살)"
            },
            {
                "구분": "귀인",
                "時": "없음",
                "日": "없음",
                "月": "天乙(천을귀인)",
                "年": "天乙(천을귀인), 太極(태극귀인), 文昌(문창귀인)"
            }
        ]

    **/
    return <div
        className="w-full h-full bg-contain bg-no-repeat "
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

        <div className="w-full px-6 ">


            <Table className="border-b border-r border-black w-full   bg-amber-200 table-fixed">
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
                                    han={'時'}
                                />
                            </div>
                        </TableHead>
                        <TableHead className="border-r border-gray-400">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    han={'時'}
                                />                            </div>
                        </TableHead>
                        <TableHead className="border-r border-gray-400">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    han={'時'}
                                />                            </div>
                        </TableHead>
                        <TableHead className="text-right">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    han={'時'}
                                />                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>


                <TableBody>
                    <TableRow className="border-b border-black">
                        {/* 맨 왼쪽 셀: 배경 유지 */}
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>

                        {/* 나머지 셀: 흰색 배경 */}
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-gray-400 "> {/* 여기를 변경 */}
                        {/* 맨 왼쪽 셀: 배경 유지 */}
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                            </div>
                        </TableCell>
                        {/* 나머지 셀: 흰색 배경 */}
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center overflow-auto">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare
                                    backgroundColor={'#222222'}
                                    
                                />
                            </div>
                        </TableCell>
                        <TableCell className="bg-white border-r border-black">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-black">
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                                   </div>
                        </TableCell>

                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare
                                />
                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKoreanInSquare />
                            </div>
                        </TableCell>
                    </TableRow>

                    <TableRow className="border-b border-black">
                        {/* 맨 왼쪽 셀: 배경 유지 */}
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>

                        {/* 나머지 셀: 흰색 배경 */}
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-black">
                        {/* 맨 왼쪽 셀: 배경 유지 */}
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>

                        {/* 나머지 셀: 흰색 배경 */}
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-black">
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'십이신살'}
                                    han={'十二神煞'}
                                />
                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="border-r border-gray-400 bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />                            </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center ">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                            </div>
                        </TableCell>
                    </TableRow>

                    <TableRow className="border-b border-black">
                        <TableCell className="border-r border-black font-medium">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    han={'貴人 '}
                                    kor={'귀인'}
                                />
                            </div>
                        </TableCell>
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
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                            </div>
                        </TableCell>
                        <TableCell className="bg-white">
                            <div className="w-full h-full grid place-items-center">
                                <ChineseCharacterWithKorean
                                    kor={'천을귀인'}
                                    han={'天乙'}
                                />
                                <ChineseCharacterWithKorean
                                    kor={'태극귀인'}
                                    han={'太極'}
                                />
                                <ChineseCharacterWithKorean
                                    kor={'문창귀인'}
                                    han={'文昌'}/>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
}

export default TableArea
