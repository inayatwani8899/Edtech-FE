import React from "react";
import { 
    Users, 
    GraduationCap, 
    UserSquare2, 
    TrendingUp, 
    Calendar, 
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        title: "Total Students",
        value: "1,284",
        change: "+12.5%",
        trend: "up",
        icon: GraduationCap,
        color: "blue"
    },
    {
        title: "Total Staff",
        value: "86",
        change: "+3.2%",
        trend: "up",
        icon: UserSquare2,
        color: "emerald"
    },
    {
        title: "Active assessments",
        value: "24",
        change: "-2",
        trend: "down",
        icon: BookOpen,
        color: "purple"
    },
    {
        title: "Avg. Performance",
        value: "78%",
        change: "+5.4%",
        trend: "up",
        icon: TrendingUp,
        color: "amber"
    }
];

const recentActivities = [
    { id: 1, type: "registration", user: "John Doe", action: "enrolled in Grade 10", time: "2 hours ago" },
    { id: 2, type: "assessment", user: "Science Dept", action: "published Mid-term Results", time: "4 hours ago" },
    { id: 3, type: "staff", user: "Sarah Smith", action: "joined as Mathematics Head", time: "1 day ago" },
    { id: 4, type: "calendar", user: "Admin", action: "updated Annual Sports Meet date", time: "2 days ago" },
];

export const SchoolDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">School Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening in your organization today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>April 2026</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25">
                        <TrendingUp className="h-4 w-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "p-3 rounded-xl transition-colors duration-300",
                                stat.color === "blue" && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
                                stat.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
                                stat.color === "purple" && "bg-purple-50 text-purple-600 dark:bg-purple-500/10",
                                stat.color === "amber" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
                            )}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                stat.trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                            )}>
                                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                        
                        {/* Decorative circle */}
                        <div className={cn(
                            "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150",
                            stat.color === "blue" && "bg-blue-600",
                            stat.color === "emerald" && "bg-emerald-600",
                            stat.color === "purple" && "bg-purple-600",
                            stat.color === "amber" && "bg-amber-600",
                        )} />
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* School Performance Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Academic Performance</h3>
                            <p className="text-sm text-slate-500">School-wide assessment analytics</p>
                        </div>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-semibold px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-full h-64 flex items-end justify-between gap-2 max-w-md mx-auto">
                            {[40, 65, 45, 90, 55, 75, 60].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 rounded-t-lg transition-all duration-500 ease-out" 
                                        style={{ height: `${h}%` }}
                                    >
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg transition-all duration-1000 delay-300" 
                                            style={{ height: i === 3 ? '100%' : '70%' }} 
                                        />
                                    </div>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-xs font-medium text-slate-400 uppercase tracking-widest">
                            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                        <Bell className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-bold text-slate-900 dark:text-white">{activity.user}</span>
                                            <span className="text-slate-500 ml-1.5">{activity.action}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-4 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 border-t border-slate-100 dark:border-slate-800 transition-all">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};
