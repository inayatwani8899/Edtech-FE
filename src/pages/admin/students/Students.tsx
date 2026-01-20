import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Eye,
    Users2,
    ArrowUpDown,
    Filter,
    Sparkles,
    GraduationCap
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Students: React.FC = () => {
    const navigate = useNavigate();
    const {
        students,
        loading,
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
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Academic Roster</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Registry</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage student records, enrollment status, and academic progress.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Hidden stats box to match user preference */}
                        <Button
                            onClick={() => navigate("/students/add")}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Register Student</span>
                        </Button>
                    </div>
                </div>

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name, email or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="h-9 px-3 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-all text-xs">
                                    <Filter className="h-3.5 w-3.5 mr-2" />
                                    Filter Matrix
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-32 space-y-6">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full border-t-4 border-primary animate-spin"></div>
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Synchronizing Data</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Loading student records...</span>
                                </div>
                            </div>
                        ) : students?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                                    <GraduationCap className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Records Found</h3>
                                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                                    {searchTerm ? "No results match your search parameters." : "Begin by registering new students to the platform."}
                                </p>
                                {searchTerm && (
                                    <Button onClick={() => setSearchTerm("")} variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200 hover:bg-slate-50">
                                        Clear Search Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="border-slate-200 hover:bg-transparent">
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[35%] cursor-pointer hover:text-primary transition-colors" onClick={handleSortToggle}>
                                                <div className="flex items-center gap-1">
                                                    Student Identity
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[25%]">Email</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[15%]">Grade</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[15%]">DOB</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[10%]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students?.map((student: Student) => (
                                            <TableRow key={student.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-indigo-500/20 border border-white/20 ring-1 ring-slate-50 group-hover:scale-105 transition-transform flex-shrink-0">
                                                            {student.firstName?.[0]}{student.lastName?.[0]}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 group-hover:text-primary transition-colors truncate">
                                                                {`${student.firstName} ${student.lastName}`}
                                                            </p>
                                                            {/* Optional secondary text if needed, keeping mostly clean for compact */}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <span className="text-xs font-semibold text-slate-700 truncate block">{student.email}</span>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <Badge variant="secondary" className="bg-slate-100 text-[9px] font-bold text-slate-600 border border-slate-200 px-2 py-0.5 pointer-events-none">
                                                        {student.gradeLevel || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <span className="text-xs font-medium text-slate-500">
                                                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex justify-center gap-2 opacity-100 transition-all duration-200">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/students/view/${student.id}`)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                                            title="View Profile"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/students/edit/${student.id}`)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                            title="Edit Details"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(String(student.id))}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                            title="Expel Student"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination Footer */}
                                <div className="p-2 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200">
                                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Grid Distribution</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Showing <span className="text-primary">{((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)}</span> of {totalCount} records
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200 scale-90 origin-right">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
                                            limit={limit}
                                            onLimitChange={setLimit}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Dialog */}
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={closeDeleteDialog}
                    onConfirm={deleteStudent}
                    title="Delete Student Record"
                    description="Are you sure you want to permanently remove this student? This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default Students;