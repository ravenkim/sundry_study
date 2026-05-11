import { ArrowUpDown } from 'lucide-react'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/shared/lib/shadcn/components/ui/button'

// 사용자 정의 렌더링 함수를 포함하는 헤더 포맷 옵션 인터페이스
interface HeaderFormatOptions<T extends object> {
    label: string
    align?: 'left' | 'center' | 'right'
    sort?: boolean
    customHeader?: (label: string) => React.ReactNode
}

// 헤더 포맷터 생성기
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createHeaderFormatter = <T extends object>(
    options: HeaderFormatOptions<T>,
): Partial<ColumnDef<T>> => ({
    header: ({ column }) => {
        const { label, align = 'left', sort = false, customHeader } = options

        // 사용자 정의 렌더링 함수가 있으면 그것을 사용
        if (customHeader) {
            return customHeader(label)
        }

        const alignClass = {
            left: 'justify-start',
            center: 'justify-center',
            right: 'justify-end',
        }[align]

        // 정렬이 활성화된 경우
        if (sort) {
            return (
                <div className={`flex w-full items-center ${alignClass}`}>
                    {label}
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className={'p-0 hover:bg-transparent'}
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>
            )
        }

        // 기본 헤더
        return (
            <div
                className={`w-full ${{ left: 'text-left', center: 'text-center', right: 'text-right' }[align]}`}
            >
                {label}
            </div>
        )
    },
})
