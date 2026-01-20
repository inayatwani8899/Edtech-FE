import React, { useEffect, useState } from "react";
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
import { Pagination } from "../../../components/ui/pagination";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Eye,
    Users2,
    AlertCircle,
    UserCircle2,
    Briefcase,
    ShieldCheck,
    Sparkles,
    Filter,
    Phone
} from 'lucide-react';
import { useCounselorStore } from "@/store/counsellorStore";
import { Badge } from "@/components/ui/badge";

const Counselors: React.FC = () => {
    const navigate = useNavigate();
    const {
        counselors,
        loading,
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        setPage,
        setLimit,
        setSearchTerm,
        fetchCounselors,
        deleteOpen,
        openDeleteDialog, // Assuming this is available in store, if not, adjust logic
        closeDeleteDialog,
        deleteCounselor,
    } = useCounselorStore();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCounselors();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, limit, searchTerm, fetchCounselors]);

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Core Personnel</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                            Counselor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Hub</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
                            Manage guidance professionals and assign student cohorts.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <Users2 className="h-4 w-4 text-emerald-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-slate-400 leading-none">Total Staff</span>
                                <span className="text-sm font-black text-slate-900 leading-none">{totalCount || 0}</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate("/counselors/add")}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-xl h-11 px-6 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="font-bold text-xs uppercase tracking-wide">Onboard Counselor</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="p-1 pb-0">
                        {/* Search & Filter Bar */}
                        <div className="px-6 pt-6 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="Search by name, email or specialization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white border border-slate-200 rounded-xl font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                                />
                            </div>
                            <Button variant="outline" className="h-11 px-4 bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:text-primary font-semibold rounded-xl gap-2 transition-all">
                                <Filter className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-wide">Filter Matrix</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-20 bg-slate-50/30">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin"></div>
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                                </div>
                                <span className="text-sm font-bold text-slate-400 mt-4 animate-pulse">Synchronizing Personnel Data...</span>
                            </div>
                        ) : normalizedCounselors(counselors).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/30">
                                <div className="h-20 w-20 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-4 group hover:border-primary/50 transition-colors">
                                    <Users2 className="h-10 w-10 text-slate-300 group-hover:text-primary/50 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No personnel records found</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                                    {searchTerm ? "No results match your search parameters." : "Begin by onboarding new counselors to the platform."}
                                </p>
                                {searchTerm && (
                                    <Button variant="ghost" onClick={() => setSearchTerm("")} className="text-primary font-bold text-xs uppercase tracking-wide">
                                        Clear Search Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-slate-200 hover:bg-transparent">
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[35%]">Counselor Identity</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[25%]">Contact</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[20%]">Status</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[20%]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {normalizedCounselors(counselors).map((counselor) => (
                                            <TableRow key={counselor?.id} className="border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group">
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-emerald-500/20 border border-white/20 ring-2 ring-slate-50 group-hover:scale-105 transition-transform flex-shrink-0">
                                                            {counselor?.firstName?.[0]}{counselor?.lastName?.[0]}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-primary transition-colors truncate">
                                                                {`${counselor?.firstName} ${counselor?.lastName}`}
                                                            </p>
                                                            <div className="flex items-center gap-1.5">
                                                                <Badge variant="secondary" className="bg-slate-100 text-[8px] font-bold uppercase text-slate-400 py-0 px-1.5 border-none rounded">
                                                                    ID: {counselor?.id?.toString().slice(0, 6)}
                                                                </Badge>
                                                                {counselor?.hireDate && (
                                                                    <span className="text-[9px] text-slate-400 font-medium hidden sm:inline-block">
                                                                        • Since {new Date(counselor.hireDate).getFullYear()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 max-w-[200px]">
                                                            <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-xs text-slate-400">@</span>
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-600 truncate" title={counselor?.email}>{counselor?.email}</span>
                                                        </div>
                                                        {counselor?.phoneNumber && (
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                                    <Phone className="h-3 w-3 text-slate-400" />
                                                                </div>
                                                                <span className="text-xs font-semibold text-slate-500">{counselor.phoneNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide gap-1">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            Active
                                                        </Badge>
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide border-none">
                                                            Counselor
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/counselors/edit/${counselor.id}`)}
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                            title="Edit Profile"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(counselor.id)}
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                            title="Revoke Access"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination Footer */}
                                <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Grid Distribution</p>
                                            <p className="text-sm font-bold text-slate-700">
                                                Showing <span className="text-primary">{((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)}</span> of {totalCount} records
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
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
                    onConfirm={deleteCounselor}
                    title="Terminate Counselor Profile"
                    description="Are you sure you want to permanently remove this counselor? This action will revoke all access and cannot be undone."
                />
            </div>
        </div>
    );
};

// Helper to handle potential data structure differences
const normalizedCounselors = (data: any[]): any[] => {
    if (!data) return [];
    return data;
};

export default Counselors;