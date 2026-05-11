'use client'

import TableLayout from '@/features/codetest/components/TableLayout'
import SajuTable from '@/features/codetest/components/SajuTable'

const TableArea = () => {
    return (
        <div
            className={
                'absolute relative top-[-90] z-50 w-full bg-[#F5F3EC] p-5'
            }
        >
            <div className={'w-full'}>
                <TableLayout>
                    <SajuTable />
                </TableLayout>
            </div>
        </div>
    )
}

export default TableArea
