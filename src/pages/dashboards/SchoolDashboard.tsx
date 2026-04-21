import React, { useState, useEffect } from "react";
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
    BookOpen,
    Wallet,
    CheckCircle2,
    AlertCircle,
    Plus,
    Brain,
    ShieldCheck,
    Search,
    Filter,
    ChevronRight,
    Target,
    Zap,
    Layers,
    Activity,
    FileText,
    ArrowRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar
} from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stats = [
    {
        title: "Total Enrollment",
        value: "1,284",
        change: "+12%",
        trend: "up",
        icon: GraduationCap,
        color: "blue",
        subText: "24 new this week"
    },
    {
        title: "Faculty strength",
        value: "86",
        change: "+3%",
        trend: "up",
        icon: UserSquare2,
        color: "emerald",
        subText: "98% attendance"
    },
    {
        title: "Fee Collection",
        value: "₹4.2L",
        change: "+8.4%",
        trend: "up",
        icon: Wallet,
        color: "indigo",
        subText: "88% target met"
    },
    {
        title: "Avg. IQ Score",
        value: "114",
        change: "+5.4%",
        trend: "up",
        icon: Brain,
        color: "purple",
        subText: "Above state avg"
    }
];

const pendingActions = [
    { id: 1, title: "Staff Leave Request", user: "Sarah Smith", type: "Leave", priority: "High", time: "2h ago" },
    { id: 2, title: "New Student Enrollment", user: "Mike Johnson", type: "Admission", priority: "Medium", time: "4h ago" },
    { id: 3, title: "Fee Waiver Request", user: "John Doe", type: "Finance", priority: "Low", time: "1d ago" },
    { id: 4, title: "Curriculum Update", user: "Admin", type: "Academic", priority: "High", time: "2d ago" },
];

const performanceData = [
    { name: 'Jan', revenue: 4000, success: 2400 },
    { name: 'Feb', revenue: 3000, success: 1398 },
    { name: 'Mar', revenue: 2000, success: 9800 },
    { name: 'Apr', revenue: 2780, success: 3908 },
    { name: 'May', revenue: 1890, success: 4800 },
    { name: 'Jun', revenue: 2390, success: 3800 },
    { name: 'Jul', revenue: 3490, success: 4300 },
];

const gradePerformance = [
    { grade: 'G10', score: 85 },
    { grade: 'G11', score: 72 },
    { grade: 'G12', score: 91 },
    { grade: 'G9', score: 68 },
    { grade: 'G8', score: 77 },
];

export const SchoolDashboard = () => {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <div className="p-1 space-y-8 animate-in fade-in duration-1000">
            {/* 1. Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 py-0 font-black text-[10px] uppercase tracking-widest">
                            Command Center
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400">•</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.4.0</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {greeting}, <span className="text-blue-600">Administrator!</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Strategic overview and operational management of <span className="text-slate-900 dark:text-white font-bold">St. Xavier's International</span>.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Security Status</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Hardened & Active</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-500/25 group">
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                        <span>EXECUTIVE ACTION</span>
                    </button>
                </div>
            </div>

            {/* 2. Operational Roadmap */}
            <div className="p-5 rounded-[2rem] bg-slate-900 dark:bg-[#080a0f] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none transition-transform group-hover:rotate-45 duration-1000">
                    <Target className="h-32 w-32 text-white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
                            <Activity className="h-4 w-4 text-blue-400" /> Academic Roadmap 2026
                        </h3>
                        <Badge className="bg-blue-500 text-white border-none font-bold text-[10px]">72% COMPLETE</Badge>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative px-4">
                        <div className="absolute top-[22px] left-0 w-full h-1 hidden md:block bg-white/10 rounded-full">
                            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 w-[72%]" />
                        </div>
                        {[
                            { step: 'Admissions', title: 'Phase 1 Done', status: 'completed' },
                            { step: 'Curriculum', title: 'Final Review', status: 'completed' },
                            { step: 'Assessments', title: 'Mid-term Prep', status: 'active' },
                            { step: 'Graduation', title: 'Planning Stage', status: 'pending' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 relative z-10 w-full md:w-auto">
                                <div className={cn(
                                    "h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    item.status === 'active' ? 'bg-blue-600 ring-4 ring-blue-500/30 scale-110 shadow-lg shadow-blue-500/40' : 
                                    item.status === 'completed' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800'
                                )}>
                                    {item.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-white" /> :
                                    <span className="text-sm font-black text-white">{i + 1}</span>}
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">{item.step}</p>
                                    <p className={`text-xs font-bold ${item.status === 'pending' ? 'text-slate-600' : 'text-white'}`}>{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. High-Impact Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white dark:bg-[#0f1117] rounded-[1.8rem] overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                                    stat.color === "blue" && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
                                    stat.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
                                    stat.color === "indigo" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10",
                                    stat.color === "purple" && "bg-purple-50 text-purple-600 dark:bg-purple-500/10",
                                )}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                                    stat.trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                                )}>
                                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.title}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">{stat.value}</h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-2 flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-amber-500" />
                                    {stat.subText}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 4. Strategic Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Performance Hub */}
                <Card className="lg:col-span-3 border-none shadow-xl bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Growth Matrix</CardTitle>
                            <p className="text-sm font-medium text-slate-500">Revenue collection vs Academic success index</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSuc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                    />
                                    <YAxis hide />
                                    <ReTooltip 
                                        contentStyle={{ 
                                            borderRadius: '1.2rem', 
                                            border: 'none', 
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                                            fontWeight: '900',
                                            padding: '1rem'
                                        }} 
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                    <Area type="monotone" dataKey="success" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSuc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Compliance</p>
                                <p className="text-2xl font-black text-blue-600">94.2%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Syllabus Progress</p>
                                <p className="text-2xl font-black text-indigo-600">82.5%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Retention</p>
                                <p className="text-2xl font-black text-emerald-600">98.1%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Library Usage</p>
                                <p className="text-2xl font-black text-purple-600">65%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vertical Secondary Insights */}
                <div className="space-y-8">
                    {/* Decision Hub */}
                    <Card className="border-none shadow-xl bg-slate-900 dark:bg-black text-white rounded-[2rem] overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-tighter">
                                Executive Tasks
                                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-2 pb-2">
                            <div className="space-y-1">
                                {pendingActions.map((action) => (
                                    <button 
                                        key={action.id} 
                                        className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <AlertCircle className={cn(
                                                    "h-5 w-5",
                                                    action.priority === 'High' ? 'text-rose-500' : 'text-blue-500'
                                                )} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">{action.title}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.user}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black text-blue-400 hover:text-blue-300 hover:bg-white/5 uppercase tracking-[0.3em]">
                                Open Command Console
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Insight Card */}
                    <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                                <Sparkles className="h-6 w-6 text-white animate-pulse" />
                            </div>
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Cognify AI Check</h4>
                            <p className="mt-2 text-2xl font-black leading-tight">Institutional IQ is tracking at 114 (+5.4%)</p>
                            <p className="text-xs font-bold opacity-70 mt-3 leading-relaxed">
                                Recommendations: Optimize Grade 11 Science schedule for better engagement. High success predicted for current Mid-Term prep.
                            </p>
                            <button className="mt-8 flex items-center gap-2 group/btn">
                                <span className="text-[10px] font-black uppercase tracking-widest">Detail AI Audit</span>
                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        <Brain className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* 5. Lower Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Secondary Data Card */}
                <Card className="border-none shadow-lg bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Class Performance Index</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gradePerformance}>
                                    <Bar 
                                        dataKey="score" 
                                        fill="#3b82f6" 
                                        radius={[8, 8, 0, 0]} 
                                        barSize={30}
                                    />
                                    <XAxis 
                                        dataKey="grade" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                    />
                                    <ReTooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: '900' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Data Card 2 */}
                <Card className="border-none shadow-lg bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Attendance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-6">
                        {[
                            { label: 'Students', value: 94, color: 'bg-blue-600' },
                            { label: 'Academic Staff', value: 98, color: 'bg-emerald-500' },
                            { label: 'Operational Staff', value: 87, color: 'bg-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <Progress value={item.value} className={cn("h-2.5 bg-slate-100 dark:bg-white/5", item.color)} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Action Card */}
                <Card className="border-none shadow-lg bg-gradient-to-tr from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border border-slate-100 dark:border-white/5 group">
                    <div className="h-20 w-20 rounded-full bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <FileText className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Ready for a deeper dive?</h3>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Generate a comprehensive audit of all institutional departments for the current semester.</p>
                    <Button className="mt-8 w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
                        Generate Semester Audit
                    </Button>
                </Card>
            </div>
        </div>
    );
};

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L14.5 9L21 11.5L14.5 14L12 21L9.5 14L3 11.5L9.5 9L12 3Z" fill="currentColor"/>
    </svg>
);
