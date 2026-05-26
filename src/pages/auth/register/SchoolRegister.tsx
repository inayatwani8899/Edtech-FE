import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  School, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  Building2, 
  BarChart3, 
  Settings2, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  FileText,
  UploadCloud,
  LockKeyhole
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SchoolRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    instituteName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationType: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    approxStudentCount: 0,
    website: "",
    siteMessage: "", 
  });

  const [document, setDocument] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null); 
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { registerSchool } = useAuthStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [logoDragActive, setLogoDragActive] = useState(false);
  const [docDragActive, setDocDragActive] = useState(false);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  const handleLogoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setLogoDragActive(true);
    } else if (e.type === "dragleave") {
      setLogoDragActive(false);
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLogoFile(file);
    }
  };

  const handleDocDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      docDragActive ? null : setDocDragActive(true);
    } else if (e.type === "dragleave") {
      setDocDragActive(false);
    }
  };

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDocDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setDocument(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.instituteName.trim()) newErrors.instituteName = "Institute Name is required";
    if (!formData.organizationType) newErrors.organizationType = "Organization Type is required";
    if (formData.approxStudentCount <= 0) newErrors.approxStudentCount = "Enter a valid capacity";
    
    if (!formData.contactNumber) newErrors.contactNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Must be exactly 10 digits";
    
    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    
    if (logoFile) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(logoFile.type)) {
        newErrors.logo = "Logo must be an image (PNG, JPG, or WEBP)";
      }
      if (logoFile.size > 2 * 1024 * 1024) {
        newErrors.logo = "Logo size must be under 2MB";
      }
    }

    if (formData.siteMessage && formData.siteMessage.length > 250) {
      newErrors.siteMessage = "Welcome message must be under 250 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!document) newErrors.document = "Institutional verification proof is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast({
          title: "Validation Error",
          description: "Please check all required fields in Step 1.",
          variant: "destructive"
        });
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast({
          title: "Validation Error",
          description: "Please check all required fields in Step 2.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const validateForm = () => {
    return validateStep1() && validateStep2() && validateStep3();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all steps for missing or invalid details.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();

      // Generate a clean tenant database name from instituteName
      const tenantDb = formData.instituteName.toLowerCase().trim()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/__+/g, "_")
        .replace(/^_+|_+$/g, "") + "_db";

      data.append("instituteName", formData.instituteName);
      data.append("TenantDb", tenantDb);
      data.append("Address", formData.address);
      data.append("City", formData.city);
      data.append("State", formData.state);
      data.append("Country", formData.country);
      data.append("PostalCode", formData.postalCode);
      data.append("email", formData.email);
      data.append("Password", formData.password);
      data.append("ContactNumber", formData.contactNumber);
      data.append("Website", formData.website || "");
      data.append("OrganizationType", formData.organizationType);
      data.append("approxStudentCount", String(formData.approxStudentCount || 0));
      
      // Metadata/Config fields requested by spec
      data.append("DocumentUrl", "");
      data.append("SiteMessage", formData.siteMessage || "");
      data.append("Status", "Pending");
      data.append("OnboardingStage", "Submitted");
      data.append("IsVerified", "false");
      data.append("IsActive", "true");

      if (document) {
        data.append("Document", document);
        data.append("DocumentFile", document);
        data.append("document", document);
        data.append("documentFile", document);
      }

      if (logoFile) {
        data.append("LogoPath", logoFile);
        data.append("Logo", logoFile);
        data.append("LogoFile", logoFile);
        data.append("logo", logoFile);
        data.append("logoFile", logoFile);
        data.append("logoPath", logoFile);
      }

      const result = await registerSchool(data);

      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Registration Successful!",
          description: result.message || "Your school registration has been successfully requested.",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error?.message || result.message || "An error occurred during registration.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.response?.data?.message || error.message || "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === "contactNumber") {
      const cleaned = value.toString().replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] text-zinc-900 relative flex flex-col justify-between overflow-y-auto select-none font-sans pb-4">
      
      {/* Subtle radial dot grid pattern from Landing Page */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(circle, #d1d1d6 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        opacity: 0.4
      }} />

      {/* 🏠 Glassmorphic Sticky Header - Cleaner, no duplicated controls on the right */}
      <div className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full py-2.5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-sans text-lg font-black tracking-tight text-zinc-900 flex items-center">
            Cognify<span className="text-[#6366f1] italic ml-0.5">IQ</span>
          </Link>
          <div className="h-4 w-px bg-zinc-200" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-all duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>
          <button
            onClick={() => navigate("/get-started")}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-all duration-300"
          >
            Back
          </button>
        </div>

        {/* Empty to balance header layout cleanly */}
        <div />
      </div>

      {/* 🌌 Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] animate-pulse mix-blend-multiply" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[150px] animate-pulse mix-blend-multiply" />
      </div>

      {isSuccess ? (
        /* SUCCESS PAGE */
        <div className="flex-grow flex items-center justify-center py-12 px-4 z-10 relative">
          <Card className="max-w-md w-full border border-zinc-200 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 animate-bounce" />
            </div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight mb-2">Institution Registered!</h2>
            <p className="text-zinc-500 text-xs leading-relaxed mb-5">
              Your onboarding request has been successfully created. We are configuring your isolated tenant space and verifying details.
            </p>
            <div className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl mb-5">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Status</p>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Awaiting System Approval</span>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="h-9 w-full rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[10px] uppercase tracking-widest shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-lg transition-all border-none"
            >
              Go to Sign In
            </Button>
          </Card>
        </div>
      ) : (
        /* STEPPER LAYOUT */
        <div className="flex-grow flex flex-col items-stretch w-full relative z-10 py-4 max-w-6xl mx-auto px-4 md:px-8">
          
          {/* 🧭 STEPPER HEADERS - Thin, Clean, Compact */}
          <div className="w-full mb-4">
            <Card className="border border-zinc-200 bg-white rounded-2xl p-2 px-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative">
                
                {/* Step 1 */}
                <div className="flex-1 flex items-center gap-2.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-350 font-bold text-xs ${
                    step > 1 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                      : step === 1 
                        ? "bg-[#6366f1] border-[#6366f1] text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-105" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-400"
                  }`}>
                    {step > 1 ? <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in-50 duration-300" /> : <School className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Step 1</span>
                    <span className={`text-[10px] font-bold tracking-tight leading-none ${step === 1 ? "text-zinc-900" : "text-zinc-500"}`}>Institution</span>
                  </div>
                </div>

                {/* Connecting line 1 */}
                <div className="hidden md:block flex-grow h-[1.5px] bg-zinc-150 mx-3 relative overflow-hidden rounded-full self-center">
                  <div className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500" style={{ width: step > 1 ? '100%' : '0%' }} />
                </div>

                {/* Step 2 */}
                <div className="flex-1 flex items-center gap-2.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-350 font-bold text-xs ${
                    step > 2 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                      : step === 2 
                        ? "bg-[#6366f1] border-[#6366f1] text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-105" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-400"
                  }`}>
                    {step > 2 ? <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in-50 duration-300" /> : <MapPin className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Step 2</span>
                    <span className={`text-[10px] font-bold tracking-tight leading-none ${step === 2 ? "text-zinc-900" : "text-zinc-500"}`}>Location & Branding</span>
                  </div>
                </div>

                {/* Connecting line 2 */}
                <div className="hidden md:block flex-grow h-[1.5px] bg-zinc-150 mx-3 relative overflow-hidden rounded-full self-center">
                  <div className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500" style={{ width: step > 2 ? '100%' : '0%' }} />
                </div>

                {/* Step 3 */}
                <div className="flex-1 flex items-center gap-2.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-350 font-bold text-xs ${
                    step === 3 
                      ? "bg-[#6366f1] border-[#6366f1] text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-105" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-400"
                  }`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Step 3</span>
                    <span className={`text-[10px] font-bold tracking-tight leading-none ${step === 3 ? "text-zinc-900" : "text-zinc-500"}`}>Verification</span>
                  </div>
                </div>

              </div>
            </Card>
          </div>

          {/* 📝 STEP FORM BODY */}
          <div className="w-full">
            <div className="space-y-4">
              
              {/* STEP 1: ORGANIZATION & CREDENTIALS */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-400">
                  <Card className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
                    
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#6366f1]" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">Institution & Admin Details</h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                        <Sparkles className="h-2.5 w-2.5 text-[#6366f1]" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#6366f1]">Onboarding</span>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[11px] text-zinc-400 leading-normal font-normal mb-4">
                      Provide primary institution details and administrator credentials to configure your secure tenant profile.
                    </p>

                    {/* Unified Form Grid (Left: Org details, Right: Credentials) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      
                      {/* Left Side: Org Information */}
                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">Institute Name</Label>
                          <div className="relative group/input">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                            <Input
                              value={formData.instituteName}
                              onChange={(e) => handleInputChange("instituteName", e.target.value)}
                              placeholder="E.g., Oakwood Academic Academy"
                              required
                              className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.instituteName ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                          </div>
                          {errors.instituteName && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.instituteName}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">Organization Type</Label>
                            <Select
                              value={formData.organizationType}
                              onValueChange={(value) => handleInputChange("organizationType", value)}
                            >
                              <SelectTrigger className={`h-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs focus:ring-4 focus:ring-indigo-500/10 px-3 focus:outline-none ${errors.organizationType ? 'ring-2 ring-rose-500/50' : ''}`}>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl shadow-2xl">
                                <SelectItem value="school" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">School</SelectItem>
                                <SelectItem value="college" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">College</SelectItem>
                                <SelectItem value="university" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">University</SelectItem>
                                <SelectItem value="coaching" className="focus:bg-indigo-50 focus:text-[#6366f1] rounded-lg cursor-pointer">Coaching / Training Institute</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.organizationType && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.organizationType}</p>}
                          </div>

                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">Student Capacity</Label>
                            <div className="relative group/input">
                              <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="number"
                                min="1"
                                value={formData.approxStudentCount || ""}
                                onChange={(e) => handleInputChange("approxStudentCount", Number(e.target.value))}
                                placeholder="E.g., 500"
                                className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.approxStudentCount ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.approxStudentCount && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.approxStudentCount}</p>}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">Official Website</Label>
                          <div className="relative group/input">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                            <Input
                              value={formData.website}
                              onChange={(e) => handleInputChange("website", e.target.value)}
                              placeholder="https://www.yourinstitution.edu"
                              className="h-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Credentials & Contact */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Email Address</Label>
                            <div className="relative group/input">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="admin@yourinstitution.edu"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.email ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.email && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.email}</p>}
                          </div>

                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Contact Number</Label>
                            <div className="relative group/input">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                value={formData.contactNumber}
                                onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                                placeholder="10-digit number"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.contactNumber ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.contactNumber && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.contactNumber}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Admin Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.password ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.password && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.password}</p>}
                          </div>

                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Confirm Password</Label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within/input:text-[#6366f1] transition-colors" />
                              <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`h-9 pl-9 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.confirmPassword ? 'ring-2 ring-rose-500/50' : ''}`}
                              />
                            </div>
                            {errors.confirmPassword && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.confirmPassword}</p>}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Integrated Divider & Navigation Actions */}
                    <div className="h-px bg-zinc-150 my-4" />
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/get-started")}
                        className="h-8 px-3 rounded-lg text-zinc-500 hover:text-zinc-950 font-bold text-[9px] uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="h-8.5 px-4 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_2px_10px_rgba(99,102,241,0.2)] hover:shadow-lg transition-all duration-300 border-none flex items-center gap-1"
                      >
                        <span className="text-[9.5px] font-bold uppercase tracking-wider">Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                  </Card>
                </div>
              )}

              {/* STEP 2: LOCATION & BRANDING CUSTOMIZATION */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-400">
                  <Card className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
                    
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#6366f1]" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">Location & Customization</h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                        <Settings2 className="h-2.5 w-2.5 text-[#6366f1]" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#6366f1]">Visual & Geo</span>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[11px] text-zinc-400 leading-normal font-normal mb-4">
                      Provide physical geolocational coordinates and configure visual branding elements for your organization portal.
                    </p>

                    {/* Unified Form Grid (Left: Location, Right: Customization) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      
                      {/* Left Side: Address Details */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">Country</Label>
                            <Input
                              value={formData.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              placeholder="E.g., United States"
                              required
                              className={`h-9 px-3 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.country ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                            {errors.country && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.country}</p>}
                          </div>

                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">State / Province</Label>
                            <Input
                              value={formData.state}
                              onChange={(e) => handleInputChange("state", e.target.value)}
                              placeholder="E.g., California"
                              required
                              className={`h-9 px-3 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.state ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                            {errors.state && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.state}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider ml-1">City</Label>
                            <Input
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              placeholder="E.g., Los Angeles"
                              required
                              className={`h-9 px-3 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.city ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                            {errors.city && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.city}</p>}
                          </div>

                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Postal / Zip Code</Label>
                            <Input
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange("postalCode", e.target.value)}
                              placeholder="E.g., 90001"
                              required
                              className={`h-9 px-3 bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-855 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 ${errors.postalCode ? 'ring-2 ring-rose-500/50' : ''}`}
                            />
                            {errors.postalCode && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.postalCode}</p>}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Street Address</Label>
                          <Textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Complete physical campus street address..."
                            required
                            className={`bg-white border border-zinc-200 focus:border-[#6366f1] rounded-xl font-bold text-zinc-850 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 min-h-[50px] py-1 resize-none ${errors.address ? 'ring-2 ring-rose-500/50' : ''}`}
                          />
                          {errors.address && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.address}</p>}
                        </div>
                      </div>

                      {/* Right Side: Branding Customization */}
                      <div className="space-y-3">
                        {/* Logo upload drop zone */}
                        <div className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Portal Logo</Label>
                          <div
                            onDragEnter={handleLogoDrag}
                            onDragOver={handleLogoDrag}
                            onDragLeave={handleLogoDrag}
                            onDrop={handleLogoDrop}
                            className={`relative border border-dashed rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[75px] ${
                              logoDragActive 
                                ? "border-[#6366f1] bg-[#eef2ff]/30" 
                                : logoFile 
                                  ? "border-emerald-500/40 bg-emerald-50/10" 
                                  : "border-zinc-200 hover:border-[#6366f1]/40 hover:bg-zinc-50/50"
                            }`}
                          >
                            <input
                              type="file"
                              id="logo-upload"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setLogoFile(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            <label htmlFor="logo-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                              {logoPreview ? (
                                <div className="relative group/logo flex flex-col items-center">
                                  <img src={logoPreview} alt="Logo preview" className="h-9 w-9 object-contain rounded-lg border border-zinc-200 bg-white p-0.5 mb-1" />
                                  <span className="text-[8px] font-black text-zinc-500 group-hover/logo:text-zinc-950 transition-colors uppercase tracking-widest leading-none">Change Image</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-center">
                                  <UploadCloud className="h-4.5 w-4.5 text-[#6366f1] mb-1" />
                                  <span className="text-[9.5px] font-bold text-zinc-700 leading-none">Drag logo or click</span>
                                  <span className="text-[7px] text-zinc-400 mt-1 uppercase font-semibold leading-none">Max 2MB</span>
                                </div>
                              )}
                            </label>
                          </div>
                          {errors.logo && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.logo}</p>}
                        </div>

                        {/* Welcome message field */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center px-1">
                            <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider">Site Welcome Message</Label>
                            <span className="text-[8px] text-zinc-400 font-mono font-bold">{(formData.siteMessage || "").length}/250</span>
                          </div>
                          <Textarea
                            value={formData.siteMessage}
                            onChange={(e) => handleInputChange("siteMessage", e.target.value)}
                            placeholder="E.g., Welcome to the assessment dashboard..."
                            className="bg-white border border-zinc-250 focus:border-[#6366f1] rounded-xl font-bold text-zinc-805 text-xs placeholder:text-zinc-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 min-h-[80px] py-1.5 resize-none"
                          />
                          {errors.siteMessage && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.siteMessage}</p>}
                        </div>
                      </div>

                    </div>

                    {/* Integrated Divider & Navigation Actions */}
                    <div className="h-px bg-zinc-150 my-4" />
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="h-8 px-3 rounded-lg text-zinc-550 hover:text-zinc-900 hover:bg-zinc-100 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="h-8.5 px-4 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_2px_10px_rgba(99,102,241,0.2)] hover:shadow-lg transition-all duration-300 border-none flex items-center gap-1.5"
                      >
                        <span className="text-[9.5px] font-bold uppercase tracking-wider">Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                  </Card>
                </div>
              )}

              {/* STEP 3: DOCUMENTS VERIFICATION & CONFIG PREVIEW */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-400">
                  <Card className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
                    
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#6366f1]" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">Documents & Verification</h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600">Verification</span>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[11px] text-zinc-400 leading-normal font-normal mb-4">
                      Upload your official school registration, board affiliation license, or institutional identification document. This file is required to authorize tenant database cluster assignments.
                    </p>

                    {/* Unified Form Grid (Left: Upload File, Right: Config details) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      
                      {/* Left Side: Document Upload */}
                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">Institutional Proof File</Label>
                          <div
                            onDragEnter={handleDocDrag}
                            onDragOver={handleDocDrag}
                            onDragLeave={handleDocDrag}
                            onDrop={handleDocDrop}
                            className={`relative border border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[90px] ${
                              docDragActive 
                                ? "border-indigo-500 bg-indigo-50/20" 
                                : document 
                                  ? "border-emerald-500/40 bg-emerald-50/10" 
                                  : "border-zinc-200 hover:border-[#6366f1]/40 hover:bg-zinc-50/50"
                            }`}
                          >
                            <input
                              type="file"
                              id="doc-upload"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setDocument(e.target.files[0]);
                                  if (errors.document) setErrors(prev => {
                                    const up = { ...prev };
                                    delete up.document;
                                    return up;
                                  });
                                }
                              }}
                              className="hidden"
                            />
                            <label htmlFor="doc-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                              {document ? (
                                <div className="flex flex-col items-center text-center">
                                  <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-1 border border-emerald-100">
                                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                                  </div>
                                  <span className="text-xs font-black text-zinc-800 truncate max-w-[280px] leading-tight">{document.name}</span>
                                  <span className="text-[8px] text-zinc-450 mt-1 uppercase font-bold leading-none">{(document.size / (1024 * 1024)).toFixed(2)} MB • Click to replace</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-center py-1">
                                  <UploadCloud className="h-5 w-5 text-[#6366f1] mb-1" />
                                  <span className="text-[11px] font-bold text-zinc-705 leading-tight">Drag verification file here or click to browse</span>
                                  <span className="text-[8px] text-zinc-400 mt-1 uppercase font-semibold leading-none">PDF, DOCX, PNG, JPG • Max 5MB</span>
                                </div>
                              )}
                            </label>
                          </div>
                          {errors.document && <p className="text-[8px] text-rose-600 font-bold uppercase tracking-tighter ml-1 mt-0.5">{errors.document}</p>}
                        </div>
                      </div>

                      {/* Right Side: Configuration Review Metrics */}
                      <div className="space-y-3 flex flex-col justify-end pb-0.5">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider ml-1">System Configuration Details</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl text-left">
                              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Clearance</span>
                              <span className="text-[9px] font-bold text-amber-600 uppercase leading-none">Pending Review</span>
                            </div>
                            <div className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl text-left">
                              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Deployment</span>
                              <span className="text-[9px] font-bold text-[#6366f1] uppercase leading-none">Stage 1: Registry</span>
                            </div>
                            <div className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl text-left">
                              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Tenant DB</span>
                              <span className="text-[9px] font-bold text-zinc-650 uppercase leading-none">Auto Cluster</span>
                            </div>
                            <div className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl text-left flex flex-col justify-between">
                              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Security</span>
                              <span className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-0.5 leading-none">
                                <LockKeyhole className="h-2 w-2 text-emerald-600" /> Isolated
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Integrated Divider & Navigation Actions */}
                    <div className="h-px bg-zinc-150 my-4" />
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="h-8 px-3 rounded-lg text-zinc-550 hover:text-zinc-900 hover:bg-zinc-100 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={isLoading}
                        className="h-8.5 px-4.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-[0_2px_10px_rgba(99,102,241,0.2)] hover:shadow-lg transition-all duration-300 border-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                            <span className="text-[9.5px] font-bold uppercase tracking-wider">Onboarding...</span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider">
                            Complete Onboarding <ArrowRight className="h-3.5 h-3.5" />
                          </span>
                        )}
                      </Button>
                    </div>

                  </Card>
                </div>
              )}

              {/* SIGN IN LINK */}
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center pt-2">
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
          </div>

        </div>
      )}
      
      {/* 🚀 Footer Spacer */}
      <div className="py-2.5 text-center border-t border-zinc-200 bg-[#f9fafb]">
        <p className="text-[7.5px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
          Secure Onboarding Protocol • Protected by Isolated Multi-Tenant Boundaries
        </p>
      </div>

    </div>
  );
};

export default SchoolRegister;