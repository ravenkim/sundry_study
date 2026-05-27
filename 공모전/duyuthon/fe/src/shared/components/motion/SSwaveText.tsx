import { motion } from 'framer-motion'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

type SSwaveTextProps = {
    text: string
    className?: string
    /** wave: 로딩용 반복 물결, enter: 한 번 등장 */
    mode?: 'wave' | 'enter'
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export function SSwaveText({
    text,
    className,
    mode = 'wave',
    as: Tag = 'span',
}: SSwaveTextProps) {
    const chars = text.split('')

    return (
        <Tag
            className={cn('inline-flex flex-wrap justify-center', className)}
            aria-label={text}
        >
            {chars.map((char, index) => (
                <motion.span
                    key={`${index}-${char}`}
                    className="inline-block"
                    aria-hidden={char === ' '}
                    initial={mode === 'enter' ? { opacity: 0, y: 10 } : false}
                    animate={
                        mode === 'enter'
                            ? { opacity: 1, y: 0 }
                            : { y: [0, -6, 0] }
                    }
                    transition={
                        mode === 'enter'
                            ? {
                                  delay: index * 0.035,
                                  duration: 0.4,
                                  ease: [0.22, 1, 0.36, 1],
                              }
                            : {
                                  repeat: Infinity,
                                  duration: 0.9,
                                  delay: index * 0.055,
                                  ease: 'easeInOut',
                              }
                    }
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </Tag>
    )
}
