import { Loader } from 'lucide-react'
import { ReactNode } from 'react'
import { SSwaveText } from 'src/shared/components/motion'

type SSspinProps = {
    children?: ReactNode
    className?: string
    loading: boolean
    size?: number
    strokeWidth?: number
    overlayColor?: string
    overlayOpacity?: string
    text?: string
}

const SSspin = ({
    children,
    className = '',
    loading,
    size = 24,
    strokeWidth = 2,
    overlayColor = 'bg-background/80',
    overlayOpacity = 'opacity-80',
    text = '',
}: SSspinProps) => {
    return (
        <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.3rem] ${className}`}
        >
            {loading && (
                <div
                    className={`absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center gap-3 rounded-[0.3rem] ${overlayColor} ${overlayOpacity}`}
                >
                    <Loader
                        className="text-primary animate-spin"
                        size={size}
                        strokeWidth={strokeWidth}
                    />
                    {text ? (
                        <SSwaveText
                            text={text}
                            className="text-on-surface text-lg font-medium"
                        />
                    ) : null}
                </div>
            )}
            {children}
        </div>
    )
}

export default SSspin
