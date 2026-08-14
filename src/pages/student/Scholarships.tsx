import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Search,
    Calendar,
    Globe,
    ArrowRight,
    Sparkles,
    Bookmark,
    Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
            amount: "$5,005",
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
        <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Compact Standardized Header with Search input */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-amber-500/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Funding Opportunities</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                            Scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">ships</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280]">Explore funding opportunities tailored to your academic and psychometric profile</p>
                    </div>
                    <div className="relative w-full md:w-[260px] shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <Input
                            placeholder="Search opportunities..."
                            className="pl-9 pr-3 h-[42px] w-full border-[#E5E7EB] bg-white rounded-[12px] text-[13px] text-[#111827] placeholder:text-[#6B7280] focus-visible:ring-[#4F46E5]"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Main List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-amber-500" />
                                Featured Scholarships
                            </h3>
                            <Badge variant="secondary" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-[#F1F5F9] border-none px-2.5 py-1 rounded-[6px]">Sorted by Match</Badge>
                        </div>

                        <div className="grid gap-4">
                            {scholarshipList.map((scholarship, i) => (
                                <Card key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row gap-5 items-start">
                                            <div className={`p-4 rounded-xl ${scholarship.bg} shrink-0`}>
                                                <scholarship.icon className={`h-7 w-7 ${scholarship.color}`} />
                                            </div>
                                            <div className="flex-1 space-y-3.5 w-full">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-[16px] font-bold text-slate-850 leading-tight">{scholarship.title}</h4>
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5">{scholarship.match}</Badge>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                            <Globe className="h-3.5 w-3.5" />
                                                            {scholarship.issuer}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-0.5 shrink-0">
                                                        <span className="text-xl font-black text-slate-900 tracking-tight">{scholarship.amount}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Grant</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3.5 border-t border-slate-100 items-end">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[9px] font-bold text-slate-450 text-slate-400 uppercase tracking-wider">Deadline</span>
                                                        <p className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            {scholarship.deadline}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <span className="text-[9px] font-bold text-slate-450 text-slate-400 uppercase tracking-wider">Criteria</span>
                                                        <p className="text-[12px] font-bold text-slate-700">{scholarship.type}</p>
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1 flex items-center md:justify-end gap-2 shrink-0">
                                                        <Button variant="outline" className="h-[36px] w-[36px] p-0 rounded-xl bg-slate-50 border-slate-100 hover:bg-slate-100">
                                                            <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                                                        </Button>
                                                        <Button className="h-[36px] px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
                                                            Apply Now
                                                            <ArrowRight className="h-3.5 w-3.5" />
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
                        <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 shadow-sm">
                            <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-4">Profile Advantage</h4>
                            <div className="space-y-4">
                                <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                                    Your profile is currently <span className="text-amber-600 font-bold">85% optimized</span> for scholarship discovery.
                                </p>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[85%] rounded-full"></div>
                                </div>
                                <Button variant="outline" className="w-full h-[38px] border-slate-200 text-slate-500 rounded-[12px] text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all">
                                    Boost My Profile
                                </Button>
                            </div>
                        </Card>

                        <Card className="bg-slate-900 border-none text-white p-5 rounded-[12px] shadow-sm">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="p-2 rounded-lg bg-white/10">
                                    <Award className="h-4.5 w-4.5 text-amber-500" />
                                </div>
                                <h4 className="text-[12px] font-bold uppercase tracking-wider">Recent Wins</h4>
                            </div>
                            <p className="text-slate-400 text-[12.5px] font-medium mb-4">3,400 students similar to your profile were awarded scholarships last month.</p>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <Star className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                    <span className="text-[12px] font-semibold text-slate-200">Achievement Grant</span>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scholarships;
