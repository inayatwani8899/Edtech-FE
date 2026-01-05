// src/components/ui/Loader.tsx
import React from "react";
import { useLoaderStore } from "@/store/loaderStore";

export const Loader: React.FC = () => {
    const loading = useLoaderStore((state) => state.loading);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="flex flex-col items-center justify-center p-6 bg-[#1e293b] rounded-xl shadow-lg">
                <div className="relative w-16 h-16">
                    <span className="absolute border-4 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></span>
                    <span className="absolute border-4 border-t-green-400 rounded-full w-12 h-12 top-2 left-2 animate-spin-slow"></span>
                    <span className="absolute border-4 border-t-yellow-400 rounded-full w-8 h-8 top-4 left-4 animate-spin-reverse"></span>
                </div>
                <p className="mt-4 text-white font-medium">Loading <span className="animate-pulse">...</span></p>
            </div>
        </div>
    );
};
