import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { GraduationCap, ArrowLeft, User, Mail, Lock, Calendar, Phone, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import Swal from "sweetalert2";

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

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const result = await registerStudent(payload);

      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated) {
        return navigate("/student/dashboard");
      }

      Swal.fire({
        toast: true,
        icon: "success",
        title: "Registration Successful",
        text: "Please log in to continue.",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      navigate("/login");
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="hidden lg:block absolute -left-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="hidden lg:block absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* LEFT BRANDING SECTION */}
      <div className="hidden lg:flex flex-col justify-center px-12 py-12 text-white z-10">
        <h1 className="text-3xl font-extrabold mb-2 leading-tight drop-shadow-lg">
          Start Your Journey
        </h1>
        <p className="text-sm text-white/85 max-w-lg mb-4">
          Create your student account and unlock personalized assessments,
          and career guidance tailored to your goals.
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/80">
          <div className="h-px w-8 bg-white/30" />
          Trusted • Secure • Smart
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-white/90" />
            <div>
              <div className="text-xs font-semibold">For Students</div>
              <div className="text-[10px] text-white/75">Personalized learning</div>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-r from-pink-500 to-yellow-400 flex items-center justify-center text-white text-[10px]">★</div>
            <div>
              <div className="text-xs font-semibold">Interactive Tests</div>
              <div className="text-[10px] text-white/75">Instant feedback</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center px-4 py-6 z-20">
        <div className="w-full max-w-md"> {/* Reduced max-width for tighter feel */}
          <Card className="bg-white/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-20 transform rotate-45" />

              <CardHeader className="text-center space-y-1 pt-6 pb-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Student Registration
                </CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Step {step} of 2: {step === 1 ? 'Account Details' : 'Personal Profile'}
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
                              placeholder="John"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
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
                              placeholder="Doe"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
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
                            placeholder="you@example.com"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
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
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
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
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
                            />
                            <Lock className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-1">
                        <Label className="text-xs">Date of Birth</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
                          />
                          <Calendar className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Grade Level</Label>
                        <Select onValueChange={(value) => handleInputChange("gradeLevel", value)}>
                          <SelectTrigger className="h-8 rounded-lg text-xs">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i + 1} value={`${i + 1}`}>
                                {i + 1}th Grade
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Phone Number (Optional)</Label>
                        <div className="relative">
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-blue-300"
                          />
                          <Phone className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    {step === 1 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all"
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
                          className="flex-[2] bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full text-xs mt-2">
                      <div className="text-slate-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-blue-600 font-bold hover:underline"
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

export default StudentRegister;
