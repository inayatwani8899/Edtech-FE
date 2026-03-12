import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowLeft, User, Mail, Lock, Phone, Briefcase, FileText, ChevronRight, CheckCircle2, Sparkles, ArrowRight, Target, Activity, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCounselorStore } from "@/store/counsellorStore";

const CounsellorRegister = () => {
  const { createCounselor } = useCounselorStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    highestQualification: "",
    yearsOfExperience: 0,
    areaOfSpecialization: "",
    currentOrganization: "",
    professionalBio: "",
    licenseNumber: "",
    isVerified: true,
    createdBy: 0
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await createCounselor(formData);
      setIsSuccess(true);

      // Navigate to login after a brief delay so they see the success state
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0a0c10] relative flex items-center justify-center overflow-hidden select-none">
      {/* 🏠 Top-Left Navigation */}
      <div className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 backdrop-blur-3xl transition-all duration-300 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
        <div className="h-4 w-px bg-white/5" />
        <Button
          variant="ghost"
          onClick={() => navigate("/get-started")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 backdrop-blur-3xl transition-all duration-300 group"
        >
          Back
        </Button>
      </div>

      {/* 🌌 ULTRA-FLUID DYNAMIC BACKDROP */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen transition-opacity duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-sky-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 🎭 LEFT BRAND UNIVERSE */}
          <div className="hidden lg:flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <Sparkles className="h-3 w-3 text-emerald-400 animate-spin-slow" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/70">Expert counselor network</span>
              </div>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tighter text-white">
                Empower the Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400">Generation of Talent.</span>
              </h1>
              <p className="text-base text-slate-400 font-medium max-w-lg leading-relaxed antialiased">
                Join our elite professional collective to provide high-resolution guidance and behavioral diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
              <div className="h-px w-12 bg-white/5" />
              Trusted • Secure • Verified
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <Target className="h-4 w-4 text-emerald-400 mb-1.5" />
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Verified Profiles</p>
                <p className="text-xs font-black text-white tracking-tighter">Professional Audit</p>
              </div>
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="h-4 w-4 rounded-md bg-gradient-to-r from-emerald-400 to-sky-500 flex items-center justify-center text-white text-[10px] mb-1.5">✓</div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">High Engagement</p>
                <p className="text-xs font-black text-white tracking-tighter">Build Trust Fast</p>
              </div>
            </div>
          </div>

          {/* 🚀 RIGHT FORM ARCHITECTURE */}
          <div className="flex items-center justify-center perspective-1000 animate-in fade-in zoom-in duration-1000 delay-100">
            <Card className="w-full max-w-[440px] relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2rem] overflow-hidden group/card transition-all duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>

              <CardHeader className="p-5 pb-1 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-emerald-500 to-sky-500 h-11 w-11 rounded-xl flex items-center justify-center mb-3 shadow-[0_12px_24px_-8px_rgba(16,185,129,0.6)] transform group-hover/card:scale-105 group-hover/card:rotate-6 transition-all duration-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white tracking-tighter leading-none mb-1.5">
                  Counselor Registration
                </CardTitle>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/10'}`} />
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/10'}`} />
                </div>
                <CardDescription className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em]">
                  Step {step} of 2: {step === 1 ? 'Personal Information' : 'Professional Detail'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 relative z-10">
                {isSuccess ? (
                  <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tighter">Registration Complete</h2>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest max-w-[200px] mx-auto">
                      Profile created. Redirecting to login...
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={() => navigate("/login")}
                        className="h-11 w-full rounded-xl bg-white text-slate-900 font-black text-[9px] uppercase tracking-widest shadow-[0_12px_24px_-8px_rgba(255,255,255,0.3)] transition-all"
                      >
                        Login Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {step === 1 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">First Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                              <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="First Name"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Last Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                              <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Last Name"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Email Address</Label>
                          <div className="relative group/input">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="Email@domain.com"
                              required
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Confirm</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Phone Number</Label>
                          <div className="relative group/input">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              required
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Qualification</Label>
                            <Select onValueChange={(value) => handleInputChange("highestQualification", value)}>
                              <SelectTrigger className="h-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-emerald-500/20 transition-all px-3">
                                <SelectValue placeholder="Degree" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#12141c] border-white/10 text-white font-bold text-[11px] rounded-lg">
                                <SelectItem value="bachelor" className="focus:bg-emerald-500 rounded-md">Bachelor's</SelectItem>
                                <SelectItem value="master" className="focus:bg-emerald-500 rounded-md">Master's</SelectItem>
                                <SelectItem value="phd" className="focus:bg-emerald-500 rounded-md">PhD</SelectItem>
                                <SelectItem value="diploma" className="focus:bg-emerald-500 rounded-md">Diploma</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Experience</Label>
                            <Select onValueChange={(value) => handleInputChange("yearsOfExperience", Number(value))}>
                              <SelectTrigger className="h-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-emerald-500/20 transition-all px-3">
                                <SelectValue placeholder="Years" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#12141c] border-white/10 text-white font-bold text-[11px] rounded-lg">
                                <SelectItem value="0" className="focus:bg-emerald-500 rounded-md">0-1 Year</SelectItem>
                                <SelectItem value="2" className="focus:bg-emerald-500 rounded-md">2-5 Years</SelectItem>
                                <SelectItem value="6" className="focus:bg-emerald-500 rounded-md">6-10 Years</SelectItem>
                                <SelectItem value="10" className="focus:bg-emerald-500 rounded-md">10+ Years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Specialization</Label>
                          <Select onValueChange={(value) => handleInputChange("areaOfSpecialization", value)}>
                            <SelectTrigger className="h-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-emerald-500/20 transition-all px-3">
                              <SelectValue placeholder="Select Domain" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#12141c] border-white/10 text-white font-bold text-[11px] rounded-lg">
                              <SelectItem value="academic" className="focus:bg-emerald-500 rounded-md">Academic</SelectItem>
                              <SelectItem value="career" className="focus:bg-emerald-500 rounded-md">Career</SelectItem>
                              <SelectItem value="mental-health" className="focus:bg-emerald-500 rounded-md">Mental Health</SelectItem>
                              <SelectItem value="college-admission" className="focus:bg-emerald-500 rounded-md">College Admission</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Current Organization</Label>
                          <div className="relative group/input">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-emerald-400 transition-colors" />
                            <Input
                              value={formData.currentOrganization}
                              onChange={(e) => handleInputChange("currentOrganization", e.target.value)}
                              placeholder="Organization Name"
                              required
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Bio / Description</Label>
                          <Textarea
                            value={formData.professionalBio}
                            onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                            placeholder="Brief professional summary..."
                            className="bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/[0.08] transition-all duration-300 min-h-[50px] py-2"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5 pt-2">
                      {step === 1 ? (
                        <Button
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full h-11 rounded-xl bg-white text-slate-900 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 group/btn"
                        >
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em]">
                            Next Step <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      ) : (
                        <div className="flex gap-2.5">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="flex-1 h-11 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black text-[8px] uppercase tracking-widest transition-all"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] h-11 rounded-xl bg-white text-slate-900 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 group/btn"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Processing...</span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em]">
                                Register <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </div>
                      )}

                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] text-center mt-2.5">
                        Already registered?
                        <button
                          type="button"
                          className="text-white hover:text-emerald-400 transition-all font-black ml-2"
                          onClick={() => navigate('/login')}
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorRegister;