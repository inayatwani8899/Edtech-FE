import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Clock,
  UserCheck,
  Award,
  FileText,
  Video,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Search,
  Plus,
  ArrowUpRight,
  Activity,
  Sparkles,
  Target,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the professional flow
const counselorStats = [
  { label: 'My Students', value: 156, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: '89 active this week' },
  { label: 'Upcoming Sessions', value: 23, icon: Calendar, color: 'text-sky-500', bg: 'bg-sky-500/10', sub: '8 scheduled today' },
  { label: 'Avg. Accuracy', value: '78%', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10', sub: 'Student assessment avg' },
  { label: 'Completed', value: 234, icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Assessments this term' }
];

const upcomingAppointments = [
  {
    student: "Emily Johnson",
    time: "10:00 AM",
    type: "Career Guidance",
    status: "confirmed",
    duration: 45,
    avatar: "EJ"
  },
  {
    student: "Michael Chen",
    time: "2:00 PM",
    type: "Academic Planning",
    status: "pending",
    duration: 30,
    avatar: "MC"
  },
  {
    student: "Sarah Williams",
    time: "3:30 PM",
    type: "Assessment Review",
    status: "confirmed",
    duration: 60,
    avatar: "SW"
  }
];

const studentProgress = [
  {
    student: "Alex Thompson",
    assessment: "Career Interest Assessment",
    progress: 85,
    status: "In Progress",
    lastActivity: "2 hours ago"
  },
  {
    student: "Maria Garcia",
    assessment: "Personality Profile",
    progress: 100,
    status: "Completed",
    lastActivity: "1 day ago"
  },
  {
    student: "David Kim",
    assessment: "Academic Skills Test",
    progress: 45,
    status: "Needs Support",
    lastActivity: "3 days ago"
  }
];

export const CounselorDashboard = () => {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "in progress": return "bg-sky-500/10 text-sky-600 border-sky-200";
      case "needs support": return "bg-rose-500/10 text-rose-600 border-rose-200";
      case "confirmed": return "bg-emerald-500 text-white border-transparent";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-emerald-500/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-sky-500/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  relative z-10">

        {/* 1. Compact Greeting Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              {greeting}, <span className="text-emerald-600">{user?.firstName || user?.name?.split(' ')[0] || 'Counselor'}!</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium -mt-1">
              Elevate student success through precision guidance and data-driven insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 rounded-xl shadow-lg shadow-emerald-500/20 group transition-all" asChild>
              <Link to="/counselor/search">
                <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Look Up
              </Link>
            </Button>
          </div>
        </div>
        {/* 2. Professional Roadmap (Top-aligned and compact) */}
        <div className="mb-8 p-4 md:p-5 rounded-[1.5rem] bg-slate-900 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none">
            <Compass className="h-24 w-24 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" /> Professional Flow
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              {(() => {
                const steps = [
                  { step: 'Queue', title: 'Consultations', status: 'completed' },
                  { step: 'Assessment', title: 'Diagnostics', status: 'completed' },
                  { step: 'Insight', title: 'Data Review', status: 'active' },
                  { step: 'Goal', title: 'Roadmap Lock', status: 'pending' }
                ];
                return (
                  <>
                    <div className="absolute top-[18px] left-0 w-full h-0.5 hidden md:block bg-white/10 rounded-full">
                      <div className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-1000" style={{ width: `66%` }} />
                    </div>
                    {steps.map((item, i) => {
                      const completed = item.status === 'completed';
                      const active = item.status === 'active';
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
        {/* Dynamic Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {counselorStats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden relative rounded-2xl">
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.bg.replace('/10', '')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className={`${stat.bg} p-2 rounded-xl transition-transform group-hover:scale-110 shadow-sm`}>
                    <stat.icon className={`h-4 w-4 ${stat.color} stroke-[2.5]`} />
                  </div>
                  <div className="bg-slate-50 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">{stat.label}</p>
                  <p className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tighter flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                    {stat.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Operational Core */}
          <div className="lg:col-span-2 space-y-10">

            {/* Professional Schedule Hub */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Focus Schedule</h2>
                  <p className="text-slate-500 font-medium text-sm">Priority appointments for today.</p>
                </div>
                <Button variant="ghost" className="text-emerald-600 font-black hover:text-emerald-700 hover:bg-emerald-50 rounded-xl" asChild>
                  <Link to="/counselor/appointments" className="flex items-center group">
                    Full Calendar
                    <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5">
                {upcomingAppointments.map((appointment, index) => (
                  <Card key={index} className="group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 border-slate-100 overflow-hidden relative">
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5",
                      appointment.status === 'confirmed' ? "bg-emerald-500" : "bg-amber-400"
                    )}></div>
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            {appointment.avatar}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-black text-slate-800">{appointment.student}</CardTitle>
                            <CardDescription className="font-bold text-emerald-600/70 uppercase text-[10px] tracking-widest mt-0.5">{appointment.type}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-slate-800 leading-none">{appointment.time}</div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{appointment.duration} MIN SESSION</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center justify-between">
                        <Badge className={cn("px-3 py-1 font-black text-[10px] tracking-widest uppercase border-0 rounded-lg shadow-sm", getStatusColor(appointment.status))}>
                          {appointment.status}
                        </Badge>
                        <div className="flex gap-2.5">
                          <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl border-slate-200 font-bold hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 group transition-all">
                            <Video className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                            Launch Room
                          </Button>
                          <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Performance Monitoring Section */}
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                Case File Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {studentProgress.map((student, index) => (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-slate-100 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-black text-slate-800 tracking-tight">{student.student}</span>
                        </div>
                        <Badge variant="outline" className={cn("font-bold text-[9px] uppercase tracking-tighter border-0 rounded-full px-2", getStatusColor(student.status))}>
                          {student.status.replace(' ', ' • ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[12px] font-bold text-slate-500 mb-2 truncate">{student.assessment}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  student.progress === 100 ? "bg-emerald-500" : student.progress < 50 ? "bg-rose-500" : "bg-sky-500"
                                )}
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-black text-slate-700">{student.progress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{student.lastActivity}</p>
                          <Button variant="ghost" size="sm" className="h-7 text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg group" asChild>
                            <Link to={`/student/${student.student.replace(' ', '-').toLowerCase()}`}>
                              INSIGHTS
                              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Side Performance Pillar */}
          <div className="space-y-8">
            {/* Professional Quick Access */}
            <Card className="border-none shadow-2xl rounded-3xl bg-slate-950 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Neural Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full h-14 justify-start bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] border-0 shadow-lg shadow-emerald-500/20 group transition-all" asChild>
                  <Link to="/counselor/appointments">
                    <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold tracking-tight">New Appointment</span>
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Reports", icon: FileText, url: "/counselor/reports" },
                    { title: "Messages", icon: MessageSquare, url: "/counselor/messages" },
                    { title: "Resources", icon: BookOpen, url: "/counselor/resources" },
                    { title: "Settings", icon: Plus, url: "/settings" }
                  ].map((btn, i) => (
                    <Button key={i} variant="ghost" className="h-20 flex-col gap-2 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white rounded-2xl group transition-all" asChild>
                      <Link to={btn.url}>
                        <btn.icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{btn.title}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Verification Status Card */}
            <Card className="bg-emerald-600 border-none shadow-xl rounded-3xl text-white overflow-hidden group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-black">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  System Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2.5 text-emerald-100">
                      <span>Satisfaction Index</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2 bg-black/10 [&>div]:bg-white" />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-300 animate-ping"></div>
                    </div>
                    <p className="text-[13px] text-emerald-50 font-bold leading-snug">
                      Outstanding performance this month. Your guidance accuracy is in the top 5% across the platform.
                    </p>
                  </div>
                  <Button variant="ghost" className="w-full text-white font-black hover:bg-white/10 rounded-xl" asChild>
                    <Link to="/profile">
                      View Detailed Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attention System */}
            <Card className="border-2 border-rose-100 shadow-xl shadow-rose-500/5 rounded-3xl bg-white overflow-hidden">
              <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100">
                <h3 className="flex items-center font-black text-rose-600 text-[11px] uppercase tracking-[0.2em]">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Attention Threshold
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                {[
                  { title: "3 Inactive Students", sub: "Haven't logged activity in 14 days", color: "rose" },
                  { title: "New Resource Update", sub: "Healthcare industry guide refreshed", color: "sky" }
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl bg-${item.color}-50/50 border border-${item.color}-100 group cursor-pointer hover:scale-[1.02] transition-transform`}>
                    <p className={`text-sm font-black text-${item.color}-700 mb-0.5`}>{item.title}</p>
                    <p className={`text-[11px] font-bold text-${item.color}-600/70`}>{item.sub}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};