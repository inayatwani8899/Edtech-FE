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
import { GraduationCap, ArrowLeft, User, Mail, Lock, Calendar, Phone } from "lucide-react";
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
    } catch (error: any) { }
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
      <div className="hidden lg:flex flex-col justify-start px-16 py-28 text-white z-10">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Start Your Journey
        </h1>
        <p className="text-lg text-white/85 max-w-lg mb-6">
          Create your student account and unlock personalized assessments,
          actionable insights, and career guidance tailored to your goals.
        </p>

        <div className="mt-8 flex items-center gap-4 text-sm text-white/80">
          <div className="h-px w-12 bg-white/30" />
          Trusted • Secure • Smart
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-white/90" />
            <div>
              <div className="text-sm font-semibold">For Students</div>
              <div className="text-xs text-white/75">Personalized learning</div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-r from-pink-500 to-yellow-400 flex items-center justify-center text-white">★</div>
            <div>
              <div className="text-sm font-semibold">Interactive Tests</div>
              <div className="text-xs text-white/75">Instant feedback</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center px-6 py-12 z-20">
        <div className="w-full max-w-xl">

        

          <Card className="bg-white/95 shadow-2xl border-0 rounded-3xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-20 transform rotate-45" />
              <CardHeader className="text-center space-y-2 pt-8 pb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Student Registration
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Create your account to begin learning — it only takes a minute.
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="John"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Doe"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
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
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
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
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Create password"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
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
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          placeholder="Confirm password"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Grade Level</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("gradeLevel", value)
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl">
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
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number (Optional)</Label>
                    <div className="relative">
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                      />
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-2/3 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    >
                      Create Account
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/get-started")}
                      className="mb-6 text-white hover:text-white/90"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    <div className="mt-4 text-sm text-slate-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-indigo-600 font-medium hover:underline"
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

export default StudentRegister;
