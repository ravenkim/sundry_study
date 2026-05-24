import type { AdminReportRow } from 'src/globals/api/types'

export function parseReportLocation(report: Pick<
    AdminReportRow,
    'buildingName' | 'roomName' | 'locationPath'
>): {
    groupPath: string
    leafName: string
} {
    if (report.locationPath) {
        const parts = report.locationPath
            .split('>')
            .map((part) => part.trim())
            .filter(Boolean)

        if (parts.length >= 2) {
            return {
                groupPath: parts.slice(0, -1).join(' · '),
                leafName: parts[parts.length - 1],
            }
        }
        if (parts.length === 1) {
            return {
                groupPath: report.buildingName,
                leafName: parts[0],
            }
        }
    }

    return {
        groupPath: report.buildingName,
        leafName: report.roomName,
    }
}

export const ReportLocationCell = ({
    report,
}: {
    report: Pick<AdminReportRow, 'buildingName' | 'roomName' | 'locationPath'>
}) => {
    const { groupPath, leafName } = parseReportLocation(report)

    return (
        <div className="flex min-w-0 flex-col gap-0.5">
            {groupPath && (
                <span className="text-on-surface-variant truncate text-[10px] font-medium tracking-wide">
                    {groupPath}
                </span>
            )}
            <span className="text-on-surface truncate font-bold">{leafName}</span>
        </div>
    )
}
