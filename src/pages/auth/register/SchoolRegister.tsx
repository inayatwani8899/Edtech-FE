import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { School, ArrowLeft, User, Mail, Lock, Phone, Globe, Calendar, MapPin, ChevronRight, Sparkles, Building2, BarChart3, Settings2, ArrowRight, CheckCircle2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SchoolRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    institutionName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institutionType: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    approxStudentCount: 0,
    website: "",
  });

  const { registerSchool } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      // Map back to what the store might expect if needed, 
      // but assuming we should update the store or this is the new standard.
      // For now, making it syntactically correct.
      const result = await registerSchool(payload);

      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Registration Successful!",
          description: "Welcome! Your school account has been created.",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error?.message || "Something went wrong.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] relative flex items-center justify-center overflow-y-auto py-12 md:py-20 lg:py-0 select-none">
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
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen transition-opacity duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-pink-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 🎭 LEFT BRAND UNIVERSE */}
          <div className="hidden lg:flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <Sparkles className="h-3 w-3 text-purple-400 animate-spin-slow" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/70">Institutional ecosystem</span>
              </div>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tighter text-white">
                Transform Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">Campus Experience.</span>
              </h1>
              <p className="text-base text-slate-400 font-medium max-w-lg leading-relaxed antialiased">
                Scale your institutional impact with advanced student management and academic optimization tools.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
              <div className="h-px w-12 bg-white/5" />
              Verified • Enterprise • Scalable
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <Building2 className="h-4 w-4 text-purple-400 mb-1.5" />
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Enterprise Ready</p>
                <p className="text-xs font-black text-white tracking-tighter">Unified Control</p>
              </div>
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="h-4 w-4 rounded-md bg-gradient-to-r from-purple-400 to-rose-500 flex items-center justify-center text-white text-[10px] mb-1.5">✓</div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Rapid Setup</p>
                <p className="text-xs font-black text-white tracking-tighter">Instant Insight</p>
              </div>
            </div>
          </div>

          {/* 🚀 RIGHT FORM ARCHITECTURE */}
          <div className="flex items-center justify-center perspective-1000 animate-in fade-in zoom-in duration-1000 delay-100">
            <Card className="w-full max-w-[440px] relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2rem] overflow-hidden group/card transition-all duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>

              <CardHeader className="p-5 pb-1 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 h-11 w-11 rounded-xl flex items-center justify-center mb-3 shadow-[0_12px_24px_-8px_rgba(168,85,247,0.6)] transform group-hover/card:scale-105 group-hover/card:rotate-6 transition-all duration-500">
                  <School className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white tracking-tighter leading-none mb-1.5">
                  School Registration
                </CardTitle>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-white/10'}`} />
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-white/10'}`} />
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-white/10'}`} />
                </div>
                <CardDescription className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em]">
                  Step {step} of 3: {step === 1 ? 'Admin Information' : step === 2 ? 'School Details' : 'Location'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 relative z-10">
                {isSuccess ? (
                  <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-purple-400 animate-bounce" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tighter">Institution Registered</h2>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest max-w-[200px] mx-auto">
                      School profile created. Redirecting to login...
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
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Admin Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                              <Input
                                value={formData.adminName}
                                onChange={(e) => handleInputChange("adminName", e.target.value)}
                                placeholder="Admin Name"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Phone</Label>
                            <div className="relative group/input">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                              <Input
                                value={formData.contactNumber}
                                onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Email Address</Label>
                          <div className="relative group/input">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="school@example.com"
                              required
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Confirm</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Institution Name</Label>
                          <div className="relative group/input">
                            <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                            <Input
                              value={formData.institutionName}
                              onChange={(e) => handleInputChange("institutionName", e.target.value)}
                              placeholder="Full School Name"
                              required
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Type</Label>
                            <Select onValueChange={(value) => handleInputChange("institutionType", value)}>
                              <SelectTrigger className="h-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-purple-500/20 px-3">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#12141c] border-white/10 text-white font-bold text-[11px] rounded-lg">
                                <SelectItem value="private" className="focus:bg-purple-500 rounded-md">Private</SelectItem>
                                <SelectItem value="government" className="focus:bg-purple-500 rounded-md">Government</SelectItem>
                                <SelectItem value="semi-government" className="focus:bg-purple-500 rounded-md">Semi-Gov</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Students</Label>
                            <Input
                              type="number"
                              onChange={(e) => handleInputChange("approxStudentCount", Number(e.target.value))}
                              placeholder="Total"
                              className="h-9 px-3 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Website (Optional)</Label>
                          <div className="relative group/input">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-purple-400 transition-colors" />
                            <Input
                              value={formData.website}
                              onChange={(e) => handleInputChange("website", e.target.value)}
                              placeholder="https://www.school.com"
                              className="h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Country</Label>
                            <Input
                              value={formData.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              placeholder="Country"
                              required
                              className="h-9 px-3 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">State</Label>
                            <Input
                              value={formData.state}
                              onChange={(e) => handleInputChange("state", e.target.value)}
                              placeholder="State"
                              required
                              className="h-9 px-3 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">City</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="City"
                            required
                            className="h-9 px-3 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Address</Label>
                          <Textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Complete address..."
                            required
                            className="bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-purple-500/20 focus:bg-white/[0.08] transition-all duration-300 min-h-[50px] py-1.5"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5 pt-2">
                      <div className="flex gap-2.5">
                        {step > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 h-11 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black text-[8px] uppercase tracking-widest transition-all"
                          >
                            Back
                          </Button>
                        )}
                        <Button
                          type={step === 3 ? "submit" : "button"}
                          onClick={() => step < 3 && setStep(step + 1)}
                          disabled={isLoading}
                          className="flex-[2] h-11 rounded-xl bg-white text-slate-900 shadow-[0_12px_24px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 group/btn"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Processing...</span>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
                              {step === 3 ? 'Register' : 'Next Step'} <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </div>

                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] text-center mt-2.5">
                        Already have account?
                        <button
                          type="button"
                          className="text-white hover:text-purple-400 transition-all font-black ml-2"
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

export default SchoolRegister;