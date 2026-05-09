import WhHeader from 'src/shared/layout/WhHeader.tsx'

import React, { ReactNode } from 'react'

interface WhLayoutProps {
    children?: ReactNode
}

const WhLayout = ({ children }: WhLayoutProps) => {
    return (
        <div>
            <WhHeader />
            {children}
        </div>
    )
}

export default WhLayout
