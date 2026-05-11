import React from 'react'
import {
    CellFormatOptions,
    Region,
} from '@/shared/components/table/options/types'

const regionFormatMap: Record<Region, { locale: string; currency: string }> = {
    kr: { locale: 'ko-KR', currency: 'KRW' },
    us: { locale: 'en-US', currency: 'USD' },
    jp: { locale: 'ja-JP', currency: 'JPY' },
    cn: { locale: 'zh-CN', currency: 'CNY' },
    eu: { locale: 'de-DE', currency: 'EUR' },
}

// 셀 포맷터 생성기
export const createCellFormatter = <T extends object>(
    options: CellFormatOptions<T>,
) => ({
    cell: ({
        row,
    }: {
        row: { getValue: <K extends keyof T>(key: K) => T[K]; original: T }
    }) => {
        const {
            key,
            align = 'left',
            format = 'text',
            region = 'kr',
            prefix = '',
            suffix = '',
            customCell,
        } = options

        const { locale, currency } = regionFormatMap[region]

        const rawValue = row.getValue(key)
        let displayValue: React.ReactNode

        if (customCell) {
            displayValue = customCell(rawValue, row.original)
        } else {
            switch (format) {
                case 'currency':
                    displayValue = new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency,
                    }).format(Number(rawValue))
                    break
                case 'percentage':
                    displayValue = `${Number(rawValue).toFixed(2)}%`
                    break
                case 'date':
                    displayValue = new Date(
                        String(rawValue),
                    ).toLocaleDateString(locale)
                    break
                case 'text':
                default:
                    displayValue = String(rawValue)
            }

            displayValue = `${prefix}${displayValue}${suffix}`
        }

        const alignClass = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        }[align]

        return (
            <div className={`${alignClass} font-medium`}>{displayValue} </div>
        )
    },
})
