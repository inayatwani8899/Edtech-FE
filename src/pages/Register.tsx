// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from "@/contexts/AuthContext";
// import { Brain, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     agreeToTerms: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const { register, isLoading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     if (!formData.name || !formData.email || !formData.password || !formData.role) {
//       return "Please fill in all required fields";
//     }
    
//     if (formData.password.length < 8) {
//       return "Password must be at least 8 characters long";
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       return "Passwords do not match";
//     }
    
//     if (!formData.agreeToTerms) {
//       return "Please agree to the Terms and Conditions";
//     }
    
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       await register(formData.email, formData.password, formData.name, formData.role);
//       toast({
//         title: "Account created successfully!",
//         description: "Welcome to PathGrad. Let's get started!",
//       });
//       navigate("/dashboard");
//     } catch (err) {
//       setError("Failed to create account. Please try again.");
//     }
//   };

//   const roleOptions = [
//     { value: "student", label: "Student", description: "Individual learner seeking self-assessment" },
//     { value: "professional", label: "Professional", description: "Working professional for career development" },
//     { value: "counselor", label: "Counselor/Educator", description: "Guide others through assessments" },
//     { value: "admin", label: "Administrator", description: "Manage platform and users" },
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <Link to="/" className="inline-flex items-center space-x-2 mb-8">
//             <Brain className="h-8 w-8 text-primary" />
//             <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//               PathGrad
//             </span>
//           </Link>
//           <h2 className="text-3xl font-bold">Create your account</h2>
//           <p className="text-muted-foreground mt-2">
//             Join thousands discovering their potential
//           </p>
//         </div>

//         <Card className="shadow-elegant animate-scale-in">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">Sign up</CardTitle>
//             <CardDescription className="text-center">
//               Create your account to start your assessment journey
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
              
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name *</Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   disabled={isLoading}
//                   className="transition-all focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address *</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   disabled={isLoading}
//                   className="transition-all focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="role">Role *</Label>
//                 <Select onValueChange={(value) => handleChange("role", value)} disabled={isLoading}>
//                   <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
//                     <SelectValue placeholder="Select your role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roleOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         <div className="flex flex-col">
//                           <span className="font-medium">{option.label}</span>
//                           <span className="text-xs text-muted-foreground">{option.description}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password *</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a strong password"
//                     value={formData.password}
//                     onChange={(e) => handleChange("password", e.target.value)}
//                     disabled={isLoading}
//                     className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//                 {formData.password && (
//                   <div className="text-xs space-y-1">
//                     <div className={`flex items-center ${formData.password.length >= 8 ? 'text-success' : 'text-muted-foreground'}`}>
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       At least 8 characters
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password *</Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={(e) => handleChange("confirmPassword", e.target.value)}
//                     disabled={isLoading}
//                     className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="terms"
//                   checked={formData.agreeToTerms}
//                   onCheckedChange={(checked) => handleChange("agreeToTerms", checked)}
//                   disabled={isLoading}
//                 />
//                 <Label htmlFor="terms" className="text-sm">
//                   I agree to the{" "}
//                   <Link to="/terms" className="text-primary hover:underline">
//                     Terms and Conditions
//                   </Link>{" "}
//                   and{" "}
//                   <Link to="/privacy" className="text-primary hover:underline">
//                     Privacy Policy
//                   </Link>
//                 </Label>
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full shadow-soft" 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating account...
//                   </>
//                 ) : (
//                   "Create Account"
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 text-center text-sm">
//               <span className="text-muted-foreground">Already have an account? </span>
//               <Link to="/login" className="text-primary hover:underline">
//                 Sign in
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };