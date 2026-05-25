import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

type SSfadeInProps = {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    y?: number
} & Pick<HTMLMotionProps<'div'>, 'layout'>

export function SSfadeIn({
    children,
    className,
    delay = 0,
    duration = 0.35,
    y = 12,
    layout,
}: SSfadeInProps) {
    return (
        <motion.div
            layout={layout}
            className={cn(className)}
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    )
}
