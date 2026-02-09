import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { School, ArrowLeft, User, Mail, Lock, Phone, Globe, Calendar, MapPin, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SchoolRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    schoolName: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    schoolType: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    establishedYear: "",
    studentCount: "",
    description: ""
  });

  const { registerSchool } = useAuthStore();
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
      const { confirmPassword, ...payload } = formData;
      const result = await registerSchool(payload);

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Welcome to EduConnect! Your school account has been created.",
        });
        navigate("/login");
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">

      <div className="hidden lg:block absolute -left-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="hidden lg:block absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="hidden lg:flex flex-col justify-center px-12 py-12 text-white z-10">
        <h1 className="text-3xl font-extrabold mb-2 leading-tight drop-shadow-lg">Register Your Institution</h1>
        <p className="text-sm text-white/85 max-w-lg mb-4">Create a school account to connect with students and counsellors, manage assessments and track progress.</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/80">
          <div className="h-px w-8 bg-white/30" />
          Trusted • Secure • Scalable
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <School className="w-4 h-4 text-white/90" />
            <div>
              <div className="text-xs font-semibold">Institution Profiles</div>
              <div className="text-[10px] text-white/75">Showcase programs</div>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white text-[10px]">★</div>
            <div>
              <div className="text-xs font-semibold">Analytics</div>
              <div className="text-[10px] text-white/75">Monitor engagement</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-6 z-20">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 opacity-20 transform rotate-45" />
              <CardHeader className="text-center space-y-1 pt-6 pb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <School className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">School Registration</CardTitle>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Step {step} of 3: {step === 1 ? 'Administrator' : step === 2 ? 'Institution Basics' : 'Location & Details'}
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                  {step === 1 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Admin First Name</Label>
                          <div className="relative">
                            <Input
                              value={formData.adminFirstName}
                              onChange={(e) => handleInputChange("adminFirstName", e.target.value)}
                              placeholder="First name"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                            />
                            <User className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Admin Last Name</Label>
                          <div className="relative">
                            <Input
                              value={formData.adminLastName}
                              onChange={(e) => handleInputChange("adminLastName", e.target.value)}
                              placeholder="Last name"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                            />
                            <User className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Admin Email</Label>
                        <div className="relative">
                          <Input
                            type="email"
                            value={formData.adminEmail}
                            onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                            placeholder="admin@school.edu"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
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
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
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
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
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
                        <Label className="text-xs">Institution Name</Label>
                        <div className="relative">
                          <Input
                            value={formData.schoolName}
                            onChange={(e) => handleInputChange("schoolName", e.target.value)}
                            placeholder="Full institution name"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                          <School className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Institution Type</Label>
                          <Select onValueChange={(value) => handleInputChange("schoolType", value)}>
                            <SelectTrigger className="h-8 rounded-lg text-xs">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high-school">High School</SelectItem>
                              <SelectItem value="college">College</SelectItem>
                              <SelectItem value="university">University</SelectItem>
                              <SelectItem value="community-college">Community College</SelectItem>
                              <SelectItem value="private-school">Private School</SelectItem>
                              <SelectItem value="public-school">Public School</SelectItem>
                              <SelectItem value="vocational">Vocational School</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Phone Number</Label>
                          <div className="relative">
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="Contact number"
                              required
                              className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                            />
                            <Phone className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Website</Label>
                        <div className="relative">
                          <Input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="yourschool.edu"
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                          <Globe className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Established Year</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={formData.establishedYear}
                            onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                            placeholder="YYYY"
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                          <Calendar className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-1">
                        <Label className="text-xs">Address</Label>
                        <div className="relative">
                          <Input
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Street address"
                            required
                            className="h-8 rounded-lg pl-8 text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                          <MapPin className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">City</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="City"
                            required
                            className="h-8 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">State</Label>
                          <Input
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            placeholder="State"
                            required
                            className="h-8 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">ZIP</Label>
                          <Input
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            placeholder="ZIP"
                            required
                            className="h-8 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Student Count</Label>
                        <Select onValueChange={(value) => handleInputChange("studentCount", value)}>
                          <SelectTrigger className="h-8 rounded-lg text-xs">
                            <SelectValue placeholder="Select count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100">0-100</SelectItem>
                            <SelectItem value="101-500">101-500</SelectItem>
                            <SelectItem value="501-1000">501-1000</SelectItem>
                            <SelectItem value="1001-5000">1001-5000</SelectItem>
                            <SelectItem value="5000+">5000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Briefly describe your institution..."
                          rows={2}
                          className="rounded-lg text-xs focus:ring-2 focus:ring-indigo-300 min-h-[60px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    {step < 3 ? (
                      <div className="flex gap-2">
                        {step > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 h-9 rounded-lg"
                          >
                            Back
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className={`flex-[2] bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all ${step === 1 ? 'w-full' : ''}`}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(step - 1)}
                          className="flex-1 h-9 rounded-lg"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-[2] bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold h-9 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full text-xs mt-2">
                      {step === 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/get-started")}
                          className="text-slate-600 hover:text-slate-700 p-0 h-auto font-normal hover:bg-transparent mr-4"
                        >
                          <ArrowLeft className="w-3 h-3 mr-1" />
                          Back to Start
                        </Button>
                      )}

                      <div className="text-slate-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-indigo-600 font-bold hover:underline"
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

export default SchoolRegister;