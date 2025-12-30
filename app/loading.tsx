import { Suspense } from "react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-club-black flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-club-red/30 border-t-club-red rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">SCN</span>
                </div>
            </div>
        </div>
    );
}
