import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, ArrowLeft, User, Mail, Lock, Calendar, Phone, ChevronRight, Sparkles, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import Swal from "sweetalert2";
import api from "@/api/axios";


const StudentRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerStudent } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gradeLevel: "",
    phone: "",
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
    }
    
    if (currentStep === 2) {
      if (!formData.phone) newErrors.phone = "Required";
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Must be 10 digits";
      
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Required";
      if (!formData.gradeLevel) newErrors.gradeLevel = "Required";
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
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("/Grade", {
          params: { page: 1, limit: 100, sortDirection: "asc" }
        });
        if (response.data.code === 200) {
          setGrades(response.data.data.grades);
        }
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      }
    };
    fetchGrades();
  }, []);


  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;

      // Format dateOfBirth to ISO string if it exists
      const formattedPayload = {
        ...payload,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      };

      const result = await registerStudent(formattedPayload);

      if (result.success) {
        setIsSuccess(true);
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Registration Successful",
          text: "Welcome! Your account has been created.",
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
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
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen transition-opacity duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-sky-600/20 rounded-full blur-[160px] animate-pulse mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[180px] animate-pulse mix-blend-overlay" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 🎭 LEFT BRAND UNIVERSE */}
          <div className="hidden lg:flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <Sparkles className="h-3 w-3 text-indigo-400 animate-spin-slow" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/70">Next-gen learning portal</span>
              </div>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tighter text-white">
                Begin Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400">Academic Journey.</span>
              </h1>
              <p className="text-base text-slate-400 font-medium max-w-lg leading-relaxed antialiased">
                Access premium courses, personalized mentorship, and a global community of curious minds.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
              <div className="h-px w-10 bg-white/5" />
              Secure • Personalized • Global
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <Shield className="h-4 w-4 text-indigo-400 mb-1.5" />
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Community Trusted</p>
                <p className="text-xs font-black text-white tracking-tighter">Secure Access</p>
              </div>
              <div className="p-3 rounded-[1.25rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-elegant group hover:bg-white/[0.06] transition-all duration-500">
                <div className="h-4 w-4 rounded-md bg-gradient-to-r from-indigo-400 to-sky-500 flex items-center justify-center text-white text-[10px] mb-1.5">✓</div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Top Ratings</p>
                <p className="text-xs font-black text-white tracking-tighter">Quality Content</p>
              </div>
            </div>
          </div>

          {/* 🚀 RIGHT FORM ARCHITECTURE */}
          <div className="flex items-center justify-center perspective-1000 animate-in fade-in zoom-in duration-1000 delay-100">
            <Card className="w-full max-w-[440px] relative z-10 bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2rem] overflow-hidden group/card transition-all duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>

              <CardHeader className="p-5 pb-1 text-center relative z-10">
                <div className="mx-auto bg-gradient-to-tr from-indigo-500 to-sky-500 h-11 w-11 rounded-xl flex items-center justify-center mb-3 shadow-[0_12px_24px_-8px_rgba(99,102,241,0.6)] transform group-hover/card:scale-105 group-hover/card:rotate-6 transition-all duration-500">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white tracking-tighter leading-none mb-1.5">
                  Student Registration
                </CardTitle>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-white/10'}`} />
                  <div className={`h-1 w-5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-white/10'}`} />
                </div>
                <CardDescription className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em]">
                  Step {step} of 2: {step === 1 ? 'Personal Information' : 'Academic Detail'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 relative z-10">
                {isSuccess ? (
                  <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-indigo-400 animate-bounce" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tighter">Registration Success</h2>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest max-w-[200px] mx-auto">
                      Profile created successfully. Redirecting to login...
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
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                              <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="First Name"
                                required
                                className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.firstName ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.firstName && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.firstName}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Last Name</Label>
                            <div className="relative group/input">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                              <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Last Name"
                                required
                                className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.lastName ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.lastName && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Email Address</Label>
                          <div className="relative group/input">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="email@example.com"
                              required
                              className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.email ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                          </div>
                          {errors.email && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.password ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.password && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.password}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Confirm</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                              <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.confirmPassword ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.confirmPassword && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.confirmPassword}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="space-y-1.5">
                           <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Phone Number</Label>
                           <div className="relative group/input">
                             <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                             <Input
                               type="tel"
                               value={formData.phone}
                               onChange={(e) => handleInputChange("phone", e.target.value)}
                               placeholder="10-digit mobile number"
                               required
                               className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.phone ? 'ring-2 ring-rose-500/50' : ''}`}
                             />
                           </div>
                           {errors.phone && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.phone}</p>}
                         </div>

                           <div className="space-y-1.5">
                             <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Date of Birth</Label>
                             <div className="relative group/input">
                               <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 group-focus-within/input:text-indigo-400 transition-colors" />
                               <Input
                                 type="date"
                                 value={formData.dateOfBirth}
                                 onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                 required
                                 className={`h-9 pl-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] placeholder:text-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/[0.08] transition-all duration-300 ${errors.dateOfBirth ? 'ring-2 ring-rose-500/50' : ''}`}
                               />
                             </div>
                             {errors.dateOfBirth && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.dateOfBirth}</p>}
                           </div>
                           <div className="space-y-1.5">
                             <Label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-3">Grade Level</Label>
                             <Select onValueChange={(value) => handleInputChange("gradeLevel", value)}>
                               <SelectTrigger className={`h-9 bg-white/[0.04] border-none rounded-lg font-bold text-white text-[11px] focus:ring-4 focus:ring-indigo-500/20 transition-all px-3 ${errors.gradeLevel ? 'ring-2 ring-rose-500/50' : ''}`}>
                                 <SelectValue placeholder="Grade" />
                               </SelectTrigger>
                              <SelectContent className="bg-[#12141c] border-white/10 text-white font-bold text-[11px] rounded-lg">
                                {grades.length > 0 ? (
                                  grades.map((grade) => (
                                    <SelectItem key={grade.id} value={grade.id.toString()} className="focus:bg-indigo-500 rounded-md">
                                      {grade.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-white/30 text-[9px] uppercase tracking-widest">
                                    Loading grades...
                                  </div>
                                )}

                              </SelectContent>

                            </Select>
                            {errors.gradeLevel && <p className="text-[7px] text-rose-400 font-bold uppercase tracking-tighter ml-3 mt-0.5">{errors.gradeLevel}</p>}
                          </div>


                      </div>
                    )}

                    <div className="flex flex-col gap-2.5 pt-2">
                      {step === 1 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
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
                        Already have account?
                        <button
                          type="button"
                          className="text-white hover:text-indigo-400 transition-all font-black ml-2"
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

export default StudentRegister;
