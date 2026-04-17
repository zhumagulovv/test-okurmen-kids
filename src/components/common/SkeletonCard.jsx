function SkeletonCard() {
    return (
        <div className="bg-(--surface-container-lowest) rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-(--surface-container)" />
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-(--surface-container) rounded w-48" />
                <div className="h-4 bg-(--surface-container) rounded w-32" />
            </div>
            <div className="flex gap-8">
                <div className="space-y-2">
                    <div className="h-3 bg-(--surface-container) rounded w-12" />
                    <div className="h-5 bg-(--surface-container) rounded w-20" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-(--surface-container) rounded w-12" />
                    <div className="h-7 bg-(--surface-container) rounded w-16" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-6 bg-(--surface-container) rounded-full w-24" />
                <div className="h-4 bg-(--surface-container) rounded w-20" />
            </div>
        </div>
    )
}

export default SkeletonCard