import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Search,
    DollarSign,
    Calendar,
    Globe,
    ArrowRight,
    Sparkles,
    Bookmark,
    ExternalLink,
    Star
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Scholarships: React.FC = () => {
    const scholarshipList = [
        {
            title: "Global STEM Scholar 2024",
            amount: "$15,000",
            deadline: "Dec 15, 2024",
            issuer: "World Tech Foundation",
            type: "Merit Based",
            match: "98% Match",
            icon: Award,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            title: "Future Leaders Excellence Grant",
            amount: "$5,000",
            deadline: "Jan 10, 2025",
            issuer: "Legacy Leadership Soc.",
            type: "Academic Excellence",
            match: "92% Match",
            icon: Sparkles,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            title: "Diversity in Innovation Fund",
            amount: "Full Tuition",
            deadline: "Feb 05, 2025",
            issuer: "Global Education Initiative",
            type: "Need Based",
            match: "85% Match",
            icon: Globe,
            color: "text-blue-500",
            bg: "bg-blue-50"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-400/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-6 bg-amber-400/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Funding Opportunities</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                            Scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">ships</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-base">Explore funding opportunities tailored to your academic and psychometric profile.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search opportunities..."
                            className="h-12 pl-11 bg-white/40 backdrop-blur-md border-slate-100 rounded-2xl focus:ring-amber-500/20 font-medium"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-500" />
                                Featured Scholarships
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-none">Sorted by Match</Badge>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {scholarshipList.map((scholarship, i) => (
                                <Card key={i} className="glass-card border-none hover:shadow-elegant transition-all duration-300 group overflow-hidden rounded-[2rem]">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className={`p-5 rounded-[1.5rem] ${scholarship.bg} group-hover:scale-105 transition-transform duration-500`}>
                                                <scholarship.icon className={`h-8 w-8 ${scholarship.color}`} />
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-xl font-black text-slate-900 leading-tight">{scholarship.title}</h4>
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">{scholarship.match}</Badge>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Globe className="h-3 w-3" />
                                                            {scholarship.issuer}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-1">
                                                        <span className="text-2xl font-black text-slate-900 tracking-tight">{scholarship.amount}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest underline decoration-amber-500/30">Total Grant</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Deadline</span>
                                                        <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                            <Calendar className="h-3 w-3 text-slate-400" />
                                                            {scholarship.deadline}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Criteria</span>
                                                        <p className="text-xs font-bold text-slate-700">{scholarship.type}</p>
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1 flex items-center md:justify-end gap-3">
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100">
                                                            <Bookmark className="h-4 w-4 text-slate-400" />
                                                        </Button>
                                                        <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                            Apply Now
                                                            <ArrowRight className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Profile Advantage</h4>
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    Your profile is currently <span className="text-amber-600 font-bold">85% optimized</span> for scholarship discovery.
                                </p>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[85%] rounded-full shadow-sm shadow-amber-200"></div>
                                </div>
                                <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">
                                    Boost My Profile
                                </Button>
                            </div>
                        </Card>

                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl bg-slate-900 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-white/10">
                                    <Award className="h-5 w-5 text-amber-500" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-tight">Recent Wins</h4>
                            </div>
                            <p className="text-slate-400 text-xs font-medium mb-6">3,400 students similar to your profile were awarded scholarships last month.</p>
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <Star className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <span className="text-xs font-bold">Achievement Grant</span>
                                </div>
                                <ArrowRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scholarships;
