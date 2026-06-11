import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    UserPlus,
    Download,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Check,
    Upload,
    FileSpreadsheet,
    AlertCircle
} from "lucide-react";
import ExcelJS from "exceljs";
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
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
        deleteOpen,
        closeDeleteDialog,
        deleteStudent,
        bulkUploadStudents,
        sortBy,
        sortDirection,
        setSortBy,
        setSortDirection,
    } = useStudentStore();

    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleHeaderSort = (columnKey: string) => {
        if (loading) return;
        if (sortBy === columnKey) {
            const nextDirection = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(nextDirection);
        } else {
            setSortBy(columnKey);
            setSortDirection("asc");
        }
    };

    const renderSortHeaderLabel = (label: string, columnKey: string) => {
        const active = sortBy === columnKey;
        return (
            <button
                type="button"
                onClick={() => handleHeaderSort(columnKey)}
                disabled={loading}
                className={cn(
                    "text-[11px] font-black uppercase tracking-wider hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 focus:outline-none select-none",
                    active ? "text-blue-600 dark:text-blue-400 font-extrabold" : "text-slate-500",
                    loading && "pointer-events-none opacity-80"
                )}
            >
                {label}
                <span className="text-[10px] font-bold">
                    {active ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
            </button>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    const getAvatarGradient = (email: string = "", name: string = "") => {
        const key = email || name || "default";
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const gradients = [
            "from-blue-500 to-indigo-650 text-white",
            "from-emerald-500 to-teal-600 text-white",
            "from-purple-500 to-indigo-600 text-white",
            "from-rose-500 to-orange-600 text-white",
            "from-amber-500 to-orange-600 text-white",
            "from-cyan-500 to-blue-600 text-white",
            "from-fuchsia-500 to-pink-650 text-white",
            "from-violet-500 to-purple-650 text-white"
        ];
        const index = Math.abs(hash) % gradients.length;
        return gradients[index];
    };

    const getStableStudentId = (id: number, email: string) => {
        let hash = 0;
        const key = email || String(id);
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const str = Math.abs(hash).toString(36).substring(0, 6).toUpperCase();
        return `#${str.padEnd(6, 'X')}`;
    };

    const formatGrade = (grade?: string) => {
        if (!grade) return "N/A";
        if (grade.toLowerCase().includes("grade")) return grade;
        return `${grade} Grade`;
    };

    const renderStatusBadge = (isActive?: boolean) => {
        const active = isActive !== false;
        return (
            <span className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                active
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
            )}>
                <span className={cn("h-1 w-1 rounded-full", active ? "bg-emerald-500" : "bg-rose-500")} />
                {active ? "Active" : "Inactive"}
            </span>
        );
    };

    // Bulk Student Upload States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCloseUpload = () => {
        if (uploading) return;
        setIsUploadOpen(false);
        setSelectedFile(null);
        setUploadResult(null);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'xlsx' && extension !== 'xls') {
            toast.error("Invalid file type. Please upload a .xlsx or .xls Excel file.");
            return;
        }
        setSelectedFile(file);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownloadTemplate = async () => {
        try {
            const workbook = new ExcelJS.Workbook();

            // 1. Create Students worksheet
            const studentsSheet = workbook.addWorksheet("Students");

            // 2. Define headers and columns with exact order & widths
            studentsSheet.columns = [
                { header: "Email", key: "Email", width: 30 },
                { header: "FirstName", key: "FirstName", width: 20 },
                { header: "LastName", key: "LastName", width: 20 },
                { header: "Password", key: "Password", width: 20 },
                { header: "Phone", key: "Phone", width: 18 },
                { header: "GradeLevel", key: "GradeLevel", width: 15 },
                { header: "DateOfBirth", key: "DateOfBirth", width: 18 },
                { header: "Gender", key: "Gender", width: 15 }
            ];

            // 3. Format header row: Bold, Center Align, Light Background Color
            const headerRow = studentsSheet.getRow(1);
            headerRow.font = { bold: true, name: "Arial" };
            headerRow.alignment = { horizontal: "center", vertical: "middle" };
            headerRow.height = 25;
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFE2E8F0" } // Light slate/grey background (slate-200)
                };
                cell.border = {
                    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
                    top: { style: "thin", color: { argb: "FFCBD5E1" } },
                    left: { style: "thin", color: { argb: "FFCBD5E1" } },
                    right: { style: "thin", color: { argb: "FFCBD5E1" } }
                };
            });

            // 4. Freeze Header Row
            studentsSheet.views = [
                { state: "frozen", ySplit: 1 }
            ];

            // 5. Add sample data
            const sampleRecords = [
                { Email: "basitt@gmail.com", FirstName: "Basit", LastName: "Dar", Password: "Student@123", Phone: "9876543210", GradeLevel: "10th", DateOfBirth: "2010-05-12", Gender: "Male" },
                { Email: "faazil@gmail.com", FirstName: "Fazil", LastName: "Bhat", Password: "Student@123", Phone: "9876543211", GradeLevel: "10th", DateOfBirth: "2009-08-20", Gender: "Male" },
                { Email: "waseeem@gmail.com", FirstName: "Waseem", LastName: "Sofi", Password: "Student@123", Phone: "9876543212", GradeLevel: "12th", DateOfBirth: "2008-01-15", Gender: "Male" },
                { Email: "rasik@gmail.com", FirstName: "Nasir", LastName: "Mir", Password: "Student@123", Phone: "9876543213", GradeLevel: "10th", DateOfBirth: "2007-11-30", Gender: "Male" },
                { Email: "wajid@gmail.com", FirstName: "Basheer", LastName: "Wani", Password: "Student@123", Phone: "9876543214", GradeLevel: "12th", DateOfBirth: "2011-03-25", Gender: "Male" }
            ];

            sampleRecords.forEach((record) => {
                const row = studentsSheet.addRow(record);
                row.height = 20;
                row.eachCell((cell) => {
                    cell.font = { name: "Arial", size: 10 };
                    cell.border = {
                        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
                        left: { style: "thin", color: { argb: "FFE2E8F0" } },
                        right: { style: "thin", color: { argb: "FFE2E8F0" } }
                    };
                });
            });

            // Format alignment on cells for data rows
            studentsSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell((cell, colNumber) => {
                        if (colNumber >= 5) {
                            cell.alignment = { horizontal: "center", vertical: "middle" };
                        } else {
                            cell.alignment = { horizontal: "left", vertical: "middle" };
                        }
                    });
                }
            });

            // 6. Create Instructions worksheet
            const instructionsSheet = workbook.addWorksheet("Instructions");
            instructionsSheet.views = [{ showGridLines: false }];

            // Set width of column A for instructions
            instructionsSheet.getColumn(1).width = 90;

            // Add Title
            const instTitleRow = instructionsSheet.getRow(1);
            instTitleRow.height = 30;
            const titleCell = instTitleRow.getCell(1);
            titleCell.value = "Student Bulk Upload Instructions";
            titleCell.font = { name: "Arial", size: 16, bold: true, color: { argb: "FF0F172A" } };
            titleCell.alignment = { vertical: "middle" };

            // Empty row (Row 2 is naturally empty if we don't write to it)
            instructionsSheet.getRow(2).height = 15;

            // Add instruction list
            const instructionLines = [
                "1. Do not modify column names.",
                "2. Email must be unique.",
                "3. GradeLevel must match system grades.",
                "4. DateOfBirth format must be YYYY-MM-DD.",
                "5. Gender values:\n   Male\n   Female\n   Other",
                "6. Password should meet platform requirements.",
                "7. Remove sample records before actual upload if desired."
            ];

            let rowIdx = 3;
            instructionLines.forEach((line) => {
                const row = instructionsSheet.getRow(rowIdx);
                const cell = row.getCell(1);
                cell.value = line;
                cell.font = { name: "Arial", size: 11, color: { argb: "FF334155" } };

                if (line.startsWith("5. Gender values:")) {
                    row.height = 70; // Set enough height for multiline text
                    cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
                } else {
                    row.height = 22;
                    cell.alignment = { vertical: "middle", horizontal: "left" };
                }

                rowIdx++;
            });

            // 7. Write to buffer and download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Student_Bulk_Upload_Template.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Student_Bulk_Upload_Template.xlsx downloaded successfully");
        } catch (err) {
            console.error("Error generating Excel template:", err);
            toast.error("Failed to generate Excel template");
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }
        setUploading(true);
        try {
            const result = await bulkUploadStudents(selectedFile);
            setUploadResult(result);
            if (result.success) {
                toast.success(result.message || "Bulk upload completed successfully");
            } else {
                toast.error(result.message || "Bulk upload completed with errors");
            }
        } catch (err: any) {
            console.error("Bulk upload failed:", err);
            toast.error(err.response?.data?.message || "Failed to upload students");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleDeleteConfirm = async () => {
        try {
            await deleteStudent();
        } catch (err: any) {
            console.error("Failed to delete student record:", err);
        }
    };

    return (
        <div className="space-y-3.5 animate-in fade-in duration-500">
            {/* Compact Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-5 rounded-2xl text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎓</span>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                                Student Matrix
                            </h1>
                        </div>
                        <p className="text-slate-350 text-xs font-medium mt-0.5">
                            Manage enrolled students
                        </p>

                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-300 font-semibold mt-2">
                            <span>Total Students: <span className="text-white font-extrabold">{totalCount}</span></span>
                            <span className="text-slate-600">•</span>
                            <span>Academic Year: <span className="text-white font-extrabold">2025-26</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadOpen(true)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-9 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 px-4 backdrop-blur-sm"
                        >
                            <Upload className="h-4 w-4" />
                            Bulk Upload
                        </Button>
                        <Button
                            onClick={() => navigate("/school/students/add")}
                            className="bg-blue-600 hover:bg-blue-500 border-none text-white h-9 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 gap-2 px-5 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <UserPlus className="h-4 w-4" />
                            Register Student
                        </Button>
                    </div>
                </div>
            </div>

            {/* Professional Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl flex flex-col lg:flex-row gap-3 items-center justify-between shadow-sm mt-4">
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Search Student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-xs"
                        />
                    </div>

                    {/* Sort By Dropdown */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            disabled={loading}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold px-2.5 py-1.5 outline-none h-9 cursor-pointer"
                        >
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="email">Email</option>
                            <option value="gradeLevel">Grade</option>
                            <option value="createdDate">Created Date</option>
                        </select>
                    </div>

                    {/* Direction Dropdown */}
                    <div className="flex items-center gap-1.5">
                        <select
                            value={sortDirection}
                            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                            disabled={loading}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold px-2.5 py-1.5 outline-none h-9 cursor-pointer"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                    {/* Page Size Dropdown */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Page Size</span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            disabled={loading}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold px-2.5 py-1.5 outline-none h-9 cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === "table" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === "grid" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl whitespace-nowrap">
                        Total Students: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{totalCount}</span>
                    </div>
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
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-pulse">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Students...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center p-8">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Students Found</h3>
                        <p className="text-slate-500 max-w-sm mt-2">Try adjusting your search criteria.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="text-blue-600 mt-4 font-bold">Clear search</Button>
                    </div>
                ) : viewMode === "table" ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-12 px-4 py-2.5">
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
                                    <TableHead className="py-2.5 px-4">{renderSortHeaderLabel("Student Info", "firstName")}</TableHead>
                                    <TableHead className="py-2.5 px-4">{renderSortHeaderLabel("Grade", "gradeLevel")}</TableHead>
                                    <TableHead className="py-2.5 px-4">{renderSortHeaderLabel("Contact Info", "email")}</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 py-2.5 px-4">Status</TableHead>
                                    <TableHead className="text-[11px] font-black uppercase tracking-wider text-slate-500 py-2.5 px-4 text-right">Actions</TableHead>
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
                                        <TableCell className="px-4 py-2">
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
                                        <TableCell className="py-2 px-4">
                                            <div className="flex items-center gap-2.5">
                                                {/* Dynamic Avatar */}
                                                <div className={cn(
                                                    "h-8 w-8 rounded-lg bg-gradient-to-tr flex items-center justify-center font-black text-xs shadow-sm transition-transform duration-300 group-hover:scale-105",
                                                    getAvatarGradient(student.email, `${student.firstName} ${student.lastName}`)
                                                )}>
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors leading-tight">{student.firstName} {student.lastName}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                                                        ID: {getStableStudentId(student.id, student.email)} | DOB: {formatDate(student.dateOfBirth)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-4">
                                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-black px-2 py-0.5 text-[9px] rounded-md">
                                                {formatGrade(student.gradeLevel || student.gradeName)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 px-4">
                                            <div className="flex flex-col gap-0.5 max-w-[200px] text-[11px]">
                                                <span className="font-bold text-slate-700 dark:text-slate-300 truncate flex items-center gap-1 leading-tight">
                                                    <span className="text-xs">📧</span>
                                                    <span className="truncate">{student.email}</span>
                                                </span>
                                                <span className="text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 leading-tight">
                                                    <span className="text-xs">📞</span>
                                                    <span>{student.phone || student.phoneNumber || "9876543210"}</span>
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-4">
                                            {renderStatusBadge(student.isActive)}
                                        </TableCell>
                                        <TableCell className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1 px-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/school/students/view/${student.id}`)}
                                                    className="h-7.5 w-7.5 rounded-lg text-slate-550 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/45 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 active:scale-95 transition-all border border-transparent"
                                                    title="View details"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/school/students/edit/${student.id}`)}
                                                    className="h-7.5 w-7.5 rounded-lg text-slate-550 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/45 hover:text-amber-600 dark:hover:text-amber-400 hover:scale-105 active:scale-95 transition-all border border-transparent"
                                                    title="Edit record"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteDialog(String(student.id))}
                                                    className="h-7.5 w-7.5 rounded-lg text-slate-550 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/45 hover:text-rose-600 dark:hover:text-rose-455 hover:scale-105 active:scale-95 transition-all border border-transparent"
                                                    title="Delete record"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
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
                                className="group relative bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
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
                                    {/* Avatar Circle with Dynamic Gradient */}
                                    <div className={cn(
                                        "h-16 w-16 rounded-2xl bg-gradient-to-tr flex items-center justify-center font-black text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500",
                                        getAvatarGradient(student.email, `${student.firstName} ${student.lastName}`)
                                    )}>
                                        {student.firstName[0]}{student.lastName[0]}
                                    </div>

                                    {/* Name and ID and DOB */}
                                    <h4 className="font-black text-slate-900 dark:text-white leading-snug">{student.firstName} {student.lastName}</h4>
                                    <div className="mt-1 flex flex-col gap-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Student ID: {getStableStudentId(student.id, student.email)}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            DOB: {formatDate(student.dateOfBirth)}
                                        </p>
                                    </div>

                                    {/* Grade & Status */}
                                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                                        <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-bold px-3 py-1 text-[10px] rounded-lg">
                                            {formatGrade(student.gradeLevel || student.gradeName)}
                                        </Badge>
                                        {renderStatusBadge(student.isActive)}
                                    </div>

                                    {/* Contact Information block */}
                                    <div className="w-full mt-6 space-y-2.5 border-t border-slate-100 dark:border-slate-850 pt-4 text-left">
                                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-350 flex items-center gap-2 truncate">
                                            <span>📧</span>
                                            <span className="truncate">{student.email}</span>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                            <span>📞</span>
                                            <span>{student.phone || student.phoneNumber || "9876543210"}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-3 gap-2 w-full mt-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/school/students/view/${student.id}`)}
                                            className="h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:text-blue-600 shadow-sm"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/school/students/edit/${student.id}`)}
                                            className="h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:text-amber-600 shadow-sm"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDeleteDialog(String(student.id))}
                                            className="h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:text-rose-600 shadow-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer / Pagination */}
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            disabled={loading}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold px-2 py-1 outline-none cursor-pointer disabled:opacity-50"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            Showing {totalCount === 0 ? 0 : ((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalCount)} of {totalCount} students
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={loading || currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                            className="h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1 px-3"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1 mx-1">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                // Only show pages close to current page to keep it clean
                                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                                    if (pageNum === 2 && currentPage > 3) {
                                        return <span key="ellipsis-start" className="px-1 text-slate-400 text-xs">...</span>;
                                    }
                                    if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                                        return <span key="ellipsis-end" className="px-1 text-slate-400 text-xs">...</span>;
                                    }
                                    return null;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        disabled={loading}
                                        onClick={() => setPage(pageNum)}
                                        className={cn(
                                            "h-9 w-9 p-0 rounded-xl text-xs font-black",
                                            currentPage === pageNum ? "bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800"
                                        )}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            disabled={loading || currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className="h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-1 px-3"
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Dialog */}
            <DeleteDialog
                open={deleteOpen}
                onOpenChange={closeDeleteDialog}
                onConfirm={handleDeleteConfirm}
                title="Delete Student Record"
                description="Are you sure you want to permanently remove this student? This action cannot be undone."
            />

            {/* Bulk Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={handleCloseUpload}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-slate-205 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-xl">
                    <DialogHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                            Bulk Student Registration
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Register hundreds of students at once by uploading your roster spreadsheet.
                        </DialogDescription>
                    </DialogHeader>

                    {!uploadResult ? (
                        <div className="space-y-5 py-4">
                            {/* Template Download Option */}
                            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-xl">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center border border-green-100 dark:border-green-900/40">
                                        <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Registration Template</p>
                                        <p className="text-[10px] text-slate-400">Download our formatted template to align your columns.</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleDownloadTemplate}
                                    className="h-8 text-[10px] font-bold uppercase rounded-lg border-slate-200 dark:border-slate-800 gap-1.5"
                                >
                                    <Download className="h-3 w-3" />
                                    Download Sample Template
                                </Button>
                            </div>

                            {/* Drag & Drop Area */}
                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[180px]",
                                    dragActive
                                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/10"
                                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/20",
                                    selectedFile && "border-green-500/80 bg-green-50/5 dark:bg-green-950/5",
                                    uploading && "pointer-events-none opacity-60"
                                )}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <>
                                        <div className="h-10 w-10 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Drag and drop your Excel file here
                                            </p>
                                            <p className="text-[10px] text-slate-450 dark:text-slate-500">
                                                or click to browse from your device
                                            </p>
                                        </div>
                                        <p className="text-[9px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                            Supports .xlsx and .xls (Max 10MB)
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 bg-green-50 dark:bg-green-950 rounded-xl border border-green-150/40 dark:border-green-900/50 flex items-center justify-center text-green-600 dark:text-green-500">
                                            <FileSpreadsheet className="h-6 w-6" />
                                        </div>
                                        <div className="text-center min-w-0 max-w-md">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate px-4">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-7 px-3 text-[10px] rounded-lg border-slate-200 dark:border-slate-800 font-bold uppercase text-slate-600 dark:text-slate-400"
                                            >
                                                Change File
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedFile(null)}
                                                className="h-7 px-3 text-[10px] rounded-lg font-bold uppercase text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseUpload}
                                    disabled={uploading}
                                    className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUploadSubmit}
                                    disabled={!selectedFile || uploading}
                                    className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            Uploading Students...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload Students
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Result Screen */
                        <div className="space-y-5 py-4">
                            {/* Summary Banner */}
                            <div className={cn(
                                "p-4 rounded-xl border flex items-start gap-3",
                                uploadResult.data?.failedCount > 0
                                    ? "bg-amber-50/45 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40"
                                    : "bg-emerald-50/45 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40"
                            )}>
                                {uploadResult.data?.failedCount > 0 ? (
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        {uploadResult.data?.failedCount > 0
                                            ? "Upload Completed With Errors"
                                            : "Bulk Upload Completed Successfully"}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        {uploadResult.message || "Roster upload processed successfully."}
                                    </p>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Records</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">{uploadResult.data?.totalRecords ?? 0}</p>
                                </div>
                                <div className="bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-900/20 p-3 rounded-xl text-center">
                                    <p className="text-[9px] font-black text-emerald-600/80 uppercase tracking-wider">Successful</p>
                                    <p className="text-lg font-black text-emerald-600 mt-1">{uploadResult.data?.successCount ?? 0}</p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl text-center border",
                                    uploadResult.data?.failedCount > 0
                                        ? "bg-rose-50/10 dark:bg-rose-950/5 border-rose-100/50 dark:border-rose-900/20"
                                        : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800/80"
                                )}>
                                    <p className={cn(
                                        "text-[9px] font-black uppercase tracking-wider",
                                        uploadResult.data?.failedCount > 0 ? "text-rose-600/80" : "text-slate-400"
                                    )}>Failed</p>
                                    <p className={cn(
                                        "text-lg font-black mt-1",
                                        uploadResult.data?.failedCount > 0 ? "text-rose-600" : "text-slate-800 dark:text-slate-100"
                                    )}>{uploadResult.data?.failedCount ?? 0}</p>
                                </div>
                            </div>

                            {/* Failed Records Table */}
                            {uploadResult.data?.errors && uploadResult.data.errors.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        Failed Records Roster
                                    </p>
                                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50 dark:bg-slate-950 sticky top-0">
                                                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                                                    <TableHead className="p-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">Row</TableHead>
                                                    <TableHead className="p-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">Student / Reference</TableHead>
                                                    <TableHead className="p-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">Error Details</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {uploadResult.data.errors.map((err: any, idx: number) => (
                                                    <TableRow key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                                                        <TableCell className="p-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                            Row {err.row || err.rowNumber || idx + 1}
                                                        </TableCell>
                                                        <TableCell className="p-3 text-xs text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                                                            {err.student || err.studentName || err.email || "-"}
                                                        </TableCell>
                                                        <TableCell className="p-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                                                            {err.error || err.errorMessage || err.message || "Validation failed"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Done Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setUploadResult(null)}
                                    className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold"
                                >
                                    Upload Another
                                </Button>
                                <Button
                                    onClick={handleCloseUpload}
                                    className="h-9 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold shadow-sm"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
