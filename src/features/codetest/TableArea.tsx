"use client"

import tableBg from '@/assets/images/tableBg.svg'


const TableArea = () => {



    return     <div
        className="w-full h-full bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${tableBg.src})` }}
    >
        <div className="text-white p-4">내용</div>
    </div>
}

export default TableArea
