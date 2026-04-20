const StatsSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white/10 rounded-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm animate-pulse"
                >
                    {/* icon skeleton */}
                    <div className="w-8 h-8 rounded-md bg-white/20" />

                    <div className="flex flex-col gap-2 w-full">
                        {/* value skeleton */}
                        <div className="h-5 w-16 bg-white/20 rounded" />

                        {/* label skeleton */}
                        <div className="h-3 w-24 bg-white/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsSkeleton