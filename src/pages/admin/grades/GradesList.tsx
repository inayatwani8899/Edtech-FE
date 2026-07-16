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
import { Pagination } from "@/components/ui/pagination";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Eye,
    Layers,
    GraduationCap,
    ArrowUpDown,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGradeStore } from "@/store/gradeStore";
import { toast } from "sonner";

export const GradesList: React.FC = () => {
    const navigate = useNavigate();
    const {
        grades,
        loading,
        error,
        currentPage,
        totalPages,
        totalCount,
        limit,
        sortDirection,
        searchTerm,
        deleteOpen,
        setPage,
        setLimit,
        setSortDirection,
        setSearchTerm,
        fetchGrades,
        openDeleteDialog,
        closeDeleteDialog,
        deleteGrade,
    } = useGradeStore();

    useEffect(() => {
        fetchGrades();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            await deleteGrade();
            toast.success("Grade removed successfully.");
        } catch {
            toast.error("Failed to delete grade. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40" />
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Academic Structure</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Management</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Define and manage academic grade levels across the platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("/manage/grades/add")}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Add Grade</span>
                        </Button>
                    </div>
                </div>

                {/* Error banner */}
                {error && !loading && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="grade-search"
                                    placeholder="Search grades..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                                className="h-9 px-3 rounded-lg border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wide gap-2 flex-shrink-0"
                            >
                                <ArrowUpDown className="h-3.5 w-3.5" />
                                {sortDirection === "asc" ? "A → Z" : "Z → A"}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-32 space-y-6">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full border-t-4 border-primary animate-spin" />
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Loading Grades</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fetching grade levels...</span>
                                </div>
                            </div>
                        ) : grades.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                                    <Layers className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Grades Found</h3>
                                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                                    {searchTerm ? "No grades match your search." : "Create grade levels to structure academic content."}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => navigate("/manage/grades/add")} className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg">
                                        <Plus className="h-4 w-4 mr-2" /> Add First Grade
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[35%]">Grade Name</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[40%]">Description</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Status</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {grades.map((grade) => (
                                                <TableRow key={grade.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                    <TableCell className="px-4 py-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                                                                <GraduationCap className="h-3 w-3 text-white" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                                                {grade.gradeName}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="max-w-xs truncate text-xs font-medium text-slate-500" title={grade.description}>
                                                            {grade.description || <span className="text-slate-300 italic">No description</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full font-bold ${grade.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                            {grade.isActive !== false ? "Active" : "Inactive"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/grades/view/${grade.id}`)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                                                title="View Grade"
                                                                aria-label={`View ${grade.gradeName}`}
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/grades/edit/${grade.id}`)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                                title="Edit Grade"
                                                                aria-label={`Edit ${grade.gradeName}`}
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openDeleteDialog(grade.id)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                                title="Delete Grade"
                                                                aria-label={`Delete ${grade.gradeName}`}
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

                                {/* Mobile Cards */}
                                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                    {grades.map((grade) => (
                                        <Card key={grade.id} className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                                            <CardContent className="p-4 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                                                            <GraduationCap className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 mb-1">{grade.gradeName}</p>
                                                            <Badge variant="secondary" className={`${grade.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"} text-[10px] font-bold border-none px-2 py-0.5`}>
                                                                {grade.isActive !== false ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                {grade.description && (
                                                    <div className="border-t border-slate-50 pt-3">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                                        <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-2">{grade.description}</p>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/manage/grades/view/${grade.id}`)} className="flex-1 h-9 rounded-lg border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                                                        <Eye className="h-3.5 w-3.5 mr-2" /> View
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/manage/grades/edit/${grade.id}`)} className="h-9 w-9 rounded-lg border-slate-200 text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => openDeleteDialog(grade.id)} className="h-9 w-9 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination Footer */}
                                <div className="p-2 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200">
                                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Grade Distribution</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Showing <span className="text-primary">{((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalCount)}</span> of {totalCount} grades
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

                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={closeDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Grade"
                    description="Are you sure you want to delete this grade? This action cannot be undone and may affect linked assessments."
                />
            </div>
        </div>
    );
};

export default GradesList;
