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
        openDeleteDialog,
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
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Core Personnel</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
                            Counselor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Hub</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Manage guidance professionals and assign student cohorts.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-xl shadow-soft border border-white/50 flex items-center gap-3 px-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Users2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Staff</span>
                                <span className="text-lg font-black text-slate-900 leading-none">{totalCount || 0}</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate("/counselors/add")}
                            className="h-12 px-6 rounded-xl bg-slate-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
                        >
                            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="font-bold text-xs uppercase tracking-wide">Onboard Counselor</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-4 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative group w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name, email or specialization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-12 pl-11 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="h-10 px-4 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-all text-sm">
                                    <Filter className="h-4 w-4 mr-2" />
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
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Accessing personnel records...</span>
                                </div>
                            </div>
                        ) : normalizedCounselors(counselors).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                                    <Users2 className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Records Found</h3>
                                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                                    {searchTerm ? "No results match your search parameters." : "Begin by onboarding new counselors to the platform."}
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
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[35%]">Counselor Identity</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[25%]">Email</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[20%]">Phone</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[20%]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {normalizedCounselors(counselors).map((counselor) => (
                                            <TableRow key={counselor?.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-emerald-500/20 border border-white/20 ring-1 ring-slate-50 group-hover:scale-105 transition-transform flex-shrink-0">
                                                            {counselor?.firstName?.[0]}{counselor?.lastName?.[0]}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 group-hover:text-primary transition-colors truncate">
                                                                {`${counselor?.firstName} ${counselor?.lastName}`}
                                                            </p>
                                                            <div className="flex items-center gap-1.5">
                                                                {counselor?.hireDate && (
                                                                    <span className="text-[9px] text-slate-400 font-medium hidden sm:inline-block">
                                                                        Since {new Date(counselor.hireDate).getFullYear()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex items-center gap-1.5 max-w-[200px]">
                                                        {/* Icon removed to match Users style simpler text or kept if Users has icons - Users has no icon in email cell, just text. I will match users simpler email style */}
                                                        <span className="text-xs font-semibold text-slate-700 truncate block" title={counselor?.email}>{counselor?.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    {counselor?.phoneNumber ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-4 w-4 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                                <Phone className="h-2.5 w-2.5 text-slate-400" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-600">{counselor.phoneNumber}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 italic">Not provided</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <div className="flex justify-center gap-2 opacity-100 transition-all duration-200">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/counselors/edit/${counselor.id}`)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                            title="Edit Profile"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(counselor.id)}
                                                            className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                            title="Revoke Access"
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