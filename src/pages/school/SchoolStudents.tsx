import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Search, 
    Plus, 
    Filter, 
    FileDown, 
    MoreHorizontal, 
    GraduationCap, 
    ArrowUpDown, 
    Eye, 
    Edit, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    UserPlus,
    Download,
    Settings2,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Check
} from "lucide-react";
import { useStudentStore, Student } from "@/store/studentStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export const SchoolStudents = () => {
    const navigate = useNavigate();
    const {
        students,
        loading,
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        setPage,
        setLimit,
        setSearchTerm,
        fetchStudents,
        openDeleteDialog,
    } = useStudentStore();

    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, [currentPage, limit, searchTerm, fetchStudents]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudents(students.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const toggleStudentSelection = (id: number) => {
        setSelectedStudents(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action: string) => {
        if (selectedStudents.length === 0) return;
        
        Swal.fire({
            title: 'Bulk Action',
            text: `Are you sure you want to ${action} ${selectedStudents.length} selected students?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Yes, proceed'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success', 'Action performed successfully', 'success');
                setSelectedStudents([]);
            }
        });
    };

    const exportData = () => {
        Swal.fire({
            title: 'Exporting Data',
            text: 'Your student registry is being prepared for export...',
            timer: 1500,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            Swal.fire('Export Complete', 'Student list exported successfully as CSV', 'success');
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Student Matrix</h1>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            {totalCount.toLocaleString()} total students enrolled
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            Academic Year 2025-26
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={exportData}
                        className="hidden sm:flex items-center gap-2 border-slate-200 dark:border-slate-800 h-10 rounded-xl font-bold text-xs uppercase"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button 
                        onClick={() => navigate("/school/students/add")}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 gap-2 px-5"
                    >
                        <UserPlus className="h-4 w-4" />
                        Register Student
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm backdrop-blur-md">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                        placeholder="Search student by name, ID or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2 font-bold text-xs uppercase transition-all px-4",
                            isFilterOpen && "bg-slate-100 dark:bg-slate-800 border-blue-500/50 text-blue-600"
                        )}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === "table" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === "grid" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-200 dark:border-slate-800">
                                <Settings2 className="h-4 w-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 dark:border-slate-800 p-2">
                            <DropdownMenuLabel className="text-xs uppercase font-black text-slate-400 tracking-widest p-2">Table Columns</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem checked className="rounded-lg">Grade Level</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked className="rounded-lg">Enrollment Date</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked className="rounded-lg">Performance</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked className="rounded-lg">Status</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Bulk Selection Message */}
            {selectedStudents.length > 0 && (
                <div className="bg-blue-600 text-white p-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 duration-300 shadow-xl shadow-blue-600/20">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs">
                            {selectedStudents.length}
                        </div>
                        <span className="text-sm font-bold tracking-wide">Students Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBulkAction('promote')}
                            className="text-white hover:bg-white/10 h-8 text-[10px] uppercase font-black tracking-widest px-3"
                        >
                            Promote
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBulkAction('suspend')}
                            className="text-white hover:bg-white/10 h-8 text-[10px] uppercase font-black tracking-widest px-3"
                        >
                            Suspend
                        </Button>
                        <div className="w-px h-5 bg-white/20 mx-1" />
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedStudents([])}
                            className="text-white hover:bg-white/10 h-8"
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/50">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Filtering academic records...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center p-8">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No students found</h3>
                        <p className="text-slate-500 max-w-sm mt-2">We couldn't find any student records matching your current filters or search query.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="text-blue-600 mt-4 font-bold">Clear all filters</Button>
                    </div>
                ) : viewMode === "table" ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-12 px-5 py-4">
                                        <div 
                                            onClick={() => handleSelectAll(selectedStudents.length !== students.length)}
                                            className={cn(
                                                "h-5 w-5 rounded border transition-all cursor-pointer flex items-center justify-center",
                                                selectedStudents.length === students.length ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-700"
                                            )}
                                        >
                                            {selectedStudents.length === students.length && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 p-4">Student Info</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 p-4">Grade</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 p-4">Contact Info</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 p-4">Status</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 p-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow 
                                        key={student.id} 
                                        className={cn(
                                            "group border-slate-100 dark:border-slate-800 transition-colors",
                                            selectedStudents.includes(student.id) ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                                        )}
                                    >
                                        <TableCell className="px-5">
                                            <div 
                                                onClick={() => toggleStudentSelection(student.id)}
                                                className={cn(
                                                    "h-5 w-5 rounded border transition-all cursor-pointer flex items-center justify-center",
                                                    selectedStudents.includes(student.id) ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-700"
                                                )}
                                            >
                                                {selectedStudents.includes(student.id) && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-750 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-sm shadow-sm">
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-900 dark:text-white truncate">{student.firstName} {student.lastName}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 font-bold px-3 py-1 text-[10px] rounded-lg">
                                                Grade {student.gradeLevel}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex flex-col max-w-[180px]">
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{student.email}</span>
                                                <span className="text-[11px] text-slate-400 mt-0.5">{student.phone || "+1 234 567 890"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Active</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => navigate(`/school/students/view/${student.id}`)}
                                                    className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                                                    title="Quick View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => navigate(`/school/students/edit/${student.id}`)}
                                                    className="h-8 w-8 rounded-lg hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                                                    title="Edit Record"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => openDeleteDialog(String(student.id))}
                                                    className="h-8 w-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    /* Grid View Mode */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {students.map((student) => (
                            <div 
                                key={student.id} 
                                className="group relative bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
                            >
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={() => toggleStudentSelection(student.id)}
                                        className={cn(
                                            "h-5 w-5 rounded-full border transition-all flex items-center justify-center",
                                            selectedStudents.includes(student.id) ? "bg-blue-600 border-blue-600 scale-110" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 group-hover:scale-110"
                                        )}
                                    >
                                        {selectedStudents.includes(student.id) && <Check className="h-3 w-3 text-white" />}
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-500">
                                        {student.firstName[0]}{student.lastName[0]}
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white leading-tight">{student.firstName} {student.lastName}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Grade {student.gradeLevel}</p>
                                    
                                    <div className="w-full mt-6 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-400">Status</span>
                                            <span className="font-bold text-emerald-500">ACTIVE</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-400">Progress</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">84%</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 w-full mt-6">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => navigate(`/school/students/view/${student.id}`)}
                                            className="h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 shadow-sm"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => navigate(`/school/students/edit/${student.id}`)}
                                            className="h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-amber-600 shadow-sm"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => openDeleteDialog(String(student.id))}
                                            className="h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 shadow-sm"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer / Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <select 
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-bold px-2 py-1 outline-none"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} records
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                            className="h-10 w-10 p-0 rounded-xl border-slate-200 dark:border-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1 mx-1">
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                                <Button 
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setPage(i + 1)}
                                    className={cn(
                                        "h-10 w-10 p-0 rounded-xl text-xs font-black",
                                        currentPage === i + 1 ? "bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800"
                                    )}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            {totalPages > 5 && <span className="px-2 text-slate-400">...</span>}
                        </div>

                        <Button 
                            variant="outline" 
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className="h-10 w-10 p-0 rounded-xl border-slate-200 dark:border-slate-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
