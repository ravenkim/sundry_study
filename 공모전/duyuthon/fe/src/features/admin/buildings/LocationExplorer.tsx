import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EcoCard } from 'src/shared/ui/eco'
import { LocationColumn } from 'src/features/admin/buildings/LocationColumn'
import { LocationFormSheet } from 'src/features/admin/buildings/LocationFormSheet'
import { getDepthLabel, getDepthSubtitle } from 'src/features/admin/buildings/locationTreeUtils'
import type { useLocationTree } from 'src/features/admin/buildings/useLocationTree'
import type { AdminLocationNode } from 'src/globals/api/types'

type LocationTreeState = ReturnType<typeof useLocationTree>

export const LocationExplorer = ({
    loading,
    submitting,
    selected,
    sheet,
    sheetBreadcrumb,
    buildings,
    middleNodes,
    roomNodes,
    thirdColumnActive,
    selectBuilding,
    selectMiddle,
    selectRoom,
    openCreateSheet,
    openEditSheet,
    closeSheet,
    handleCreate,
    handleUpdate,
    handleDelete,
}: LocationTreeState) => {
    const { t } = useTranslation('adminBuildings')
    const [deleteIntent, setDeleteIntent] = useState(false)

    const openEdit = (node: AdminLocationNode) => {
        setDeleteIntent(false)
        openEditSheet(node)
    }

    const openDelete = (node: AdminLocationNode) => {
        setDeleteIntent(true)
        openEditSheet(node)
    }

    const handleCloseSheet = () => {
        setDeleteIntent(false)
        closeSheet()
    }

    const selectedBuilding = buildings.find((b) => b.id === selected.buildingId)
    const selectedMiddle = middleNodes.find((m) => m.id === selected.middleId)

    const column2Title = selectedBuilding
        ? t('columnChildrenTitle', { name: selectedBuilding.name })
        : getDepthLabel(2)

    const column3Title = selectedMiddle
        ? t('columnChildrenTitle', { name: selectedMiddle.name })
        : getDepthLabel(3)

    return (
        <>
            <EcoCard className="overflow-hidden p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <LocationColumn
                        title={getDepthLabel(1)}
                        subtitle={getDepthSubtitle(1)}
                        items={buildings}
                        selectedId={selected.buildingId}
                        depth={1}
                        loading={loading}
                        canAdd
                        emptyMessage={t('empty.depth1')}
                        emptyActionLabel={t('empty.depth1Action')}
                        onSelect={selectBuilding}
                        onAdd={() => openCreateSheet(1)}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        onEmptyAction={() => openCreateSheet(1)}
                    />

                    <LocationColumn
                        title={column2Title}
                        subtitle={getDepthSubtitle(2)}
                        items={middleNodes}
                        selectedId={selected.middleId}
                        depth={2}
                        loading={loading}
                        disabled={!selected.buildingId}
                        canAdd={!!selected.buildingId}
                        emptyMessage={
                            selected.buildingId
                                ? t('empty.depth2Add')
                                : t('empty.selectDepth1')
                        }
                        emptyActionLabel={
                            selected.buildingId ? t('empty.depth2Action') : undefined
                        }
                        onSelect={selectMiddle}
                        onAdd={() => openCreateSheet(2)}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        onEmptyAction={() => openCreateSheet(2)}
                    />

                    <LocationColumn
                        title={column3Title}
                        subtitle={getDepthSubtitle(3)}
                        items={roomNodes}
                        selectedId={selected.roomId}
                        depth={3}
                        loading={loading}
                        disabled={
                            !selected.buildingId ||
                            !selected.middleId ||
                            !thirdColumnActive
                        }
                        canAdd={thirdColumnActive}
                        emptyMessage={
                            !selected.buildingId
                                ? t('empty.selectDepth1')
                                : !selected.middleId
                                  ? t('empty.selectDepth2Group')
                                  : !thirdColumnActive
                                    ? t('empty.depth3DirectLeaf')
                                    : t('empty.depth3Add')
                        }
                        emptyActionLabel={
                            thirdColumnActive ? t('empty.depth3Action') : undefined
                        }
                        onSelect={selectRoom}
                        onAdd={() => openCreateSheet(3)}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        onEmptyAction={() => openCreateSheet(3)}
                    />
                </div>
            </EcoCard>

            <LocationFormSheet
                sheet={sheet}
                breadcrumb={sheetBreadcrumb}
                submitting={submitting}
                startWithDeleteConfirm={deleteIntent}
                onClose={handleCloseSheet}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </>
    )
}
