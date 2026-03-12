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
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, Sparkles, ArrowRight, Activity, Users, Globe, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen px-12 relative flex items-center justify-center overflow-hidden bg-[#0a0c10] select-none">
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

      <div className="absolute top-6 left-6 md:left-12 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 backdrop-blur-3xl transition-all duration-300 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* 🎭 LEFT BRAND UNIVERSE - HIGH-INTENSITY STORYTELLING */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <Sparkles className="h-3 w-3 text-warning animate-spin-slow" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/70">Next-Gen Intelligence</span>
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tighter text-white">
                Architect Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-primary">Future Self.</span>
              </h1>

              <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed antialiased">
                The world's most advanced learning ecosystem, designed to decode your potential through behavioral data.
              </p>
            </div>

            {/* 📊 METABOLIC LIVE PULSE CARDS */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-primary/20 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Live Scholars</p>
                <p className="text-xl font-black text-white tracking-tighter">1,284 <span className="text-[9px] text-emerald-400 tracking-normal">+12%</span></p>
              </div>

              <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-warning">
                    <Users className="h-4 w-4" />
                  </div>
                  <Globe className="h-3 w-3 text-white/20" />
                </div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Expert Mentors</p>
                <p className="text-xl font-black text-white tracking-tighter">450+</p>
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

            <Card className="w-full max-w-[400px] relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2rem] overflow-hidden group/card hover:translate-y-[-4px] hover:rotate-x-1 hover:rotate-y-[-1] transition-all duration-700 ease-out">
              {/* Inner Gloss Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>

              <CardHeader className="p-2 pb-4 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-primary to-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-[0_12px_24px_-8px_rgba(99,102,241,0.6)] transform group-hover/card:scale-105 group-hover/card:rotate-6 transition-all duration-500">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-black text-white tracking-tighter leading-none mb-2">
                  Portal Access
                </CardTitle>
                <CardDescription className="text-[9px] font-black text-white/40 uppercase tracking-[0.25em]">
                  Secure Neural Interface
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-4 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-xl animate-in fade-in zoom-in duration-300 py-2">
                      <AlertDescription className="text-[8px] font-black uppercase tracking-widest text-center">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">User Id / Email</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within/input:text-primary transition-colors text-white/20">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@ecosystem.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-12 pl-12 bg-white/[0.04] border-white/5 rounded-xl font-bold text-white text-sm placeholder:text-white/10 focus:ring-4 focus:ring-primary/20 focus:bg-white/[0.08] transition-all duration-300 border-none outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4">
                      <Label htmlFor="password" className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-[9px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within/input:text-primary transition-colors text-white/20">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 pl-12 pr-12 bg-white/[0.04] border-white/5 rounded-xl font-bold text-white text-sm placeholder:text-white/10 focus:ring-4 focus:ring-primary/20 focus:bg-white/[0.08] transition-all duration-300 border-none outline-none shadow-inner"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-white/20 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-white text-slate-900 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 group/btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Logging in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
                        Login <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center border-t border-white/5 pt-6">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    New user?
                    <Link
                      to="/get-started"
                      className="text-white hover:text-primary underline underline-offset-4 decoration-white/10 transition-all font-black"
                    >
                      Signup
                    </Link>
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
