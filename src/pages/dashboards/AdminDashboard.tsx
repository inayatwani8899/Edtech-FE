import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStatsStore } from "../../store/userStatsStore";
import {
  Users,
  BarChart3,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  FileText,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Target,
  Compass,
  CheckCircle2,
  Flag,
  Trophy,
  Zap,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const systemAlerts = [
  {
    type: "warning",
    title: "High server load detected",
    description: "CPU usage at 85% for last 10 minutes",
    time: "5 minutes ago",
    severity: "medium"
  },
  {
    type: "info",
    title: "Weekly backup completed",
    description: "All data successfully backed up",
    time: "2 hours ago",
    severity: "low"
  },
  {
    type: "error",
    title: "Failed login attempts",
    description: "15 failed attempts from IP 192.168.1.100",
    time: "1 hour ago",
    severity: "high"
  }
];

const recentActivity = [
  {
    action: "New user registration",
    user: "yamin@gmail.com",
    time: "2 minutes ago",
    type: "user"
  },
  {
    action: "System config updated",
    user: "admin@ecosystem.io",
    time: "15 minutes ago",
    type: "config"
  }
];

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { stats, loading, fetchUserStats } = useUserStatsStore();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const totalUsers = stats?.totalUsers ?? 0;
  const totalCounsellors = stats?.totalCounsellors ?? 0;
  const totalStudents = stats?.totalStudents ?? 0;
  const totalTests = stats?.totalTests ?? 0;
  const totalCategories = stats?.totalCategories ?? 0;

  const userTrendData = [
    { name: 'Mon', score: 40 },
    { name: 'Tue', score: 45 },
    { name: 'Wed', score: 65 },
    { name: 'Thu', score: 55 },
    { name: 'Fri', score: 80 },
    { name: 'Sat', score: 75 },
    { name: 'Sun', score: 85 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                {greeting},
              </span>
              <span className="ml-2">
                {user?.name ? user.name.split(' ')[0] : 'Admin'}! 👋
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              System overview and management command center.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-primary/10 p-2 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
              <p className="text-sm font-semibold text-slate-700">All Systems Operational</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Exactly same as student dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10', sub: '+12% this month', link: '/manage/users' },
            { label: 'Counsellors', value: totalCounsellors.toLocaleString(), icon: Shield, color: 'text-success', bg: 'bg-success/10', sub: 'Top tier mentors', link: '/manage/counselors' },
            { label: 'Active Students', value: totalStudents.toLocaleString(), icon: UserCheck, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: 'Engagement: 92%', link: '/manage/students' },
            { label: 'System Tests', value: totalTests.toLocaleString(), icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: '4 new added', link: '/manage/tests' }
          ].map((stat, i) => (
            <Link key={i} to={stat.link}>
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md bg-white/70 group hover:translate-y-[-4px] transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="border-slate-100 text-slate-400 bg-white/50">Live</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-800">{loading ? '...' : stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      {stat.sub}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* System Health Roadmap - Matching student roadmap style */}
        <div className="mb-10 p-6 rounded-[2rem] bg-slate-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Compass className="h-40 w-40 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Infrastructure Health
            </h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 hidden md:block -translate-y-1/2"></div>
              {[
                { step: 'Database', title: 'Operational', status: 'completed' },
                { step: 'Security', title: 'Hardened', status: 'completed' },
                { step: 'API Gate', title: 'Performance', status: 'active' },
                { step: 'Scaling', title: 'Auto-Mode', status: 'pending' }
              ].map((item, i) => (
                <div key={i} className="flex md:flex-col items-center gap-4 relative z-10 group/item">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.status === 'completed' ? 'bg-success shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                    item.status === 'active' ? 'bg-primary animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10'
                    }`}>
                    {item.status === 'completed' ? <CheckCircle2 className="h-6 w-6 text-white" /> :
                      <span className="text-sm font-black text-white">{i + 1}</span>}
                  </div>
                  <div className="text-left md:text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{item.step}</p>
                    <p className={`text-sm font-bold ${item.status === 'pending' ? 'text-white/30' : 'text-white'}`}>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Main Traffic Hub - Matches student score card style */}
            <Card className="relative bg-white border-slate-100 shadow-xl overflow-hidden rounded-2xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="md:flex">
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3 py-1 font-bold">
                      TRAFFIC ANALYSIS
                    </Badge>
                    <Badge variant="outline" className="border-slate-200 text-slate-500">
                      Real-time Feed
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                    Global Engagement Index
                  </h2>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={userTrendData}>
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
                          tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }}
                        />
                        <YAxis hide />
                        <ReTooltip
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/3 bg-slate-50 items-center justify-center p-8 border-l border-slate-100">
                  <div className="bg-white p-6 rounded-3xl shadow-soft text-center">
                    <TrendingUp className="h-16 w-16 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-2xl font-black text-slate-800">1.2M</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Requests</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Management Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">System Alerts</h2>
                  <p className="text-slate-500 font-medium">Critical logs and monitoring</p>
                </div>
                <Button variant="ghost" className="text-primary font-bold hover:text-primary/80 hover:bg-primary/5" asChild>
                  <Link to="/settings" className="flex items-center">
                    Configure
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemAlerts.map((alert, i) => (
                  <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl ${alert.severity === 'high' ? 'bg-rose-50 text-rose-500' :
                        alert.severity === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.time}</span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                      {alert.title}
                    </CardTitle>
                    <p className="text-slate-500 font-medium text-sm mb-4 line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex gap-2">
                      <Badge className={`${alert.severity === 'high' ? 'bg-rose-500 text-white' :
                        alert.severity === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        } border-none font-bold text-[9px] uppercase`}>
                        {alert.severity} Priority
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Actions - Exact match to student sidebar style */}
            <Card className="border-none shadow-lg rounded-2xl bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 underline decoration-primary underline-offset-8">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white rounded-xl h-12" asChild>
                  <Link to="/manage/users">
                    <Plus className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-bold">Add New User</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white rounded-xl h-12" asChild>
                  <Link to="/manage/tests">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-bold">Manage Tests</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white rounded-xl h-12" asChild>
                  <Link to="/settings">
                    <Settings className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-bold">Settings</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Card - Exact match to student milestone card */}
            <Card className="bg-gradient-to-br from-primary to-blue-700 border-none shadow-xl rounded-2xl text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-white" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>Uptime Index</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2 bg-white/20 [&>div]:bg-white" />
                  </div>
                  <p className="text-sm text-blue-50 font-medium">
                    All clusters are operating within optimal parameters. No performance degradation detected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
};