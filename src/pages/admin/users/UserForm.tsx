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
import { ArrowLeft, Loader2 } from 'lucide-react';

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
        // Reset form and fetch roles on component mount
        resetFormData();
        fetchRoles();

        // Fetch user if editing
        if (id) {
            fetchUser(id);
        }

        // Cleanup on unmount
        return () => {
            resetFormData();
        };
    }, [id, fetchUser, fetchRoles, resetFormData]);

    // Populate form when user data is loaded (for edit mode)
    useEffect(() => {
        if (user && roles.length > 0 && id) {
            console.log(roles)
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
                // password: "",
                // confirmPassword: "",
            });
        }
    }, [user, roles, id, setFormData]);

  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords for new users
        if (!id && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Convert dateOfBirth from string to Date object for the API
        const payload = {
            ...formData,
            role: formData.role,
            roleId: formData.roleId,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        };

        // Cleanup for update
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
    // Show loading state
    if (id && (loading || rolesLoading) && !user) {
        return (
            <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-lg">Loading user data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 py-2 px-4">
            <div className="max-w-4xl mx-auto">
         
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            <h3 className="text-2xl font-small text-gray-900">
                                {id ? "Edit User" : "Add New User"}
                            </h3>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email / Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            {/* Password only for Add */}
                            {/* {!id && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )} */}

                            {/* Role */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <Select
                                        value={formData.roleId !== 0 ? String(formData.roleId) : ""}
                                        onValueChange={handleRoleChange}
                                        disabled={rolesLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select Role"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedRole?.name.toLowerCase() === "admin" && (
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Checkbox
                                            id="isAdmin"
                                            checked={formData.isAdmin}
                                            onCheckedChange={(checked) =>
                                                setFormData({ isAdmin: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="isAdmin" className="cursor-pointer">
                                            Administrator Access
                                        </Label>
                                    </div>
                                )}
                            </div>

                            {/* Counselor Fields */}
                            {selectedRole?.name.toLowerCase() === "counsellor" && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Counselor Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            name="highestQualification"
                                            placeholder="Highest Qualification"
                                            value={formData.highestQualification}
                                            onChange={handleFormChange}
                                        />
                                        <Input
                                            name="yearsOfExperience"
                                            type="number"
                                            placeholder="Years of Experience"
                                            value={formData.yearsOfExperience}
                                            onChange={handleNumberChange}
                                        />
                                        <Input
                                            name="areaOfSpecialization"
                                            placeholder="Area of Specialization"
                                            value={formData.areaOfSpecialization}
                                            onChange={handleFormChange}
                                        />
                                        <Input
                                            name="currentOrganization"
                                            placeholder="Current Organization"
                                            value={formData.currentOrganization}
                                            onChange={handleFormChange}
                                        />
                                        <Input
                                            name="licenseNumber"
                                            placeholder="License Number"
                                            value={formData.licenseNumber}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalBio">Professional Bio</Label>
                                        <textarea
                                            id="professionalBio"
                                            name="professionalBio"
                                            placeholder="Professional Bio"
                                            value={formData.professionalBio}
                                            onChange={(e) => setFormData({ professionalBio: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Student Fields */}
                            {selectedRole?.name.toLowerCase() === "student" && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Student Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gradeLevel">Grade Level</Label>
                                            <Select
                                                value={formData.gradeLevel}
                                                onValueChange={(val) =>
                                                    setFormData({ gradeLevel: val })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Grade Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gradeOptions.map((grade, idx) => (
                                                        <SelectItem key={idx} value={grade}>
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                            <Input
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/manage/users")}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {id ? "Updating..." : "Adding..."}
                                        </div>
                                    ) : (
                                        id ? "Update User" : "Add User"
                                    )}
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