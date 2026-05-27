import { motion } from 'framer-motion'
import { Children, isValidElement, type ReactNode } from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

type SSstaggerChildrenProps = {
    children: ReactNode
    className?: string
    stagger?: number
}

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
}

export function SSstaggerChildren({
    children,
    className,
    stagger = 0.06,
}: SSstaggerChildrenProps) {
    return (
        <motion.div
            className={cn(className)}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: stagger },
                },
            }}
        >
            {Children.map(children, (child, index) => {
                if (!isValidElement(child)) return child

                return (
                    <motion.div
                        key={child.key ?? index}
                        variants={itemVariants}
                    >
                        {child}
                    </motion.div>
                )
            })}
        </motion.div>
    )
}
