import React from 'react'

interface MobileLayoutProps {
    children: React.ReactNode
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
    return <div className="mx-auto max-w-md outline outline-1 outline-border bg-[#F3F2EF]">{children}</div>
}

export default MobileLayout
