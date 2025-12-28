export function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded mt-4" />
            </div>
        </div>
    );
}

export function SkeletonHero() {
    return (
        <div className="min-h-[60vh] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center space-y-6 animate-pulse">
                <div className="h-24 w-24 bg-gray-300 rounded-full mx-auto" />
                <div className="h-12 bg-gray-300 rounded w-1/2 mx-auto" />
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
                <div className="flex gap-4 justify-center">
                    <div className="h-12 bg-gray-300 rounded w-40" />
                    <div className="h-12 bg-gray-300 rounded w-40" />
                </div>
            </div>
        </div>
    );
}
