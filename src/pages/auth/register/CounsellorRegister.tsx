import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowLeft, User, Mail, Lock, Phone, Briefcase, FileText, ChevronRight } from "lucide-react";
import { useEffect } from "react";
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
    qualification: "",
    experience: "",
    specialization: "",
    organization: "",
    bio: "",
    licenseNumber: ""
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
      await createCounselor(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:8000/api/auth/google";

    // Optional: Show loading state
    toast({
      title: "Redirecting to Google",
      description: "Please complete the sign-in with Google",
    });
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-emerald-600 via-sky-600 to-indigo-600 relative overflow-hidden">

      <div className="hidden lg:block absolute -left-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="hidden lg:block absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="hidden lg:flex flex-col justify-center px-12 py-12 text-white z-10">
        <h1 className="text-3xl font-extrabold mb-2 leading-tight drop-shadow-lg">Grow Your Practice</h1>
        <p className="text-sm text-white/85 max-w-lg mb-4">Join our network to reach more students and provide impactful guidance using our assessment tools and analytics.</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/80">
          <div className="h-px w-8 bg-white/30" />
          Trusted • Secure • Verified
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-white/90" />
            <div>
              <div className="text-xs font-semibold">Professional Network</div>
              <div className="text-[10px] text-white/75">Connect with students</div>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-r from-emerald-400 to-sky-500 flex items-center justify-center text-white text-[10px]">✓</div>
            <div>
              <div className="text-xs font-semibold">Verified Profiles</div>
              <div className="text-[10px] text-white/75">Build trust fast</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-6 z-20">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-20 transform rotate-45" />
              <CardHeader className="text-center space-y-1 pt-6 pb-2">
                <div className="bg-gradient-to-r from-emerald-500 to-sky-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Counsellor Registration</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Step {step} of 2: {step === 1 ? 'Account Details' : 'Professional Profile'}
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                  {step === 1 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">First Name</Label>
                          <div className="relative">
                            <Input
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              placeholder="First name"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                            />
                            <User className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Last Name</Label>
                          <div className="relative">
                            <Input
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              placeholder="Last name"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                            />
                            <User className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Email Address</Label>
                        <div className="relative">
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="you@organization.com"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                          />
                          <Mail className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Password</Label>
                          <div className="relative">
                            <Input
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange("password", e.target.value)}
                              placeholder="Create password"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                            />
                            <Lock className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              placeholder="Confirm"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                            />
                            <Lock className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Phone Number</Label>
                        <div className="relative">
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="e.g. +91 99999 99999"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                          />
                          <Phone className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Highest Qualification</Label>
                          <Select onValueChange={(value) => handleInputChange("qualification", value)}>
                            <SelectTrigger className="h-8 rounded-lg text-xs">
                              <SelectValue placeholder="Select qualification" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                              <SelectItem value="master">Master's Degree</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                              <SelectItem value="diploma">Professional Diploma</SelectItem>
                              <SelectItem value="certificate">Professional Certificate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Years of Experience</Label>
                          <Select onValueChange={(value) => handleInputChange("experience", value)}>
                            <SelectTrigger className="h-8 rounded-lg text-xs">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="2-5">2-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Area of Specialization</Label>
                        <Select onValueChange={(value) => handleInputChange("specialization", value)}>
                          <SelectTrigger className="h-8 rounded-lg text-xs">
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Academic Counselling</SelectItem>
                            <SelectItem value="career">Career Guidance</SelectItem>
                            <SelectItem value="mental-health">Mental Health</SelectItem>
                            <SelectItem value="college-admission">College Admission</SelectItem>
                            <SelectItem value="personal-development">Personal Development</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Current Organization</Label>
                        <div className="relative">
                          <Input
                            value={formData.organization}
                            onChange={(e) => handleInputChange("organization", e.target.value)}
                            placeholder="Your workplace"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                          />
                          <Briefcase className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">License Number (if applicable)</Label>
                        <div className="relative">
                          <Input
                            value={formData.licenseNumber}
                            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                            placeholder="License or registration id"
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-emerald-300"
                          />
                          <FileText className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Professional Bio</Label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Briefly describe your background and approach"
                          rows={2}
                          className="rounded-lg text-xs focus:ring-2 focus:ring-emerald-300 min-h-[60px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    {step === 1 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1 h-9 rounded-lg"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-[2] bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full text-xs mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/get-started")}
                        className="text-slate-600 hover:text-slate-700 p-0 h-auto font-normal hover:bg-transparent mr-4"
                      >
                        <ArrowLeft className="w-3 h-3 mr-1" />
                        Back to Start
                      </Button>

                      <div className="text-slate-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-emerald-600 font-bold hover:underline"
                          onClick={() => navigate('/login')}
                        >
                          Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounsellorRegister;