"use client"

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'

import React from 'react'
import { Input } from '@/shared/lib/shadcn/components/ui/input'
import { VirtualizedTable } from '@/shared/components/table/options/virtualized'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/lib/shadcn/components/ui/table'
import { renderPagination } from '@/shared/components/table/options/pagination'
import { DataTableProps } from '@/shared/components/table/options/types'

export function SSdataTable<TData, TValue>({
    columns = [],
    data = [],
    pagination = {},
    virtualization = {},
    search = {},
}: DataTableProps<TData, TValue>) {
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="truncate"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
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
