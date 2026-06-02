import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    EyeOff,
    CheckCircle2,
    ArrowLeft,
    Sparkles,
    Fingerprint,
    Globe,
    ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/axios";

const CounselorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [counselor, setCounselor] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        highestQualification: "",
        yearsOfExperience: 0,
        areaOfSpecialization: "",
        currentOrganization: "",
        licenseNumber: "",
        professionalBio: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (id) {
            fetchCounselor();
        }
    }, [id]);

    const fetchCounselor = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/Counsellor/${id}`);
            const data = response.data.data;
            setCounselor(data);
            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                highestQualification: data.highestQualification || "",
                yearsOfExperience: data.yearsOfExperience || 0,
                areaOfSpecialization: data.areaOfSpecialization || "",
                currentOrganization: data.currentOrganization || "",
                licenseNumber: data.licenseNumber || "",
                professionalBio: data.professionalBio || "",
                password: "",
                confirmPassword: ""
            });
        } catch (error) {
            toast.error("Failed to fetch counselor details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!id && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            if (id) {
                await api.put(`/Counsellor`, { ...formData, id });
                toast.success("Counselor profile updated successfully");
            } else {
                await api.post("/Counsellor/register", {
                    ...formData,
                    roleId: 2, // Default Counselor role ID found in app context
                    isAdmin: false
                });
                toast.success("New counselor registered successfully");
            }
            navigate("/manage/counselors");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (id && loading && !counselor) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Dossier...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA]  px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/counselors")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {id ? "Update Profile" : "Register Counselor"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Personnel Management Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/counselors")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {id ? "Sync Data" : "Activate"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: IDENTITY & STATUS */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                        <User className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : "Identification"}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Registry Dossier</p>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-left">
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1">Tenure</span>
                                        <span className="text-sm font-black text-slate-800">{formData.yearsOfExperience} <small className="text-[9px] opacity-40">YRS</small></span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-left">
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1">Status</span>
                                        <span className="text-sm font-black text-emerald-600">Active</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Update Tenure</Label>
                                    <Select
                                        value={String(formData.yearsOfExperience)}
                                        onValueChange={(val) => handleInputChange("yearsOfExperience", Number(val))}
                                    >
                                        <SelectTrigger className="w-full h-9 bg-slate-100/50 border-transparent rounded-xl px-3 text-[10px] font-bold text-slate-600 focus:ring-0">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                <span>Experience: {formData.yearsOfExperience}y</span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                            {[0, 1, 2, 3, 5, 8, 10, 15, 20].map((yr) => (
                                                <SelectItem key={yr} value={String(yr)} className="text-[10px] font-bold">{yr}+ Professional Years</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: PROFESSIONAL DETAILS & CONTACT */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Shield className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Professional Profile & Contact</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Link Active</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* PRIMARY IDENTITY & CONTACT GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">First Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" placeholder="Given Name" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Last Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" placeholder="Family Name" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight ml-1">Digital Mail (Email)</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="h-10 pl-9 bg-indigo-50/30 border-indigo-100/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                                                placeholder="address@domain.edu"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Signal Number</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" placeholder="+1 (000) 000-0000" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Academic Qualification</Label>
                                        <Select value={formData.highestQualification} onValueChange={(val) => handleInputChange("highestQualification", val)}>
                                            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm px-4 focus:ring-indigo-100">
                                                <SelectValue placeholder="Select Degree" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="bachelor" className="text-sm font-bold">Bachelor's Degree</SelectItem>
                                                <SelectItem value="master" className="text-sm font-bold">Master's Degree</SelectItem>
                                                <SelectItem value="phd" className="text-sm font-bold">PhD / Doctorate</SelectItem>
                                                <SelectItem value="diploma" className="text-sm font-bold">Professional Diploma</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Focus Specialization</Label>
                                        <Select value={formData.areaOfSpecialization} onValueChange={(val) => handleInputChange("areaOfSpecialization", val)}>
                                            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm px-4 focus:ring-indigo-100">
                                                <SelectValue placeholder="Select Domain" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="academic" className="text-sm font-bold">Academic Guidance</SelectItem>
                                                <SelectItem value="career" className="text-sm font-bold">Career Development</SelectItem>
                                                <SelectItem value="mental-health" className="text-sm font-bold">Psychology</SelectItem>
                                                <SelectItem value="college-admission" className="text-sm font-bold">Admissions</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Current Organization</Label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input value={formData.currentOrganization} onChange={(e) => handleInputChange("currentOrganization", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm transition-all" placeholder="Institution Name" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">License Verification #</Label>
                                        <div className="relative group">
                                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input value={formData.licenseNumber} onChange={(e) => handleInputChange("licenseNumber", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm transition-all" placeholder="LIC-XXXXXX" />
                                        </div>
                                    </div>

                                    {!id && (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-amber-600 uppercase tracking-tight ml-1">Access Password</Label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                                        className="h-10 bg-amber-50/30 border-amber-100 rounded-xl font-bold text-sm px-4 pr-10 focus:ring-amber-200"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-amber-600 uppercase tracking-tight ml-1">Verify Password</Label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                                        className="h-10 bg-amber-50/30 border-amber-100 rounded-xl font-bold text-sm px-4 pr-10 focus:ring-amber-200"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Quote className="h-3.5 w-3.5 text-indigo-400" />
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Professional narrative (Bio)</Label>
                                    </div>
                                    <Textarea value={formData.professionalBio} onChange={(e) => handleInputChange("professionalBio", e.target.value)} className="w-full min-h-[100px] bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none transition-all" placeholder="Enter expert philosophy and background description..." />
                                </div>
                            </CardContent>
                        </Card>

                        {/* ACTION STRIP */}
                        {id && (
                            <div className="mt-6 p-4 rounded-3xl bg-indigo-600 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20 group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5 text-indigo-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Dossier Synchronization Active</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Identity verified for secure update</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} className="bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg">
                                    Push Update
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default CounselorForm;
