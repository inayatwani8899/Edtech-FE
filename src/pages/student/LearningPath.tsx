import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Map,
    CheckCircle2,
    Circle,
    Lock,
    Trophy,
    Sparkles,
    ArrowRight
} from "lucide-react";

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
            bg: "bg-emerald-50/50"
        },
        {
            id: 2,
            title: "Core Skill Development",
            description: "Focused training on logic, verbal reasoning, and quantitative skills.",
            status: "current",
            date: "In Progress",
            icon: Sparkles,
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            id: 3,
            title: "Advanced Career Match",
            description: "Deep dive into career alignments based on your evolving skill profile.",
            status: "upcoming",
            date: "Locked",
            icon: Lock,
            color: "text-slate-400",
            bg: "bg-slate-50/50"
        },
        {
            id: 4,
            title: "Final Certification",
            description: "Graduate from the foundational track and earn your scholar badge.",
            status: "upcoming",
            date: "Locked",
            icon: Trophy,
            color: "text-slate-400",
            bg: "bg-slate-50/50"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-warning/30"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-warning">Educational Roadmap</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                        Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-orange-600">Path</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-2xl">
                        Track your milestones and navigate your personalized educational journey through our ecosystem.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Roadmap */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 before:content-['']">
                            {milestones.map((milestone) => (
                                <div key={milestone.id} className="relative group">
                                    {/* Status Indicator */}
                                    <div className={`absolute -left-[32px] top-1 p-1 rounded-full border-4 border-white shadow-sm z-20 
                    ${milestone.status === 'completed' ? 'bg-emerald-500' :
                                            milestone.status === 'current' ? 'bg-primary animate-pulse' : 'bg-slate-300'}`}>
                                        <milestone.icon className="h-4 w-4 text-white" />
                                    </div>

                                    <Card className={`glass-card border-none transition-all duration-300 group-hover:shadow-elegant group-hover:-translate-y-1 overflow-hidden 
                    ${milestone.status === 'current' ? 'ring-2 ring-primary/20' : ''}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{milestone.title}</h3>
                                                        {milestone.status === 'current' && (
                                                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">Active</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-medium">{milestone.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{milestone.date}</span>
                                                    {milestone.status === 'current' && (
                                                        <Button variant="ghost" className="h-8 group/btn text-xs font-bold text-primary p-0 hover:bg-transparent">
                                                            Continue Track <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
                        <Card className="glass-card border-none shadow-soft overflow-hidden rounded-3xl">
                            <div className="h-2 bg-gradient-to-r from-warning to-orange-500"></div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-orange-50">
                                        <Map className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Path Statistics</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</span>
                                        <span className="text-sm font-black text-slate-700">1 / 4</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[25%] rounded-full shadow-sm shadow-orange-200"></div>
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Target</p>
                                            <p className="text-xs font-bold text-slate-700">Skill Profiling Session</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none shadow-soft rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                            <Sparkles className="h-8 w-8 text-warning mb-4 animate-pulse" />
                            <h4 className="text-lg font-black tracking-tight mb-2">Unlock Your Potential</h4>
                            <p className="text-slate-400 text-sm font-medium mb-4">Complete your current milestones to unlock professional career guidance sessions.</p>
                            <Button className="w-full bg-warning hover:bg-warning/90 text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl">View Details</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
