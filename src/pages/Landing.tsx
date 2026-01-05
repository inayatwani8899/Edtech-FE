import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Clock,
  Award,
  BarChart3,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Star,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Assessment",
    description: "Cutting-edge AI algorithms provide deep insights into cognitive abilities and personality traits."
  },
  {
    icon: Users,
    title: "Multi-Role Platform",
    description: "Designed for students, professionals, educators, and HR teams with role-specific features."
  },
  {
    icon: TrendingUp,
    title: "Adaptive Testing",
    description: "Tests adapt to your skill level, ensuring accurate and efficient assessment."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level security with GDPR compliance ensures your data remains protected."
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive reports with actionable insights and career recommendations."
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get immediate feedback with AI-generated reports and recommendations."
  }
];

const testTypes = [
  {
    title: "Aptitude Tests",
    description: "Verbal, numerical, and logical reasoning assessments",
    icon: Target,
    color: "bg-primary"
  },
  {
    title: "Personality Assessment",
    description: "Big Five traits and MBTI-style personality profiling",
    icon: Users,
    color: "bg-secondary"
  },
  {
    title: "Interest Inventory",
    description: "Holland's Code (RIASEC) career interest mapping",
    icon: Lightbulb,
    color: "bg-accent"
  },
  {
    title: "Emotional Intelligence",
    description: "Self-awareness, empathy, and emotional regulation",
    icon: Brain,
    color: "bg-warning"
  }
];

const benefits = [
  "Scientifically validated assessments",
  "AI-powered personalized recommendations",
  "Real-time progress tracking",
  "Career guidance and counseling support",
  "Industry-specific professional assessments",
  "Comprehensive reporting dashboard"
];

export const Landing = () => {
  const navigate = useNavigate();
  const { getPublicPublishedTests, publicPublishedTests } = useTestStore();

  useEffect(() => {
    getPublicPublishedTests();
  }, [getPublicPublishedTests]);

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "No time limit";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      General: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Math: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Science: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      English: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Technology: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Assessment Platform
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Unlock Your{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Potential
                  </span>{" "}
                  with Smart Testing
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Comprehensive psychometric assessments powered by AI. Discover your strengths,
                  understand your personality, and get personalized career recommendations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="shadow-elegant" asChild>
                  <Link to="/login">
                    Take a Test
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="counselors">Talk to our Counselors</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Instant results
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full animate-float"></div>
              <img
                src={heroImage}
                alt="People taking psychometric assessments"
                className="relative z-10 rounded-2xl shadow-elegant w-full h-auto animate-scale-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      {publicPublishedTests ? (
        publicPublishedTests?.length > 0 && (
          <section id="featured-tests" className="pt-1 pb-2 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-16">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-4xl font-bold">Featured Tests</h2>
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Start your assessment journey with our most popular tests. Carefully crafted
                  to provide meaningful insights into your abilities and personality.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicPublishedTests.map((test) => (
                  <Card
                    key={test.id}
                    className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className={getCategoryColor(test.category)}>
                          {test.category}
                        </Badge>
                        {test.isPublished === true && (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Star className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {test.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 mt-2">
                        {test.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        {/* <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDuration(test.timeDuration)}</span>
                        </div> */}

                        {/* <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>
                          {test.totalQuestionsPerPage > 0
                            ? `${test.totalQuestionsPerPage} questions`
                            : "Multiple questions"}
                        </span>
                      </div> */}

                        {test?.completions > 0 && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{test?.completions} completions</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full group"
                        size="lg"
                        asChild
                      >
                        <Link to={`/get-started?testId=${test?.id}`}>
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {publicPublishedTests.length > 3 && (
                <div className="text-center mt-12">
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/tests">
                      View All Tests
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )) :
        (
          // Skeleton / Loading State
          <section className="pt-1 pb-2 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-72 w-full rounded-lg"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Why Choose PathGrad?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with scientific rigor to deliver
              the most accurate and insightful psychometric assessments available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Test Types Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Comprehensive Test Battery</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our scientifically validated assessments cover all aspects of psychological measurement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testTypes.map((test, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-elegant transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 ${test.color}`}></div>
                <CardHeader className="text-center">
                  <div className={`h-16 w-16 rounded-full ${test.color}/10 flex items-center justify-center mx-auto mb-4`}>
                    <test.icon className={`h-8 w-8 ${test.color.replace('bg-', 'text-')}`} />
                  </div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{test.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-2 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Everything You Need for Success</h2>
                <p className="text-xl text-muted-foreground">
                  Our comprehensive platform provides all the tools you need to understand
                  yourself better and make informed career decisions.
                </p>
              </div>

              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    localStorage.removeItem("testId");
                    localStorage.removeItem("testFlowActive");
                    navigate("/get-started");
                  }}
                >
                  Get Started Today
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center space-y-2">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Assessments Completed</div>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-muted-foreground">AI Support</div>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <div className="text-3xl font-bold text-warning">4.9/5</div>
                <div className="text-muted-foreground">User Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl font-bold">Ready to Discover Your Potential?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of individuals who have already unlocked their potential
            with our AI-powered psychometric assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="shadow-lg" asChild>
              <Link to="/tests">
                <Award className="mr-2 h-5 w-5" />
                Explore All Tests
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-secondary text-secondary" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};