import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Loader2,
    ArrowUpDown,
    Building,
    GraduationCap,
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Student {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    gender?: string;
    grade?: string;
    organizationName?: string;
    isActive?: boolean;
    createdAt?: string;
}

const Students: React.FC = () => {
    // Organization lists
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [orgsLoading, setOrgsLoading] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<string>("");

    // Student parameters and data
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Search and Sort
    const [searchVal, setSearchVal] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string>("createddate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Fetch all organizations on mount
    useEffect(() => {
        const fetchOrgs = async () => {
            setOrgsLoading(true);
            try {
                const response = await api.get<any>("/Organization", {
                    params: { limit: 1000 }
                });
                
                let orgList: any[] = [];
                if (response.data?.data?.organizations) {
                    orgList = response.data.data.organizations;
                } else if (Array.isArray(response.data?.data)) {
                    orgList = response.data.data;
                } else if (Array.isArray(response.data)) {
                    orgList = response.data;
                }
                
                setOrganizations(orgList);
                if (orgList.length > 0) {
                    setSelectedOrgId(String(orgList[0].id));
                }
            } catch (err: any) {
                console.error("Failed to load organizations:", err);
                toast.error("Failed to load organizations.");
            } finally {
                setOrgsLoading(false);
            }
        };

        fetchOrgs();
    }, []);

    // Search debounce handler
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchVal);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchVal]);

    // Fetch students list when organization or query parameters change
    useEffect(() => {
        if (!selectedOrgId) return;

        const fetchStudents = async () => {
            setStudentsLoading(true);
            try {
                const response = await api.get<any>(`/SuperAdmin/organizations/${selectedOrgId}/students`, {
                    params: {
                        pageNumber: currentPage,
                        pageSize: limit,
                        search: debouncedSearch || undefined,
                        sortBy,
                        sortDirection
                    }
                });

                const { students: loadedStudents, pagination } = response.data?.data || {};
                setStudents(loadedStudents || []);
                setTotalCount(pagination?.totalCount || 0);
                setTotalPages(pagination?.totalPages || 1);
                setCurrentPage(pagination?.pageNumber || 1);
            } catch (err: any) {
                console.error("Failed to load students:", err);
                toast.error(err.response?.data?.message || "Failed to retrieve organization students.");
                setStudents([]);
                setTotalCount(0);
                setTotalPages(1);
            } finally {
                setStudentsLoading(false);
            }
        };

        fetchStudents();
    }, [selectedOrgId, currentPage, limit, debouncedSearch, sortBy, sortDirection]);

    const handleSort = (columnKey: string) => {
        if (sortBy === columnKey) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnKey);
            setSortDirection("desc");
        }
        setCurrentPage(1);
    };

    const getSelectedOrgName = () => {
        const found = organizations.find(o => String(o.id) === selectedOrgId);
        return found ? found.instituteName : "None";
    };

    const getAvatarGradient = (email: string = "", name: string = "") => {
        const key = email || name || "default";
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const gradients = [
            "from-blue-500 to-indigo-600 text-white",
            "from-emerald-500 to-teal-600 text-white",
            "from-purple-500 to-indigo-650 text-white",
            "from-rose-500 to-orange-600 text-white",
            "from-amber-500 to-orange-600 text-white",
            "from-cyan-500 to-blue-600 text-white",
            "from-fuchsia-500 to-pink-600 text-white",
            "from-violet-500 to-purple-600 text-white"
        ];
        const index = Math.abs(hash) % gradients.length;
        return gradients[index];
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
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

    const renderSortHeaderLabel = (label: string, columnKey: string) => {
        const active = sortBy === columnKey;
        return (
            <button
                type="button"
                onClick={() => handleSort(columnKey)}
                className={cn(
                    "text-[9px] font-black uppercase tracking-wider hover:text-primary transition-colors inline-flex items-center gap-1.5 focus:outline-none select-none",
                    active ? "text-primary font-extrabold" : "text-slate-500"
                )}
            >
                {label}
                <span className="text-[8px] font-bold">
                    {active ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
            </button>
        );
    };

    const renderStatusBadge = (isActive?: boolean) => {
        const active = isActive !== false;
        return (
            <span className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider pointer-events-none",
                active 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
            )}>
                <span className={cn("h-1 w-1 rounded-full", active ? "bg-emerald-500" : "bg-rose-500")} />
                {active ? "Active" : "Inactive"}
            </span>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Compact Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Super Admin Console</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Management</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Monitor and manage students across all organizations.
                        </p>
                    </div>
                </div>

                {/* Organization Selection Panel */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <Building className="h-4 w-4 text-indigo-500" />
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Organization</label>
                        </div>
                        
                        <div className="w-full sm:w-80">
                            {orgsLoading ? (
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                    Loading organizations...
                                </div>
                            ) : (
                                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                                    <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg max-h-60">
                                        {organizations.map((org) => (
                                            <SelectItem key={org.id} value={String(org.id)} className="text-xs font-medium">
                                                {org.instituteName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50 space-y-3">
                        {/* Search and Statistics Strip */}
                        <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
                            {/* Search box */}
                            <div className="relative group w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name, email or phone..."
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    className="h-8 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-[11px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>

                            {/* Statistics Strip */}
                            {selectedOrgId && (
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 font-semibold bg-slate-50/65 dark:bg-slate-950/20 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 w-full sm:w-auto">
                                    <span>Selected Org: <span className="text-slate-900 dark:text-white font-extrabold">{getSelectedOrgName()}</span></span>
                                    <span className="text-slate-300 dark:text-slate-800">•</span>
                                    <span>Total Students: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{totalCount}</span></span>
                                    <span className="text-slate-300 dark:text-slate-800">•</span>
                                    <span>Page: <span className="text-slate-900 dark:text-white font-extrabold">{currentPage} of {totalPages}</span></span>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {!selectedOrgId ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                <Building className="h-16 w-16 text-slate-300 mb-4 animate-bounce" />
                                <h3 className="text-lg font-bold text-slate-800">Please select an organization</h3>
                                <p className="text-slate-400 text-xs mt-1">Select an organization from the dropdown above to view its student roster.</p>
                            </div>
                        ) : studentsLoading ? (
                            /* Loading Skeleton Rows */
                            <div className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="border-slate-200">
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[22%]">Student</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Grade</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[18%]">Organization</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[18%]">Contact</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Gender</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Status</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Created Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <TableRow key={idx} className="border-slate-100 animate-pulse">
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-7 w-7 rounded-md bg-slate-200 animate-pulse" />
                                                        <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3"><div className="h-3 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                                                <TableCell className="px-4 py-3"><div className="h-3 w-28 bg-slate-200 rounded animate-pulse" /></TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                                                        <div className="h-2.5 w-20 bg-slate-200 rounded animate-pulse" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3"><div className="h-3 w-12 bg-slate-200 rounded animate-pulse" /></TableCell>
                                                <TableCell className="px-4 py-3"><div className="h-4 w-14 bg-slate-200 rounded-full animate-pulse" /></TableCell>
                                                <TableCell className="px-4 py-3"><div className="h-3 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                <GraduationCap className="h-16 w-16 text-slate-200 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800">No students found</h3>
                                <p className="text-slate-400 text-xs mt-1">
                                    {debouncedSearch ? "No records match your search query." : "No students found for this organization."}
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-3 py-2 w-[22%]">{renderSortHeaderLabel("Student", "fullname")}</TableHead>
                                                <TableHead className="px-3 py-2 w-[12%]">{renderSortHeaderLabel("Grade", "grade")}</TableHead>
                                                <TableHead className="px-3 py-2 w-[18%] text-[9px] font-black text-slate-500 uppercase tracking-wider">Organization</TableHead>
                                                <TableHead className="px-3 py-2 w-[18%] text-[9px] font-black text-slate-500 uppercase tracking-wider">Contact</TableHead>
                                                <TableHead className="px-3 py-2 w-[10%] text-[9px] font-black text-slate-500 uppercase tracking-wider">Gender</TableHead>
                                                <TableHead className="px-3 py-2 w-[10%] text-[9px] font-black text-slate-500 uppercase tracking-wider">Status</TableHead>
                                                <TableHead className="px-3 py-2 w-[10%]">{renderSortHeaderLabel("Created Date", "createddate")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id} className="border-slate-100 hover:bg-slate-50 transition-colors group">
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={cn(
                                                                "h-6 w-6 rounded-md bg-gradient-to-tr flex items-center justify-center font-bold text-white text-[9px] shadow-sm transition-transform duration-200 group-hover:scale-105 flex-shrink-0",
                                                                getAvatarGradient(student.email, student.fullName)
                                                            )}>
                                                                {student.fullName ? student.fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : "ST"}
                                                            </div>
                                                            <span className="font-extrabold text-[11px] text-slate-900 leading-tight truncate group-hover:text-primary transition-colors">
                                                                {student.fullName}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-650 font-black px-1.5 py-0.5 text-[8px] rounded-md pointer-events-none">
                                                            {student.grade ? (student.grade.toLowerCase().includes("grade") ? student.grade : `${student.grade} Grade`) : "N/A"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <span className="text-[11px] font-semibold text-slate-700 truncate block max-w-[150px]">
                                                            {student.organizationName || "-"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <div className="flex flex-col gap-0.5 max-w-[200px] text-[10px]">
                                                            <span className="font-bold text-slate-700 truncate flex items-center gap-1 leading-tight">
                                                                <span className="text-xs">📧</span>
                                                                <span className="truncate">{student.email}</span>
                                                            </span>
                                                            <span className="text-slate-400 font-semibold flex items-center gap-1 leading-tight">
                                                                <span className="text-xs">📞</span>
                                                                <span>{student.phoneNumber || "N/A"}</span>
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <span className="text-[11px] font-semibold text-slate-700 capitalize">
                                                            {student.gender || "-"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        {renderStatusBadge(student.isActive)}
                                                    </TableCell>
                                                    <TableCell className="px-3 py-1.5 align-middle">
                                                        <span className="text-[11px] font-medium text-slate-500">
                                                            {formatDate(student.createdAt)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                                    {students.map((student) => (
                                        <Card key={student.id} className="border border-slate-200/60 shadow-sm overflow-hidden rounded-xl bg-white">
                                            <CardContent className="p-3 space-y-2.5 text-left">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={cn(
                                                            "h-8 w-8 rounded-md bg-gradient-to-tr flex items-center justify-center font-bold text-white text-[10px] shadow-sm",
                                                            getAvatarGradient(student.email, student.fullName)
                                                        )}>
                                                            {student.fullName ? student.fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : "ST"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-extrabold text-slate-900 leading-none mb-1">
                                                                {student.fullName}
                                                            </p>
                                                            <span className="text-[9px] font-semibold text-slate-400 block truncate max-w-[170px]">{student.email}</span>
                                                        </div>
                                                    </div>
                                                    {renderStatusBadge(student.isActive)}
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-2 text-[10px]">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Grade</p>
                                                        <span className="font-bold text-slate-700">
                                                            {student.grade || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
                                                        <span className="font-bold text-slate-700">
                                                            {student.phoneNumber || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Gender</p>
                                                        <span className="font-bold text-slate-700 capitalize">
                                                            {student.gender || "-"}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Created Date</p>
                                                        <span className="font-bold text-slate-700">
                                                            {formatDate(student.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {selectedOrgId && students.length > 0 && (
                            <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <select 
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        disabled={studentsLoading}
                                        className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 outline-none cursor-pointer disabled:opacity-50"
                                    >
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                    </select>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Showing {totalCount === 0 ? 0 : ((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalCount)} of {totalCount} records
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        disabled={studentsLoading || currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className="h-8.5 rounded-xl border-slate-200 text-xs font-bold gap-1 px-3"
                                    >
                                        Previous
                                    </Button>
                                    
                                    <div className="flex items-center gap-1 mx-1">
                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            const pageNum = i + 1;
                                            if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                                                if (pageNum === 2 && currentPage > 3) {
                                                    return <span key="ellipsis-start" className="px-1 text-slate-450 text-xs">...</span>;
                                                }
                                                if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                                                    return <span key="ellipsis-end" className="px-1 text-slate-455 text-xs">...</span>;
                                                }
                                                return null;
                                            }
                                            return (
                                                <Button 
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    disabled={studentsLoading}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={cn(
                                                        "h-8.5 w-8.5 p-0 rounded-xl text-xs font-black",
                                                        currentPage === pageNum ? "bg-primary text-white border-primary" : "border-slate-200"
                                                    )}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        disabled={studentsLoading || currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        className="h-8.5 rounded-xl border-slate-200 text-xs font-bold gap-1 px-3"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Students;