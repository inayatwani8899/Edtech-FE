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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Eye,
    FolderOpen,
    Sparkles,
    Brain,
    Filter,
    RefreshCw,
    BookOpen,
    Tag
} from 'lucide-react';
import { usePsychometricTheoryStore } from "@/store/psychometricTheoryStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const TheoriesList: React.FC = () => {
    const navigate = useNavigate();

    const {
        theories,
        loading,
        error,
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        selectedCategoryId,
        setPage,
        setLimit,
        setSearchTerm,
        setSelectedCategoryId,
        fetchTheories,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteTheory,
    } = usePsychometricTheoryStore();

    const { categories, fetchCategories } = useCategoryStore();

    // Fetch categories on mount if not loaded
    useEffect(() => {
        if (!categories || categories.length === 0) {
            fetchCategories();
        }
    }, [fetchCategories, categories]);

    // Fetch theories on dependencies update
    useEffect(() => {
        fetchTheories();
    }, [currentPage, limit, searchTerm, selectedCategoryId, fetchTheories]);

    const handleDelete = async () => {
        try {
            await deleteTheory();
            toast.success("Psychometric Theory deleted successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete Psychometric Theory");
        }
    };

    // Paginated subset of theories for client display
    const paginatedTheories = theories.slice((currentPage - 1) * limit, currentPage * limit);

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
                            <div className="h-px w-6 bg-[#4F46E5]/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#4F46E5]">Psychometric Taxonomy</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Psychometric <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-indigo-600">Theories</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage psychometric evaluation models (Holland's RIASEC, Big Five OCEAN, Bloom's Taxonomy, etc.).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("/manage/theories/add")}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Add Theory</span>
                        </Button>
                    </div>
                </div>

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            {/* Search Bar */}
                            <div className="relative group w-full md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-[#4F46E5] transition-colors" />
                                <Input
                                    placeholder="Search theories by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/30 transition-all w-full"
                                />
                            </div>

                            {/* Category Filter Dropdown */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
                                    <Filter className="h-3.5 w-3.5 text-[#4F46E5]" />
                                    <span>Category:</span>
                                </div>
                                <Select
                                    value={selectedCategoryId}
                                    onValueChange={(val) => setSelectedCategoryId(val)}
                                >
                                    <SelectTrigger className="h-9 w-full md:w-[220px] bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories?.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.categoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fetchTheories()}
                                    className="h-9 w-9 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shrink-0"
                                    title="Refresh List"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            /* SKELETON LOADING STATE */
                            <div className="p-6 space-y-4">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 animate-pulse">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
                                            <div className="space-y-2 flex-1 max-w-xs">
                                                <Skeleton className="h-4 w-3/4 bg-slate-200 rounded" />
                                                <Skeleton className="h-3 w-1/2 bg-slate-200 rounded" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-20 bg-slate-200 rounded-full" />
                                        <div className="flex gap-2 ml-4">
                                            <Skeleton className="h-7 w-7 rounded-lg bg-slate-200" />
                                            <Skeleton className="h-7 w-7 rounded-lg bg-slate-200" />
                                            <Skeleton className="h-7 w-7 rounded-lg bg-slate-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            /* ERROR STATE WITH RETRY */
                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                <div className="bg-rose-50 p-4 rounded-full mb-3 text-rose-500">
                                    <Brain className="h-8 w-8" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load theories</h3>
                                <p className="text-xs text-slate-500 max-w-sm mb-4">{error}</p>
                                <Button
                                    onClick={() => fetchTheories()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-4 text-xs font-bold gap-1.5"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
                                </Button>
                            </div>
                        ) : theories?.length === 0 ? (
                            /* EMPTY STATE */
                            <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                                <div className="bg-slate-50/80 p-8 rounded-3xl mb-4 relative group">
                                    <FolderOpen className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">No Psychometric Theories Found</h3>
                                <p className="text-slate-500 font-medium max-w-md text-xs mb-6">
                                    {searchTerm || selectedCategoryId !== 'all'
                                        ? "No psychometric theories match your current search or category filter."
                                        : "Get started by adding your first psychometric theory."}
                                </p>
                                <Button
                                    onClick={() => navigate("/manage/theories/add")}
                                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg h-9 px-4 text-xs font-bold gap-1.5 shadow-md"
                                >
                                    <Plus className="h-4 w-4" /> Add Psychometric Theory
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {/* TABLE VIEW (DESKTOP) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[30%]">Theory Name</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[20%]">Category</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[35%]">Description</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTheories.map((theory) => (
                                                <TableRow key={theory.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-indigo-500/20 border border-white/20 shrink-0">
                                                                <Brain className="h-3.5 w-3.5" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 group-hover:text-[#4F46E5] transition-colors truncate">
                                                                    {theory.theoryName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        {theory.categoryName ? (
                                                            <Badge variant="outline" className="bg-indigo-50/50 text-[#4F46E5] border-indigo-200/50 text-[10px] font-semibold rounded-md px-2 py-0.5">
                                                                {theory.categoryName}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 font-medium">General / Unassigned</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <div className="max-w-md truncate text-xs font-medium text-slate-500" title={theory.description}>
                                                            {theory.description || "No description provided."}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex justify-center gap-1.5">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/theories/view/${theory.id}`)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#4F46E5] hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                                                title="View Theory Details"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/theories/edit/${theory.id}`)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                                title="Edit Theory"
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openDeleteDialog(theory.id)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                                title="Delete Theory"
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

                                {/* MOBILE CARD VIEW */}
                                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                    {paginatedTheories.map((theory) => (
                                        <Card key={theory.id} className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                            <Brain className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-slate-900 leading-tight mb-1 truncate">
                                                                {theory.theoryName}
                                                            </p>
                                                            {theory.categoryName && (
                                                                <Badge variant="secondary" className="bg-indigo-50 text-[#4F46E5] text-[9px] font-bold border-none px-2 py-0.5">
                                                                    {theory.categoryName}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-2.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                                    <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3">
                                                        {theory.description || "No description provided."}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/manage/theories/view/${theory.id}`)}
                                                        className="flex-1 h-8 rounded-lg border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/manage/theories/edit/${theory.id}`)}
                                                        className="h-8 w-8 rounded-lg border-slate-200 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(theory.id)}
                                                        className="h-8 w-8 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* PAGINATION FOOTER */}
                                <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200">
                                            <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Theory Distribution</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Showing <span className="text-[#4F46E5]">{((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)}</span> of {totalCount} theories
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

                {/* DELETE CONFIRMATION DIALOG */}
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={closeDeleteDialog}
                    onConfirm={handleDelete}
                    title="Delete Psychometric Theory"
                    description="Are you sure you want to delete this theory? This action cannot be undone and may affect associated test questions."
                />
            </div>
        </div>
    );
};

export default TheoriesList;
