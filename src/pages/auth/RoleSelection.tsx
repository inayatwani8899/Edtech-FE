import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building, ArrowLeft, Sparkles, ChevronRight, Activity, Target, Shield } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const RoleSelection = () => {
  const { setTestId } = useAuthStore();
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
      subtitle: "Personalized Growth",
      description: "Define your path with data-driven career assessments.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      accentColor: "text-blue-400",
      features: ["Career Roadmap", "Skill Gap Analysis"],
      statsColor: "text-blue-400",
      badgeText: "Self-Paced Learning",
      iconAlt: Activity
    },
    {
      id: "counsellor",
      title: "Counselor",
      subtitle: "Expert Guidance",
      description: "Empower students via advanced behavioral oversight.",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      accentColor: "text-emerald-400",
      features: ["Student Metrics", "session Mgmt"],
      statsColor: "text-emerald-400",
      badgeText: "Professional Audit",
      iconAlt: Target
    },
    {
      id: "school",
      title: "Organization",
      subtitle: "Strategic Control",
      description: "Institutional intelligence for high-scale environments.",
      icon: Building,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      accentColor: "text-purple-400",
      features: ["Batch Analytics", "Admin Console"],
      statsColor: "text-purple-400",
      badgeText: "Enterprise Ready",
      iconAlt: Shield
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] relative flex items-center justify-center overflow-hidden select-none">
      {/* 🌌 ULTRA-FLUID DYNAMIC BACKDROP (Parity with Login) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[160px] animate-pulse mix-blend-screen transition-opacity duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10 w-full max-w-6xl animate-in fade-in duration-1000 py-4">

        {/* 🏠 Top-Left Navigation */}
        <div className="absolute top-6 left-6 md:left-12 z-50">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 backdrop-blur-3xl transition-all duration-300 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        {/* Header - Matching Login Parity */}
        <div className="text-center mb-6 space-y-3">
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
              <Sparkles className="h-3 w-3 text-warning animate-spin-slow" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/70">identity gateway</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-[1.05] tracking-tighter text-white">
            Define Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-primary">Ecosystem Role.</span>
          </h1>

          <p className="text-[11px] md:text-xs text-slate-400 font-medium max-w-md mx-auto leading-relaxed antialiased">
            Choose your interaction model to initialize your experience.
          </p>

          <div className="pt-2">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              Already have an account?
              <Link
                to="/login"
                className="text-white hover:text-primary underline underline-offset-4 decoration-white/10 transition-all font-black"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Role Cards - Optimized for screen fit */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 w-full max-w-5xl mx-auto mb-6 perspective-1000">
          {roles.map((role) => {
            const Icon = role.icon;
            const IconAlt = role.iconAlt;
            return (
              <Card
                key={role.id}
                className="group relative cursor-pointer bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.2rem] overflow-hidden hover:translate-y-[-8px] hover:rotate-x-2 transition-all duration-700 ease-out flex flex-col h-full"
              >
                {/* Radiant Halo Effect (Parity with Login) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none z-0"></div>

                <CardHeader className="text-center pb-2 pt-6 relative z-10 space-y-2">
                  <div className={`mx-auto bg-gradient-to-tr ${role.gradient} h-14 w-14 rounded-2xl flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${role.statsColor}`}>{role.badgeText}</span>
                    </div>
                    <CardTitle className="text-xl font-black text-white tracking-tighter leading-none mb-1">
                      {role.title}
                    </CardTitle>
                    <CardDescription className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                      {role.subtitle}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10 px-6 pb-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-center text-slate-400 text-[11px] font-medium leading-relaxed mb-4 line-clamp-2">
                      {role.description}
                    </p>

                    <div className="flex flex-col gap-1.5 mb-6">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.05] transition-colors duration-300">
                          <IconAlt className={`h-2.5 w-2.5 ${role.statsColor}`} />
                          <span className="text-[9px] font-bold text-white/70 tracking-wide uppercase">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={`/register/${role.id}`}>
                    <Button
                      className={`w-full h-12 rounded-2xl font-black text-[9px] uppercase tracking-[0.25em] transition-all duration-500 bg-white text-slate-900 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.2)] hover:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      Initialize <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;


