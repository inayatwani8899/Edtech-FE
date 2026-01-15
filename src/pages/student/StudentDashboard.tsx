import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, TrendingUp, Clock, Award, ArrowRight, BarChart3, Users, BookOpen,
  AlertCircle, Sparkles, Target, Zap, LayoutDashboard, Flag, Trophy, Compass
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
// Assuming these are defined elsewhere or passed as props for demonstration
const studentStats = {
  testsCompleted: 5,
  totalTests: 12, // Adjusted for better visualization
  averageScore: 75,
  hoursSpent: 60,
  rank: 3,
  totalUsers: 150,
};

const performanceData = [
  { name: 'Mon', score: 40 },
  { name: 'Tue', score: 45 },
  { name: 'Wed', score: 65 },
  { name: 'Thu', score: 55 },
  { name: 'Fri', score: 80 },
  { name: 'Sat', score: 75 },
  { name: 'Sun', score: 85 },
];

// Import your stores
import { useAuthStore } from "@/store/useAuthStore";
import { useTestStore } from "@/store/testStore";
import { usePaymentStore } from "@/store/paymentStore"; // Ensure this path is correct
import { useTestConfigurationStore } from "@/store/testConfigurationStore";

export const StudentDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { user } = useAuthStore();
  const { publishedTests, getPublishedTests } = useTestStore();
  const { handlePayment, loading, paidTests, isTestPaid } = usePaymentStore(); // Get handlePayment and loading state from store
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
  const [greeting, setGreeting] = useState("");
  const [processingTestId, setProcessingTestId] = useState<string | null>(null);
  const { fetchConfigurationByRoleIdTestId } = useTestConfigurationStore();
  useEffect(() => {
    const fetchPaidStatus = async () => {
      if (!user?.id || !publishedTests?.length) return;

      const roleId = localStorage.getItem("roleId");
      const statuses: Record<string, boolean> = {};

      try {
        // Run all requests concurrently instead of sequentially
        const results = await Promise.all(
          publishedTests.map(async (test) => {
            const [isPaid, configuration] = await Promise.all([
              isTestPaid(String(user.id), test.id),
              fetchConfigurationByRoleIdTestId(roleId, test.id),
            ]);
            console.log(configuration);
            return { testId: test.id, isPaid };
          })
        );

        // Build status object
        results.forEach(({ testId, isPaid }) => {
          statuses[testId] = isPaid;
        });

        setPaidStatus(statuses);
      } catch (error) {
        console.error("Error fetching paid status:", error);
      }
    };

    fetchPaidStatus();
  }, [user?.id, publishedTests]);


  useEffect(() => {
    // Fetch published tests on mount
    getPublishedTests();
  }, [getPublishedTests]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-700 border-green-200";
      case "intermediate": return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const psychometricTest = publishedTests.find(test =>
    test.title.toLowerCase().includes('psychometric') ||
    test.title.toLowerCase().includes('physometric')
  );

  const otherTests = publishedTests.filter(test => test.id !== psychometricTest?.id);



  return (
    // <StudentLayout>
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                {greeting},
              </span>
              <span className="ml-2">
                {user?.firstName ? user.firstName.split(' ')[0] : 'Scholar'}! 👋
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Ready to unlock your potential today?
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Goal</p>
              <p className="text-sm font-semibold text-slate-700">Complete Career Path</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tests Taken', value: studentStats.testsCompleted, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', progress: (studentStats.testsCompleted / studentStats.totalTests) * 100 },
            { label: 'Average Score', value: `${studentStats.averageScore}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', sub: 'Top 15% overall' },
            { label: 'Total Points', value: '2,450', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: 'Level 4 Scholar' },
            { label: 'Next Milestone', value: 'Psychometric', icon: Flag, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: '2 tests away' }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md bg-white/70 group hover:translate-y-[-4px] transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.progress !== undefined && (
                    <Badge variant="outline" className="border-slate-100 text-slate-400 bg-white/50">{Math.round(stat.progress)}%</Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                  {stat.progress !== undefined ? (
                    <Progress value={stat.progress} className="h-1.5 mt-3 bg-slate-100 [&>div]:bg-success" />
                  ) : (
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      {stat.sub}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Journey Roadmap */}
        <div className="mb-10 p-6 rounded-[2rem] bg-slate-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Compass className="h-40 w-40 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              Your Career Journey
            </h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 hidden md:block -translate-y-1/2"></div>
              {[
                { step: 'Start', title: 'Onboarding', status: 'completed' },
                { step: 'Evaluation', title: 'Psychometric', status: 'active' },
                { step: 'Insight', title: 'Skill Profile', status: 'pending' },
                { step: 'Goal', title: 'Career Path', status: 'pending' }
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
            {/* Featured Psychometric Test */}
            {psychometricTest && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative bg-white border-slate-100 shadow-xl overflow-hidden rounded-2xl">
                  <div className="md:flex">
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 font-bold">
                          FEATURED ASSESSMENT
                        </Badge>
                        <Badge variant="outline" className="border-slate-200 text-slate-500">
                          Highly Recommended
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {psychometricTest.title}
                      </h2>
                      <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                        {psychometricTest.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center text-slate-500 font-semibold">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          {psychometricTest.timeDuration} mins
                        </div>
                        <div className="flex items-center text-slate-500 font-semibold">
                          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                          Complete Evaluation
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {!user ? (
                          <Button asChild size="lg" className="rounded-xl px-8 shadow-primary/25 shadow-lg">
                            <Link to="/login">Login to Start</Link>
                          </Button>
                        ) : paidStatus[psychometricTest.id] ? (
                          <Button asChild size="lg" className="rounded-xl px-8 shadow-primary/25 shadow-lg group">
                            <Link to={`/test/${psychometricTest.id}`} className="flex items-center">
                              Start Assessment
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            className="rounded-xl px-8 shadow-primary/25 shadow-lg"
                            onClick={async () => {
                              setProcessingTestId(psychometricTest.id);
                              const result = await handlePayment(psychometricTest);
                              if (result.success && user?.id) {
                                setPaidStatus((prev) => ({ ...prev, [psychometricTest.id]: true }));
                              }
                              setProcessingTestId(null);
                            }}
                            disabled={processingTestId === psychometricTest.id}
                          >
                            {processingTestId === psychometricTest.id
                              ? "Processing..."
                              : `Buy Now - ₹${psychometricTest.price}`}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex md:w-1/3 bg-slate-50 items-center justify-center p-8 border-l border-slate-100">
                      <div className="bg-white p-6 rounded-3xl shadow-soft">
                        <Zap className="h-24 w-24 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Other Tests Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Explore Assessments</h2>
                  <p className="text-slate-500 font-medium">Continue your learning journey</p>
                </div>
                <Button variant="ghost" className="text-primary font-bold hover:text-primary/80 hover:bg-primary/5" asChild>
                  <Link to="/tests" className="flex items-center">
                    See All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {publishedTests.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="border-slate-100 shadow-sm">
                      <CardHeader className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherTests?.map((test, i) => (
                    <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden rounded-2xl">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className={getDifficultyColor(test.difficulty as any)}>
                            {test.difficulty || "Regular"}
                          </Badge>
                          <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            <Clock className="h-3 w-3 mr-1" />
                            {test.timeDuration}m
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                          {test.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[40px] text-slate-500 font-medium">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!user ? (
                          <Button asChild variant="outline" className="w-full rounded-xl font-bold">
                            <Link to="/login">Login</Link>
                          </Button>
                        ) : paidStatus[test.id] ? (
                          <Button asChild className="w-full rounded-xl font-bold shadow-soft">
                            <Link to={`/test/${test.id}`}>Start Assessment</Link>
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-xl font-bold shadow-soft"
                            onClick={async () => {
                              setProcessingTestId(test.id);
                              const result = await handlePayment(test);
                              if (result.success && user?.id) {
                                setPaidStatus((prev) => ({ ...prev, [test.id]: true }));
                              }
                              setProcessingTestId(null);
                            }}
                            disabled={processingTestId === test.id}
                          >
                            {processingTestId === test.id
                              ? "Processing..."
                              : `Buy Now - ₹${test.price}`}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-none shadow-lg rounded-2xl bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 underline decoration-primary underline-offset-8">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white rounded-xl h-12" asChild>
                  <Link to="/results">
                    <BarChart3 className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-bold">My Performance</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white rounded-xl h-12" asChild>
                  <Link to="/profile">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-bold">Profile Settings</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="bg-gradient-to-br from-primary to-blue-700 border-none shadow-xl rounded-2xl text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-400" />
                  Your Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>Course Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-white/20 [&>div]:bg-white" />
                  </div>
                  <p className="text-sm text-blue-50 font-medium">
                    You're doing great! Complete 2 more tests to earn your next badge.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
    // </StudentLayout>
  );
};