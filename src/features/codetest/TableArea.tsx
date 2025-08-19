"use client"

import tableBg from '@/assets/images/tableBg.svg'


const TableArea = () => {
    const data = 'asd'

    return     <div
        className="w-full h-full  bg-cover "
        style={{ backgroundImage: `url(${tableBg.src})` }}
    >
        <div className="text-white p-4">내용</div>
    </div>
}

export default TableArea
