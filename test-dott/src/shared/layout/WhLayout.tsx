import WhHeader from 'src/shared/layout/WhHeader.tsx'

import React, { ReactNode } from 'react'

interface WhLayoutProps {
    children?: ReactNode
    title?: string
}

const WhLayout = ({ children, title = '' }: WhLayoutProps) => {
    return (
        <div>
            <WhHeader title={title} />
            {children}
        </div>
    )
}

export default WhLayout
