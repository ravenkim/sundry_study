import { SSdataTable } from '@/shared/components/table/SSdataTable'
import { DataTableProps } from '@/shared/components/table/options/types'


const SajuTable = <TData, TValue>({
                                      data,
                                      columns,
                                  }: DataTableProps<TData, TValue>) => {
    return (
        <SSdataTable<TData, TValue>
            data={data}
            columns={columns}
        />
    )
}

export default SajuTable
