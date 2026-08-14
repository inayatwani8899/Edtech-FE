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
    Tooltip
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
        <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Compact Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-[#4F46E5]/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Performance Analytics</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                            Progress <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-indigo-600">Tracking</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280]">Visualize your academic trajectory and cross-compare with global benchmarks</p>
                    </div>
                    <div className="flex items-center gap-2 pb-1.5">
                        <Button variant="outline" className="h-[38px] px-3.5 rounded-[12px] border-[#E5E7EB] bg-white text-[11px] font-bold text-slate-650 uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-50">
                            <Calendar className="h-3.5 w-3.5" />
                            This Quarter
                        </Button>
                        <Button variant="outline" className="h-[38px] px-3.5 rounded-[12px] border-[#E5E7EB] bg-white text-[11px] font-bold text-slate-650 uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-50">
                            <Filter className="h-3.5 w-3.5" />
                            All Metrics
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Overall Percentile', val: '92nd', trend: '+4%', icon: Target, color: 'text-[#4F46E5]', bg: 'bg-indigo-50' },
                        { label: 'Avg Study Time', val: '4.2h', trend: '+12%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Test Completion', val: '88%', trend: '+0%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Skill Growth', val: 'High', trend: 'Global', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-slate-550 ${stat.bg}`}>
                                        <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <ArrowUp className="h-2.5 w-2.5" />
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                <p className="text-xl font-black text-slate-800 tracking-tight">{stat.val}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <Card className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-sm">
                        <CardHeader className="p-5 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-[16px] font-bold text-slate-800">Performance Velocity</CardTitle>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Weekly growth trajectory</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-[#6366f1]"></div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">My Score</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Average</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0">
                            <div className="h-[240px] md:h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorScore2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 605 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 605 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                                                padding: '8px 12px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorScore2)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="avg"
                                            stroke="#e2e8f0"
                                            strokeWidth={2}
                                            fill="transparent"
                                            strokeDasharray="5 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
                            <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Target className="h-4 w-4 text-[#4F46E5]" />
                                Competency Map
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Logical Reasoning', val: 88, color: 'bg-[#4F46E5]' },
                                    { name: 'Quantitative Skills', val: 74, color: 'bg-indigo-500' },
                                    { name: 'Verbal Fluency', val: 92, color: 'bg-emerald-500' },
                                    { name: 'Adaptive Logic', val: 65, color: 'bg-amber-500' },
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-500">{skill.name}</span>
                                            <span className="text-slate-900">{skill.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${skill.color} rounded-full`}
                                                style={{ width: `${skill.val}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="bg-slate-900 text-white p-5 rounded-[12px] relative overflow-hidden">
                            <h4 className="text-[15px] font-bold tracking-tight mb-1.5">Master Insights</h4>
                            <p className="text-slate-405 text-slate-400 text-[12px] font-medium leading-relaxed mb-4">Your "Verbal Fluency" is in the top 1% globally. We recommend leveraging this in upcoming communication assessments.</p>
                            <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[12px] h-[38px] text-[12px] font-semibold transition-all">
                                View Report
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracking;
