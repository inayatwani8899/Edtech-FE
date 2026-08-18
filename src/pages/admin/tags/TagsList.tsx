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
    Tag,
    Filter,
    RefreshCw,
    Brain,
    BookOpen
} from 'lucide-react';
import { usePsychometricTagStore } from "@/store/psychometricTagStore";
import { usePsychometricTheoryStore } from "@/store/psychometricTheoryStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const TagsList: React.FC = () => {
    const navigate = useNavigate();

    const {
        tags,
        loading,
        error,
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        selectedTheoryId,
        setPage,
        setLimit,
        setSearchTerm,
        setSelectedTheoryId,
        fetchTags,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteTag,
    } = usePsychometricTagStore();

    const { theories, fetchTheories } = usePsychometricTheoryStore();

    // Fetch theories on mount if not loaded
    useEffect(() => {
        if (!theories || theories.length === 0) {
            fetchTheories();
        }
    }, [fetchTheories, theories]);

    // Fetch tags when dependencies update
    useEffect(() => {
        fetchTags();
    }, [currentPage, limit, searchTerm, selectedTheoryId, fetchTags]);

    const handleDelete = async () => {
        try {
            await deleteTag();
            toast.success("Psychometric Tag deleted successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete Psychometric Tag");
        }
    };

    // Subset for current page
    const paginatedTags = tags.slice((currentPage - 1) * limit, currentPage * limit);

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-purple-500/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600">Psychometric Sub-Dimensions</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Psychometric <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Tags</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage psychometric dimension tags, trait codes, and theory sub-scales for test scoring.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("/manage/tags/add")}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Add Tag</span>
                        </Button>
                    </div>
                </div>

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-center">
                            {/* Search Bar */}
                            <div className="relative group w-full sm:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-purple-600 transition-colors" />
                                <Input
                                    placeholder="Search tags by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-8 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-[11px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all w-full"
                                strokeWidth={1.5}
                                />
                            </div>

                            {/* Theory Filter Dropdown */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">
                                    <Filter className="h-3 w-3 text-purple-600" />
                                    <span>Filter by Theory:</span>
                                </div>
                                <Select
                                    value={selectedTheoryId}
                                    onValueChange={(val) => setSelectedTheoryId(val)}
                                >
                                    <SelectTrigger className="h-8 w-full sm:w-[180px] bg-white border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700">
                                        <SelectValue placeholder="All Theories" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        <SelectItem value="all">All Theories</SelectItem>
                                        {theories?.map((th) => (
                                            <SelectItem key={th.id} value={String(th.id)}>
                                                {th.theoryName || th.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fetchTags()}
                                    className="h-8 w-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shrink-0 flex items-center justify-center"
                                    title="Refresh List"
                                >
                                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
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
                                    <Tag className="h-8 w-8" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load psychometric tags</h3>
                                <p className="text-xs text-slate-500 max-w-sm mb-4">{error}</p>
                                <Button
                                    onClick={() => fetchTags()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-8 px-4 text-xs font-bold gap-1.5"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
                                </Button>
                            </div>
                        ) : tags?.length === 0 ? (
                            /* EMPTY STATE */
                            <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                                <div className="bg-slate-50/80 p-8 rounded-3xl mb-4 relative group">
                                    <FolderOpen className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">No Psychometric Tags Found</h3>
                                <p className="text-slate-500 font-medium max-w-md text-xs mb-6">
                                    {searchTerm || selectedTheoryId !== 'all'
                                        ? "No psychometric tags match your current search or theory filter."
                                        : "Get started by adding your first psychometric tag."}
                                </p>
                                <Button
                                    onClick={() => navigate("/manage/tags/add")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-9 px-4 text-xs font-bold gap-1.5 shadow-md"
                                >
                                    <Plus className="h-4 w-4" /> Add Psychometric Tag
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {/* TABLE VIEW (DESKTOP) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider w-[30%]">Tag Name</TableHead>
                                                <TableHead className="px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider w-[20%]">Theory</TableHead>
                                                <TableHead className="px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider w-[35%]">Description</TableHead>
                                                <TableHead className="px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTags.map((tag) => (
                                                <TableRow key={tag.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-purple-500/20 border border-white/20 shrink-0">
                                                                <Tag className="h-3.5 w-3.5" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[11px] font-bold text-slate-900 leading-none mb-0.5 group-hover:text-purple-600 transition-colors truncate">
                                                                    {tag.tagName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        {tag.theoryName ? (
                                                            <Badge variant="outline" className="bg-purple-50/50 text-purple-600 border-purple-200/50 text-[8px] font-bold rounded-md px-1.5 py-0.5 pointer-events-none">
                                                                {tag.theoryName}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 font-medium">General / Unassigned</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <div className="max-w-md truncate text-[11px] font-medium text-slate-500" title={tag.description}>
                                                            {tag.description || "No description provided."}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <div className="flex justify-center gap-1.5">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/tags/view/${tag.id}`)}
                                                                className="h-6 w-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-650 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200 transition-all flex items-center justify-center"
                                                                title="View Tag Details"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => navigate(`/manage/tags/edit/${tag.id}`)}
                                                                className="h-6 w-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center"
                                                                title="Edit Tag"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openDeleteDialog(tag.id)}
                                                                className="h-6 w-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center"
                                                                title="Delete Tag"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
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
                                    {paginatedTags.map((tag) => (
                                        <Card key={tag.id} className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                            <Tag className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-slate-900 leading-tight mb-1 truncate">
                                                                {tag.tagName}
                                                            </p>
                                                            {tag.theoryName && (
                                                                <Badge variant="secondary" className="bg-purple-50 text-purple-600 text-[9px] font-bold border-none px-2 py-0.5">
                                                                    {tag.theoryName}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-2.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                                    <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3">
                                                        {tag.description || "No description provided."}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/manage/tags/view/${tag.id}`)}
                                                        className="flex-1 h-8 rounded-lg border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/manage/tags/edit/${tag.id}`)}
                                                        className="h-8 w-8 rounded-lg border-slate-200 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(tag.id)}
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
                                            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Tag Distribution</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Showing <span className="text-purple-600">{((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)}</span> of {totalCount} tags
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
                    title="Delete Psychometric Tag"
                    description="Are you sure you want to delete this tag? This action cannot be undone and may affect associated test questions."
                />
            </div>
        </div>
    );
};

export default TagsList;
