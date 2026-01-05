import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useStudentStore, Student } from "../../../store/studentStore";
import { Pagination } from "../../../components/ui/pagination";
import { Plus, Search, Edit, Trash2, Loader2, Eye, Users2, ArrowUpDown } from 'lucide-react';

const Students: React.FC = () => {
    const navigate = useNavigate();
    const {
        students,
        loading,
        error,
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        sortDirection,
        setPage,
        setLimit,
        setSearchTerm,
        setSortDirection,
        fetchStudents,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteStudent,
    } = useStudentStore();

    useEffect(() => {
        fetchStudents();
    }, [currentPage, limit, searchTerm, sortDirection, fetchStudents]);

    const handleSortToggle = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Student Management</CardTitle>
                        <Button onClick={() => navigate("/students/add")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                            <span className="text-lg">Loading Students...</span>
                        </div>
                    ) : students?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No students found</h3>
                            {searchTerm && (
                                <p className="mb-4">No students match your search criteria.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="cursor-pointer" onClick={handleSortToggle}>
                                            <div className="flex items-center">
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Grade Level</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students?.map((student: Student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                {`${student.firstName} ${student.lastName}`}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.gradeLevel}</TableCell>
                                            <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View Student"
                                                        onClick={() => navigate(`/students/view/${student.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit Student"
                                                        onClick={() => navigate(`/students/edit/${student.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete Student"
                                                        onClick={() => openDeleteDialog(String(student.id))}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    limit={limit}
                                    onLimitChange={setLimit}
                                />

                                {/* Results count */}
                                <div className="text-sm text-muted-foreground text-center mt-4">
                                    Showing {((currentPage - 1) * limit) + 1} to{' '}
                                    {Math.min(currentPage * limit, totalCount)} of{' '}
                                    {totalCount} students
                                </div>
                            </div>
                        </>
                    )}

                    {/* Delete Dialog */}
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={closeDeleteDialog}
                        onConfirm={deleteStudent}
                        title="Delete Student"
                        description="Are you sure you want to delete this student? This cannot be undone."
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Students;