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
  Target
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">

        {/* Professional Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                Professional Dashboard
              </Badge>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Verified Counselor</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600">
                {greeting},
              </span>
              <span className="ml-3">
                {user?.firstName || user?.name?.split(' ')[0] || 'Counselor'}! 🎯
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              Elevate student success through precision guidance and data-driven insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-emerald-500/20 group transition-all" asChild>
              <Link to="/counselor/search">
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Student Lookup
              </Link>
            </Button>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hidden sm:flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Queue Status</p>
                <p className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  High Engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {counselorStats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm group hover:translate-y-[-6px] transition-all duration-500 overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.bg.replace('/10', '')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <CardContent className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div className={`${stat.bg} p-3 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.color} stroke-[2.5]`} />
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map(x => (
                        <div key={x} className="h-4 w-4 rounded-full border-2 border-white bg-slate-200 overflow-hidden text-[6px] flex items-center justify-center font-bold text-slate-500">
                          {x}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      {stat.sub}
                    </p>
                  </div>
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