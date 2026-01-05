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
  // {
  //   action: "Test completed",
  //   user: "jane.smith@email.com",
  //   time: "5 minutes ago"
  // },
  // {
  //   action: "Profile updated",
  //   user: "admin@school.edu",
  //   time: "10 minutes ago"
  // }
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.name?.split(' ')[0]}! ⚡
          </h1>
          <p className="text-muted-foreground mt-2">
            System overview and management dashboard for administrators.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-gray-400">N/A</div>
              ) : (
                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString() || '0'}</div>
              )}
              {/* <p className="text-xs text-muted-foreground">
                +{adminStats.newUsers} new this week
              </p> */}
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-gray-400">N/A</div>
              ) : (
                <div className="text-2xl font-bold">{stats?.activeUsers.toLocaleString() || '0'}</div>
              )}
              {/* <p className="text-xs text-muted-foreground">
                {Math.round((adminStats.activeUsers / adminStats.totalUsers) * 100)}% of total users
              </p> */}
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              {/* <p className="text-xs text-muted-foreground">
                {adminStats.completionRate}% completion rate
              </p> */}
            </CardContent>
          </Card>

          {/* <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">
                Uptime this month
              </p>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Management Tools */}
          <div className="lg:col-span-2 space-y-6">
            

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="group hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link to="/manage/users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-secondary" />
                    Test Management
                  </CardTitle>
                  <CardDescription>
                    Create, edit, and manage assessment tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/manage/tests">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Tests
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    View system analytics and user statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      alert.severity === 'high' ? 'text-destructive' :
                      alert.severity === 'medium' ? 'text-warning' : 'text-success'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
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
            </Card> */}

            {/* Recent Activity */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Activity className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <Card className="shadow-soft bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {adminStats.systemUptime}%
                  </div>
                  <p className="text-sm opacity-90">
                    Uptime this month
                  </p>
                  <Progress 
                    value={adminStats.systemUptime} 
                    className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
                  />
                  <p className="text-xs opacity-75">
                    System running smoothly with minimal downtime.
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};