import React, { useEffect, useState } from "react";
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
import { useOrganizationStore, Organization } from "@/store/organizationStore";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Building,
  ArrowUpDown,
  Filter,
  Sparkles,
  ExternalLink,
  MapPin,
  Check,
  X,
  Eye,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { TenantSetupModal } from "./components/TenantSetupModal";

const Organizations: React.FC = () => {
  const navigate = useNavigate();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedOrgForSetup, setSelectedOrgForSetup] = useState<Organization | null>(null);

  const handleOpenSetup = (org: Organization) => {
    setSelectedOrgForSetup(org);
    setSetupModalOpen(true);
  };

  const {
    organizations,
    loading,
    currentPage,
    totalPages,
    limit,
    totalCount,
    searchTerm,
    sortDirection,
    
    statusFilter,
    approvalFilter,
    documentFilter,
    detailsFilter,
    
    setPage,
    setLimit,
    setSearchTerm,
    setSortDirection,
    
    setStatusFilter,
    setApprovalFilter,
    setDocumentFilter,
    setDetailsFilter,
    
    fetchOrganizations,
    deleteOpen,
    openDeleteDialog,
    closeDeleteDialog,
    deleteOrganization,
    verifyOrganization,
  } = useOrganizationStore();

  useEffect(() => {
    fetchOrganizations();
  }, [
    currentPage,
    limit,
    searchTerm,
    sortDirection,
    statusFilter,
    approvalFilter,
    documentFilter,
    detailsFilter,
    fetchOrganizations
  ]);

  const handleSortToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleVerify = async (id: string) => {
    const org = organizations.find((o) => String(o.id) === id);
    const actionText = org?.isVerified ? "revoke approval for" : "approve";
    
    Swal.fire({
      title: org?.isVerified ? "Revoke Approval?" : "Approve Organization?",
      text: `Are you sure you want to ${actionText} "${org?.instituteName || "this organization"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: org?.isVerified ? "Yes, Revoke" : "Yes, Approve",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await verifyOrganization(id);
          toast.success("Organization approval status updated successfully.");
        } catch (error: any) {
          toast.error(error.message || "Failed to update approval status.");
        }
      }
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrganization();
      toast.success("Organization profile removed successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete organization.");
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "Pending").toLowerCase();
    switch (s) {
      case "completed":
      case "fully activated":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Fully Activated</Badge>;
      case "verified":
      case "server verified":
        return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">Server Verified</Badge>;
      case "registered":
        return <Badge className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">Registered</Badge>;
      case "database created":
        return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">Database Created</Badge>;
      case "data synced":
        return <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">Data Synced</Badge>;
      case "email sent":
        return <Badge className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">Email Sent</Badge>;
      case "pending":
      case "pending setup":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">Pending Setup</Badge>;
      case "rejected":
      case "failed setup":
        return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">Failed Setup</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold">{status || "Pending"}</Badge>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-px w-6 bg-primary/40"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Global Registry</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
              Organization <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Console</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 max-w-2xl">
              Register, audit, and approve partner academic organizations and tenant servers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/organizations/add")}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
            >
              <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Add Organization</span>
            </Button>
          </div>
        </div>

        {/* Filter & Data Card */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50 space-y-4">
            {/* Search and Sort Toggle */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by institute name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleSortToggle}
                  className="h-9 px-3 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-all text-xs"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                  Sort Order ({sortDirection.toUpperCase()})
                </Button>
              </div>
            </div>

            {/* Filter Matrix Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100/80">
              {/* Filter 1: Status */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Audit Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="All" className="text-xs font-medium">All Statuses</SelectItem>
                    <SelectItem value="Completed" className="text-xs font-medium">Completed</SelectItem>
                    <SelectItem value="Pending" className="text-xs font-medium">Pending</SelectItem>
                    <SelectItem value="Verified" className="text-xs font-medium">Verified</SelectItem>
                    <SelectItem value="Rejected" className="text-xs font-medium">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 2: Approval Status */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Clearance Status</label>
                <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                  <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="All Verification" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="All" className="text-xs font-medium">All Verification</SelectItem>
                    <SelectItem value="Approved" className="text-xs font-medium">Approved</SelectItem>
                    <SelectItem value="Not Approved" className="text-xs font-medium">Not Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 3: Document Uploads */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Documents Audited</label>
                <Select value={documentFilter} onValueChange={setDocumentFilter}>
                  <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="All Documents" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="All" className="text-xs font-medium">All Documents</SelectItem>
                    <SelectItem value="Documents Completed" className="text-xs font-medium">Documents Completed</SelectItem>
                    <SelectItem value="Documents Pending" className="text-xs font-medium">Documents Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 4: Profile Completion */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Profile Completeness</label>
                <Select value={detailsFilter} onValueChange={setDetailsFilter}>
                  <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="All Profile Details" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="All" className="text-xs font-medium">All Profile Details</SelectItem>
                    <SelectItem value="Details Completed" className="text-xs font-medium">Details Completed</SelectItem>
                    <SelectItem value="Incomplete" className="text-xs font-medium">Incomplete</SelectItem>
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
                  <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Synchronizing Console</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Loading organization profiles...</span>
                </div>
              </div>
            ) : organizations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                  <Building className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Organizations Found</h3>
                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                  {searchTerm 
                    ? "No registry matching those exact query parameters." 
                    : "Add new organizations to configure student onboarding servers."}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200 hover:bg-slate-50">
                    Clear Search Matrix
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {/* Desktop view */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[25%]">Institute Name</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[22%]">Contact Info</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Onboarding</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Clearance</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Documents</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[17%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.map((org: Organization) => {
                        const hasDocs = !!(org.documentUrl || (org.documents && org.documents.length > 0));
                        return (
                          <TableRow key={org.id} className="border-slate-100 hover:bg-slate-50 transition-all duration-200 group">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm shadow-indigo-500/20 flex-shrink-0">
                                  {org.instituteName?.[0] || "I"}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-900 leading-tight truncate mb-0.5">
                                    {org.instituteName}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                                    <MapPin className="h-2.5 w-2.5" />
                                    <span>{org.city || "-"}, {org.state || "-"}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-slate-700 truncate">{org.email}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                  <span>{org.contactNumber || "-"}</span>
                                  {org.website && (
                                    <>
                                      <span>•</span>
                                      <a 
                                        href={org.website.startsWith("http") ? org.website : `https://${org.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-primary hover:underline flex items-center gap-0.5 inline-flex"
                                      >
                                        Visit <ExternalLink className="h-2 w-2" />
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                {getStatusBadge(org.status)}
                                {org.status?.toLowerCase() !== "fully activated" && org.status?.toLowerCase() !== "completed" && (
                                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        org.status?.toLowerCase() === "failed setup" ? "bg-rose-500 w-1/3" :
                                        org.status?.toLowerCase() === "database created" ? "bg-indigo-500 w-2/3" :
                                        org.status?.toLowerCase() === "data synced" || org.status?.toLowerCase() === "email sent" ? "bg-purple-500 w-5/6" : "bg-amber-500 w-1/4"
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              {org.isVerified ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[9px] flex items-center gap-1 w-fit">
                                  <Check className="h-2.5 w-2.5" /> Approved
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[9px] flex items-center gap-1 w-fit">
                                  <X className="h-2.5 w-2.5" /> Locked
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              {hasDocs ? (
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Done
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                  <XCircle className="h-3.5 w-3.5 text-slate-300" /> Pending
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerify(String(org.id))}
                                  className={`h-7 px-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    org.isVerified 
                                      ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200" 
                                      : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"
                                  }`}
                                  title={org.isVerified ? "Revoke clearance" : "Approve organization"}
                                >
                                  {org.isVerified ? "Revoke" : "Approve"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/organizations/view/${org.id}`)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                  title="View details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenSetup(org)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-650 hover:text-indigo-650 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                  title="Configure Tenant Database & Sync"
                                >
                                  <Database className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/organizations/edit/${org.id}`)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                  title="Edit details"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(String(org.id))}
                                  className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                  title="Delete profile"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile view */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden">
                  {organizations.map((org: Organization) => {
                    const hasDocs = !!(org.documentUrl || (org.documents && org.documents.length > 0));
                    return (
                      <Card key={org.id} className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/20">
                                {org.instituteName?.[0] || "I"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 leading-tight mb-1">
                                  {org.instituteName}
                                </p>
                                <span className="text-[10px] font-semibold text-slate-500 block truncate">{org.email}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-3 text-left">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Audit Status</p>
                              {getStatusBadge(org.status)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Approval Clearance</p>
                              {org.isVerified ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold py-0 px-2 pointer-events-none">Approved</Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-bold py-0 px-2 pointer-events-none">Locked</Badge>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Documents</p>
                              <span className="text-xs font-semibold text-slate-700">
                                {hasDocs ? "Uploaded" : "Pending"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">City, State</p>
                              <span className="text-xs font-semibold text-slate-700">{org.city || "-"}, {org.state || "-"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-slate-50">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(String(org.id))}
                              className={`flex-1 h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                                org.isVerified
                                  ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                                  : "border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {org.isVerified ? "Revoke" : "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/organizations/view/${org.id}`)}
                              className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenSetup(org)}
                              className="h-9 w-9 rounded-lg border-slate-200 text-indigo-600 hover:bg-indigo-50"
                              title="Configure Database"
                            >
                              <Database className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/organizations/edit/${org.id}`)}
                              className="h-9 w-9 rounded-lg border-slate-200 text-indigo-600 hover:bg-indigo-50"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(String(org.id))}
                              className="h-9 w-9 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

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

        {/* Delete Confirmation */}
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
          title="Delete Organization Registry"
          description="Are you sure you want to permanently remove this organization? All connected tenant database information will be unlinked."
        />

        <TenantSetupModal
          open={setupModalOpen}
          onOpenChange={setSetupModalOpen}
          organization={selectedOrgForSetup}
        />
      </div>
    </div>
  );
};

export default Organizations;
