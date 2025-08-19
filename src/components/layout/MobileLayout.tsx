import React from 'react'

interface MobileLayoutProps {
    children: React.ReactNode
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
    return <div className="mx-auto max-w-md">{children}</div>
}

export default MobileLayout
