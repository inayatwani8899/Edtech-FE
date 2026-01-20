import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, Sparkles, ArrowRight, Activity, Users, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "../../store/useAuthStore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0c10] select-none">
      {/* 🌌 ULTRA-FLUID DYNAMIC BACKDROP */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[160px] animate-pulse mix-blend-screen transition-opacity duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>

        {/* Animated Particles Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-1 w-1 bg-white rounded-full top-[20%] left-[30%] animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute h-1 w-1 bg-white rounded-full top-[60%] left-[80%] animate-ping" style={{ animationDuration: '4s' }}></div>
          <div className="absolute h-1 w-1 bg-white rounded-full top-[10%] left-[70%] animate-ping" style={{ animationDuration: '5s' }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-24 items-center">

          {/* 🎭 LEFT BRAND UNIVERSE - HIGH-INTENSITY STORYTELLING */}
          <div className="hidden lg:flex flex-col justify-center space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <Sparkles className="h-4 w-4 text-warning animate-spin-slow" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/70">Next-Gen Intelligence</span>
              </div>

              <h1 className="text-7xl font-black leading-[1.05] tracking-tighter text-white">
                Architect Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-primary">Future Self.</span>
              </h1>

              <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed antialiased">
                The world's most advanced learning ecosystem, designed to decode your potential through behavioral data.
              </p>
            </div>

            {/* 📊 METABOLIC LIVE PULSE CARDS */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Live Scholars</p>
                <p className="text-2xl font-black text-white tracking-tighter">1,284 <span className="text-[10px] text-emerald-400 tracking-normal">+12%</span></p>
              </div>

              <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-warning">
                    <Users className="h-5 w-5" />
                  </div>
                  <Globe className="h-4 w-4 text-white/20" />
                </div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Expert Mentors</p>
                <p className="text-2xl font-black text-white tracking-tighter">450+</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
              <div className="h-px w-12 bg-white/10" />
              Trusted by Elite Institutions
            </div>
          </div>

          {/* 🚀 RIGHT LOGIN ARCHITECTURE - 3D RADIANT GLASS */}
          <div className="flex items-center justify-center perspective-1000 animate-in fade-in zoom-in duration-1000 delay-100">
            {/* RADIANT HALO EFFECT */}
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-50 z-0 scale-75"></div>

            <Card className="w-full max-w-[440px] relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden group/card hover:translate-y-[-8px] hover:rotate-x-2 hover:rotate-y-[-2] transition-all duration-700 ease-out">
              {/* Inner Gloss Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>

              <CardHeader className="p-10 pb-6 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-primary to-blue-600 h-20 w-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_12px_24px_-8px_rgba(99,102,241,0.6)] transform group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-4xl font-black text-white tracking-tighter leading-none mb-3">
                  Portal Access
                </CardTitle>
                <CardDescription className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">
                  Secure Neural Interface
                </CardDescription>
              </CardHeader>

              <CardContent className="p-10 pt-6 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <Alert className="bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-2xl animate-in fade-in zoom-in duration-300">
                      <AlertDescription className="text-[9px] font-black uppercase tracking-widest text-center">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-5">Identity Hash</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within/input:text-primary transition-colors text-white/20">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@ecosystem.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-16 pl-14 bg-white/[0.04] border-white/5 rounded-[1.5rem] font-bold text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/20 focus:bg-white/[0.08] transition-all duration-300 border-none outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-5">
                      <Label htmlFor="password" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Secret Key</Label>
                      <Link
                        to="/forgot-password"
                        className="text-[9px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Override Path?
                      </Link>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within/input:text-primary transition-colors text-white/20">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-16 pl-14 pr-14 bg-white/[0.04] border-white/5 rounded-[1.5rem] font-bold text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/20 focus:bg-white/[0.08] transition-all duration-300 border-none outline-none shadow-inner"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent text-white/20 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-[1.5rem] bg-white text-slate-900 shadow-[0_20px_40px_-12px_rgba(255,255,255,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 group/btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Hydrating Interface...</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em]">
                        Initialize Session <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-12 text-center border-t border-white/5 pt-10">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] flex items-center justify-center gap-3">
                    Unauthorized Scholar?
                    <Link
                      to="/get-started"
                      className="text-white hover:text-primary underline underline-offset-8 decoration-white/10 transition-all font-black"
                    >
                      Establish Presence
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* 🚀 FIXED FOOTER SLOGAN */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="px-6 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
            Secured by EdTech Quantum Infrastructure &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
};
