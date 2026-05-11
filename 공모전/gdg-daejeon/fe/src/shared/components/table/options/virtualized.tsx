import { flexRender, Row, Table as TanstackTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'src/shared/lib/shadcn/components/ui/table.tsx'
import { ScrollArea } from 'src/shared/lib/shadcn/components/ui/scroll-area.tsx'
import { useEffect, useRef, useState } from 'react'
import { VirtualizationOptions } from './types.ts'

export const VirtualizedTable = <TData,>({
    table,
    virtualization,
}: {
    table: TanstackTable<TData>
    virtualization: VirtualizationOptions
}) => {
    const {
        rowHeight = 52,
        containerHeight = 400,
        overscan = 5,
    } = virtualization

    const parentRef = useRef<HTMLDivElement>(null)
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)

    const { rows } = table.getRowModel()

    useEffect(() => {
        if (parentRef.current) {
            const viewport = parentRef.current.querySelector(
                '[data-radix-scroll-area-viewport]',
            ) as HTMLElement
            setScrollElement(viewport)
        }
    }, [])

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollElement,
        estimateSize: () => rowHeight,
        overscan,
    })

    const virtualItems = virtualizer.getVirtualItems()

    return (
        <div className="rounded-md border">
            <ScrollArea
                ref={parentRef}
                style={{ height: containerHeight }}
                className="w-full"
            >
                <div
                    style={{
                        height: virtualizer.getTotalSize() + rowHeight,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* 고정 헤더 */}
                    <div className="bg-background sticky top-0 z-10 border-b">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="truncate"
                                                style={{
                                                    width:
                                                        header.getSize() !== 150
                                                            ? `${header.getSize()}px`
                                                            : `${100 / headerGroup.headers.length}%`,
                                                    height: rowHeight,
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                        </Table>
                    </div>

                    {/* 가상화된 행들 */}
                    {virtualItems.map((virtualRow) => {
                        const row = rows[virtualRow.index] as Row<TData>
                        if (!row) return null

                        return (
                            <div
                                key={row.id}
                                style={{
                                    position: 'absolute',
                                    top: rowHeight, // 헤더 높이만큼 오프셋
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <Table className="w-full table-fixed">
                                    <TableBody>
                                        <TableRow
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            style={{ height: rowHeight }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="truncate"
                                                        style={{
                                                            width:
                                                                cell.column.getSize() !==
                                                                150
                                                                    ? `${cell.column.getSize()}px`
                                                                    : `${100 / row.getVisibleCells().length}%`,
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
