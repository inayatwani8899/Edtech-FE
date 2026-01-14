import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStatsStore } from "../../store/userStatsStore";
import * as types from "@/types/types";
import { 
  Users,
  BarChart3,
  Settings,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  FileText,
  Calendar,
  Plus
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

// Removed static adminStats object

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
    time: "2 minutes ago"
  },
  
];

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { stats, loading, error, fetchUserStats } = useUserStatsStore();
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  // Prepare analytics data (derived from `stats` if available)
  const totalUsers = stats?.totalUsers ?? 0;
  const totalCounsellors = stats?.totalCounsellors ?? stats?.totalCounsellors ?? 0;
  const totalStudents = stats?.totalStudents ?? 0;
  const totalTests = stats?.totalTests ?? 0;
  const totalCategories = stats?.totalCategories ?? 0;

  const userTrendData = Array.from({ length: 6 }).map((_, idx) => {
    const monthIndex = idx + 1;
    // spread users across 6 intervals, last value equals totalUsers
    const users = Math.round((totalUsers * monthIndex) / 6);
    return { month: `M-${6 - idx}`, users };
  });

  const roleDistribution = [
    { name: "Students", value: totalStudents },
    { name: "Counsellors", value: totalCounsellors },
    { name: "Others", value: Math.max(totalUsers - totalStudents - totalCounsellors, 0) },
  ];

  const testCategoryData = [
    { name: "Tests", value: totalTests },
    { name: "Categories", value: totalCategories },
  ];

  const PIE_COLORS = ["#6366F1", "#10B981", "#60A5FA"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* decorative orbs */}
      <div className="absolute -top-40 -right-40 w-72 h-72 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent inline-block">
            {greeting}, {user?.name?.split(' ')[0]}! ⚡
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
            System overview and management dashboard for administrators.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-md hover:scale-105 transition">
              <Link to="/manage/users">
                <Plus className="w-4 h-4 mr-2 inline" />
                New User
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-2">
              <Link to="/manage/tests">
                <FileText className="w-4 h-4 mr-2 inline" />
                New Test
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/analytics">
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                View Analytics
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search users, tests..."
              className="hidden sm:inline-block px-3 py-2 rounded-lg border bg-white/70 dark:bg-slate-900/60"
            />
          </div>
        </div>

        {/* Stats Cards (integrated with backend totals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <CardHeader className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-gray-400">N/A</div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalUsers ? stats.totalUsers.toLocaleString() : '0'}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <CardHeader className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Counsellors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCounsellors ? stats.totalCounsellors.toLocaleString() : '0'}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <CardHeader className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents ? stats.totalStudents.toLocaleString() : '0'}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <CardHeader className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTests ? stats.totalTests.toLocaleString() : '0'}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <CardHeader className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-400 to-stone-600 flex items-center justify-center shadow-md">
                <Database className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCategories ? stats.totalCategories.toLocaleString() : '0'}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Management Tools */}
          <div className="lg:col-span-2 space-y-6">
            

            <div className="space-y-6">
              <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                    User Trends
                  </CardTitle>
                  <CardDescription>Monthly active users (simulated)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <LineChart data={userTrendData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ReTooltip />
                        <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Role Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
                            {roleDistribution.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-secondary" />
                      Tests & Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer>
                        <BarChart data={testCategoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ReTooltip />
                          <Bar dataKey="value" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)} bg-opacity-10`}>
                    <div className="mt-0.5">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-destructive' :
                        alert.severity === 'medium' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center mt-0.5">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-sm text-muted-foreground">No recent activity</div>
                )}
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card className="bg-white/95 dark:bg-slate-900/80 rounded-2xl shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-sm opacity-90">Uptime this month</p>
                  <Progress value={98} className="bg-muted/20 [&>div]:bg-accent" />
                  <p className="text-xs opacity-75">System running smoothly with minimal downtime.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};