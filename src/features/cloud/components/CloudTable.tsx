'use client'
import { SSdataTable } from '@/shared/components/table/SSdataTable'
import { Button } from '@/shared/lib/shadcn/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { cloudDummyList } from '@/features/cloud/data/cloudData'
import { Cloud } from '@/features/cloud/types'
import { useEffect, useState } from 'react'
import { CloudFormDialog, FormValues } from './CloudFormDialog'
import { DeleteConfirmationDialog } from '@/shared/components/dialog/DeleteConfirmationDialog'

const CloudTable = () => {
    const [isClient, setIsClient] = useState(false)
    const [tableData, setTableData] = useState<Cloud[]>(cloudDummyList)
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: 'create' | 'edit'
        cloud?: Cloud
    }>({
        isOpen: false,
        mode: 'create',
        cloud: undefined,
    })
    const [deleteTarget, setDeleteTarget] = useState<Cloud | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleSave = (data: Partial<FormValues>) => {
        if (dialogState.mode === 'create') {
            const newCloud: Cloud = {
                id: `new-${Math.random().toString(36).substr(2, 9)}`,
                provider: data.provider!,
                name: data.name!,
                cloudGroupName:
                    data.cloudGroupName?.split(',').map((s) => s.trim()) || [],
                eventProcessEnabled: data.eventProcessEnabled!,
                userActivityEnabled: data.userActivityEnabled!,
                scheduleScanEnabled: data.scheduleScanEnabled!,
                scheduleScanSetting: data.scheduleScanSetting,
                regionList: data.regionList!.split(',').map((s) => s.trim()),
                proxyUrl: data.proxyUrl,
                credentials: {
                    accessKeyId: data.accessKeyId!,
                    secretAccessKey: data.secretAccessKey!,
                },
                credentialType: data.credentialType!,
                eventSource: {
                    cloudTrailName: data.cloudTrailName,
                },
            }
            setTableData((prev) => [newCloud, ...prev])
        } else {
            setTableData((prev) =>
                prev.map((cloud) => {
                    if (cloud.id === dialogState.cloud?.id) {
                        const newCredentials = { ...cloud.credentials }
                        if (
                            'accessKeyId' in newCredentials &&
                            data.accessKeyId
                        ) {
                            newCredentials.accessKeyId = data.accessKeyId
                        }
                        if (
                            'secretAccessKey' in newCredentials &&
                            data.secretAccessKey
                        ) {
                            newCredentials.secretAccessKey =
                                data.secretAccessKey
                        }

                        return {
                            ...cloud,
                            name: data.name || cloud.name,
                            provider: data.provider || cloud.provider,
                            cloudGroupName: data.cloudGroupName
                                ? data.cloudGroupName
                                      .split(',')
                                      .map((s) => s.trim())
                                : cloud.cloudGroupName,
                            regionList: data.regionList
                                ? data.regionList
                                      .split(',')
                                      .map((s) => s.trim())
                                : cloud.regionList,
                            proxyUrl: data.proxyUrl,
                            eventProcessEnabled: data.eventProcessEnabled!,
                            userActivityEnabled: data.userActivityEnabled!,
                            scheduleScanEnabled: data.scheduleScanEnabled!,
                            scheduleScanSetting: data.scheduleScanEnabled
                                ? data.scheduleScanSetting
                                : undefined,
                            credentialType:
                                data.credentialType || cloud.credentialType,
                            credentials: newCredentials,
                            eventSource: {
                                ...cloud.eventSource,
                                cloudTrailName: data.cloudTrailName,
                            },
                        }
                    }
                    return cloud
                }),
            )
        }
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        setTableData((prev) =>
            prev.filter((cloud) => cloud.id !== deleteTarget.id),
        )
        setDeleteTarget(null) // Close the dialog
    }

    const handleEditClick = (cloud: Cloud) => {
        setDialogState({
            isOpen: true,
            mode: 'edit',
            cloud: cloud, // Pass the row data, the dialog will fetch fresh data
        })
    }

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
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(cloud)}
                        >
                            수정
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteTarget(cloud)}
                        >
                            삭제
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button
                    onClick={() =>
                        setDialogState({
                            isOpen: true,
                            mode: 'create',
                            cloud: undefined,
                        })
                    }
                >
                    클라우드 생성
                </Button>
            </div>
            <SSdataTable
                columns={cloudColumns}
                data={tableData}
                virtualization={{
                    enabled: true,
                    containerHeight: 600,
                }}
            ></SSdataTable>
            {isClient && dialogState.isOpen && (
                <CloudFormDialog
                    key={dialogState.cloud?.id || 'create'}
                    isOpen={dialogState.isOpen}
                    mode={dialogState.mode}
                    cloud={dialogState.cloud}
                    onClose={() =>
                        setDialogState({
                            isOpen: false,
                            mode: 'create',
                            cloud: undefined,
                        })
                    }
                    onSave={handleSave}
                />
            )}
            {isClient && deleteTarget && (
                <DeleteConfirmationDialog
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteConfirm}
                    cloudName={deleteTarget.name}
                />
            )}
        </div>
    )
}

export default CloudTable
