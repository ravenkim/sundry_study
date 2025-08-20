// NineGridBox.tsx
import React from 'react'

type Props = {
    className?: string // 크기 제어용 (예: w-64, w-full 등)
    children?: React.ReactNode // 가운데 박스 안에 넣을 내용
}

const TableLayout: React.FC<Props> = ({ children }) => {
    return (
        <div
            className="grid w-full grid-cols-[7px_1fr_7px] grid-rows-[7px_1fr_7px] relative top-[-30] bg-[#F5F3EC] border-[3px] border-[#1B2F49]"

        >
            <div className="absolute top-0 bottom-0 left-[7px] w-px bg-[#2B557E]" />
            <div className="absolute top-0 right-[7px] bottom-0 w-px bg-[#2B557E]" />

            <div className="absolute top-[7px] right-0 left-0 h-px bg-[#2B557E]" />
            <div className="absolute right-0 bottom-[7px] left-0 h-px bg-[#2B557E]" />

            <div />
            <div />
            <div />

            <div />
            <div className="h-full w-full overflow-hidden">{children}</div>
            <div />

            <div />
            <div />
            <div />
        </div>
    )
}

export default TableLayout
