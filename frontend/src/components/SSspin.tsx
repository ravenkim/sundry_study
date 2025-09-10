'use client'

type SSspinProps = {
    children?: React.ReactNode
    className?: string
    loading?: boolean
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
                    overlayColor = 'bg-white',
                    overlayOpacity = 'opacity-80',
                    text = '',
                }: SSspinProps) => {
    return (
        <div
            className={`relative overflow-hidden rounded-[0.3rem] ${className}`}
        >
            {loading && (
                <div
                    className={`absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-[0.3rem] ${overlayColor} ${overlayOpacity}`}
                >
                    {/* Spinner (SVG) */}
                    <svg
                        className="animate-spin text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width={size}
                        height={size}
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>

                    {text && (
                        <div className="ml-4 text-2xl">{text}</div>
                    )}
                </div>
            )}
            {children}
        </div>
    )
}

export default SSspin
