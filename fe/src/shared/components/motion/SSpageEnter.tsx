import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SSpageEnterProps = {
    children: ReactNode
    className?: string
}

export function SSpageEnter({ children, className }: SSpageEnterProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    )
}
