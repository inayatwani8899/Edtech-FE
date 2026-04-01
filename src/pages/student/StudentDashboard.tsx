import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, TrendingUp, Clock, Award, ArrowRight, BarChart3, Users,
  Sparkles, Target, Zap, Flag, Trophy, Compass, Brain, Microscope, Lightbulb
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

// Import stores
import { useAuthStore } from "@/store/useAuthStore";
import { useTestStore } from "@/store/testStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useTestConfigurationStore } from "@/store/testConfigurationStore";

// Import API and Types
import api from "@/api/axios";
import { StudentDashboardStats, StudentDashboardResponse } from "@/types/types";


// Mock AI Data
const neuralSkillsData = [
  { subject: 'Logic', A: 85, fullMark: 100 },
  { subject: 'Empathy', A: 65, fullMark: 100 },
  { subject: 'Focus', A: 90, fullMark: 100 },
  { subject: 'Creative', A: 70, fullMark: 100 },
  { subject: 'Verbal', A: 75, fullMark: 100 },
];

const performanceTrend = [
  { name: 'Jan', score: 45, projected: 45 },
  { name: 'Feb', score: 52, projected: 52 },
  { name: 'Mar', score: 68, projected: 68 },
  { name: 'Apr', score: 75, projected: 75 },
  { name: 'May', score: null, projected: 85 },
];

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { publishedTests, getPublishedTests, userSubmissions, fetchUserSubmissions } = useTestStore();
  const { handlePayment, isTestPaid } = usePaymentStore();
  const { fetchConfigurationByRoleIdTestId } = useTestConfigurationStore();

  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
  const [greeting, setGreeting] = useState("");
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<StudentDashboardStats | null>(null);

  const statsSummary = useMemo(() => {
    // Exact mapping from Dashboard API response
    const stats = {
      testsTaken: dashboardStats?.testsTaken ?? testsCompleted,
      avgScore: dashboardStats?.avgScore ?? 0,
      points: dashboardStats?.points ?? 0,
      highScore: dashboardStats?.highScore ?? 0,
      attempts: dashboardStats?.attempts ?? 0
    };

    return [
      { 
        label: 'Tests Taken', 
        value: stats.testsTaken, 
        icon: CheckCircle2, 
        color: 'text-emerald-500', 
        accent: 'bg-emerald-500', 
        bg: 'bg-emerald-500/10', 
        progress: (stats.testsTaken / 5) * 100, 
        route: '/results' 
      },
      { 
        label: 'Avg Score', 
        value: `${stats.avgScore}%`, 
        icon: TrendingUp, 
        color: stats.avgScore >= 70 ? 'text-primary' : stats.avgScore >= 40 ? 'text-amber-500' : 'text-slate-500', 
        accent: 'bg-primary', 
        bg: 'bg-primary/10', 
        sub: `High: ${stats.highScore}%`, // Integrates high score accurately
        route: '/results' 
      },
      { 
        label: 'Points', 
        value: stats.points.toLocaleString(), 
        icon: Trophy, 
        color: 'text-amber-500', 
        accent: 'bg-amber-500', 
        bg: 'bg-amber-500/10', 
        sub: stats.points >= 2000 ? 'Lvl 4 Scholar' : stats.points >= 500 ? 'Lvl 2 Scholar' : 'Lvl 1 Scholar', 
        route: '/profile' 
      },
      { 
        label: 'Attempts', 
        value: stats.attempts, 
        icon: Target, // Changed to Target for attempts mapping
        color: 'text-violet-500', 
        accent: 'bg-violet-500', 
        bg: 'bg-violet-500/10', 
        sub: 'Total Engagement', 
        route: '/learning' 
      },
    ];
  }, [testsCompleted, dashboardStats]);




  useEffect(() => {
    getPublishedTests();
    fetchUserSubmissions({ pageNumber: 1, pageSize: 100 });
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");

    // Fetch dashboard stats from API
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<StudentDashboardResponse>("/StudentDashboard");
        if (response.data.code === 200) {
          setDashboardStats(response.data.data);
          setTestsCompleted(response.data.data.testsTaken);
        }
      } catch (err) {
        console.error("Failed to fetch student dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, [getPublishedTests, fetchUserSubmissions]);


  useEffect(() => {
    if (userSubmissions?.data) {
      setTestsCompleted(new Set(userSubmissions.data.map(s => s.testId)).size);
    }
  }, [userSubmissions]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id || !publishedTests?.length) return;
      const roleId = localStorage.getItem("roleId");
      const statuses: Record<string, boolean> = {};
      await Promise.all(publishedTests.map(async (test) => {
        const isPaid = await isTestPaid(String(user.id), test.id);
        statuses[test.id] = isPaid;
        return fetchConfigurationByRoleIdTestId(roleId, test.id);
      }));
      setPaidStatus(statuses);
    };
    checkStatus();
  }, [user?.id, publishedTests]);

  const psychometricTest = publishedTests.find(t => t.title.toLowerCase().includes('psychometric') || t.title.toLowerCase().includes('physometric'));
  const otherTests = publishedTests.filter(t => t.id !== psychometricTest?.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-12">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* 1. Compact Greeting Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              {greeting}, <span className="text-primary">{user?.firstName?.split(' ')[0] || 'Scholar'}!</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium -mt-1">
              Your psychometric profile is currently <span className="text-primary font-bold">85% Complete</span>
            </p>
          </div>
        </div>

        {/* 3. Career Roadmap (Now on top and smaller) */}
        <div className="mb-8 p-4 md:p-5 rounded-[1.5rem] bg-slate-900 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none">
            <Compass className="h-24 w-24 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" /> Your Career Journey
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              {(() => {
                const steps = [
                  { step: 'Start', title: 'Onboarding' },
                  { step: 'Evaluation', title: 'Psychometric' },
                  { step: 'Insight', title: 'Skill Profile' },
                  { step: 'Goal', title: 'Career Path' }
                ];
                const reachedIndex = Math.min(testsCompleted + 1, steps.length - 1);
                const widthPercent = (reachedIndex / (steps.length - 1)) * 100;

                return (
                  <>
                    <div className="absolute top-[18px] left-0 w-full h-0.5 hidden md:block bg-white/10 rounded-full">
                      <div className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${widthPercent}%` }} />
                    </div>
                    {steps.map((item, i) => {
                      const completed = i < reachedIndex;
                      const active = i === reachedIndex;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5 relative z-10 w-full md:w-auto">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse' : completed ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                            {completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : <span className="text-xs font-black text-white">{i + 1}</span>}
                          </div>
                          <div className="text-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{item.step}</p>
                            <p className={`text-[11px] font-bold ${completed || active ? 'text-white' : 'text-slate-600'}`}>{item.title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* 2. Top 4 Compact Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsSummary.map((stat, i) => (
            <Card key={i} className="group relative border-none shadow-sm bg-white/90 backdrop-blur-md hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl" onClick={() => navigate(stat.route)}>
              <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${stat.accent}`} />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${stat.bg} p-2 rounded-lg transition-transform group-hover:scale-110`}><stat.icon className={`h-4 w-4 ${stat.color}`} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                  </div>
                </div>
                {stat.progress !== undefined ? (
                  <Progress value={stat.progress} className="h-1 bg-slate-100 rounded-full" />
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100/50 w-fit">
                    <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{stat.sub}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 4. Deep Visualizations (Radar & Area Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <Card className="lg:col-span-8 border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" /> Performance Momentum
                </CardTitle>
                <CardDescription>Actual score vs. AI projected growth</CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">+12% Target</Badge>
            </CardHeader>
            <CardContent className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="text-center pb-0">
              <CardTitle className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
                <Brain className="h-5 w-5 text-primary" /> Neural DNA
              </CardTitle>
              <CardDescription>Cognitive Strengths Mapping</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={neuralSkillsData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 5. Assessment Ecosystem Section */}
        <div className="mt-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Ecosystem</h2>
              <p className="text-slate-500 font-medium">Curated modules powered by the CognifyIQ engine</p>
            </div>
            <Button variant="outline" className="rounded-2xl font-bold border-slate-200 bg-white hover:bg-slate-50 px-6 h-11 transition-all">
              Browse Full Library <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Featured Psychometric Card */}
            <div className="lg:col-span-8 group">
              {psychometricTest ? (
                <Card className="h-full bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1">
                  <div className="md:flex h-full">
                    <div className="p-8 md:p-10 md:w-2/3 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 uppercase tracking-wider text-[10px]">
                          Core Assessment
                        </Badge>
                        <div className="flex items-center text-slate-400 text-xs font-bold">
                          <Users className="h-3.5 w-3.5 mr-1" /> 12k+ Scholars Taken
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                          {psychometricTest.title}
                        </h3>
                        <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 font-medium">
                          {psychometricTest.description}
                        </p>
                      </div>

                      <div className="mt-10 flex flex-wrap items-center gap-6">
                        <Button
                          onClick={() => !paidStatus[psychometricTest.id] ? handlePayment(psychometricTest) : navigate(`/test/${psychometricTest.id}`)}
                          size="lg"
                          className="rounded-2xl px-10 h-14 font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                        >
                          {paidStatus[psychometricTest.id] ? 'Begin Assessment' : `Unlock Access - ₹${psychometricTest.price}`}
                        </Button>
                        <div className="flex items-center gap-4 py-2">
                          <div className="flex items-center text-slate-500 font-bold text-sm">
                            <Clock className="mr-2 h-5 w-5 text-primary/60" /> {psychometricTest.timeDuration}m
                          </div>
                          <div className="h-4 w-px bg-slate-200" />
                          <div className="flex items-center text-slate-500 font-bold text-sm">
                            <Zap className="mr-2 h-5 w-5 text-primary/60" /> AI Insights
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex md:w-1/3 bg-slate-50/50 items-center justify-center border-l border-slate-100 group-hover:bg-primary/5 transition-colors duration-500">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Brain className="h-32 w-32 text-slate-200 group-hover:text-primary transition-all duration-700 group-hover:scale-110 relative z-10" />
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
              )}
            </div>

            {/* Sidebar Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Achievement/Milestone Card */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 flex flex-col justify-between h-[210px] group hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Trophy className="h-6 w-6 group-hover:animate-bounce" />
                  </div>
                  <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold">Level 4</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-black text-slate-800 tracking-tight">Certification Progress</p>
                    <span className="text-xs font-bold text-primary">80%</span>
                  </div>
                  <Progress value={80} className="h-2.5 bg-slate-100 rounded-full" />
                </div>
              </Card>

              {/* Quick Actions Card */}
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 p-2 overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl h-14 group" asChild>
                    <Link to="/results">
                      <BarChart3 className="h-5 w-5 mr-4 text-primary transition-transform group-hover:scale-110" />
                      <span className="font-bold tracking-tight">Analytics & Reports</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl h-14 group" asChild>
                    <Link to="/profile">
                      <Users className="h-5 w-5 mr-4 text-primary transition-transform group-hover:scale-110" />
                      <span className="font-bold tracking-tight">Scholastic Profile</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Secondary Assessment Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {otherTests?.slice(0, 4).map((test) => (
              <Card key={test.id} className="group border-none shadow-sm bg-white/60 backdrop-blur-sm rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[9px] uppercase tracking-tighter">
                      {test.difficulty || 'Intermediate'}
                    </Badge>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {test.timeDuration}m
                    </div>
                  </div>
                  <CardTitle className="text-base font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Button
                    onClick={() => !paidStatus[test.id] ? handlePayment(test) : navigate(`/test/${test.id}`)}
                    variant="outline"
                    className="w-full rounded-xl font-bold border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    {paidStatus[test.id] ? 'Start Assessment' : `Unlock Test`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};