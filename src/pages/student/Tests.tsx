// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Brain,
//   Clock,
//   Users,
//   Target,
//   Lightbulb,
//   Briefcase,
//   Search,
//   Filter,
//   Play,
//   CheckCircle2,
//   BarChart3,
//   Star,
//   TrendingUp,
//   Heart
// } from "lucide-react";
// import { useTestStore } from "@/store/testStore";
// import { usePaymentStore } from "@/store/paymentStore";
// import { useAuthStore } from "@/store/useAuthStore";

// const allTests = [
//   {
//     id: "1",
//     title: "Cognitive Aptitude Assessment",
//     description: "Comprehensive evaluation of verbal, numerical, and logical reasoning abilities. Designed to measure your problem-solving skills and cognitive processing speed.",
//     type: "aptitude",
//     category: "Cognitive",
//     duration: 45,
//     questions: 60,
//     difficulty: "intermediate",
//     completed: false,
//     progress: 0,
//     icon: Brain,
//     color: "bg-primary",
//     rating: 4.8,
//     participants: 25420,
//     tags: ["Reasoning", "Problem Solving", "Logic"]
//   },
//   {
//     id: "2",
//     title: "Big Five Personality Assessment",
//     description: "Discover your personality across five key dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.",
//     type: "personality",
//     category: "Personality",
//     duration: 30,
//     questions: 120,
//     difficulty: "beginner",
//     completed: true,
//     progress: 100,
//     icon: Users,
//     color: "bg-secondary",
//     rating: 4.9,
//     participants: 42150,
//     tags: ["Big Five", "Traits", "Behavior"]
//   },
//   {
//     id: "3",
//     title: "Career Interest Inventory (RIASEC)",
//     description: "Identify your professional interests using Holland's RIASEC model to find careers that match your preferences and motivations.",
//     type: "interest",
//     category: "Career",
//     duration: 25,
//     questions: 90,
//     difficulty: "beginner",
//     completed: false,
//     progress: 60,
//     icon: Target,
//     color: "bg-accent",
//     rating: 4.7,
//     participants: 31280,
//     tags: ["Career", "Interests", "RIASEC"]
//   },
//   {
//     id: "4",
//     title: "Emotional Intelligence Assessment",
//     description: "Measure your ability to recognize, understand, and manage emotions in yourself and others. Critical for leadership and interpersonal success.",
//     type: "emotional-intelligence",
//     category: "Emotional",
//     duration: 35,
//     questions: 75,
//     difficulty: "intermediate",
//     completed: false,
//     progress: 0,
//     icon: Heart,
//     color: "bg-warning",
//     rating: 4.6,
//     participants: 18970,
//     tags: ["EQ", "Emotions", "Leadership"]
//   },
//   {
//     id: "5",
//     title: "Professional Skills Assessment",
//     description: "Evaluate your workplace competencies including communication, teamwork, problem-solving, and technical skills for your industry.",
//     type: "professional",
//     category: "Professional",
//     duration: 40,
//     questions: 85,
//     difficulty: "advanced",
//     completed: false,
//     progress: 0,
//     icon: Briefcase,
//     color: "bg-destructive",
//     rating: 4.5,
//     participants: 12450,
//     tags: ["Skills", "Workplace", "Competency"]
//   },
//   {
//     id: "6",
//     title: "Creative Thinking Assessment",
//     description: "Assess your creative problem-solving abilities, innovative thinking patterns, and artistic/creative intelligence.",
//     type: "aptitude",
//     category: "Creative",
//     duration: 35,
//     questions: 50,
//     difficulty: "intermediate",
//     completed: false,
//     progress: 0,
//     icon: Lightbulb,
//     color: "bg-accent",
//     rating: 4.4,
//     participants: 8760,
//     tags: ["Creativity", "Innovation", "Art"]
//   }
// ];

// const categories = ["All", "Cognitive", "Personality", "Career", "Emotional", "Professional", "Creative"];
// const difficulties = ["All", "beginner", "intermediate", "advanced"];

// export const Tests = () => {
//   const { handlePayment, loading, paidTests, isTestPaid } = usePaymentStore(); // Get handlePayment and loading state from store
//   const { user } = useAuthStore();
//   const [greeting, setGreeting] = useState("");
//   const [processingTestId, setProcessingTestId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedDifficulty, setSelectedDifficulty] = useState("All");
//   const [activeTab, setActiveTab] = useState("all");
//   const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
//   const { getPublishedTests, publishedTests } = useTestStore();
//   useEffect(() => {
//     const fetchPaidStatus = async () => {
//       if (!user?.id || !publishedTests?.length) return;

//       const statuses: Record<string, boolean> = {};
//       for (const test of publishedTests) {
//         const result = await isTestPaid(user.id, test.id);
//         statuses[test.id] = result;
//       }
//       setPaidStatus(statuses);
//     };

//     fetchPaidStatus();
//   }, [user?.id, publishedTests]);

//   useEffect(() => {
//     getPublishedTests();
//   }, [getPublishedTests])
//   const filteredTests = allTests.filter(test => {
//     const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       test.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

//     const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
//     const matchesDifficulty = selectedDifficulty === "All" || test.difficulty === selectedDifficulty;

//     const matchesTab = activeTab === "all" ||
//       (activeTab === "completed" && test.completed) ||
//       (activeTab === "in-progress" && test.progress > 0 && !test.completed) ||
//       (activeTab === "available" && test.progress === 0);

//     return matchesSearch && matchesCategory && matchesDifficulty && matchesTab;
//   });

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "beginner": return "bg-success/10 text-success border-success/20";
//       case "intermediate": return "bg-warning/10 text-warning border-warning/20";
//       case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
//       default: return "bg-muted/10 text-muted-foreground border-muted/20";
//     }
//   };

//   const getTestStats = () => {
//     const completed = allTests.filter(t => t.completed).length;
//     const inProgress = allTests.filter(t => t.progress > 0 && !t.completed).length;
//     const available = allTests.filter(t => t.progress === 0).length;
//     return { completed, inProgress, available, total: publishedTests.length };
//   };

//   const stats = getTestStats();

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Center</h1>
//           <p className="text-muted-foreground">
//             Explore our comprehensive collection of psychometric assessments designed to help you understand your potential.
//           </p>
//         </div>

//         {/* Stats Overview */}
//         {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <Card className="text-center">
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-primary">{stats.total}</div>
//               <p className="text-sm text-muted-foreground">Total Tests</p>
//             </CardContent>
//           </Card>
//           <Card className="text-center">
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-success">{stats.completed}</div>
//               <p className="text-sm text-muted-foreground">Completed</p>
//             </CardContent>
//           </Card>
//           <Card className="text-center">
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
//               <p className="text-sm text-muted-foreground">In Progress</p>
//             </CardContent>
//           </Card>
//           <Card className="text-center">
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-muted-foreground">{stats.available}</div>
//               <p className="text-sm text-muted-foreground">Available</p>
//             </CardContent>
//           </Card>
//         </div> */}

//         {/* Filters */}
//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Filter className="h-5 w-5 mr-2" />
//               Filter Tests
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search tests by name, description, or tags..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                 <SelectTrigger className="w-full md:w-[400px]">
//                   <SelectValue placeholder="Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map(category => (
//                     <SelectItem key={category} value={category}>{category}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {/* <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <SelectValue placeholder="Difficulty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {difficulties.map(difficulty => (
//                     <SelectItem key={difficulty} value={difficulty}>
//                       {difficulty === "All" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select> */}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Test Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
//           {/* <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="all">All Tests</TabsTrigger>
//             <TabsTrigger value="available">Available</TabsTrigger>
//             <TabsTrigger value="in-progress">In Progress</TabsTrigger>
//             <TabsTrigger value="completed">Completed</TabsTrigger>
//           </TabsList> */}

//           <TabsContent value={activeTab} className="mt-6">
//             {filteredTests.length === 0 ? (
//               <Card className="text-center py-12">
//                 <CardContent>
//                   <div className="text-muted-foreground">
//                     <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                     <h3 className="text-lg font-medium mb-2">No tests found</h3>
//                     <p>Try adjusting your search criteria or filters.</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-6">
//                 {publishedTests.map((test) => {
//                   const Icon = test.icon;
//                   return (
//                     <Card key={test.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
//                       <div className={`h-1 w-full ${test.color}`} />
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start space-x-4 flex-1">
//                             <div className={`p-4 rounded-xl ${test.color}/10 group-hover:${test.color}/20 transition-colors`}>
//                               {/* <Icon className={`h-8 w-8 ${test.color?.replace('bg-', 'text-')}`} /> */}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <CardTitle className="text-xl group-hover:text-primary transition-colors">
//                                   {test.title}
//                                 </CardTitle>
//                                 <Badge variant="outline" className="text-xs">
//                                   {test.category}
//                                 </Badge>
//                               </div>
//                               <CardDescription className="text-base mb-4">
//                                 {test.description}
//                               </CardDescription>

//                               <div className="flex flex-wrap items-center gap-4 mb-3">
//                                 <div className="flex items-center text-sm text-muted-foreground">
//                                   <Clock className="h-4 w-4 mr-1" />
//                                   {test.timeDuration} min
//                                 </div>
//                                 {/* <div className="flex items-center text-sm text-muted-foreground">
//                                   <BarChart3 className="h-4 w-4 mr-1" />
//                                   {test.questions} questions
//                                 </div> */}
//                                 <div className="flex items-center text-sm text-muted-foreground">
//                                   <Users className="h-4 w-4 mr-1" />
//                                   {test?.participants?.toLocaleString()} taken
//                                 </div>
//                                 <div className="flex items-center text-sm text-muted-foreground">
//                                   <Star className="h-4 w-4 mr-1 fill-current text-warning" />
//                                   {test?.rating}
//                                 </div>
//                               </div>

//                               <div className="flex flex-wrap gap-2 mb-4">
//                                 {/* <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
//                                   {test.difficulty}
//                                 </Badge> */}
//                                 {test.completed && (
//                                   <Badge variant="outline" className="bg-success/10 text-success border-success/20">
//                                     <CheckCircle2 className="h-3 w-3 mr-1" />
//                                     Completed
//                                   </Badge>
//                                 )}
//                                 {test.progress > 0 && !test.completed && (
//                                   <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
//                                     <TrendingUp className="h-3 w-3 mr-1" />
//                                     {test.progress}% Complete
//                                   </Badge>
//                                 )}
//                                 {test?.tags?.map(tag => (
//                                   <Badge key={tag} variant="secondary" className="text-xs">
//                                     {tag}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                           {/* ✅ Conditional Button */}
//                           {!user ? (
//                             <Button asChild size="sm">
//                               <Link to="/login">Login to Purchase</Link>
//                             </Button>
//                           ) : paidStatus[test.id] ? (
//                             <Button asChild size="sm">
//                               <Link to={`/test/${test.id}`}>Start Assessment</Link>
//                             </Button>
//                           ) : (
//                             <Button
//                               size="sm"
//                               onClick={async () => {
//                                 setProcessingTestId(test.id);
//                                 const result = await handlePayment(test);
//                                 if (result.success && user?.id) {
//                                   setPaidStatus((prev) => ({ ...prev, [test.id]: true }));
//                                 }
//                                 setProcessingTestId(null);
//                               }}
//                               disabled={processingTestId === test.id}
//                             >
//                               {processingTestId === test.id
//                                 ? "Processing..."
//                                 : `Buy Now - ₹${test.price}`}
//                             </Button>
//                           )}
//                           {/* {paidTests[test.id] ? (
//                             <Button size="sm" variant={test.completed ? "outline" : "default"} asChild>
//                               <Link to={`/test/${test.id}`}>
//                                 <span>Start Assessment</span>
//                               </Link>
//                             </Button>
//                           ) : (
//                             <Button
//                               size="sm"
//                               variant={test.completed ? "outline" : "default"}
//                               onClick={async () => {
//                                 setProcessingTestId(test.id);
//                                 const result = await handlePayment(test);
//                                 setProcessingTestId(null);
//                               }}
//                               disabled={processingTestId === test.id || loading}
//                             >
//                               {processingTestId === test.id || loading ? "Processing..." : "Make Payment"}
//                             </Button>
//                           )} */}
//                           {/* {paidTests[test.id] ? (
//                             <Button asChild size="sm">
//                               <Link to={`/test/${test.id}`}>Start Assessment</Link>
//                             </Button>
//                           ) : (
//                             <Button
//                               size="sm"
//                               onClick={async () => {
//                                 setProcessingTestId(test.id);
//                                 const result = await handlePayment(test);
//                                 setProcessingTestId(null);
//                               }}
//                               disabled={processingTestId === test.id}
//                             >
//                               {processingTestId === test.id ? "Processing..." : "Buy Now"}
//                             </Button>
//                           )} */}
//                           {/* {user?.id && (isTestPaid(user.id, test.id)) ? (
//                             <Button asChild size="sm">
//                               <Link to={`/test/${test.id}`}>Start Assessment</Link>
//                             </Button>
//                           ) : !user ? (
//                             <Button asChild size="sm">
//                               <Link to="/login">Login to Purchase</Link>
//                             </Button>
//                           ) : (
//                             <Button
//                               size="sm"
//                               onClick={async () => {
//                                 setProcessingTestId(test.id);
//                                 const result = await handlePayment(test);
//                                 setProcessingTestId(null);
//                               }}
//                               disabled={processingTestId === test.id}
//                             >
//                               {processingTestId === test.id ? "Processing..." : `Buy Now - ₹${test.price}`}
//                             </Button>
//                           )} */}
//                           {/* <div className="flex flex-col items-end space-y-3 ml-4">
//                             <Button
//                               size="default"
//                               variant={test.completed ? "outline" : "default"}
//                               className="min-w-[140px]"
//                               asChild
//                             >
//                               <Link to={`/test/${test.id}`}>
//                                 {test.paymentStatus==="Paid" ? (
//                                   <>
//                                    <Play className="h-4 w-4 mr-2" />
//                                     Start Test
//                                   </>
//                                 ) :  (
//                                   <>
//                                     <Play className="h-4 w-4 mr-2" />
//                                     Make Payment
//                                   </>
//                                 )}
//                               </Link>
//                             </Button>
//                             {test.progress > 0 && !test.completed && (
//                               <div className="text-center">
//                                 <div className="text-sm font-medium text-warning mb-1">{test.progress}%</div>
//                                 <div className="w-20 bg-muted rounded-full h-2">
//                                   <div
//                                     className="bg-warning h-2 rounded-full transition-all"
//                                     style={{ width: `${test.progress}%` }}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div> */}
//                         </div>
//                       </CardHeader>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart
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
  const { getPublishedTests, publishedTests, fetchQuestions } = useTestStore();
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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Center</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of psychometric assessments designed to help you understand your potential.
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
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tests by name, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[400px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "All" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
                </div>
              </CardContent>
            </Card>
          </>
        )

        }


        {/* Test Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          {/* <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList> */}

          <TabsContent value={activeTab} className="mt-6">
            {publishedTests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No active tests found</h3>
                    <p>Contact administrator for more information.</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredTests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No tests found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {publishedTests.map((test) => {
                  const Icon = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
                      <div className={`h-1 w-full ${test.color}`} />
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`p-4 rounded-xl ${test.color}/10 group-hover:${test.color}/20 transition-colors`}>
                              {/* <Icon className={`h-8 w-8 ${test.color?.replace('bg-', 'text-')}`} /> */}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                  {test.title}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {test.category}
                                </Badge>
                              </div>
                              <CardDescription className="text-base mb-4">
                                {test.description}
                              </CardDescription>

                              <div className="flex flex-wrap items-center gap-4 mb-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {test.timeDuration} min
                                </div>
                                {/* <div className="flex items-center text-sm text-muted-foreground">
                                  <BarChart3 className="h-4 w-4 mr-1" />
                                  {test.questions} questions
                                </div> */}
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Users className="h-4 w-4 mr-1" />
                                  {test?.participants?.toLocaleString()} taken
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 mr-1 fill-current text-warning" />
                                  {test?.rating}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {/* <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                                  {test.difficulty}
                                </Badge> */}
                                {test.completed && (
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                                {test.progress > 0 && !test.completed && (
                                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {test.progress}% Complete
                                  </Badge>
                                )}
                                {test?.tags?.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
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
                                if (user?.grade) {
                                  await fetchQuestions(1, 10, null, test.id, user.grade);
                                  navigate(`/test/${test.id}`);
                                } else {
                                  // Fallback if grade is missing, though unlikely for a logged in student
                                  console.error("User grade not found");
                                }
                                setProcessingTestId(null);
                              }}
                              disabled={processingTestId === test.id}
                            >
                              {processingTestId === test.id
                                ? "Processing..."
                                : "Start Now"}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};