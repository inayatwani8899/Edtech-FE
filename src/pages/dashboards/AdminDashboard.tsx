import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "../../store/useAuthStore";
import api from "@/api/axios";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  FileText,
  HelpCircle,
  GraduationCap,
  Plus,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Activity,
  RefreshCw
} from "lucide-react";

interface DashboardSummary {
  totalQuestions: number;
  totalTests: number;
  totalOrganizations: number;
  totalGrades: number;
}

const systemAlerts = [
  {
    type: "warning",
    title: "High database utilization",
    description: "Peak connection count reached 82%",
    time: "5m ago",
    severity: "medium"
  },
  {
    type: "error",
    title: "SSL expiry notice",
    description: "Certificate autorenew scheduled in 3 days",
    time: "2h ago",
    severity: "low"
  },
  {
    type: "error",
    title: "Intrusion protection alert",
    description: "Blocked 3 brute-force sequences",
    time: "1h ago",
    severity: "high"
  }
];

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<any>("/SuperAdmin/dashboard-summary");
      if (response.data && response.data.success) {
        setSummary(response.data.data);
      } else {
        setError("Failed to fetch dashboard summary.");
      }
    } catch (err: any) {
      console.error("Failed to load dashboard summary:", err);
      setError(err.response?.data?.message || "Failed to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchSummary();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse p-1.5">
        {/* Welcome Banner Skeleton */}
        <div className="bg-slate-200 dark:bg-slate-800 h-28 rounded-2xl w-full" />

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 h-32 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-12 bg-slate-250 dark:bg-slate-750 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 h-24 w-full" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4 p-1.5 animate-in fade-in duration-500">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-elegant bg-white dark:bg-[#0f1117] rounded-3xl p-8 text-center flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-955/20 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/30 text-rose-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Unable to load dashboard details.</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
            Please check your network connection or credentials and try again.
          </p>
          <Button 
            onClick={fetchSummary} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: "Total Questions",
      count: summary.totalQuestions,
      emptyMessage: "No Questions Available",
      icon: <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      gradientClass: "bg-gradient-to-br from-blue-500/5 via-transparent to-transparent",
      iconBgClass: "bg-blue-50 dark:bg-blue-950/20 border-blue-100/30 dark:border-blue-900/30",
      link: "/ai-generation",
    },
    {
      label: "Total Tests",
      count: summary.totalTests,
      emptyMessage: "No Tests Created Yet",
      icon: <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-455" />,
      gradientClass: "bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent",
      iconBgClass: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/30 dark:border-emerald-900/30",
      link: "/manage/tests",
    },
    {
      label: "Total Organizations",
      count: summary.totalOrganizations,
      emptyMessage: "No Organizations Onboarded",
      icon: <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      gradientClass: "bg-gradient-to-br from-purple-500/5 via-transparent to-transparent",
      iconBgClass: "bg-purple-50 dark:bg-purple-950/20 border-purple-100/30 dark:border-purple-900/30",
      link: "/manage/organizations",
    },
    {
      label: "Total Grades",
      count: summary.totalGrades,
      emptyMessage: "No Grades Configured",
      icon: <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-500" />,
      gradientClass: "bg-gradient-to-br from-amber-500/5 via-transparent to-transparent",
      iconBgClass: "bg-amber-50 dark:bg-amber-950/20 border-amber-100/30 dark:border-amber-900/30",
      link: "/manage/configurations",
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500 p-1.5">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Building2 className="h-32 w-32" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              {greeting}, <span className="text-indigo-400">{user?.name ? user.name.split(' ')[0] : 'Super Admin'}</span>
            </h1>
            <p className="text-xs text-slate-350 font-medium mt-1 max-w-xl">
              Manage organizations, tests, questions, and platform operations from one centralized dashboard.
            </p>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mt-3">
              {currentDate}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <span className="text-[8px] font-bold text-white/40 block uppercase tracking-wider leading-none">Platform Status</span>
                <span className="text-[10px] font-extrabold text-white">Systems Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <div className="text-left">
                <span className="text-[8px] font-bold text-white/40 block uppercase tracking-wider leading-none">Platform Speed</span>
                <span className="text-[10px] font-extrabold text-white">Optimal (99.8% Perf)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <Link key={i} to={card.link} className="block group">
            <div className={cn(
              "bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant relative overflow-hidden",
              card.gradientClass
            )}>
              <div className="flex items-start justify-between">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border", card.iconBgClass)}>
                  {card.icon}
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-wider border-slate-150 dark:border-slate-800 text-slate-400 bg-white/50 dark:bg-white/5 px-2 py-0.5">
                  LIVE
                </Badge>
              </div>
              <div className="mt-3">
                <span className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                  {card.label}
                </span>
                {card.count === 0 ? (
                  <div className="mt-1.5 min-h-[36px] flex flex-col justify-center">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-550 italic leading-snug">
                      {card.emptyMessage}
                    </span>
                    <span className="text-[8px] font-black text-slate-400 block mt-0.5 tracking-wider uppercase">Count: 0</span>
                  </div>
                ) : (
                  <div className="min-h-[36px] flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                      {card.count.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Quick Actions Section */}
      <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-3">
        <div>
          <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Quick Actions</h2>
          <p className="text-[10px] text-slate-500 font-medium">Platform management flow and operational pipelines</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/organizations/add")} 
            className="w-full justify-start text-left h-10 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-extrabold text-[10px] tracking-wider uppercase transition-all"
          >
            <Plus className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />
            Add Organization
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/manage/tests")} 
            className="w-full justify-start text-left h-10 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-extrabold text-[10px] tracking-wider uppercase transition-all"
          >
            <FileText className="h-4 w-4 mr-2 text-emerald-500 shrink-0" />
            Manage Tests
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/ai-generation")} 
            className="w-full justify-start text-left h-10 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-extrabold text-[10px] tracking-wider uppercase transition-all"
          >
            <HelpCircle className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
            Question Bank
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/manage/organizations")} 
            className="w-full justify-start text-left h-10 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-extrabold text-[10px] tracking-wider uppercase transition-all"
          >
            <Users className="h-4 w-4 mr-2 text-purple-500 shrink-0" />
            View Organizations
          </Button>
        </div>
      </div>

      {/* 4. Monitoring & Metrics Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Alerts Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">System Alerts</h2>
              <p className="text-[10px] text-slate-500 font-medium">Critical system notifications and logs</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold text-[10px] hover:bg-primary/5 h-8 px-2.5 rounded-lg animate-in" onClick={fetchSummary}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
          <div className="space-y-2.5">
            {systemAlerts.map((alert, i) => (
              <div key={i} className="flex items-start justify-between p-3 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/30 dark:hover:bg-white/5 rounded-xl transition-all gap-3">
                <div className="flex gap-2.5">
                  <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", 
                    alert.severity === 'high' ? 'bg-rose-50 dark:bg-rose-955/20 text-rose-500' :
                    alert.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-500'
                  )}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{alert.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">{alert.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{alert.time}</span>
                  <Badge className={cn("border-none text-[8px] font-black uppercase px-1.5 py-0.2 rounded", 
                    alert.severity === 'high' ? 'bg-rose-500 text-white' :
                    alert.severity === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  )}>
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Metrics */}
        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Infrastructure Status</h2>
            <p className="text-[10px] text-slate-500 font-medium">Real-time status metrics of backend layers</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-600 dark:text-slate-350">
                <span>Database Health</span>
                <span className="text-emerald-500 font-black">99.9%</span>
              </div>
              <Progress value={99.9} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-600 dark:text-slate-350">
                <span>Memory Utilization</span>
                <span className="text-blue-500 font-black">44.5%</span>
              </div>
              <Progress value={44.5} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-600 dark:text-slate-350">
                <span>CPU Core Load</span>
                <span className="text-amber-500 font-black">12.8%</span>
              </div>
              <Progress value={12.8} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-amber-500" />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3">
              <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-2">Systems Operational</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  API Gateway
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Auth Node
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Storage Hub
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  CDN Proxy
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};