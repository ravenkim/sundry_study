'use client'
import { SSdataTable } from '@/shared/components/table/SSdataTable'
import { Button } from '@/shared/lib/shadcn/components/ui/button'

import { ColumnDef } from '@tanstack/react-table'
import { cloudDummyList } from '@/features/cloud/data/cloudData'

const CloudTable = () => {
    const cloudColumns: ColumnDef<Cloud>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span>{row.getValue('id')}</span>,
        },
        {
            accessorKey: 'provider',
            header: 'Provider',
            cell: ({ row }) => <span>{row.getValue('provider')}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Cloud Name',
            cell: ({ row }) => <span>{row.getValue('name')}</span>,
        },
        {
            accessorKey: 'cloudGroupName',
            header: 'Group',
            cell: ({ row }) => {
                const groups = row.getValue<string[]>('cloudGroupName')
                return groups?.length ? groups.join(', ') : '-'
            },
        },
        {
            accessorKey: 'regionList',
            header: 'Regions',
            cell: ({ row }) => {
                const regions = row.getValue<string[]>('regionList')
                return regions?.length ? regions.join(', ') : '-'
            },
        },
        {
            accessorKey: 'eventProcessEnabled',
            header: 'Event',
            cell: ({ row }) =>
                row.getValue<boolean>('eventProcessEnabled') ? (
                    <span className="text-green-600">Enabled</span>
                ) : (
                    <span className="text-red-600">Disabled</span>
                ),
        },
        {
            accessorKey: 'userActivityEnabled',
            header: 'User Activity',
            cell: ({ row }) =>
                row.getValue<boolean>('userActivityEnabled') ? (
                    <span className="text-green-600">Enabled</span>
                ) : (
                    <span className="text-red-600">Disabled</span>
                ),
        },
        {
            accessorKey: 'scheduleScanEnabled',
            header: 'Schedule Scan',
            cell: ({ row }) =>
                row.getValue<boolean>('scheduleScanEnabled') ? (
                    <span className="text-green-600">Enabled</span>
                ) : (
                    <span className="text-gray-500">Disabled</span>
                ),
        },
        {
            accessorKey: 'credentialType',
            header: 'Credential Type',
            cell: ({ row }) => <span>{row.getValue('credentialType')}</span>,
        },
        {
            accessorKey: 'proxyUrl',
            header: 'Proxy URL',
            cell: ({ row }) => row.getValue<string>('proxyUrl') ?? '-',
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const cloud = row.original
                return (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => console.log('Edit', cloud)}
                        >
                            수정
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <SSdataTable
            columns={cloudColumns}
            data={cloudDummyList}
            virtualization={{
                enabled: true,
                containerHeight: 600,
            }}
        ></SSdataTable>
    )
}

export default CloudTable