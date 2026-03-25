import { ColumnDef } from '@tanstack/react-table'
import { SSdataTable } from 'src/shared/components/table/SSdataTable.tsx'
import { Button } from 'src/shared/lib/shadcn/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'src/shared/lib/shadcn/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { createCellFormatter } from 'src/shared/components/table/options/cellFormatter.tsx'
import { createHeaderFormatter } from 'src/shared/components/table/options/headerFormatter.tsx'

const Table = () => {
    type Payment = {
        id: string
        amount: number
        status: 'pending' | 'processing' | 'success' | 'failed'
        email: string
    }
    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: 'status',
            header: 'Status',
            size: 200,
        },
        {
            accessorKey: 'email',
            ...createHeaderFormatter({
                label: 'Email',
                align: 'center',
                sort: true,
            }),
            size: 50,
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-right">Amount</div>,
            ...createCellFormatter({
                key: 'amount',
                format: 'currency',
                align: 'left',
            }),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const payment = row.original
                //todo 이거 컴포넌트화 어떻게 범위를 어디까지 할지 고민중
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(payment.id)
                                }
                            >
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>
                                View payment details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const data: Payment[] = [
        {
            id: '728ed52f',
            amount: 100,
            status: 'pending',
            email: 'm@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
        {
            id: '489e1d42',
            amount: 125,
            status: 'processing',
            email: 'example@gmail.com',
        },
        {
            id: 'a1b2c3d4',
            amount: 250,
            status: 'success',
            email: 'john@example.com',
        },
        {
            id: 'd4e5f6g7',
            amount: 75,
            status: 'failed',
            email: 'jane@example.com',
        },
        {
            id: 'h8i9j0k1',
            amount: 330,
            status: 'pending',
            email: 'user1@example.com',
        },
        {
            id: 'l2m3n4o5',
            amount: 180,
            status: 'success',
            email: 'user2@example.com',
        },
        {
            id: 'p6q7r8s9',
            amount: 99,
            status: 'processing',
            email: 'user3@example.com',
        },
        {
            id: 't0u1v2w3',
            amount: 420,
            status: 'failed',
            email: 'user4@example.com',
        },
        {
            id: 'x4y5z6a7',
            amount: 150,
            status: 'success',
            email: 'user5@example.com',
        },
    ]

    return (
        <div>
            <SSdataTable
                columns={columns}
                data={data}
                pagination={{
                    enabled: true,
                }}
                search={{
                    columns: ['email', 'status'],
                    position: 'top',
                    align: 'right',
                }}
            />
        </div>
    )
}

export default Table
