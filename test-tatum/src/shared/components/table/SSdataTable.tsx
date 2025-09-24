'use client'

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    RowData,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/lib/shadcn/components/ui/table'
import { DataTableProps } from './options/types'
import { renderPagination } from './options/pagination'
import { VirtualizedTable } from './options/virtualized'
import React from 'react'
import { Input } from '@/shared/lib/shadcn/components/ui/input'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        merge?: boolean
    }
}

export function SSdataTable<TData>({
    columns,
    data,
    pagination = {},
    virtualization = {},
    search = {},
}: DataTableProps<TData, unknown>) {
    const {
        enabled: paginationEnabled = false,
        pageSize = 10,
        position = 'bottom',
        align = 'right',
        showPageNumbers = true,
        maxVisiblePages = 5,
    } = pagination

    const {
        columns: searchColumns = [],
        position: searchPosition = 'top',
        align: searchAlign = 'left',
        placeholder = '',
    } = search

    const { enabled: virtualEnabled = false } = virtualization

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: paginationEnabled ? pageSize : data.length,
                pageIndex: 0,
            },
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
    })

    const searchComponent =
        searchColumns.length > 0 ? (
            <div
                className={`flex items-center py-4 ${
                    {
                        left: 'justify-start',
                        center: 'justify-center',
                        right: 'justify-end',
                    }[searchAlign]
                }`}
            >
                <Input
                    placeholder={placeholder}
                    value={globalFilter ?? ''}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
            </div>
        ) : null

    const paginationComponent = paginationEnabled
        ? renderPagination(table, showPageNumbers, maxVisiblePages, align)
        : null

    if (virtualEnabled) {
        return (
            <div>
                {(searchPosition === 'top' || searchPosition === 'both') &&
                    searchComponent}
                {(position === 'top' || position === 'both') &&
                    paginationComponent}
                <VirtualizedTable
                    table={table}
                    virtualization={virtualization}
                />
                {(position === 'bottom' || position === 'both') &&
                    paginationComponent}
                {(searchPosition === 'bottom' || searchPosition === 'both') &&
                    searchComponent}
            </div>
        )
    }

    function getRowSpans(
        rows: Row<TData>[],
        columnId: string,
    ): Record<string, number> {
        const spans: Record<string, number> = {}
        let prevValue: unknown = null
        let startRowId: string | null = null
        let count = 0

        rows.forEach((row) => {
            const value = row.getValue(columnId)

            if (value === prevValue) {
                count++
                spans[startRowId!] = count // 첫 행에 누적 rowSpan
                spans[row.id] = 0 // 병합된 나머지는 숨김
            } else {
                prevValue = value
                startRowId = row.id
                count = 1
                spans[row.id] = 1
            }
        })

        return spans
    }

    return (
        <div>
            {(searchPosition === 'top' || searchPosition === 'both') &&
                searchComponent}
            {(position === 'top' || position === 'both') && paginationComponent}
            <div className="overflow-hidden rounded-md border">
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
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    const colDef = cell.column.columnDef
                                    const mergeEnabled = colDef.meta?.merge

                                    if (mergeEnabled) {
                                        const spans = getRowSpans(
                                            table.getRowModel().rows,
                                            cell.column.id,
                                        )
                                        const span = spans[row.id]
                                        if (span === 0) return null
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                rowSpan={span}
                                                className="truncate"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        )
                                    }

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className="truncate"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {(position === 'bottom' || position === 'both') &&
                paginationComponent}
            {(searchPosition === 'bottom' || searchPosition === 'both') &&
                searchComponent}
        </div>
    )
}
