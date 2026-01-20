import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
    User,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    Calendar as CalendarIcon,
    Save,
    Fingerprint,
    Building2,
    Award
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
        handleNumberChange,
        setFormData
    } = useUserStore();

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
            alert("Passwords do not match!");
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
            <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-primary animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">

                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            {id ? "Edit User" : "Create User"}
                        </h1>


                        <p className="text-sm font-medium text-slate-500">
                            Manage user identity, roles, and institutional access.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/manage/users")}
                            className="bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 h-10 px-5"
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary text-white font-bold h-10 px-6 shadow-lg shadow-primary/20 hover:bg-primary/90"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {id ? "Update User" : "Save Changes"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Form Column */}
                    <div className="lg:col-span-8 space-y-6">
                        <form id="user-form" onSubmit={handleSubmit} className="space-y-6">

                            {/* Personal & Contact Information Group */}
                            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-primary to-indigo-500 w-full"></div>
                                <CardHeader className="p-6 pb-2 border-b border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <User className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                            <p className="text-xs text-slate-500 font-medium">Basic identity and contact details</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 grid gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-xs font-bold uppercase text-slate-500 tracking-wider">First Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder="e.g. Jonathan"
                                                value={formData.firstName}
                                                onChange={handleFormChange}
                                                required
                                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold text-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                placeholder="e.g. Doe"
                                                value={formData.lastName}
                                                onChange={handleFormChange}
                                                required
                                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="h-11 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold text-slate-900"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.phoneNumber}
                                                    onChange={handleFormChange}
                                                    className="h-11 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dynamic Role Sections */}
                            {selectedRole?.name.toLowerCase() === "student" && (
                                <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="h-1 bg-indigo-500 w-full"></div>
                                    <CardHeader className="p-6 pb-2 border-b border-indigo-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">Student Profile</h3>
                                                <p className="text-xs text-slate-500 font-medium">Academic placement details</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Grade Level</Label>
                                            <Select
                                                value={formData.gradeLevel}
                                                onValueChange={(val) => setFormData({ gradeLevel: val })}
                                            >
                                                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 font-semibold text-slate-800">
                                                    <SelectValue placeholder="Select Grade" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {gradeOptions.map((grade, idx) => (
                                                        <SelectItem key={idx} value={grade}>{grade}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Date of Birth</Label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    name="dateOfBirth"
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleFormChange}
                                                    className="h-11 pl-10 bg-slate-50 border-slate-200 font-semibold text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {selectedRole?.name.toLowerCase() === "counsellor" && (
                                <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="h-1 bg-emerald-500 w-full"></div>
                                    <CardHeader className="p-6 pb-2 border-b border-emerald-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <Briefcase className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">Professional Profile</h3>
                                                <p className="text-xs text-slate-500 font-medium">Qualifications and expertise</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 grid gap-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Highest Qualification</Label>
                                                <div className="relative">
                                                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        name="highestQualification"
                                                        placeholder="e.g. Master's Degree"
                                                        value={formData.highestQualification}
                                                        onChange={handleFormChange}
                                                        className="h-11 pl-10 bg-slate-50 border-slate-200 font-semibold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Experience Items</Label>
                                                <Input
                                                    name="yearsOfExperience"
                                                    type="number"
                                                    placeholder="Years"
                                                    value={formData.yearsOfExperience}
                                                    onChange={handleNumberChange}
                                                    className="h-11 bg-slate-50 border-slate-200 font-semibold"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Area of Specialization</Label>
                                                <Input
                                                    name="areaOfSpecialization"
                                                    placeholder="e.g. Psychology"
                                                    value={formData.areaOfSpecialization}
                                                    onChange={handleFormChange}
                                                    className="h-11 bg-slate-50 border-slate-200 font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Organization</Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        name="currentOrganization"
                                                        placeholder="Current Organization"
                                                        value={formData.currentOrganization}
                                                        onChange={handleFormChange}
                                                        className="h-11 pl-10 bg-slate-50 border-slate-200 font-semibold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">License Number</Label>
                                            <div className="relative">
                                                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    name="licenseNumber"
                                                    placeholder="Professional License ID"
                                                    value={formData.licenseNumber}
                                                    onChange={handleFormChange}
                                                    className="h-11 pl-10 bg-slate-50 border-slate-200 font-semibold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Professional Bio</Label>
                                            <textarea
                                                name="professionalBio"
                                                placeholder="Brief professional summary..."
                                                value={formData.professionalBio}
                                                onChange={(e) => setFormData({ professionalBio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 placeholder:text-slate-400 resize-none focus:bg-white focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </form>
                    </div>

                    {/* Sidebar Configuration Column */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Role Selector Card */}
                        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden sticky top-6">
                            <CardHeader className="p-6 pb-2 border-b border-slate-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Role & Access</h3>
                                        <p className="text-xs text-slate-500 font-medium">System permissions</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Assigned Role</Label>
                                    <Select
                                        value={formData.roleId !== 0 ? String(formData.roleId) : ""}
                                        onValueChange={handleRoleChange}
                                        disabled={rolesLoading}
                                    >
                                        <SelectTrigger className="h-12 bg-white border-slate-200 font-bold text-slate-800 shadow-sm hover:border-slate-300">
                                            <SelectValue placeholder={rolesLoading ? "Loading..." : "Select Role"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)} className="font-semibold py-3 text-slate-700">
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedRole?.name.toLowerCase() === "admin" && (
                                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="isAdmin"
                                                checked={formData.isAdmin}
                                                onCheckedChange={(checked) => setFormData({ isAdmin: checked as boolean })}
                                                className="mt-1 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <div className="space-y-1">
                                                <Label htmlFor="isAdmin" className="text-sm font-bold cursor-pointer">Administrator Privileges</Label>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Grant full access to system configuration and user management.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Status</p>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">Active</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;