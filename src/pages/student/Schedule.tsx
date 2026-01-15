import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Zap,
    Bell
} from "lucide-react";

export const Schedule: React.FC = () => {
    const events = [
        {
            time: "09:30 AM",
            title: "Advanced Logic Seminar",
            type: "Live Session",
            duration: "60 mins",
            instructor: "Dr. Alan Grant",
            icon: Video,
            color: "text-primary",
            bg: "bg-primary/5"
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
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-6 bg-accent/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Time Management</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Schedule</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-base">Plan your learning sessions and stay ahead of your assessment deadlines.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/40 backdrop-blur-md rounded-2xl p-1 border border-slate-100/50 shadow-soft">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
                            <div className="px-4 flex items-center justify-center min-w-[140px]">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Oct 24, 2024</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        <Button className="h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                            <Calendar className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Timeline */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Today's Timeline</h3>
                                <div className="h-px flex-1 bg-slate-100"></div>
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-100 px-2 uppercase tracking-widest">4 Events Remaining</Badge>
                            </div>

                            {events.map((event, i) => (
                                <div key={i} className="relative group pl-24 pb-8 border-l-2 border-slate-50 ml-4 last:pb-0">
                                    {/* Time Label */}
                                    <div className="absolute left-[-96px] top-1 text-right">
                                        <p className="text-sm font-black text-slate-900 tracking-tight">{event.time}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{event.duration}</p>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-[-5px] top-2 h-2 w-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors duration-300 ring-4 ring-white shadow-sm ring-offset-2"></div>

                                    <Card className="glass-card border-none hover:shadow-elegant transition-all duration-300 group overflow-hidden rounded-[2rem]">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-4 rounded-2xl ${event.bg} group-hover:scale-105 transition-transform duration-500`}>
                                                        <event.icon className={`h-6 w-6 ${event.color}`} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-black text-slate-900 leading-none">{event.title}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3" />
                                                                {event.type}
                                                            </span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                with {event.instructor}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-50 rounded-xl">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                    <Button className={`h-10 px-6 rounded-xl text-white hover:opacity-90 text-[10px] font-bold uppercase tracking-widest shadow-lg ${event.color.replace('text-', 'bg-')}`}>
                                                        Join Room
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl overflow-hidden relative">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Reminders</h4>
                                <Bell className="h-4 w-4 text-slate-400 animate-bounce" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { task: 'Prepare for Logic Module', due: 'In 2 hours', urgency: 'High' },
                                    { task: 'Submit Bio Sketch', due: 'By EOD', urgency: 'Normal' },
                                    { task: 'Feedback Session', due: 'Tomorrow', urgency: 'Normal' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/40 border border-slate-50 relative group cursor-pointer hover:bg-white transition-all">
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full ${item.urgency === 'High' ? 'bg-rose-500 shadow-sm shadow-rose-200' : 'bg-slate-200'}`}></div>
                                        <p className="text-xs font-bold text-slate-800 mb-1">{item.task}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.due}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl bg-indigo-600 text-white">
                            <h4 className="text-lg font-black tracking-tight mb-2">Weekly Goal</h4>
                            <p className="text-indigo-100 text-xs font-medium mb-6">Complete 12 hours of focused learning to stay on track for your scholar badge.</p>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest">7.5 / 12 Hours</span>
                                <span className="text-[10px] font-bold">62%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[62%] rounded-full shadow-sm"></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
