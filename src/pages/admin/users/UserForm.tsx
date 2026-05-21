import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Loader2, 
    Save, 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Eye, 
    EyeOff, 
    ArrowLeft, 
    Sparkles, 
    Award,
    Building2,
    Briefcase,
    GraduationCap,
    Calendar as CalendarIcon,
    ChevronDown,
    Fingerprint,
    CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        user,
        loading,
        roles,
        rolesLoading,
        formData,
        selectedRole,
        fetchUser,
        createUser,
        updateUser,
        fetchRoles,
        resetFormData,
        handleFormChange,
        handleRoleChange,
        setFormData
    } = useUserStore();

    useEffect(() => {
        resetFormData();
        fetchRoles();
        if (id) {
            fetchUser(id);
        }
    }, [id, fetchUser, fetchRoles, resetFormData]);

    useEffect(() => {
        if (user && roles.length > 0 && id) {
            const userRole = roles.find(role => role.id === user.roleId);
            setFormData({
                email: user.email || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phoneNumber: user.phoneNumber || "",
                roleId: user.roleId || 0,
                role: userRole ? (userRole.name as any) : (user.role || ""),
                isAdmin: user?.isAdmin || false,
                highestQualification: user.highestQualification || "",
                yearsOfExperience: user.yearsOfExperience || 0,
                areaOfSpecialization: user.areaOfSpecialization || "",
                currentOrganization: user.currentOrganization || "",
                licenseNumber: user.licenseNumber || "",
                professionalBio: user.professionalBio || "",
                gradeLevel: user.gradeLevel || "",
                dateOfBirth: user.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                    : null,
            });
        }
    }, [user, roles, id, setFormData]);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error("Complete identity fields (First & Last Name)");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Valid institutional email required");
            return false;
        }
        if (!formData.roleId) {
            toast.error("System role must be assigned");
            return false;
        }
        if (!id && (!formData.password || formData.password !== formData.confirmPassword)) {
            toast.error("Passwords must be valid and match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
            roleId: formData.roleId,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        };

        try {
            if (id) {
                delete (payload as any).confirmPassword;
                if (!payload.password) delete (payload as any).password;
                await updateUser(id, payload);
                toast.success("Identity dossier synchronized successfully");
            } else {
                delete (payload as any).confirmPassword;
                await createUser(payload);
                toast.success("New personnel record initialized");
            }
            navigate("/manage/users");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Protocol synchronization failed");
        }
    };

    if (id && (loading || rolesLoading) && !user) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Central Registry...</p>
            </div>
        );
    }

    const isStudent = selectedRole?.name.toLowerCase() === "student" || formData.role?.toLowerCase() === "student";
    const isCounselor = selectedRole?.name.toLowerCase() === "counsellor" || formData.role?.toLowerCase() === "counsellor";
    const isAdminRole = selectedRole?.name.toLowerCase() === "admin" || selectedRole?.name.toLowerCase() === "superadmin" || formData.role?.toLowerCase() === "admin" || formData.role?.toLowerCase() === "superadmin";

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/users")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {id ? "Update User" : "Initialize Identity"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Core System Access Hub</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/users")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            Abort
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {id ? "Deploy Update" : "Activate"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: IDENTITY & ROLE */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Fingerprint className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : "Identification"}
                                </h2>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                                    {selectedRole?.name === "Admin" || selectedRole?.name === "SuperAdmin" ? "Super Admin" : (selectedRole?.name || "Pending...")}
                                </Badge>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50 text-left">
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">System Clearance</span>
                                        <div className="flex items-center justify-center gap-2">
                                            <Shield className={`h-3 w-3 ${formData.isAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                                            <span className={`text-[10px] font-black uppercase ${formData.isAdmin ? "text-emerald-600" : "text-slate-400"}`}>
                                                {formData.isAdmin ? "Terminal Super Admin" : "Restricted"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Switch Access Role</Label>
                                    <Select
                                        value={formData.roleId !== 0 ? String(formData.roleId) : ""}
                                        onValueChange={handleRoleChange}
                                    >
                                        <SelectTrigger className="w-full h-9 bg-slate-100/50 border-transparent rounded-xl px-3 text-[10px] font-bold text-slate-600 focus:ring-0">
                                            <SelectValue placeholder="System Role" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200">
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)} className="text-[10px] font-bold">
                                                    {role.name === "Admin" || role.name === "SuperAdmin" ? "Super Admin" : role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: CORE HUB */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <User className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Base Identity Records</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relay Connection Encrypted</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* PRIMARY IDENTITY GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Given Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input 
                                                name="firstName"
                                                value={formData.firstName} 
                                                onChange={handleFormChange} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" 
                                                placeholder="First Name" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Family Surname</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input 
                                                name="lastName"
                                                value={formData.lastName} 
                                                onChange={handleFormChange} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" 
                                                placeholder="Last Name" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight ml-1">System Mailbox</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <Input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                className="h-10 pl-9 bg-indigo-50/30 border-indigo-100/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                                                placeholder="user@institution.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Encryption Signal (Phone)</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input 
                                                name="phoneNumber"
                                                value={formData.phoneNumber} 
                                                onChange={handleFormChange} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all" 
                                                placeholder="+1 (000) 000-0000" 
                                            />
                                        </div>
                                    </div>

                                    {/* DYNAMIC ROLE FIELDS: STUDENT */}
                                    {isStudent && (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Academic Stratum (Grade)</Label>
                                                <Select value={formData.gradeLevel} onValueChange={(val) => setFormData({ gradeLevel: val })}>
                                                    <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm px-4">
                                                        <SelectValue placeholder="Select Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"].map((g) => (
                                                            <SelectItem key={g} value={g} className="text-sm font-bold">{g}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Solar Cycle Birth</Label>
                                                <div className="relative group">
                                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                                                    <Input 
                                                        type="date" 
                                                        name="dateOfBirth"
                                                        value={formData.dateOfBirth || ""} 
                                                        onChange={handleFormChange} 
                                                        className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm" 
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* DYNAMIC ROLE FIELDS: COUNSELOR */}
                                    {isCounselor && (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Highest Credential</Label>
                                                <Input name="highestQualification" value={formData.highestQualification} onChange={handleFormChange} className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm" placeholder="e.g. Masters in Psychology" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Years of Practice</Label>
                                                <Input name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleFormChange} className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Specialization Core</Label>
                                                <Input name="areaOfSpecialization" value={formData.areaOfSpecialization} onChange={handleFormChange} className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm shadow-sm" placeholder="Academic / Career Guidance" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Verification License</Label>
                                                <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleFormChange} className="h-10 bg-slate-50/50 border-slate-200/50 rounded-xl font-bold text-sm" placeholder="LIC-990-22" />
                                            </div>
                                        </>
                                    )}

                                    {/* SECURITY OVERRIDE (ADMIN) */}
                                    {isAdminRole && (
                                        <div className="col-span-full pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 text-white shadow-lg overflow-hidden relative">
                                                <Checkbox
                                                    id="isAdmin"
                                                    checked={formData.isAdmin}
                                                    onCheckedChange={(val) => setFormData({ isAdmin: !!val })}
                                                    className="h-6 w-6 border-white/20 data-[state=checked]:bg-emerald-500"
                                                />
                                                <div className="relative z-10">
                                                    <Label htmlFor="isAdmin" className="text-sm font-black cursor-pointer flex items-center gap-2">
                                                        Grant Terminal Administrator Privileges
                                                        <Sparkles className="h-3 w-3 text-amber-400" />
                                                    </Label>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Full access to system overrides and settings</p>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                            </div>
                                        </div>
                                    )}

                                    {/* PASSWORDS (NEW USERS) */}
                                    {!id && (
                                        <>
                                            <div className="space-y-1.5 pt-4">
                                                <Label className="text-[10px] font-bold text-amber-600 uppercase tracking-tight ml-1">Secure Passkey</Label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleFormChange}
                                                        className="h-10 bg-amber-50/30 border-amber-100/50 rounded-xl font-bold text-sm px-4 transition-all focus:bg-white"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 pt-4">
                                                <Label className="text-[10px] font-bold text-amber-600 uppercase tracking-tight ml-1">Confirm Integrity</Label>
                                                <div className="relative group">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleFormChange}
                                                        className="h-10 bg-amber-50/30 border-amber-100/50 rounded-xl font-bold text-sm px-4 transition-all focus:bg-white"
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

                                {/* BIO AREA FOR COUNSELORS */}
                                {isCounselor && (
                                    <div className="space-y-2 pt-4 border-t border-slate-50">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Professional Narrative</Label>
                                        <Textarea 
                                            name="professionalBio" 
                                            value={formData.professionalBio} 
                                            onChange={(e) => setFormData({ professionalBio: e.target.value })} 
                                            className="w-full min-h-[100px] bg-slate-50/50 border-slate-200/50 rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-100" 
                                            placeholder="Overview of expert background..." 
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* SYNC STRIP */}
                        {id && (
                            <div className="mt-6 p-4 rounded-3xl bg-indigo-600 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20 group animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5 text-indigo-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Dossier Synchronization Active</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Identity verified for global system update</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} className="bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                                    Push Record
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

export default UserForm;