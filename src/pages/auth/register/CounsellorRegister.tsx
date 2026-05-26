import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowLeft, User, Mail, Lock, Phone, Briefcase, FileText, ChevronRight, CheckCircle2, Sparkles, ArrowRight, Target, Activity, Shield, Loader2 } from "lucide-react";
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Required";
      if (!formData.lastName.trim()) newErrors.lastName = "Required";

      if (!formData.email) newErrors.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

      if (!formData.password) newErrors.password = "Required";
      else if (formData.password.length < 6) newErrors.password = "Min 6 characters";

      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch";

      if (!formData.phone) newErrors.phone = "Required";
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Must be 10 digits";
    }

    if (currentStep === 2) {
      if (!formData.highestQualification) newErrors.highestQualification = "Required";
      if (!formData.areaOfSpecialization) newErrors.areaOfSpecialization = "Required";
      if (!formData.currentOrganization.trim()) newErrors.currentOrganization = "Required";
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please check all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsLoading(true);
    try {
      // Create a payload that matches exactly what the backend expects
      const { confirmPassword, ...payload } = formData;

      // Ensure numeric and boolean fields are correctly typed
      const backendPayload = {
        ...payload,
        yearsOfExperience: Number(formData.yearsOfExperience),
        isVerified: true, // As specified in the schema
        createdBy: 0     // As specified in the schema
      };

      await createCounselor(backendPayload);
      setIsSuccess(true);

      // Navigate to login after a brief delay so they see the success state
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      // Error handled by axios interceptor
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong during registration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field === "phone") {
      const cleaned = value.toString().replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => {
        const up = { ...prev };
        delete up[field];
        return up;
      });
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] text-zinc-900 relative flex items-center justify-center overflow-y-auto py-12 md:py-20 lg:py-0 select-none font-sans">
      
      {/* Subtle radial dot grid pattern from Landing Page */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(circle, #d1d1d6 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        opacity: 0.4
      }} />

      {/* 🏠 Top-Left Navigation */}
      <div className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 backdrop-blur-md transition-all duration-300 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Home
        </Link>
        <div className="h-4 w-px bg-zinc-200" />
        <Button
          variant="ghost"
          onClick={() => navigate("/get-started")}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 backdrop-blur-md transition-all duration-300 group"
        >
          Back
        </Button>
      </div>

      {/* 🌌 Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] animate-pulse mix-blend-multiply" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[150px] animate-pulse mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* 🎭 LEFT BRAND UNIVERSE */}
          <div className="hidden lg:flex flex-col justify-center space-y-5 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] border border-indigo-100 self-start shadow-sm">
                <Sparkles className="h-3 w-3 text-[#6366f1] animate-pulse" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#6366f1]">Expert counselor network</span>
              </div>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-zinc-900">
                Empower the Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-black">Generation of Talent.</span>
              </h1>
              <p className="text-base text-zinc-500 font-medium max-w-lg leading-relaxed antialiased">
                Join our elite professional collective to provide high-resolution guidance and behavioral diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">
              <div className="h-px w-12 bg-zinc-200" />
              Trusted • Secure • Verified
            </div>

            <div className="grid grid-cols-2 gap-3.5 max-w-md">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:bg-zinc-50/50 transition-all duration-300">
                <Target className="h-4.5 w-4.5 text-[#6366f1] mb-1.5" />
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Verified Profiles</p>
                <p className="text-xs font-black text-zinc-800 tracking-tight">Professional Audit</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:bg-zinc-50/50 transition-all duration-300">
                <div className="h-4.5 w-4.5 rounded bg-[#6366f1] flex items-center justify-center text-white text-[10px] mb-1.5">✓</div>
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">High Engagement</p>
                <p className="text-xs font-black text-zinc-800 tracking-tight">Build Trust Fast</p>
              </div>
            </div>
          </div>

          {/* 🚀 RIGHT FORM ARCHITECTURE */}
          <div className="flex items-center justify-center perspective-1000 animate-in fade-in zoom-in duration-1000 delay-100">
            <Card className="w-full max-w-[440px] relative z-10 bg-white border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden group/card transition-all duration-700 ease-out">
              
              <CardHeader className="p-5 pb-1 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 h-11 w-11 rounded-xl flex items-center justify-center mb-3 shadow-[0_4px_14px_rgba(99,102,241,0.35)] transform group-hover/card:scale-105 transition-all duration-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-zinc-900 tracking-tight leading-none mb-1.5">
                  Counselor Registration
                </CardTitle>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-zinc-200'}`} />
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-zinc-200'}`} />
                </div>
                <CardDescription className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                  Step {step} of 2: {step === 1 ? 'Personal Information' : 'Professional Detail'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 relative z-10">
                {isSuccess ? (
                  <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-505">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                    </div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Registration Complete</h2>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest max-w-[200px] mx-auto">
                      Profile created. Redirecting to login...
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={() => navigate("/login")}
                        className="h-11 w-full rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-[9px] uppercase tracking-widest shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all border-none"
                      >
                        Login Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {step === 1 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">First Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="First Name"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.firstName ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.firstName && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.firstName}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Last Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Last Name"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.lastName ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.lastName && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Email Address</Label>
                          <div className="relative group/input">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="Email@domain.com"
                              required
                              className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.email ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                          </div>
                          {errors.email && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.password ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.password && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.password}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Confirm</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.confirmPassword ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.confirmPassword && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.confirmPassword}</p>}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Phone Number</Label>
                          <div className="relative group/input">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="10-digit mobile number"
                              required
                              className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.phone ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                          </div>
                          {errors.phone && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.phone}</p>}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Qualification</Label>
                            <Select onValueChange={(value) => handleInputChange("highestQualification", value)}>
                              <SelectTrigger className={`h-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] focus:ring-4 focus:ring-indigo-500/10 transition-all px-3 focus:outline-none ${errors.highestQualification ? 'ring-2 ring-rose-500/50' : ''}`}>
                                <SelectValue placeholder="Degree" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl shadow-2xl">
                                <SelectItem value="bachelor" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Bachelor's</SelectItem>
                                <SelectItem value="master" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Master's</SelectItem>
                                <SelectItem value="phd" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">PhD</SelectItem>
                                <SelectItem value="diploma" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Diploma</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.highestQualification && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.highestQualification}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Experience</Label>
                            <Select onValueChange={(value) => handleInputChange("yearsOfExperience", Number(value))}>
                              <SelectTrigger className="h-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] focus:ring-4 focus:ring-indigo-500/10 transition-all px-3 focus:outline-none">
                                <SelectValue placeholder="Years" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl shadow-2xl">
                                <SelectItem value="0" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">0-1 Year</SelectItem>
                                <SelectItem value="2" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">2-5 Years</SelectItem>
                                <SelectItem value="6" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">6-10 Years</SelectItem>
                                <SelectItem value="10" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">10+ Years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Specialization</Label>
                          <Select onValueChange={(value) => handleInputChange("areaOfSpecialization", value)}>
                            <SelectTrigger className={`h-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] focus:ring-4 focus:ring-indigo-500/10 transition-all px-3 focus:outline-none ${errors.areaOfSpecialization ? 'ring-2 ring-rose-500/50' : ''}`}>
                              <SelectValue placeholder="Select Domain" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl shadow-2xl">
                              <SelectItem value="academic" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Academic</SelectItem>
                              <SelectItem value="career" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Career</SelectItem>
                              <SelectItem value="mental-health" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Mental Health</SelectItem>
                              <SelectItem value="college-admission" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">College Admission</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.areaOfSpecialization && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.areaOfSpecialization}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Organization</Label>
                            <div className="relative group/input">
                              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                value={formData.currentOrganization}
                                onChange={(e) => handleInputChange("currentOrganization", e.target.value)}
                                placeholder="Organization"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.currentOrganization ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.currentOrganization && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.currentOrganization}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">License Number</Label>
                            <div className="relative group/input">
                              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                placeholder="License #"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.licenseNumber ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.licenseNumber && <p className="text-[7px] text-rose-600 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.licenseNumber}</p>}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-3">Bio / Description</Label>
                          <Textarea
                            value={formData.professionalBio}
                            onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                            placeholder="Brief professional summary..."
                            className="bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-800 text-[11px] placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 min-h-[50px] py-2 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5 pt-2">
                      {step === 1 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="w-full h-11 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-lg transition-all duration-300 border-none"
                        >
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em]">
                            Next Step <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </span>
                        </Button>
                      ) : (
                        <div className="flex gap-2.5">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="flex-1 h-11 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-black text-[8px] uppercase tracking-widest transition-all"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] h-11 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-lg transition-all duration-300 border-none"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2 justify-center">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Processing...</span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-2 justify-center text-[9px] font-black uppercase tracking-[0.25em]">
                                Register <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </div>
                      )}

                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center mt-2.5">
                        Already registered?
                        <button
                          type="button"
                          className="text-[#6366f1] hover:text-[#4f46e5] transition-all font-black ml-2"
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