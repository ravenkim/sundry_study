const Id = () => {
    return (
        <div className="h-screen w-screen">
            <div className="flex w-full flex-wrap gap-4">
                {/* 첫 번째 */}
                <div className="w-full shrink-0 grow-0 bg-amber-300 lg:w-[450px]">
                    첫 번째
                </div>

                {/* 두 번째 */}
                <div className="w-full bg-amber-400 lg:min-w-[450px] lg:flex-1">
                    두 번째
                </div>
            </div>
        </div>
    )
}

export default Id
