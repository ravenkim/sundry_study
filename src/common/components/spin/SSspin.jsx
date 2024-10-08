import { cn } from 'src/assets/shadcn/utils.js'

const SSspin = ({ children, className, loading }) => {
    
    // todo  이미지 변경
    return (
        <div className="relative w-full h-full">
            {loading && (
                <div className="w-full h-full absolute inset-0 bg-muted bg-opacity-50 flex items-center justify-center z-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("animate-spin text-primary", className)}
                    >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
            )}
            {children}
        </div>
    )
}

export default SSspin