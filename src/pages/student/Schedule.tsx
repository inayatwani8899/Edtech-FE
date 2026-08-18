import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    Video,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Zap,
    Bell,
    Sparkles,
    Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Schedule: React.FC = () => {
    const events = [
        {
            time: "09:30 AM",
            title: "Advanced Logic Seminar",
            type: "Live Session",
            duration: "60 mins",
            instructor: "Dr. Alan Grant",
            icon: Video,
            color: "text-[#4F46E5]",
            bg: "bg-indigo-50"
        },
        {
            time: "11:00 AM",
            title: "Psychometric Evaluation",
            type: "Portal Test",
            duration: "45 mins",
            instructor: "Automated",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            time: "02:00 PM",
            title: "Career Guidance Sync",
            type: "One-on-One",
            duration: "30 mins",
            instructor: "Sarah Jenkins",
            icon: Video,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            time: "04:30 PM",
            title: "Quantitative Workshop",
            type: "Group Class",
            duration: "90 mins",
            instructor: "Marcus Thorne",
            icon: BookOpen,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-8 font-sans transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Compact Standardized Header with Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB] dark:border-slate-800">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-amber-500/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Time Management</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827] dark:text-white">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Schedule</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280] dark:text-slate-400">Plan your learning sessions and stay ahead of your assessment deadlines</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="flex bg-white dark:bg-slate-900 rounded-[12px] p-1 border border-[#E5E7EB] dark:border-slate-800 shadow-sm">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-[8px] hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /></Button>
                            <div className="px-3 flex items-center justify-center min-w-[110px]">
                                <span className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-widest">Oct 24, 2024</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-[8px] hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        <Button className="h-[38px] w-[38px] p-0 rounded-[12px] bg-slate-900 dark:bg-slate-950 text-white border border-transparent dark:border-slate-850 hover:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                            <Calendar className="h-4.5 w-4.5" />
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Main Timeline */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">Today's Timeline</h3>
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 px-2 py-0.5 uppercase tracking-widest bg-white dark:bg-slate-900">4 Events Remaining</Badge>
                            </div>

                            {events.map((event, i) => (
                                <div key={i} className="flex gap-4 md:gap-6 group pb-6 last:pb-0">
                                    {/* Time Block */}
                                    <div className="w-20 md:w-24 shrink-0 text-right pt-2.5 border-r border-slate-100 dark:border-slate-800 relative pr-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] font-black text-slate-800 dark:text-white tracking-tight">{event.time}</p>
                                            <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{event.duration}</p>
                                        </div>
                                        {/* Timeline Dot */}
                                        <div className="absolute -right-[4.5px] top-4.5 h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-[#4F46E5] transition-all duration-300 ring-2 ring-white dark:ring-slate-950 shadow-sm z-10 scale-90 group-hover:scale-110"></div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex-1 min-w-0">
                                        <Card className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 w-full xl:w-auto min-w-0">
                                                        <div className={`p-3 rounded-xl ${event.bg} dark:bg-slate-950/40 shrink-0`}>
                                                            <event.icon className={`h-5 w-5 ${event.color}`} />
                                                        </div>
                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <h4 className="text-[14.5px] font-bold text-slate-800 dark:text-white leading-tight truncate">{event.title}</h4>
                                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                                <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {event.type}
                                                                </span>
                                                                <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800 hidden sm:block"></span>
                                                                <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                                                                    with {event.instructor}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between xl:justify-end gap-3 w-full xl:w-auto pt-3 xl:pt-0 border-t xl:border-none border-slate-50 dark:border-slate-850 shrink-0">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                        <Button className={cn("h-[34px] px-4 rounded-lg text-white hover:opacity-90 text-[10px] font-bold uppercase tracking-wider shadow-sm", event.color.replace('text-', 'bg-'))}>
                                                            Join Room
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Reminders</h4>
                                <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400 animate-bounce" />
                            </div>
                            <div className="space-y-3.5">
                                {[
                                    { task: 'Prepare for Logic Module', due: 'In 2 hours', urgency: 'High' },
                                    { task: 'Submit Bio Sketch', due: 'By EOD', urgency: 'Normal' },
                                    { task: 'Feedback Session', due: 'Tomorrow', urgency: 'Normal' }
                                ].map((item, i) => (
                                    <div key={i} className="p-3.5 rounded-xl bg-slate-550 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 relative group cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all">
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full ${item.urgency === 'High' ? 'bg-rose-500 shadow-sm shadow-rose-200' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                        <p className="text-[12px] font-bold text-slate-800 dark:text-white mb-0.5">{item.task}</p>
                                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.due}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-none bg-gradient-to-br from-indigo-650 to-indigo-800 bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-[12px] relative overflow-hidden shadow-sm">
                            <div className="absolute -right-4 -top-4 text-white/5 pointer-events-none">
                                <Sparkles className="h-20 w-20" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-[15px] font-bold tracking-tight mb-1 flex items-center gap-1.5">
                                    <Trophy className="h-4 w-4 text-amber-400" />
                                    Weekly Goal
                                </h4>
                                <p className="text-indigo-100 text-[12.5px] font-medium mb-4 leading-relaxed">
                                    Complete <span className="text-white font-bold">12 hours</span> of focused learning to stay on track for your scholar badge.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-100">
                                        <span>Progress</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full">62%</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-white rounded-full" style={{ width: '62%' }}></div>
                                    </div>
                                    <p className="text-[9px] font-bold text-center text-indigo-100/60 uppercase tracking-wider pt-1">
                                        7.5 / 12 Hours Completed
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
