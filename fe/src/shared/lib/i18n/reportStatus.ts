import { useTranslation } from 'react-i18next'

export type ReportStatusKey =
    | 'APPROVED'
    | 'PENDING'
    | 'REJECTED'
    | 'UNDETECTABLE'

export function useReportStatusLabel(
    status: string,
    variant: 'default' | 'profile' = 'default',
): string {
    const { t } = useTranslation('report')
    const key = status as ReportStatusKey
    if (variant === 'profile' && key === 'PENDING') {
        return t('status.reviewing')
    }
    return t(`status.${key}`, { defaultValue: status })
}

export function useAdminReportStatusLabel(status: string): string {
    const { t } = useTranslation('admin')
    return t(`reportStatus.${status}`, { defaultValue: status })
}
