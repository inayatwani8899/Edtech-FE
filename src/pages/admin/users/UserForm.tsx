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
    Award,
    Sparkles,
    Shield,
    Star
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
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Retrieving Dossier...</p>
            </div>
        );
    }

    const isStudent = selectedRole?.name.toLowerCase() === "student";
    const isCounselor = selectedRole?.name.toLowerCase() === "counsellor";
    const isAdminRole = selectedRole?.name.toLowerCase() === "admin";

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-sky-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Modern Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                                User Management
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {id ? "Edit Profile" : "New User"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Identity Hub</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/users")}
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
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500"></div>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Visual Avatar Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        {isStudent ? (
                                            <GraduationCap className="h-12 w-12 text-slate-300" />
                                        ) : isCounselor ? (
                                            <Briefcase className="h-12 w-12 text-slate-300" />
                                        ) : (
                                            <User className="h-12 w-12 text-slate-300" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                            {selectedRole?.name || "Unknown Role"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">First Name</Label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleFormChange}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Given Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Last Name</Label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleFormChange}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Family Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold text-slate-500">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="user@institution.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleFormChange}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: DYNAMIC METRICS - Spans 4 cols */}
                    <Card className="md:col-span-4 border-none shadow-elegant bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-[2rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    {isStudent ? <GraduationCap className="h-5 w-5 text-sky-300" /> :
                                        isCounselor ? <Star className="h-5 w-5 text-amber-300" /> :
                                            <ShieldCheck className="h-5 w-5 text-emerald-300" />}
                                </div>
                                <h3 className="text-lg font-bold">
                                    {isStudent ? "Academic Grade" :
                                        isCounselor ? "Experience" :
                                            "System Access"}
                                </h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 space-y-4">
                            {isStudent ? (
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight leading-none">
                                        {formData.gradeLevel || "N/A"}
                                    </div>
                                    <Select
                                        value={formData.gradeLevel}
                                        onValueChange={(val) => setFormData({ gradeLevel: val })}
                                    >
                                        <SelectTrigger className="h-10 bg-white/10 border-white/5 text-white font-bold hover:bg-white/20 transition-all border-none focus:ring-0 rounded-xl">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            {gradeOptions.map((grade, idx) => (
                                                <SelectItem key={idx} value={grade} className="focus:bg-slate-800 focus:text-white">{grade}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : isCounselor ? (
                                <div className="text-center py-2">
                                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                                        {formData.yearsOfExperience}+
                                    </span>
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Years Active</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-2 h-full">
                                    {formData.isAdmin ? (
                                        <Badge className="bg-emerald-500 text-white px-4 py-1 text-xs">Full Admin</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-300 border-slate-600 px-4 py-1 text-xs">Standard User</Badge>
                                    )}
                                    <div className="mt-4 w-full">
                                        <Label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Role Selection</Label>
                                        <Select
                                            value={formData.roleId !== 0 ? String(formData.roleId) : ""}
                                            onValueChange={handleRoleChange}
                                        >
                                            <SelectTrigger className="h-10 bg-white/10 border-white/5 text-white font-bold hover:bg-white/20 transition-all border-none focus:ring-0 rounded-xl">
                                                <SelectValue placeholder="Change Role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={String(role.id)} className="focus:bg-slate-800 focus:text-white">
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* CARD 3: ROLE-SPECIFIC DETAILS (Wide Strip) - Spans 8 cols */}
                    {isCounselor && (
                        <Card className="md:col-span-8 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-emerald-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Professional Credentials</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Highest Qualification</Label>
                                        <Input
                                            name="highestQualification"
                                            value={formData.highestQualification}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white border-slate-200/50 hover:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                            placeholder="Degree"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Specialization</Label>
                                        <Input
                                            name="areaOfSpecialization"
                                            value={formData.areaOfSpecialization}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white border-slate-200/50 hover:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                            placeholder="Field of Study"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Current Organization</Label>
                                        <Input
                                            name="currentOrganization"
                                            value={formData.currentOrganization}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white border-slate-200/50 hover:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                            placeholder="Institution Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">License ID</Label>
                                        <Input
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white border-slate-200/50 hover:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                            placeholder="Lic. #"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {isStudent && (
                        <Card className="md:col-span-8 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-sky-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Student Particulars</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Date of Birth</Label>
                                        <Input
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleFormChange}
                                            className="h-11 bg-white border-slate-200/50 hover:border-sky-200 transition-all rounded-xl font-semibold text-slate-700"
                                        />
                                    </div>
                                    {/* Placeholder for future student fields like Guardian, etc. */}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CARD 4: BIO OR ADMIN SETTINGS - Spans 4 cols -> actually fits in remaining space */}
                    <div className="md:col-span-4 space-y-6">
                        {/* Bio is mostly for Counselors, but users might have it? */}
                        {isCounselor && (
                            <Card className="border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden flex-grow">
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-indigo-600" />
                                        <h3 className="text-lg font-bold text-slate-900">Bio</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <textarea
                                        name="professionalBio"
                                        value={formData.professionalBio}
                                        onChange={(e) => setFormData({ professionalBio: e.target.value })}
                                        placeholder="Professional statement..."
                                        className="w-full min-h-[140px] bg-white/50 border-slate-200/50 hover:border-indigo-200 focus:bg-white rounded-xl resize-none text-slate-700 font-medium leading-relaxed p-4 outline-none transition-all"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Admin Privileges Checkbox */}
                        {isAdminRole && (
                            <Card className="border-none shadow-elegant bg-slate-900 text-white rounded-[2rem] overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <Checkbox
                                        id="isAdmin"
                                        checked={formData.isAdmin}
                                        onCheckedChange={(checked) => setFormData({ isAdmin: checked as boolean })}
                                        className="h-6 w-6 border-white/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                    <div className="space-y-0.5">
                                        <Label htmlFor="isAdmin" className="text-sm font-bold cursor-pointer hover:text-emerald-300 transition-colors">Administrator Privileges</Label>
                                        <p className="text-[10px] text-slate-400">Grant full system configuration access.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Password/Security (If creating new) */}
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
                                        onChange={(e) => setFormData({ password: e.target.value })}
                                        className="h-11 bg-white border-amber-200/50 focus:border-amber-400 rounded-xl font-semibold"
                                        placeholder="Set Password"
                                    />
                                    <Input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ confirmPassword: e.target.value })}
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

export default UserForm;