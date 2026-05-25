import { useTranslation } from 'react-i18next'

export type ReportStatusKey =
    | 'APPROVED'
    | 'PENDING'
    | 'REJECTED'
    | 'UNDETECTABLE'

export function useReportStatusLabel(status: string): string {
    const { t } = useTranslation('report')
    const key = status as ReportStatusKey
    return t(`status.${key}`, { defaultValue: status })
}

export function useAdminReportStatusLabel(status: string): string {
    const { t } = useTranslation('admin')
    return t(`reportStatus.${status}`, { defaultValue: status })
}
