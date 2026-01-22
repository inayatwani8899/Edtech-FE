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
    Quote
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
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Modern Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                                Faculty Management
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {id ? "Edit Profile" : "New Counselor"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Expert Dossier</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/counselors")}
                            className="bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold h-10 px-5 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold h-10 px-6 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 rounded-xl"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Record
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

                    {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"></div>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Visual Avatar Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <Briefcase className="h-12 w-12 text-indigo-300" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center">
                                        <Badge className="bg-indigo-100 text-indigo-600 border-none">Counselor</Badge>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">First Name</Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Given Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Last Name</Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Family Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold text-slate-500">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="counselor@institute.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: EXPERIENCE METRIC - Spans 4 cols */}
                    <Card className="md:col-span-4 border-none shadow-elegant bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    <Star className="h-5 w-5 text-indigo-300" />
                                </div>
                                <h3 className="text-lg font-bold">Experience</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 space-y-4">
                            <div className="text-center py-2">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                                    {formData.yearsOfExperience}+
                                </span>
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Years Active</p>
                            </div>
                            <Select
                                value={String(formData.yearsOfExperience || "")}
                                onValueChange={(val) => handleInputChange("yearsOfExperience", Number(val))}
                            >
                                <SelectTrigger className="h-10 bg-white/10 border-white/5 text-white font-bold hover:bg-white/20 transition-all border-none focus:ring-0 rounded-xl">
                                    <SelectValue placeholder="Update Years" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                    <SelectItem value="1">1 Year</SelectItem>
                                    <SelectItem value="2">2 Years</SelectItem>
                                    <SelectItem value="3">3 Years</SelectItem>
                                    <SelectItem value="5">5 Years</SelectItem>
                                    <SelectItem value="10">10+ Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* CARD 3: CREDENTIALS (Horizontal Strip) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-violet-600" />
                                <h3 className="text-lg font-bold text-slate-900">Professional Credentials</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">Highest Qualification</Label>
                                    <Select
                                        value={formData.highestQualification}
                                        onValueChange={(val) => handleInputChange("highestQualification", val)}
                                    >
                                        <SelectTrigger className="h-11 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-xl font-semibold text-slate-700">
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
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">Specialization</Label>
                                    <Select
                                        value={formData.areaOfSpecialization}
                                        onValueChange={(val) => handleInputChange("areaOfSpecialization", val)}
                                    >
                                        <SelectTrigger className="h-11 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-xl font-semibold text-slate-700">
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
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">Current Organization</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            value={formData.currentOrganization}
                                            onChange={(e) => handleInputChange("currentOrganization", e.target.value)}
                                            className="h-11 pl-10 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-xl font-semibold text-slate-700"
                                            placeholder="Institution Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">License ID</Label>
                                    <Input
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                        className="h-11 bg-white border-slate-200/50 hover:border-violet-200 transition-all rounded-xl font-semibold text-slate-700"
                                        placeholder="Lic. #"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 4: BIO & SECURITY - Spans 4 cols */}
                    <div className="md:col-span-4 space-y-6">
                        <Card className="border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden flex-grow">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center gap-2">
                                    <Quote className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Bio</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    value={formData.professionalBio}
                                    onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                                    placeholder="Write a professional introduction..."
                                    className="w-full min-h-[140px] bg-white/50 border-slate-200/50 hover:border-indigo-200 focus:bg-white rounded-xl resize-none text-slate-700 font-medium leading-relaxed p-4 outline-none transition-all"
                                />
                            </CardContent>
                        </Card>

                        {/* Security (If creating new) */}
                        {!id && (
                            <Card className="border-none shadow-elegant bg-amber-50/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-amber-600" />
                                        <h3 className="text-lg font-bold text-slate-900">Security</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="h-11 bg-white border-amber-200/50 focus:border-amber-400 rounded-xl font-semibold"
                                        placeholder="Set Password"
                                    />
                                    <Input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        className="h-11 bg-white border-amber-200/50 focus:border-amber-400 rounded-xl font-semibold"
                                        placeholder="Confirm Password"
                                    />
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
