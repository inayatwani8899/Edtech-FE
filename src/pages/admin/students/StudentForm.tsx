import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentStore, Student } from "../../../store/studentStore";
import { Loader2 } from "lucide-react";

interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string; // Changed from phoneNumber to phone
    gradeLevel: string;
    dateOfBirth: string;
}

const StudentForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { student, loading, error, fetchStudent, createStudent, updateStudent, clearStudent } = useStudentStore();
    
    const [formData, setFormData] = useState<StudentFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "", // Changed from phoneNumber to phone
        gradeLevel: "",
        dateOfBirth: ""
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchStudent(id);
        }
        
        return () => {
            clearStudent();
        };
    }, [id, fetchStudent, clearStudent]);

    useEffect(() => {
        if (id && student) {
            setFormData({
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                email: student.email || "",
                phone: student.phone || "", // Changed from phoneNumber to phone
                gradeLevel: student.gradeLevel || "",
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ""
            });
        }
    }, [student, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Transform form data to match API requirements
            const studentData = {
                ...formData
            };
            
            if (id) {
                // For updates, we need to send the ID in the body
                await updateStudent(id, studentData);
            } else {
                // For creation, use the transformed data
                await createStudent(studentData);
            }
            
            navigate("/manage/students");
        } catch (err) {
            console.error("Failed to save student:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{id ? "Edit Student" : "Add Student"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {(loading && id) ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                            <span className="text-lg">Loading Student...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="gradeLevel">Grade Level</Label>
                                    <Input
                                        id="gradeLevel"
                                        name="gradeLevel"
                                        value={formData.gradeLevel}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            {error && (
                                <div className="text-red-500 text-sm py-2">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/manage/students")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Student"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default StudentForm;