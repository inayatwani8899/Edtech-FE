import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/ui/pagination';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    BarChart3,
    Loader2,
    ToggleLeft,
    ToggleRight,
    Sparkles,
    Library,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '@/store/testStore';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Toggle } from "@/components/ui/toggle";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "active":
            return <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 py-0.5 text-[9px] uppercase font-bold">Active</Badge>;
        case "draft":
            return <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 px-2 py-0.5 text-[9px] uppercase font-bold">Draft</Badge>;
        case "archived":
            return <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-2 py-0.5 text-[9px] uppercase font-bold">Archived</Badge>;
        default:
            return <Badge variant="secondary" className="text-[9px] uppercase font-bold">{status}</Badge>;
    }
};

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Aptitude', label: 'Aptitude' },
    { value: 'Personality', label: 'Personality' },
    { value: 'Professional', label: 'Professional' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
];

export const ManageTests: React.FC = () => {
    const navigate = useNavigate();

    const {
        tests,
        loading,
        filters,
        currentPage,
        totalPages,
        limit,
        totalCount,
        setPage,
        setLimit,
        fetchTests,
        setFilters,
        deleteTest,
        duplicateTest,
        publishTest,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
    } = useTestStore();

    const [searchInput, setSearchInput] = useState(filters.search);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters({ search: searchInput });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput, filters.search, setFilters]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const handleStatusFilter = (status: string) => {
        setFilters({ status });
    };

    const handleCategoryFilter = (category: string) => {
        setFilters({ category });
    };

    const handlePublish = async (testId: string, newState: boolean) => {
        try {
            await publishTest(testId, newState);
        } catch (err) {
            console.error('Failed to toggle publish state:', err);
        }
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Evaluation Matrix</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Hub</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage standardized tests, quizzes, and evaluation criteria.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Hidden Stats box to match user preference */}
                        <Button
                            onClick={() => navigate('/create-test')}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Create Test</span>
                        </Button>
                    </div>
                </div>

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search tests..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Select value={filters.status} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="h-9 w-[140px] rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={filters.category} onValueChange={handleCategoryFilter}>
                                    <SelectTrigger className="h-9 w-[160px] rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                                        <Filter className="h-3 w-3 mr-2 text-slate-400" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Indexing Assessments</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Loading test catalog...</span>
                                </div>
                            </div>
                        ) : tests?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                                    <Library className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Tests Found</h3>
                                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                                    {searchInput ? "No results match your filters." : "Start by creating your first assessment module."}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="border-slate-200 hover:bg-transparent">
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[30%]">Test Details</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[15%]">Category</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[15%]">Duration</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[15%]">Status</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Results</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tests?.map((test) => (
                                            <TableRow key={test?.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-blue-500/20 border border-white/20 ring-1 ring-slate-50 group-hover:scale-105 transition-transform flex-shrink-0">
                                                            <FileText className="h-3 w-3" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 group-hover:text-primary transition-colors truncate">
                                                                {test?.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <Badge variant="secondary" className="bg-slate-100 text-[9px] font-bold text-slate-600 border border-slate-200 px-2 py-0.5 pointer-events-none capitalize">
                                                        {test?.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <span className="text-xs font-semibold text-slate-700">{test?.timeDuration} min</span>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    {getStatusBadge(test.status)}
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <span className="text-xs font-bold text-slate-700">{test?.completions}</span>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex justify-center gap-2 opacity-100 transition-all duration-200">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                                            title="View Analytics"
                                                        >
                                                            <BarChart3 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/edit-test/${test.id}`)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                            title="Edit Test"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>

                                                        <Toggle
                                                            pressed={test?.isPublished}
                                                            onPressedChange={(state) => handlePublish(test.id, state)}
                                                            size="sm"
                                                            className="h-7 w-7 rounded-lg data-[state=on]:bg-emerald-100 data-[state=on]:border-emerald-200 data-[state=on]:text-emerald-700 bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                                                            title={test?.isPublished ? "Unpublish Test" : "Publish Test"}
                                                        >
                                                            {test?.isPublished ? (
                                                                <ToggleRight className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <ToggleLeft className="h-3.5 w-3.5" />
                                                            )}
                                                        </Toggle>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(test.id)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                            title="Delete Test"
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
                    onConfirm={deleteTest}
                    title="Delete Assessment"
                    description="Are you sure you want to delete this test? This action is irreversible."
                />
            </div>
        </div>
    );
};