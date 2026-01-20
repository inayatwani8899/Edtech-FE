import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store/userStore";
import {
    ArrowLeft,
    Loader2,
    ShieldCheck,
    Sparkles,
    User,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    Calendar as CalendarIcon,
    Save,
    Fingerprint,
    Cpu,
    Network
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const gradeOptions = [
    "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade",
];

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        // State
        user,
        loading,
        roles,
        rolesLoading,
        formData,
        selectedRole,
        // Actions
        fetchUser,
        createUser,
        updateUser,
        fetchRoles,
        resetFormData,
        handleFormChange,
        handleRoleChange,
        handleNumberChange,
        setFormData
    } = useUserStore();

    // Initialize form and fetch data
    useEffect(() => {
        resetFormData();
        fetchRoles();
        if (id) {
            fetchUser(id);
        }
        return () => {
            resetFormData();
        };
    }, [id, fetchUser, fetchRoles, resetFormData]);

    // Populate form for edit mode
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id && formData.password !== formData.confirmPassword) {
            alert("Neural access keys do not match!");
            return;
        }

        const payload = {
            ...formData,
            role: formData.role,
            roleId: formData.roleId,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        };

        if (id) {
            delete (payload as any).confirmPassword;
            if (!payload.password) delete (payload as any).password;
            await updateUser(id, payload);
        } else {
            delete (payload as any).confirmPassword;
            await createUser(payload);
        }

        navigate("/manage/users");
    };

    if (id && (loading || rolesLoading) && !user) {
        return (
            <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-4 border-primary animate-spin"></div>
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                    <span className="text-xl font-black text-slate-400 uppercase tracking-[0.4em] block mb-2">Accessing Neural Records</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Deciphering institutional identity...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden py-6 px-4">
            {/* 🌌 Dynamic Backdrop */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/manage/users")}
                    className="mb-4 font-bold text-xs uppercase tracking-wide text-slate-400 hover:text-primary transition-all flex items-center gap-2 group px-4 py-2 rounded-xl hover:bg-white/50"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Users
                </Button>

                {/* Form Card */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-px w-6 bg-primary/40"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">User Configuration</span>
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
                                    {id ? "Edit" : "Add"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">User</span>
                                </h1>
                                <p className="text-slate-500 font-medium text-sm">
                                    Configure user details and permissions.
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-soft border border-white hidden sm:block">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info Section */}
                            <div className="space-y-4 p-5 rounded-xl bg-slate-50/40 border border-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Fingerprint className="h-4 w-4 text-primary" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-xs font-bold text-slate-500">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={handleFormChange}
                                            required
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold placeholder:text-slate-200 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-xs font-bold text-slate-500">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleFormChange}
                                            required
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold placeholder:text-slate-200 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-4 p-5 rounded-xl bg-indigo-50/30 border border-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold text-slate-500">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold placeholder:text-slate-200 focus:ring-2 focus:ring-indigo-600/10 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-xs font-bold text-slate-500">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="tel"
                                                placeholder="+1 234 567 8900"
                                                value={formData.phoneNumber}
                                                onChange={handleFormChange}
                                                className="h-11 bg-white/70 border-none rounded-xl font-semibold placeholder:text-slate-200 focus:ring-2 focus:ring-indigo-600/10 transition-all pl-10 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Section */}
                            <div className="space-y-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-white/10">
                                        <ShieldCheck className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40">Role & Permissions</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-xs font-bold text-white/30">User Role</Label>
                                        <Select
                                            value={formData.roleId !== 0 ? String(formData.roleId) : ""}
                                            onValueChange={handleRoleChange}
                                            disabled={rolesLoading}
                                        >
                                            <SelectTrigger className="h-11 bg-white/10 border-white/10 rounded-xl font-bold text-white focus:ring-2 focus:ring-primary/20 transition-all shadow-lg">
                                                <SelectValue placeholder={rolesLoading ? "Loading..." : "Select role"} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 bg-slate-900 text-white">
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={String(role.id)} className="rounded-lg font-semibold py-2 hover:bg-white/10">
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedRole?.name.toLowerCase() === "admin" && (
                                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 h-11 mt-auto">
                                            <Checkbox
                                                id="isAdmin"
                                                checked={formData.isAdmin}
                                                onCheckedChange={(checked) => setFormData({ isAdmin: checked as boolean })}
                                                className="h-5 w-5 rounded-md border-2 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <Label htmlFor="isAdmin" className="text-sm font-bold text-white/80 cursor-pointer">
                                                Admin Access
                                            </Label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Counselor Fields */}
                            {selectedRole?.name.toLowerCase() === "counsellor" && (
                                <div className="space-y-4 p-5 rounded-xl bg-emerald-50/30 border border-white/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                                            <Briefcase className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Professional Details</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            name="highestQualification"
                                            placeholder="Highest qualification"
                                            value={formData.highestQualification}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold shadow-sm"
                                        />
                                        <Input
                                            name="yearsOfExperience"
                                            type="number"
                                            placeholder="Years of experience"
                                            value={formData.yearsOfExperience}
                                            onChange={handleNumberChange}
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold shadow-sm"
                                        />
                                        <Input
                                            name="areaOfSpecialization"
                                            placeholder="Specialization"
                                            value={formData.areaOfSpecialization}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold shadow-sm"
                                        />
                                        <Input
                                            name="currentOrganization"
                                            placeholder="Current organization"
                                            value={formData.currentOrganization}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold shadow-sm"
                                        />
                                        <Input
                                            name="licenseNumber"
                                            placeholder="License number"
                                            value={formData.licenseNumber}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white/70 border-none rounded-xl font-semibold shadow-sm md:col-span-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalBio" className="text-xs font-bold text-slate-500">Professional Bio</Label>
                                        <textarea
                                            id="professionalBio"
                                            name="professionalBio"
                                            placeholder="Brief professional background..."
                                            value={formData.professionalBio}
                                            onChange={(e) => setFormData({ professionalBio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white/70 border-none rounded-xl font-semibold text-slate-900 placeholder:text-slate-200 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-sm resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Student Fields */}
                            {selectedRole?.name.toLowerCase() === "student" && (
                                <div className="space-y-4 p-5 rounded-xl bg-indigo-50/30 border border-white/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                                            <GraduationCap className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500">Grade Level</Label>
                                            <Select
                                                value={formData.gradeLevel}
                                                onValueChange={(val) => setFormData({ gradeLevel: val })}
                                            >
                                                <SelectTrigger className="h-11 bg-white/70 border-none rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 shadow-sm">
                                                    <SelectValue placeholder="Select grade" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-xl p-2 bg-white">
                                                    {gradeOptions.map((grade, idx) => (
                                                        <SelectItem key={idx} value={grade} className="font-semibold py-2 rounded-lg">
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth" className="text-xs font-bold text-slate-500">Date of Birth</Label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-200" />
                                                <Input
                                                    id="dateOfBirth"
                                                    name="dateOfBirth"
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleFormChange}
                                                    className="h-11 bg-white/70 border-none rounded-xl font-semibold pl-10 shadow-sm focus:ring-2 focus:ring-indigo-600/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-50">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate("/manage/users")}
                                    className="h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-wide text-slate-400 hover:bg-slate-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 px-8 rounded-xl bg-slate-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-2">
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                                        )}
                                        <span className="text-xs font-bold uppercase tracking-wide">
                                            {loading ? "Saving..." : (id ? "Update User" : "Create User")}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserForm;