
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  Clock,
  Users,
  Target,
  Lightbulb,
  Briefcase,
  Search,
  Filter,
  Play,
  CheckCircle2,
  BarChart3,
  Star,
  TrendingUp,
  Heart,
  ArrowRight,
  ChevronRight,
  TrendingDown,
  LayoutGrid,
  Zap,
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";
import { useTestStore } from "@/store/testStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/useAuthStore";

const allTests = [
  {
    id: "1",
    title: "Cognitive Aptitude Assessment",
    description: "Comprehensive evaluation of verbal, numerical, and logical reasoning abilities. Designed to measure your problem-solving skills and cognitive processing speed.",
    type: "aptitude",
    category: "Cognitive",
    duration: 45,
    questions: 60,
    difficulty: "intermediate",
    completed: false,
    progress: 0,
    icon: Brain,
    color: "bg-primary",
    rating: 4.8,
    participants: 25420,
    tags: ["Reasoning", "Problem Solving", "Logic"]
  },
  {
    id: "2",
    title: "Big Five Personality Assessment",
    description: "Discover your personality across five key dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.",
    type: "personality",
    category: "Personality",
    duration: 30,
    questions: 120,
    difficulty: "beginner",
    completed: true,
    progress: 100,
    icon: Users,
    color: "bg-secondary",
    rating: 4.9,
    participants: 42150,
    tags: ["Big Five", "Traits", "Behavior"]
  },
  {
    id: "3",
    title: "Career Interest Inventory (RIASEC)",
    description: "Identify your professional interests using Holland's RIASEC model to find careers that match your preferences and motivations.",
    type: "interest",
    category: "Career",
    duration: 25,
    questions: 90,
    difficulty: "beginner",
    completed: false,
    progress: 60,
    icon: Target,
    color: "bg-accent",
    rating: 4.7,
    participants: 31280,
    tags: ["Career", "Interests", "RIASEC"]
  },
  {
    id: "4",
    title: "Emotional Intelligence Assessment",
    description: "Measure your ability to recognize, understand, and manage emotions in yourself and others. Critical for leadership and interpersonal success.",
    type: "emotional-intelligence",
    category: "Emotional",
    duration: 35,
    questions: 75,
    difficulty: "intermediate",
    completed: false,
    progress: 0,
    icon: Heart,
    color: "bg-warning",
    rating: 4.6,
    participants: 18970,
    tags: ["EQ", "Emotions", "Leadership"]
  },
  {
    id: "5",
    title: "Professional Skills Assessment",
    description: "Evaluate your workplace competencies including communication, teamwork, problem-solving, and technical skills for your industry.",
    type: "professional",
    category: "Professional",
    duration: 40,
    questions: 85,
    difficulty: "advanced",
    completed: false,
    progress: 0,
    icon: Briefcase,
    color: "bg-destructive",
    rating: 4.5,
    participants: 12450,
    tags: ["Skills", "Workplace", "Competency"]
  },
  {
    id: "6",
    title: "Creative Thinking Assessment",
    description: "Assess your creative problem-solving abilities, innovative thinking patterns, and artistic/creative intelligence.",
    type: "aptitude",
    category: "Creative",
    duration: 35,
    questions: 50,
    difficulty: "intermediate",
    completed: false,
    progress: 0,
    icon: Lightbulb,
    color: "bg-accent",
    rating: 4.4,
    participants: 8760,
    tags: ["Creativity", "Innovation", "Art"]
  }
];

const categories = ["All", "Cognitive", "Personality", "Career", "Emotional", "Professional", "Creative"];
const difficulties = ["All", "beginner", "intermediate", "advanced"];

export const Tests = () => {
  const { handlePayment, loading, paidTests, isTestPaid } = usePaymentStore(); // Get handlePayment and loading state from store
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState("");
  const [processingTestId, setProcessingTestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
  const { getPublishedTests, publishedTests, fetchQuestions, testTakingLoading } = useTestStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPaidStatus = async () => {
      if (!user?.id || !publishedTests?.length) return;

      const statuses: Record<string, boolean> = {};
      for (const test of publishedTests) {
        const result = await isTestPaid(String(user.id), test.id);
        statuses[test.id] = result;
      }
      setPaidStatus(statuses);
    };

    fetchPaidStatus();
  }, [user?.id, publishedTests]);

  useEffect(() => {
    getPublishedTests();
  }, [getPublishedTests])
  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || test.difficulty === selectedDifficulty;

    const matchesTab = activeTab === "all" ||
      (activeTab === "completed" && test.completed) ||
      (activeTab === "in-progress" && test.progress > 0 && !test.completed) ||
      (activeTab === "available" && test.progress === 0);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getTestStats = () => {
    const completed = allTests.filter(t => t.completed).length;
    const inProgress = allTests.filter(t => t.progress > 0 && !t.completed).length;
    const available = allTests.filter(t => t.progress === 0).length;
    return { completed, inProgress, available, total: publishedTests.length };
  };

  const stats = getTestStats();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-primary/30"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Educational Assessments</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
            Assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Hub</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed">
            Professional evaluations designed to map your natural strengths
            and align them with high-growth career trajectories.
          </p>
        </div>

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">{stats.available}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Filters */}
        {publishedTests.length > 0 && (
          <Card className="glass-card mb-8 border-none overflow-hidden rounded-xl">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-11 bg-slate-50/50 border-slate-100 rounded-lg font-semibold text-slate-700 text-sm focus:ring-primary/20 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[200px] h-11 bg-slate-50/50 border-slate-100 rounded-lg font-semibold text-slate-600 text-sm focus:ring-primary/20">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 bg-white/95 backdrop-blur-xl">
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="font-semibold text-sm py-2">{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 font-slate-900 border-slate-200 focus-visible:ring-slate-950 focus-visible:outline-slate-950">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl backdrop-blur-sm border border-slate-200/50 w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-none rounded-lg px-6 font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">All Modules</TabsTrigger>
              <TabsTrigger value="available" className="flex-1 md:flex-none rounded-lg px-6 font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Available</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 md:flex-none rounded-lg px-6 font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Completed</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                Live
              </div>
              <div className="h-3 w-px bg-slate-200"></div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <span className="text-primary">{testTakingLoading ? "..." : filteredTests.length}</span> Assessments
              </div>
            </div>
          </div>


          <TabsContent value={activeTab} className="mt-0 outline-none">
            {testTakingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="glass-card border-none rounded-xl p-6">
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-full mb-1.5" />
                    <Skeleton className="h-3 w-2/3 mb-6" />
                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                      <Skeleton className="h-10 flex-1 rounded-lg" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : publishedTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <LayoutGrid className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">No active tests found</h3>
                <p className="text-slate-500 text-xs font-medium">Contact your administrator for more information.</p>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">No results found</h3>
                <p className="text-slate-500 text-xs font-medium">Try adjusting your search terminology or category filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publishedTests.map((test, i) => (
                  <Card key={test.id} className="group relative glass-card border-none hover:shadow-soft transition-all duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className={`${getDifficultyColor(test.difficulty as any)} border-none px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest`}>
                            {test.difficulty || "Regular"}
                          </Badge>
                          {test.category && (
                            <Badge variant="outline" className="border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                              {test.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100/50 rounded-md text-[9px] font-bold text-slate-500 backdrop-blur-sm">
                          <Clock className="h-3 w-3 text-primary" />
                          {test.timeDuration}m
                        </div>
                      </div>

                      <CardTitle className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-300">
                        {test.title}
                      </CardTitle>

                      <CardDescription className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {test.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center gap-4 mb-5 py-3 border-y border-slate-50 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">{test?.participants?.toLocaleString() || "1.2k+"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-bold text-slate-500">{test?.rating || "4.8"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {!user ? (
                          <Button asChild size="sm" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-widest h-10 bg-slate-900 shadow-sm">
                            <Link to="/login" className="flex items-center justify-center">
                              Login to Unlock
                            </Link>
                          </Button>
                        ) : paidStatus[test.id] ? (
                          <Button asChild size="sm" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-widest h-10 bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
                            <Link to={`/test/${test.id}`} className="flex items-center justify-center">
                              Start Now
                              <ArrowRight className="ml-1.5 h-3 w-3" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-widest h-10 bg-slate-900 shadow-sm"
                            onClick={async () => {
                              setProcessingTestId(test.id);
                              if (user?.grade) {
                                await fetchQuestions(1, 10, null, test.id, user.grade);
                                navigate(`/test/${test.id}`);
                              } else {
                                console.error("User grade not found");
                              }
                              setProcessingTestId(null);
                            }}
                            disabled={processingTestId === test.id}
                          >
                            {processingTestId === test.id
                              ? "Starting..."
                              : "Quick Start"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};