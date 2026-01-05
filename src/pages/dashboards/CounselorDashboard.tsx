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
  CheckCircle2
} from "lucide-react";

const counselorStats = {
  totalStudents: 156,
  activeStudents: 89,
  sessionsThisWeek: 23,
  averageScore: 78,
  upcomingAppointments: 8,
  completedAssessments: 234
};

const upcomingAppointments = [
  {
    student: "Emily Johnson",
    time: "10:00 AM",
    type: "Career Guidance",
    status: "confirmed",
    duration: 45
  },
  {
    student: "Michael Chen",
    time: "2:00 PM", 
    type: "Academic Planning",
    status: "pending",
    duration: 30
  },
  {
    student: "Sarah Williams",
    time: "3:30 PM",
    type: "Assessment Review",
    status: "confirmed",
    duration: 60
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
      case "completed": return "bg-success/10 text-success border-success/20";
      case "in progress": return "bg-primary/10 text-primary border-primary/20";
      case "needs support": return "bg-warning/10 text-warning border-warning/20";
      case "confirmed": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.name?.split(' ')[0]}! 🎯
          </h1>
          <p className="text-muted-foreground mt-2">
            Guide students on their academic and career journey with personalized support.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counselorStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {counselorStats.activeStudents} active this week
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counselorStats.sessionsThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                {counselorStats.upcomingAppointments} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counselorStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Student assessments
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counselorStats.completedAssessments}</div>
              <p className="text-xs text-muted-foreground">
                Completed this semester
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Today's Appointments</h2>
                <Button variant="outline" asChild>
                  <Link to="/calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {upcomingAppointments.map((appointment, index) => (
                  <Card key={index} className="group hover:shadow-soft transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{appointment.student}</CardTitle>
                          <CardDescription>{appointment.type}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{appointment.time}</div>
                          <div className="text-sm text-muted-foreground">{appointment.duration} min</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Student Progress */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Student Progress</h2>
              <div className="grid gap-4">
                {studentProgress.map((student, index) => (
                  <Card key={index} className="group hover:shadow-soft transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{student.student}</CardTitle>
                          <CardDescription>{student.assessment}</CardDescription>
                        </div>
                        <Badge variant="outline" className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Last activity: {student.lastActivity}</span>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/student/${student.student.replace(' ', '-').toLowerCase()}`}>
                              View Details
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/schedule-appointment">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student-reports">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/message-students">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Students
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/resources">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Counseling Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Urgent Notifications */}
            <Card className="shadow-soft border-warning">
              <CardHeader>
                <CardTitle className="flex items-center text-warning">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Attention Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm font-medium">3 students need follow-up</p>
                  <p className="text-xs text-muted-foreground">Haven't completed assessments in 2+ weeks</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">New career resources available</p>
                  <p className="text-xs text-muted-foreground">Updated industry guides for IT and Healthcare</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="shadow-soft bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    89%
                  </div>
                  <p className="text-sm opacity-90">
                    Student satisfaction rate
                  </p>
                  <Progress 
                    value={89} 
                    className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
                  />
                  <p className="text-xs opacity-75">
                    Excellent counseling performance this semester.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};