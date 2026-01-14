import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowLeft, User, Mail, Lock, Phone, Briefcase, FileText } from "lucide-react";
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
    await createCounselor(formData);
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

      <div className="hidden lg:flex flex-col justify-start px-16 py-28 text-white z-10">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">Grow Your Practice</h1>
        <p className="text-lg text-white/85 max-w-lg mb-6">Join our network to reach more students and provide impactful guidance using our assessment tools and analytics.</p>

        <div className="mt-8 flex items-center gap-4 text-sm text-white/80">
          <div className="h-px w-12 bg-white/30" />
          Trusted • Secure • Verified
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-white/90" />
            <div>
              <div className="text-sm font-semibold">Professional Network</div>
              <div className="text-xs text-white/75">Connect with students</div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-r from-emerald-400 to-sky-500 flex items-center justify-center text-white">✓</div>
            <div>
              <div className="text-sm font-semibold">Verified Profiles</div>
              <div className="text-xs text-white/75">Build trust fast</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 z-20">
        <div className="w-full max-w-xl">
          <Card className="bg-white/95 shadow-2xl border-0 rounded-3xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-20 transform rotate-45" />
              <CardHeader className="text-center space-y-2 pt-8 pb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-sky-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Counsellor Registration</CardTitle>
                <p className="text-sm text-slate-600">Create your counsellor account to start helping students.</p>
              </CardHeader>

              <CardContent className="px-8 pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="First name"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Last name"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="you@organization.com"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create password"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm password"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="e.g. +91 99999 99999"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                      />
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Highest Qualification</Label>
                      <Select onValueChange={(value) => handleInputChange("qualification", value)}>
                        <SelectTrigger className="h-11 rounded-xl">
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

                    <div className="space-y-2">
                      <Label>Years of Experience</Label>
                      <Select onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="h-11 rounded-xl">
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

                  <div className="space-y-2">
                    <Label>Area of Specialization</Label>
                    <Select onValueChange={(value) => handleInputChange("specialization", value)}>
                      <SelectTrigger className="h-11 rounded-xl">
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

                  <div className="space-y-2">
                    <Label>Current Organization</Label>
                    <div className="relative">
                      <Input
                        value={formData.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        placeholder="Your workplace"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                      />
                      <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>License Number (if applicable)</Label>
                    <div className="relative">
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        placeholder="License or registration id"
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-emerald-300"
                      />
                      <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Professional Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Briefly describe your background and approach"
                      rows={4}
                      className="rounded-xl focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>

                  <div className="flex flex-col items-center pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-2/3 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
                    >
                      Create Account
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => navigate("/get-started")}
                      className="mb-6 text-slate-600 hover:text-slate-700"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    <div className="mt-4 text-sm text-slate-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-emerald-600 font-medium hover:underline"
                        onClick={() => navigate('/login')}
                      >
                        Sign in
                      </button>
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