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
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50/50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT BRAND SECTION - High Fidelity */}
          <div className="hidden lg:flex flex-col justify-center text-slate-900 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-800">
                  EdTech<span className="text-primary italic font-serif ml-1">Pro</span>
                </span>
              </div>

              <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
                Elevate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Learning Journey</span>
              </h1>

              <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
                Experience the next generation of personalized education with AI-driven insights and world-class assessments.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-md shadow-soft w-fit">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-widest text-[10px]">Secure Access</p>
                  <p className="text-xs font-bold text-slate-500 italic">Encrypted User Identity</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
                <div className="h-px w-8 bg-slate-200" />
                Empowering Scholars Worldwide
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN SECTION - Refined Glassmorphism */}
          <div className="flex items-center justify-center animate-in fade-in zoom-in duration-700">
            <Card className="w-full max-w-md glass-card border-none shadow-elegant rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4 text-center">
                <div className="mx-auto bg-slate-50 h-16 w-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-slate-100">
                  <Lock className="h-7 w-7 text-primary animate-pulse" />
                </div>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Authentication Portfolio
                </CardDescription>
              </CardHeader>

              <CardContent className="p-10 pt-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-destructive/5 border-destructive/10 text-destructive rounded-2xl animate-in fade-in slide-in-from-top-2">
                      <AlertDescription className="text-[10px] font-black uppercase tracking-widest">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Identification</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-slate-300">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-14 pl-12 bg-slate-50/50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4">
                      <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass-Key</Label>
                      <Link
                        to="/forgot-password"
                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        Recovery Option?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-slate-300">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-14 pl-12 pr-12 bg-slate-50/50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-300 hover:text-primary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group/btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                        Access Portal <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    New Scholar?
                    <Link
                      to="/get-started"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      Initialize Identity
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

