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
    ChevronRight,
    ArrowUpRight
} from "lucide-react";

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
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-success/30"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-success">Future Mapping</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                        Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-emerald-600">Guidance</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-2xl">
                        AI-powered career recommendations and expert mentorship based on your unique psychometric profile.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Panel - Recommendations */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Compass className="h-4 w-4 text-emerald-500" />
                                AI Career Matches
                            </h3>
                            <Badge variant="outline" className="border-emerald-100 text-emerald-600 font-bold text-[9px] uppercase tracking-widest px-2 py-0.5">Top Alignment</Badge>
                        </div>

                        <div className="grid gap-4">
                            {recommendations.map((job, i) => (
                                <Card key={i} className="glass-card border-none hover:shadow-elegant transition-all duration-300 group overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className={`p-4 rounded-2xl ${job.bg} group-hover:scale-110 transition-transform duration-500`}>
                                                <job.icon className={`h-8 w-8 ${job.color}`} />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="text-lg font-black text-slate-900 mb-1">{job.role}</h4>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Star className="h-3 w-3 text-warning fill-warning" />
                                                        Match Score: <span className="text-slate-700">{job.match}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Briefcase className="h-3 w-3" />
                                                        Market Demand: <span className="text-emerald-500">{job.demand}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest">
                                                View Roadmap
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Mentor Section */}
                        <div className="mt-12 space-y-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Specialized Mentors
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { name: "Dr. Sarah Chen", expertise: "Data Science Lead", sessions: 120 },
                                    { name: "Marcus Thorne", expertise: "Senior Product Architect", sessions: 85 }
                                ].map((mentor, i) => (
                                    <Card key={i} className="glass-card border-none shadow-soft p-5 group hover:shadow-elegant transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-sm font-black text-slate-800">{mentor.name}</h5>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mentor.expertise}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                                <ChevronRight className="h-4 w-4 text-slate-300" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden relative">
                            <div className="absolute -right-8 -bottom-8 opacity-10">
                                <Lightbulb className="h-32 w-32" />
                            </div>
                            <h4 className="text-xl font-black tracking-tight mb-3">Daily Insight</h4>
                            <p className="text-emerald-50 text-sm font-medium leading-relaxed mb-6 italic">
                                "Technical skills get you the interview, but cross-domain adaptability builds the career. Focus on logic fundamentals."
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="h-px w-6 bg-white/30"></div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-100">AI Counselor</span>
                            </div>
                        </Card>

                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Skills Discovery</h4>
                            <div className="space-y-4">
                                {['Critical Thinking', 'Pattern Recognition', 'Adaptive Logic'].map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm font-bold text-slate-600">{skill}</span>
                                        <Badge variant="outline" className="ml-auto text-[8px] border-emerald-50 text-emerald-600">High Growth</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-6 h-10 border-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">
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
