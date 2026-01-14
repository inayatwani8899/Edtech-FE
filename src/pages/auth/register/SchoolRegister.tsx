import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { School, ArrowLeft, User, Mail, Lock, Phone, Globe, Calendar } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Welcome to EduConnect! Your school account has been created.",
    });
    // Handle form submission logic here
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

      <div className="hidden lg:flex flex-col justify-start px-16 py-28 text-white z-10">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">Register Your Institution</h1>
        <p className="text-lg text-white/85 max-w-lg mb-6">Create a school account to connect with students and counsellors, manage assessments and track progress.</p>

        <div className="mt-8 flex items-center gap-4 text-sm text-white/80">
          <div className="h-px w-12 bg-white/30" />
          Trusted • Secure • Scalable
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <School className="w-6 h-6 text-white/90" />
            <div>
              <div className="text-sm font-semibold">Institution Profiles</div>
              <div className="text-xs text-white/75">Showcase programs</div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white">★</div>
            <div>
              <div className="text-sm font-semibold">Analytics</div>
              <div className="text-xs text-white/75">Monitor student engagement</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 z-20">
        <div className="w-full max-w-xl">
          <Card className="bg-white/95 shadow-2xl border-0 rounded-3xl overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 right-6 w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 opacity-20 transform rotate-45" />
              <CardHeader className="text-center space-y-2 pt-8 pb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <School className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">School Registration</CardTitle>
                <p className="text-sm text-slate-600">Register your institution to connect with students and counsellors.</p>
              </CardHeader>

              <CardContent className="px-8 pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="space-y-2">
                    <Label>School/Institution Name</Label>
                    <div className="relative">
                      <Input
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        placeholder="Full institution name"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                      />
                      <School className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Administrator First Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.adminFirstName}
                          onChange={(e) => handleInputChange("adminFirstName", e.target.value)}
                          placeholder="First name"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Administrator Last Name</Label>
                      <div className="relative">
                        <Input
                          value={formData.adminLastName}
                          onChange={(e) => handleInputChange("adminLastName", e.target.value)}
                          placeholder="Last name"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Administrator Email</Label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                        placeholder="admin@school.edu"
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
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create a password"
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
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                      <Label>Institution Type</Label>
                      <Select onValueChange={(value) => handleInputChange("schoolType", value)}>
                        <SelectTrigger className="h-11 rounded-xl">
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

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="School contact number"
                          required
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Street address"
                      required
                      className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="ZIP code"
                        required
                        className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Website (Optional)</Label>
                      <div className="relative">
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://www.yourschool.edu"
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Established Year</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={formData.establishedYear}
                          onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                          placeholder="e.g., 1995"
                          min="1800"
                          max={new Date().getFullYear()}
                          className="h-11 rounded-xl pl-11 focus:ring-2 focus:ring-indigo-300"
                        />
                        <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Approximate Student Count</Label>
                    <Select onValueChange={(value) => handleInputChange("studentCount", value)}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select student count range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-100">0-100 students</SelectItem>
                        <SelectItem value="101-500">101-500 students</SelectItem>
                        <SelectItem value="501-1000">501-1,000 students</SelectItem>
                        <SelectItem value="1001-5000">1,001-5,000 students</SelectItem>
                        <SelectItem value="5000+">5,000+ students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Institution Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Briefly describe your institution, programs, and what makes it unique..."
                      rows={4}
                      className="rounded-xl focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>

                  <div className="flex flex-col items-center pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-2/3 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
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