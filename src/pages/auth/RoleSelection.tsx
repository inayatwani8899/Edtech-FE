import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const RoleSelection = () => {
  const { testId, setTestId } = useAuthStore();
  const [searchParams] = useSearchParams();

  // Get testId from URL search params
  const urlTestId = searchParams.get('testId');

  useEffect(() => {
    // Set testId in store when component mounts or URL changes
    if (urlTestId) {
      setTestId(urlTestId);
    }
  }, [urlTestId, setTestId]);

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Individual learner seeking self-assessment and personal development",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      accentColor: "text-blue-600",
      features: ["Personal assessment", "Career guidance", "Skill development"],
    },
    {
      id: "counsellor",
      title: "Counselor",
      description: "Educational professional guiding students and managing assessments",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      accentColor: "text-emerald-600",
      features: ["Student management", "Assessment oversight", "Progress tracking"],
    },
    {
      id: "school",
      title: "School/Organization",
      description: "Educational institution or organization managing multiple users",
      icon: Building,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      accentColor: "text-purple-600",
      features: ["Multi-user management", "Institutional analytics", "Bulk assessments"],
    },
  ];

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-300 to-blue-300 opacity-5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-sm">
            Welcome to PathGrad
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose your role to get started on your journey with PathGrad
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="group relative cursor-pointer border border-white/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <CardHeader className="text-center pb-4 pt-8 relative z-10">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className={`text-3xl font-bold ${role.accentColor}`}>{role.title}</CardTitle>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-400 mt-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10 px-6 pb-8">
                  <ul className="space-y-3">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <div className={`w-2 h-2 bg-gradient-to-r ${role.gradient} rounded-full mr-3 flex-shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full mt-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${role.gradient} text-white hover:scale-105`}
                    size="lg"
                  >
                    <Link to={`/register/${role.id}`}>
                      Get Started as {role.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;