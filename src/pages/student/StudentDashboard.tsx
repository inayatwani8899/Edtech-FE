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
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// Assuming these are defined elsewhere or passed as props for demonstration
const studentStats = {
  testsCompleted: 5,
  totalTests: 2,
  averageScore: 75,
  hoursSpent: 60,
  rank: 3,
  totalUsers: 150,
};

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
              isTestPaid(user.id, test.id),
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
    switch (difficulty) {
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };



  return (
    // <StudentLayout>
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.firstName ? user.firstName.split(' ')[0] : 'Guest'}! 🎓
            {/* Changed user?.name?.split(' ')[0] to user?.firstName for consistency */}
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore your potential and discover your ideal career path through assessments.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.testsCompleted}</div>
              {/* <p className="text-xs text-muted-foreground">
                of {studentStats.totalTests} recommended tests
              </p> */}
              <Progress value={(studentStats.testsCompleted / studentStats.totalTests) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Great progress!
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.hoursSpent}</div>
              <p className="text-xs text-muted-foreground">
                Out of 90
              </p>
            </CardContent>
          </Card>

          {/* <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{studentStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                of {studentStats.totalUsers.toLocaleString()} students
              </p>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Tests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <Button variant="outline" asChild>
                {/* FIX: Wrap Link's children in a single element (e.g., <span>) */}
                <Link to="/tests">
                  <span>
                    All Tests
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* <div className="grid gap-4">
              {publishedTests?.map((test, i) => {
                return (
                  <Card key={i} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
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
                                {test.timeDuration} min
                              </div>
                            </div>
                          </div>
                        </div>
                        {user?.id && (isTestPaid(user.id, test.id)) ? (
                          <Button asChild size="sm">
                            <Link to={`/test/${test.id}`}>Start Assessment</Link>
                          </Button>
                        ) : !user ? (
                          <Button asChild size="sm">
                            <Link to="/login">Login to Purchase</Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={async () => {
                              setProcessingTestId(test.id);
                              const result = await handlePayment(test);
                              setProcessingTestId(null);
                            }}
                            disabled={processingTestId === test.id}
                          >
                            {processingTestId === test.id ? "Processing..." : `Buy Now - ₹${test.price}`}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div> */}

            <div className="grid gap-4">
              {publishedTests.length === 0 && (
                <div className="grid gap-4">
                  {/* Skeleton Loader for Test Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {/* Repeat skeleton for 6 items (2 rows) or however many you want to show */}
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        {/* Test Title Skeleton */}
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-10" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>

                        {/* Test Info Skeleton */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-10 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-10 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        </div>

                        {/* Button Skeleton */}
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {publishedTests?.map((test, i) => (
                <Card key={i} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
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
                              {test.timeDuration} min
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ✅ Conditional Button */}
                      {!user ? (
                        <Button asChild size="sm">
                          <Link to="/login">Login to Purchase</Link>
                        </Button>
                      ) : paidStatus[test.id] ? (
                        <Button asChild size="sm">
                          <Link to={`/test/${test.id}`}>Start Assessment</Link>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
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
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

          </div>
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/results">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span>
                      My Results
                    </span>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      Update Profile
                    </span>
                  </Link>
                </Button>
                {/* <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/career-guide">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>
                      Career Guide
                    </span>
                  </Link>
                </Button> */}
              </CardContent>
            </Card>

            {/* Progress Card */}
            {/* <Card className="shadow-soft bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {Math.round((studentStats.testsCompleted / studentStats.totalTests) * 100)}%
                  </div>
                  <p className="text-sm opacity-90">
                    Assessment completion
                  </p>
                  <Progress
                    value={(studentStats.testsCompleted / studentStats.totalTests) * 100}
                    className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
                  />
                  <p className="text-xs opacity-75">
                    Keep going! Complete more assessments to unlock career insights.
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div >
    // </StudentLayout>
  );
};