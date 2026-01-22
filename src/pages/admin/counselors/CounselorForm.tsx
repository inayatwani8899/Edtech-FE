import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    Fingerprint,
    Shield,
    Sparkles,
    CheckCircle2,
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

    const [focusedField, setFocusedField] = useState<string | null>(null);

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
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] relative overflow-hidden flex flex-col">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50 via-slate-50 to-transparent pointer-events-none z-0" />
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[100px] animate-pulse z-0" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse z-0" />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/manage/counselors")} className="rounded-full hover:bg-slate-100 text-slate-500">
                        <span className="sr-only">Back</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {id ? "Edit Profile" : "Create Profile"}
                        </h1>
                        <p className="text-xs font-medium text-slate-500">
                            Counselor Directory &bull; {formData.firstName ? `${formData.firstName} ${formData.lastName}` : "New Entry"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/manage/counselors")}
                        className="text-slate-500 hover:text-slate-800 hidden sm:flex font-medium"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 shadow-xl shadow-slate-900/10 transition-all hover:scale-105 active:scale-95 font-bold"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {id ? "Save Changes" : "Publish Profile"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 max-w-[1600px] mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">

                {/* LEFT COLUMN: The Editor */}
                <div className="lg:col-span-7 space-y-10 pb-20">

                    {/* Section 01: Identity */}
                    <div className="group space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-900/20">01</div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 md:pl-14">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className="h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold text-lg transition-all"
                                    placeholder="e.g. Sarah"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className="h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold text-lg transition-all"
                                    placeholder="e.g. Connor"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="h-12 pl-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-medium text-base transition-all"
                                        placeholder="sarah.connor@institute.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className="h-12 pl-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-medium text-base transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-200/60" />

                    {/* Section 02: Credentials */}
                    <div className="group space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm shadow-sm">02</div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Professional Config</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 md:pl-14">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</Label>
                                <Select
                                    value={formData.highestQualification}
                                    onValueChange={(val) => { handleInputChange("highestQualification", val); setFocusedField('qual') }}
                                >
                                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl font-semibold text-slate-700">
                                        <SelectValue placeholder="Select Degree" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                        <SelectItem value="master">Master's Degree</SelectItem>
                                        <SelectItem value="phd">PhD</SelectItem>
                                        <SelectItem value="diploma">Professional Diploma</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</Label>
                                <Select
                                    value={String(formData.yearsOfExperience || "")}
                                    onValueChange={(val) => handleInputChange("yearsOfExperience", Number(val))}
                                >
                                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl font-semibold text-slate-700">
                                        <SelectValue placeholder="Years Active" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Year</SelectItem>
                                        <SelectItem value="3">3 Years</SelectItem>
                                        <SelectItem value="5">5 Years</SelectItem>
                                        <SelectItem value="10">10+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization Area</Label>
                                <Select
                                    value={formData.areaOfSpecialization}
                                    onValueChange={(val) => { handleInputChange("areaOfSpecialization", val); setFocusedField('spec') }}
                                >
                                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl font-semibold text-slate-700">
                                        <SelectValue placeholder="Primary Domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="academic">Academic Counselling</SelectItem>
                                        <SelectItem value="career">Career Guidance</SelectItem>
                                        <SelectItem value="mental-health">Mental Health</SelectItem>
                                        <SelectItem value="college-admission">College Admission</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution / Organization</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    <Input
                                        value={formData.currentOrganization}
                                        onChange={(e) => handleInputChange("currentOrganization", e.target.value)}
                                        onFocus={() => setFocusedField('org')}
                                        onBlur={() => setFocusedField(null)}
                                        className="h-12 pl-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-medium text-base transition-all"
                                        placeholder="Current Workplace"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-200/60" />

                    {/* Section 03: Biography */}
                    <div className="group space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm shadow-sm">03</div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Public Profile</h2>
                        </div>
                        <div className="pl-4 md:pl-14 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</Label>
                                <Textarea
                                    value={formData.professionalBio}
                                    onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                                    onFocus={() => setFocusedField('bio')}
                                    onBlur={() => setFocusedField(null)}
                                    className="min-h-[150px] bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-medium text-base p-4 leading-relaxed resize-none"
                                    placeholder="Write a compelling introduction..."
                                />
                                <div className="flex justify-end">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formData.professionalBio.length} Characters</span>
                                </div>
                            </div>

                            {!id && (
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-4 w-4 text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Security Credentials</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input type="password" placeholder="Set Password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className="bg-white border-slate-200" />
                                        <Input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} className="bg-white border-slate-200" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: The Interactive Preview */}
                <div className="lg:col-span-5 hidden lg:block">
                    <div className="sticky top-32">
                        <div className="relative">
                            {/* Decorative Glow behind the card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 blur-[80px] opacity-20 rounded-full"></div>

                            {/* The Card */}
                            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden relative transform transition-all duration-700 hover:scale-[1.02]">
                                <div className="h-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                            <Sparkles className="h-5 w-5 text-indigo-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-8 pb-8 -mt-16 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <div className="h-32 w-32 rounded-[2rem] bg-white p-1.5 shadow-xl">
                                            <div className="h-full w-full rounded-[1.6rem] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                                {/* If they had an image we'd show it, else icon */}
                                                <User className="h-12 w-12 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="mb-2 space-y-1 text-right">
                                            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-none px-3 py-1 rounded-full text-[10px] items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                VERIFIED COUNSELOR
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-1">
                                        <h2 className={`text-3xl font-black text-slate-900 tracking-tight transition-all duration-300 ${!formData.firstName ? "opacity-30" : ""}`}>
                                            {formData.firstName || "Name"} {formData.lastName}
                                        </h2>
                                        <p className={`text-sm font-bold text-indigo-600 uppercase tracking-wide transition-all duration-300 ${!formData.areaOfSpecialization ? "opacity-30" : ""}`}>
                                            {formData.areaOfSpecialization ? formData.areaOfSpecialization.replace("-", " ") : "Specialization"} Specialization
                                        </p>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 ${focusedField === 'org' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                                            <Building2 className="h-4 w-4 text-slate-400 mb-2" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Organization</p>
                                            <p className="font-bold text-slate-800 text-sm truncate">{formData.currentOrganization || "N/A"}</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 ${focusedField === 'qual' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                                            <Award className="h-4 w-4 text-slate-400 mb-2" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Credentials</p>
                                            <p className="font-bold text-slate-800 text-sm capitalize">{formData.highestQualification || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className={`mt-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 transition-all duration-500 ${focusedField === 'bio' ? 'scale-[1.02] shadow-sm' : ''}`}>
                                        <Quote className="h-4 w-4 text-indigo-300 mb-2" />
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-4 italic">
                                            "{formData.professionalBio || "Biography will appear here..."}"
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available for Sessions</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-slate-900">{formData.yearsOfExperience}+</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Years Exp.</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="mt-6 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Profile Preview Mode</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CounsellorForm;
