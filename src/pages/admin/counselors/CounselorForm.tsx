import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCounselorStore } from "@/store/counsellorStore";
import {
    Loader2,
    Save,
    User,
    Mail,
    Phone,
    Briefcase,
    Award,
    Building2,
    Shield,
    Star,
    Quote,
    Eye,
    EyeOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CounsellorForm = () => {
    const { id } = useParams<{ id: string }>();
    const { counselor, loading, createCounselor, fetchCounselor, updateCounselor } = useCounselorStore();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        highestQualification: "",
        yearsOfExperience: 0,
        areaOfSpecialization: "",
        currentOrganization: "",
        professionalBio: "",
        licenseNumber: ""
    });

    // Load existing counselor if editing
    useEffect(() => {
        if (id) fetchCounselor(id);
    }, [id, fetchCounselor]);

    // Set form data when counselor is loaded
    useEffect(() => {
        if (counselor && id) {
            setFormData({
                firstName: counselor.firstName || "",
                lastName: counselor.lastName || "",
                email: counselor.email || "",
                password: "",
                confirmPassword: "",
                phoneNumber: counselor.phoneNumber || "",
                highestQualification: counselor.highestQualification || "",
                yearsOfExperience: counselor.yearsOfExperience || 0,
                areaOfSpecialization: counselor.areaOfSpecialization || "",
                currentOrganization: counselor.currentOrganization || "",
                professionalBio: counselor.professionalBio || "",
                licenseNumber: counselor.licenseNumber || "",
            });
        }
    }, [counselor, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id && formData.password && formData.password !== formData.confirmPassword) {
            toast({ variant: "destructive", description: "Passwords do not match." });
            return;
        }

        try {
            if (id) {
                const payload = { ...formData };
                delete (payload as any).confirmPassword;
                if (!payload.password) delete (payload as any).password;
                await updateCounselor(id, payload);
            } else {
                const payload = { ...formData };
                delete (payload as any).confirmPassword;
                await createCounselor(payload);
            }
            navigate("/manage/counselors");
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", description: "Failed to save counselor record." });
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (id && loading && !counselor) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-500 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Loading Expert Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-2 px-3 sm:px-4">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Modern Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-500 text-[8px] uppercase tracking-widest font-bold px-1.5 py-0">
                                Faculty Management
                            </Badge>
                        </div>
                        <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                            {id ? "Edit Profile" : "New Counselor"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Expert Dossier</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/counselors")}
                            className="bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold h-7 px-3 text-[10px] transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold h-7 px-4 text-[10px] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 rounded-lg"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Save className="h-3 w-3 mr-1.5" />}
                            Save
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2 auto-rows-min">

                    {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"></div>
                        <CardContent className="p-3">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Visual Avatar Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border-2 border-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <Briefcase className="h-5 w-5 text-indigo-300" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center">
                                        <Badge className="bg-indigo-100 text-indigo-600 border-none scale-75 h-4">PRO</Badge>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-bold text-slate-500">First Name</Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className="h-7 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-lg font-bold text-slate-700 text-[10px]"
                                            placeholder="Given Name"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-bold text-slate-500">Last Name</Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className="h-7 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-lg font-bold text-slate-700 text-[10px]"
                                            placeholder="Family Name"
                                        />
                                    </div>
                                    <div className="space-y-0.5 col-span-2">
                                        <Label className="text-[10px] font-bold text-slate-500">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="h-7 pl-8 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px]"
                                                placeholder="counselor@institute.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-bold text-slate-500">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                            <Input
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                className="h-8 pl-8 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px]"
                                                placeholder="+1 (555)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: EXPERIENCE METRIC - Spans 4 cols */}
                    <Card className="md:col-span-4 border-none shadow-elegant bg-[#0F172A] text-white rounded-xl overflow-hidden relative group flex flex-col h-full border border-slate-800">
                        {/* Interactive Background Glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
                        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                        <CardHeader className="p-3 pb-0 relative z-10 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Star className="h-3 w-3 text-amber-400 group-hover:rotate-12 transition-transform" />
                                    <h3 className="text-[10px] uppercase tracking-wider font-black text-slate-400">Experience</h3>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-3 relative z-10 flex flex-col justify-between flex-grow">
                            <div className="text-center py-2 flex flex-col items-center justify-center flex-grow">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    {formData.yearsOfExperience}+
                                </span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Total Years</span>
                            </div>

                            <div className="space-y-1 mt-auto">
                                <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Adjust Tenure</Label>
                                <Select
                                    value={String(formData.yearsOfExperience || "")}
                                    onValueChange={(val) => handleInputChange("yearsOfExperience", Number(val))}
                                >
                                    <SelectTrigger className="h-7 bg-white/5 border-white/10 text-white font-bold hover:bg-white/10 transition-all border-none focus:ring-1 focus:ring-amber-500/50 rounded-lg px-2 text-[10px]">
                                        <SelectValue placeholder="Update" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        {[1, 2, 3, 5, 8, 10, 15, 20].map((yr) => (
                                            <SelectItem key={yr} value={String(yr)} className="text-[10px] focus:bg-amber-500/10 focus:text-amber-200">
                                                {yr}+ {yr === 1 ? 'Year' : 'Years'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 3: PROFESSIONAL RECORD (Credentials + Bio) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col">
                        <CardHeader className="p-3 pb-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Award className="h-3.5 w-3.5 text-violet-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Professional Record</h3>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Quote className="h-3 w-3 text-indigo-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bio Included</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-bold text-slate-500">Highest Qualification</Label>
                                    <Select
                                        value={formData.highestQualification}
                                        onValueChange={(val) => handleInputChange("highestQualification", val)}
                                    >
                                        <SelectTrigger className="h-7 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px] px-2">
                                            <SelectValue placeholder="Degree" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                            <SelectItem value="master">Master's Degree</SelectItem>
                                            <SelectItem value="phd">PhD</SelectItem>
                                            <SelectItem value="diploma">Professional Diploma</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-bold text-slate-500">Specialization</Label>
                                    <Select
                                        value={formData.areaOfSpecialization}
                                        onValueChange={(val) => handleInputChange("areaOfSpecialization", val)}
                                    >
                                        <SelectTrigger className="h-7 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px] px-2">
                                            <SelectValue placeholder="Domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="academic">Academic Counselling</SelectItem>
                                            <SelectItem value="career">Career Guidance</SelectItem>
                                            <SelectItem value="mental-health">Mental Health</SelectItem>
                                            <SelectItem value="college-admission">College Admission</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-bold text-slate-500">Organization</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                        <Input
                                            value={formData.currentOrganization}
                                            onChange={(e) => handleInputChange("currentOrganization", e.target.value)}
                                            className="h-7 pl-8 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px]"
                                            placeholder="Institution Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-bold text-slate-500">License ID</Label>
                                    <Input
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                        className="h-7 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-lg font-semibold text-slate-700 text-[10px]"
                                        placeholder="Lic. #"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 border-t border-slate-100 pt-2">
                                <Label className="text-[10px] font-bold text-slate-500">Professional Introduction (Bio)</Label>
                                <Textarea
                                    value={formData.professionalBio}
                                    onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                                    placeholder="Write a brief intro about your expertise and approach..."
                                    className="w-full min-h-[60px] bg-white border-slate-200/50 hover:border-indigo-200 focus:bg-white rounded-lg resize-none text-slate-700 font-medium text-[10px] leading-relaxed p-2.5 outline-none transition-all"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 4: SECURITY - Spans 4 cols */}
                    <div className="md:col-span-4 flex flex-col h-full">
                        {/* Security (If creating new) */}
                        {!id && (
                            <Card className="border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden flex-grow flex flex-col border border-white">
                                <CardHeader className="p-3 pb-1 border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-amber-50 rounded-lg">
                                            <Shield className="h-3.5 w-3.5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Access Lock</h3>
                                            <p className="text-[9px] text-slate-400 font-bold -mt-0.5">Secure Credentials</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 flex-grow flex flex-col gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 flex justify-between">
                                            System Password
                                            <span className="text-amber-500 text-[8px]">Required</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                                className="h-7 bg-slate-50 border-slate-200/50 focus:border-indigo-400 focus:ring-0 rounded-lg font-semibold text-[10px] pr-8 transition-all"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500">Confirm Identity</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                                className="h-7 bg-slate-50 border-slate-200/50 focus:border-indigo-400 focus:ring-0 rounded-lg font-semibold text-[10px] pr-8 transition-all"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-2">
                                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0 animate-pulse"></div>
                                            <p className="text-[9px] text-slate-500 font-medium leading-tight">
                                                Use a combination of special characters and numbers for maximum security.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* If editing, show the Tips card */}
                        {id && (
                            <Card className="border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden flex-grow border border-white">
                                <CardHeader className="p-3 pb-1 border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 rounded-lg">
                                            <Star className="h-3.5 w-3.5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Quick Insight</h3>
                                            <p className="text-[9px] text-slate-400 font-bold -mt-0.5">Profile Maintenance</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 flex-grow">
                                    <div className="space-y-3">
                                        <div className="group cursor-default">
                                            <p className="text-[10px] text-slate-600 font-bold group-hover:text-indigo-600 transition-colors">Achievements & Bio</p>
                                            <p className="text-[9px] text-slate-400 leading-relaxed">Update bio to reflect recent professional milestones and current focus.</p>
                                        </div>
                                        <div className="group cursor-default pt-2 border-t border-slate-50">
                                            <p className="text-[10px] text-slate-600 font-bold group-hover:text-indigo-600 transition-colors">Credential Audit</p>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">Ensure license numbers and qualification titles match official records.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CounsellorForm;
