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

export default function TablePage() {
    return (
        <MobileLayout>
            <div className="w-full h-full p-3">
                <Table className="border-b border-r border-black w-full table-fixed">
                    <TableHeader>
                        <TableRow className="border-b border-black">
                            <TableHead className="w-0 flex-1 border-r border-black">

                            </TableHead>
                            <TableHead className="w-0 flex-1 border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <ChineseCharacterWithKorean

                                    />
                                </div>
                            </TableHead>
                            <TableHead className="w-0 flex-1 border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableHead>
                            <TableHead className="w-0 flex-1 border-r border-gray-400">
                                <div className="w-full h-full grid place-items-center">
                                    <div className="w-[10px] h-[10px] bg-red-500" />
                                </div>
                            </TableHead>
                            <TableHead className="w-0 flex-1 text-right">
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
        </MobileLayout>
    )
}
