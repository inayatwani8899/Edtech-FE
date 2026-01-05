import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentStore, Student } from "../../../store/studentStore";
import { Loader2, Calendar, Phone, Mail, User, School } from "lucide-react";

const StudentView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { student, loading, error, fetchStudent, clearStudent } = useStudentStore();

    useEffect(() => {
        if (id) {
            fetchStudent(id);
        }
        
        return () => {
            clearStudent();
        };
    }, [id, fetchStudent, clearStudent]);

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                    <span className="text-lg">Loading Student Details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center text-red-500">
                            <div className="text-lg font-semibold mb-2">Error Loading Student</div>
                            <p className="mb-4">{error}</p>
                            <Button onClick={() => navigate("/manage/students")}>Back to Students</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <div className="text-lg font-semibold mb-2">Student Not Found</div>
                            <p className="mb-4">The requested student could not be found.</p>
                            <Button onClick={() => navigate("/manage/students")}>Back to Students</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>Student Details</CardTitle>
                        <Button 
                            variant="outline" 
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                        >
                            Edit Student
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{`${student.firstName} ${student.lastName}`}</h2>
                            <p className="text-muted-foreground">Student ID: {student.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>Email</span>
                            </div>
                            <p>{student.email || "N/A"}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>Phone</span>
                            </div>
                            <p>{student.phone || "N/A"}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <School className="h-4 w-4 mr-2" />
                                <span>Grade Level</span>
                            </div>
                            <p>{student.gradeLevel || "N/A"}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Date of Birth</span>
                            </div>
                            <p>
                                {student.dateOfBirth 
                                    ? new Date(student.dateOfBirth).toLocaleDateString() 
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/manage/students")}
                    >
                        Back to Students
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default StudentView;