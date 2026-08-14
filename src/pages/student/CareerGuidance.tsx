import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    Briefcase,
    Compass,
    Star,
    TrendingUp,
    Users,
    Lightbulb,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CareerGuidance: React.FC = () => {
    const recommendations = [
        {
            role: "Strategic Data Analyst",
            match: 94,
            demand: "High",
            icon: TrendingUp,
            color: "text-blue-500",
            bg: "bg-blue-50/50"
        },
        {
            role: "User Experience Architect",
            match: 88,
            demand: "Growing",
            icon: Target,
            color: "text-indigo-500",
            bg: "bg-indigo-50/50"
        },
        {
            role: "Product Manager (Education)",
            match: 82,
            demand: "Steady",
            icon: Briefcase,
            color: "text-emerald-500",
            bg: "bg-emerald-50/50"
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
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Future Mapping</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-indigo-600">Guidance</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280]">AI-powered career recommendations and expert mentorship based on your unique profile</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Main Panel - Recommendations */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Compass className="h-4 w-4 text-[#4F46E5]" />
                                AI Career Matches
                            </h3>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">Top Alignment</Badge>
                        </div>

                        <div className="grid gap-4">
                            {recommendations.map((job, i) => (
                                <Card key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div className={cn("p-3 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300 bg-slate-50 border border-slate-100")}>
                                                <job.icon className={cn("h-6 w-6", job.color)} />
                                            </div>
                                            <div className="flex-1 text-center md:text-left min-w-0">
                                                <h4 className="text-[15px] font-bold text-slate-800 mb-1 truncate">{job.role}</h4>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                        Match Score: <span className="text-slate-700">{job.match}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <Briefcase className="h-3.5 w-3.5" />
                                                        Market Demand: <span className="text-emerald-600">{job.demand}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="h-[36px] px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-bold uppercase tracking-wider transition-all">
                                                View Roadmap
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Mentor Section */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-[#4F46E5]" />
                                Specialized Mentors
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { name: "Dr. Sarah Chen", expertise: "Data Science Lead" },
                                    { name: "Marcus Thorne", expertise: "Senior Product Architect" }
                                ].map((mentor, i) => (
                                    <Card key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <Users className="h-5 w-5 text-slate-450 text-slate-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-[13.5px] font-bold text-slate-800 truncate">{mentor.name}</h5>
                                                <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider truncate">{mentor.expertise}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50 rounded-lg shrink-0">
                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-[12px] relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                                <Lightbulb className="h-24 w-24" />
                            </div>
                            <h4 className="text-[15px] font-bold tracking-tight mb-2">Daily Insight</h4>
                            <p className="text-emerald-50 text-[12.5px] font-medium leading-relaxed mb-4 italic">
                                "Technical skills get you the interview, but cross-domain adaptability builds the career. Focus on logic fundamentals."
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="h-px w-6 bg-white/30"></div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">AI Counselor</span>
                            </div>
                        </Card>

                        <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
                            <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-4">Skills Discovery</h4>
                            <div className="space-y-3.5">
                                {['Critical Thinking', 'Pattern Recognition', 'Adaptive Logic'].map((skill, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 text-xs font-semibold">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-slate-650 font-bold">{skill}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] border-emerald-150 text-emerald-600 font-semibold bg-emerald-50/30">High Growth</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-5 h-[38px] border-slate-200 text-slate-500 rounded-[12px] text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50">
                                Explore All Skills
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerGuidance;
