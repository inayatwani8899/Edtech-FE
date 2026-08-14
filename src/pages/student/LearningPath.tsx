import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Map,
    CheckCircle2,
    Lock,
    Trophy,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const LearningPath: React.FC = () => {
    const milestones = [
        {
            id: 1,
            title: "Foundational Assessment",
            description: "Complete your initial psychometric and aptitude evaluation.",
            status: "completed",
            date: "Oct 12, 2024",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            id: 2,
            title: "Core Skill Development",
            description: "Focused training on logic, verbal reasoning, and quantitative skills.",
            status: "current",
            date: "In Progress",
            icon: Sparkles,
            color: "text-[#4F46E5]",
            bg: "bg-indigo-50"
        },
        {
            id: 3,
            title: "Advanced Career Match",
            description: "Deep dive into career alignments based on your evolving skill profile.",
            status: "upcoming",
            date: "Locked",
            icon: Lock,
            color: "text-slate-400",
            bg: "bg-slate-50"
        },
        {
            id: 4,
            title: "Final Certification",
            description: "Graduate from the foundational track and earn your scholar badge.",
            status: "upcoming",
            date: "Locked",
            icon: Trophy,
            color: "text-slate-400",
            bg: "bg-slate-50"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Compact Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-[#4F46E5]/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Educational Roadmap</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-indigo-600">Path</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280]">Track your milestones and navigate your personalized educational journey</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Main Roadmap */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 before:content-['']">
                            {milestones.map((milestone) => (
                                <div key={milestone.id} className="relative group">
                                    {/* Status Indicator */}
                                    <div className={cn(
                                        "absolute -left-[32px] top-2.5 p-1 rounded-full border-4 border-white shadow-sm z-20 transition-all duration-300",
                                        milestone.status === 'completed' && 'bg-emerald-500',
                                        milestone.status === 'current' && 'bg-[#4F46E5] ring-2 ring-indigo-500/20',
                                        milestone.status === 'upcoming' && 'bg-slate-300'
                                    )}>
                                        <milestone.icon className="h-3 w-3 text-white" />
                                    </div>

                                    <Card className={cn(
                                        "bg-white border border-[#E5E7EB] rounded-[12px] p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] overflow-hidden",
                                        milestone.status === 'current' && 'border-indigo-300 bg-indigo-50/10'
                                    )}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{milestone.title}</h3>
                                                        {milestone.status === 'current' && (
                                                            <Badge className="bg-indigo-50 text-[#4F46E5] border-none text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">Active</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-[12.5px] text-[#6B7280] font-medium">{milestone.description}</p>
                                                </div>
                                                <div className="flex flex-col md:items-end gap-1 shrink-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{milestone.date}</span>
                                                    {milestone.status === 'current' && (
                                                        <Button variant="ghost" className="h-8 text-xs font-semibold text-[#4F46E5] p-0 hover:bg-transparent flex items-center gap-1">
                                                            Continue Track <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Quick Stats & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-sm">
                            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="p-2 rounded-lg bg-orange-50">
                                        <Map className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Path Statistics</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                        <span>COMPLETED</span>
                                        <span className="text-slate-800 font-bold">1 / 4</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[25%] rounded-full"></div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Target</p>
                                            <p className="text-[12px] font-bold text-slate-700">Skill Profiling Session</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-none text-white p-5 rounded-[12px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Sparkles className="h-20 w-20 text-white" />
                            </div>
                            <Sparkles className="h-6 w-6 text-amber-400 mb-3 animate-pulse" />
                            <h4 className="text-[15px] font-bold tracking-tight mb-1.5">Unlock Your Potential</h4>
                            <p className="text-slate-400 text-[12.5px] font-medium mb-4 leading-relaxed">Complete your current milestones to unlock professional career guidance sessions.</p>
                            <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[12px] h-[38px] text-[12px] font-semibold transition-all">
                                View Details
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
