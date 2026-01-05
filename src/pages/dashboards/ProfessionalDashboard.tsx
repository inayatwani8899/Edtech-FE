import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Brain, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen,
  Play,
  BarChart3,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Star,
  Briefcase,
  Network,
  UserPlus
} from "lucide-react";

const professionalTests = [
  {
    id: "1",
    title: "Leadership Skills Assessment",
    description: "Evaluate your leadership potential and management style",
    type: "leadership",
    duration: 35,
    difficulty: "intermediate",
    completed: false,
    progress: 0,
    icon: Users,
    color: "bg-primary"
  },
  {
    id: "2", 
    title: "Professional Skills Evaluation",
    description: "Assess your technical and soft skills for career advancement",
    type: "skills",
    duration: 45,
    difficulty: "intermediate",
    completed: true,
    progress: 100,
    icon: Briefcase,
    color: "bg-secondary"
  },
  {
    id: "3",
    title: "Career Development Path",
    description: "Discover opportunities for professional growth in your field",
    type: "career",
    duration: 30,
    difficulty: "beginner", 
    completed: false,
    progress: 70,
    icon: TrendingUp,
    color: "bg-accent"
  },
  {
    id: "4",
    title: "Emotional Intelligence for Leaders",
    description: "Enhance your emotional intelligence in professional settings",
    type: "emotional-intelligence",
    duration: 40,
    difficulty: "advanced",
    completed: false,
    progress: 0,
    icon: Lightbulb,
    color: "bg-warning"
  }
];

const professionalStats = {
  testsCompleted: 4,
  totalTests: 12,
  averageScore: 91,
  hoursSpent: 18.5,
  rank: 45,
  totalUsers: 8750,
  skillsImproved: 7,
  careerGoals: 3
};

const careerInsights = [
  {
    type: "skill_gap",
    title: "Project Management certification recommended",
    description: "Based on your role and industry trends",
    time: "1 day ago",
    icon: Target,
    color: "text-primary"
  },
  {
    type: "networking",
    title: "Connect with 5 professionals in your field",
    description: "Expand your professional network this month",
    time: "2 days ago",
    icon: Network,
    color: "text-secondary"
  },
  {
    type: "achievement",
    title: "Leadership skills improved by 23%",
    description: "Great progress in your recent assessment",
    time: "1 week ago",
    icon: Star,
    color: "text-success"
  }
];

export const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.name?.split(' ')[0]}! 💼
          </h1>
          <p className="text-muted-foreground mt-2">
            Advance your career with professional assessments and skill development insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Done</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionalStats.testsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                of {professionalStats.totalTests} professional tests
              </p>
              <Progress value={(professionalStats.testsCompleted / professionalStats.totalTests) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionalStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Excellent performance level
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionalStats.hoursSpent}h</div>
              <p className="text-xs text-muted-foreground">
                Professional development time
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professional Rank</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{professionalStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                of {professionalStats.totalUsers.toLocaleString()} professionals
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Tests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Professional Development</h2>
              <Button variant="outline" asChild>
                <Link to="/tests">
                  View All Assessments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {professionalTests.map((test) => {
                const Icon = test.icon;
                return (
                  <Card key={test.id} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
                    <div className={`h-1 w-full ${test.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${test.color}/10`}>
                            <Icon className={`h-6 w-6 ${test.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {test.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {test.description}
                            </CardDescription>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                {test.duration} min
                              </div>
                              <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                                {test.difficulty}
                              </Badge>
                              {test.completed && (
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {test.progress > 0 && !test.completed && (
                            <div className="text-right">
                              <div className="text-sm font-medium">{test.progress}%</div>
                              <Progress value={test.progress} className="w-20" />
                            </div>
                          )}
                          <Button 
                            size="sm" 
                            variant={test.completed ? "outline" : "default"}
                            asChild
                          >
                            <Link to={`/test/${test.id}`}>
                              {test.completed ? (
                                <>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Results
                                </>
                              ) : test.progress > 0 ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Assessment
                                </>
                              )}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Career Insights */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Career Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/skill-tracker">
                    <Target className="h-4 w-4 mr-2" />
                    Skill Tracker
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/career-planning">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Career Planning
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/networking">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Professional Network
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/certifications">
                    <Award className="h-4 w-4 mr-2" />
                    Certifications
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Skills Progress */}
            <Card className="shadow-soft bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Skills Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {professionalStats.skillsImproved}
                  </div>
                  <p className="text-sm opacity-90">
                    Skills improved this quarter
                  </p>
                  <Progress 
                    value={(professionalStats.skillsImproved / 10) * 100} 
                    className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
                  />
                  <p className="text-xs opacity-75">
                    Excellent progress in your professional development journey.
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