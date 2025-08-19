import React from 'react'

interface MobileLayoutProps {
    children: React.ReactNode
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
    return (
        <div className="outline-border mx-auto max-w-md bg-[#F3F2EF] outline outline-1">
            {children}
        </div>
    )
}

export default MobileLayout
