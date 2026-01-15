import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    BarChart3,
    Target,
    Activity,
    Zap,
    Calendar,
    Filter,
    ArrowUp
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line
} from 'recharts';

const data = [
    { name: 'Week 1', score: 65, avg: 60 },
    { name: 'Week 2', score: 72, avg: 62 },
    { name: 'Week 3', score: 68, avg: 61 },
    { name: 'Week 4', score: 85, avg: 63 },
    { name: 'Week 5', score: 78, avg: 64 },
    { name: 'Week 6', score: 92, avg: 65 },
];

export const ProgressTracking: React.FC = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-6 bg-primary/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Performance Analytics</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                            Progress <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Tracking</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-base">Visualize your academic trajectory and cross-compare with global benchmarks.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="glass-card border-slate-200 h-10 px-4 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            This Quarter
                        </Button>
                        <Button variant="outline" className="glass-card border-slate-200 h-10 px-4 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5" />
                            All Metrics
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center md:text-left">
                    {[
                        { label: 'Overall Percentile', val: '92nd', trend: '+4%', icon: Target, color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'Avg Study Time', val: '4.2h', trend: '+12%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Test Completion', val: '88%', trend: '+0%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Skill Growth', val: 'High', trend: 'Global', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="glass-card border-none shadow-soft group hover:shadow-elegant transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <ArrowUp className="h-2.5 w-2.5" />
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-12 gap-8">
                    <Card className="lg:col-span-8 glass-card border-none shadow-elegant rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900">Performance Velocity</CardTitle>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Weekly growth trajectory</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Score</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="h-[350px] w-full mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                padding: '12px 16px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#6366f1"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="avg"
                                            stroke="#e2e8f0"
                                            strokeWidth={3}
                                            fill="transparent"
                                            strokeDasharray="10 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="glass-card border-none shadow-soft p-6 rounded-3xl">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Competency Map
                            </h4>
                            <div className="space-y-6">
                                {[
                                    { name: 'Logical Reasoning', val: 88, color: 'bg-primary' },
                                    { name: 'Quantitative Skills', val: 74, color: 'bg-indigo-500' },
                                    { name: 'Verbal Fluency', val: 92, color: 'bg-emerald-500' },
                                    { name: 'Adaptive Logic', val: 65, color: 'bg-amber-500' },
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-500 font-bold">{skill.name}</span>
                                            <span className="text-slate-900">{skill.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${skill.color} rounded-full transition-all duration-1000 delay-300`}
                                                style={{ width: `${skill.val}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="bg-slate-900 p-6 rounded-3xl text-white border-none shadow-soft group hover:shadow-elegant transition-all">
                            <h4 className="text-lg font-black tracking-tight mb-2">Master Insights</h4>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4">Your "Verbal Fluency" is in the top 1% globally. We recommend leveraging this in upcoming communication assessments.</p>
                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl">View Report</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracking;
