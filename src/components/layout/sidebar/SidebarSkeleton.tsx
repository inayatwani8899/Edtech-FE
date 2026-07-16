import React from "react";
import { cn } from "@/lib/utils";

interface SidebarSkeletonProps {
  isCollapsed?: boolean;
  theme?: "dark" | "light";
}

export function SidebarSkeleton({ isCollapsed = false, theme = "dark" }: SidebarSkeletonProps) {
  // 8 placeholders for the main flow, 2 for secondary / access control
  const flowCount = 8;
  const secondaryCount = 2;

  const bgClasses = theme === "dark" ? "bg-slate-800" : "bg-slate-200";
  const lineClasses = theme === "dark" ? "bg-slate-800/70" : "bg-slate-200/70";

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full select-none pointer-events-none p-3 space-y-4 animate-pulse">
      {/* Flow Items Section */}
      <div className="space-y-3">
        {!isCollapsed && (
          <div className="px-3 py-1 flex items-center gap-4">
            <div className={cn("h-2.5 w-20 rounded", lineClasses)} />
            <div className={cn("h-[1px] w-full flex-1", theme === "dark" ? "bg-slate-800/50" : "bg-slate-200/50")} />
          </div>
        )}
        
        <div className="space-y-2">
          {Array.from({ length: flowCount }).map((_, index) => (
            <div
              key={`flow-${index}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg",
                isCollapsed ? "justify-center" : ""
              )}
            >
              {/* Circle Icon Placeholder */}
              <div className={cn("h-5 w-5 rounded-full flex-shrink-0", bgClasses)} />
              {/* Text Placeholder */}
              {!isCollapsed && (
                <div 
                  className={cn("h-3.5 rounded", lineClasses)} 
                  style={{ width: `${Math.floor(Math.random() * (120 - 70 + 1)) + 70}px` }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section Divider & Secondary Items */}
      <div className="space-y-3 pt-2">
        {!isCollapsed && (
          <div className="px-3 py-1 flex items-center gap-4">
            <div className={cn("h-2.5 w-24 rounded", lineClasses)} />
            <div className={cn("h-[1px] w-full flex-1", theme === "dark" ? "bg-slate-800/50" : "bg-slate-200/50")} />
          </div>
        )}

        <div className="space-y-2">
          {Array.from({ length: secondaryCount }).map((_, index) => (
            <div
              key={`sec-${index}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg",
                isCollapsed ? "justify-center" : ""
              )}
            >
              {/* Circle Icon Placeholder */}
              <div className={cn("h-5 w-5 rounded-full flex-shrink-0", bgClasses)} />
              {/* Text Placeholder */}
              {!isCollapsed && (
                <div 
                  className={cn("h-3.5 rounded", lineClasses)} 
                  style={{ width: `${Math.floor(Math.random() * (110 - 80 + 1)) + 80}px` }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SidebarSkeleton;
