import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrganizationStore } from "@/store/organizationStore";
import { 
    Loader2, 
    Calendar, 
    Phone, 
    Mail, 
    Globe, 
    Building, 
    ArrowLeft, 
    Edit, 
    Shield, 
    BadgeCheck, 
    Activity,
    MapPin,
    CalendarDays,
    Users,
    HardDrive,
    FileText,
    Download,
    ExternalLink,
    CheckCircle,
    XCircle,
    UserCheck,
    Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Swal from "sweetalert2";

const OrganizationView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { 
        organization, 
        loading, 
        error, 
        fetchOrganization, 
        verifyOrganization, 
        clearOrganization 
    } = useOrganizationStore();

    useEffect(() => {
        if (id) {
            fetchOrganization(id);
        }
        
        return () => {
            clearOrganization();
        };
    }, [id, fetchOrganization, clearOrganization]);

    const handleVerifyToggle = async () => {
        if (!id || !organization) return;
        
        const actionText = organization.isVerified ? "revoke approval for" : "approve";
        
        Swal.fire({
            title: organization.isVerified ? "Revoke Approval?" : "Approve Organization?",
            text: `Are you sure you want to ${actionText} "${organization.instituteName}"? This will toggle their system clearance status.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: organization.isVerified ? "#ef4444" : "#10b981", // red vs emerald
            cancelButtonColor: "#94a3b8", // slate
            confirmButtonText: organization.isVerified ? "Yes, Revoke" : "Yes, Approve",
            cancelButtonText: "Cancel",
            background: "#fff",
            color: "#000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await verifyOrganization(id);
                    toast.success("Organization approval status updated successfully.");
                } catch (err: any) {
                    toast.error(err.message || "Failed to update approval status.");
                }
            }
        });
    };

    const getDocumentAbsoluteUrl = (docUrl?: string) => {
        if (!docUrl) return "";
        if (docUrl.startsWith("http://") || docUrl.startsWith("https://")) return docUrl;
        
        const base = import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/";
        const origin = base.replace("/api/", "");
        return `${origin}${docUrl.startsWith("/") ? "" : "/"}${docUrl}`;
    };

    const getStatusBadge = (status?: string) => {
        const s = (status || "Pending").toLowerCase();
        switch (s) {
            case "completed":
                return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1">Completed</Badge>;
            case "verified":
                return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1">Verified</Badge>;
            case "rejected":
                return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1">Rejected</Badge>;
            case "pending":
            default:
                return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1">Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Organization Dossier...</p>
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center px-4">
                <Card className="max-w-md w-full border-none shadow-xl bg-white rounded-[2rem] overflow-hidden border border-slate-100">
                    <CardContent className="p-10 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto mb-6 border border-rose-100">
                            <Shield className="h-10 w-10 text-rose-500" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Protocol Failed</h2>
                        <p className="text-slate-500 text-sm mb-8">{error || "The requested organization could not be located in the registry."}</p>
                        <Button onClick={() => navigate("/manage/organizations")} className="bg-slate-900 text-white font-black text-[10px] uppercase h-10 px-8 rounded-xl tracking-widest hover:bg-slate-800 transition-all">
                            Return to Registry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const docUrl = getDocumentAbsoluteUrl(organization.documentUrl);

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] px-4 overflow-x-hidden relative">
            {/* Ambient background glows */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 pt-4">
                {/* CONDENSED HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-200/60 transition-all" onClick={() => navigate("/manage/organizations")}>
                            <ArrowLeft className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase flex items-center gap-2">
                                <Building className="h-4.5 w-4.5 text-indigo-500" /> Organization Intel
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Identity Dossier</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/manage/organizations")} 
                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[10px] h-9 px-4 rounded-lg uppercase tracking-wider"
                        >
                            Back
                        </Button>
                        <Button 
                            onClick={() => navigate(`/organizations/edit/${organization.id}`)} 
                            className="bg-indigo-600 text-white font-black text-[10px] h-9 px-5 rounded-lg shadow-lg shadow-indigo-500/10 hover:bg-indigo-500 transition-all flex items-center gap-2 uppercase tracking-wider"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            Modify Dossier
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                    {/* LEFT COLUMN: IDENTITY AVATAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden border border-slate-100">
                            <div className="h-28 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                            </div>
                            <CardContent className="px-6 pb-6 -mt-14 relative z-10 text-center">
                                <div className="h-24 w-24 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 mx-auto mb-4">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <Building className="h-10 w-10 text-slate-400" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-1 truncate px-2">
                                    {organization.instituteName}
                                </h2>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold uppercase tracking-[0.15em] text-[9px] px-3.5 py-0.5 mb-6">
                                    {organization.organizationType || "Institute"}
                                </Badge>

                                <div className="space-y-3 pt-5 border-t border-slate-100 text-left">
                                    <div className="flex items-center justify-between p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reference ID</span>
                                            <span className="text-xs font-black text-slate-700 font-mono">ID: {organization.id}</span>
                                        </div>
                                        <Shield className="h-4 w-4 text-slate-300" />
                                    </div>
                                    
                                    <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${
                                        organization.isVerified 
                                            ? "bg-emerald-50/30 border-emerald-100 shadow-emerald-500/5" 
                                            : "bg-slate-50/50 border-slate-200 shadow-slate-500/5"
                                    }`}>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Security clearance</span>
                                            <span className={`text-xs font-black ${organization.isVerified ? "text-emerald-700" : "text-slate-500"}`}>
                                                {organization.isVerified ? "Verified Approved" : "Locked / Pending"}
                                            </span>
                                        </div>
                                        {organization.isVerified ? (
                                            <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-slate-300" />
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleVerifyToggle}
                                        className={`w-full text-[9px] font-black uppercase tracking-widest h-9 rounded-xl border transition-all ${
                                            organization.isVerified
                                                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                                : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                        }`}
                                    >
                                        {organization.isVerified ? "Revoke System Clearance" : "Grant System Clearance"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: DETAIL SECTIONS */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* BASIC INFORMATION & METRICS */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Institutional Matrix</h3>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Building className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Institute Name</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.instituteName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Users className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Approx student count</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.approxStudentCount || 0} students</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Briefcase className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Organization type</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.organizationType || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <HardDrive className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tenant DB name</p>
                                            <p className="text-xs font-bold text-slate-800 font-mono">{organization.tenantDb || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CONTACT DIRECTORY */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Contact records</h3>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-4 group col-span-1 md:col-span-2">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Mail className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                                            <a href={`mailto:${organization.email}`} className="text-xs font-bold text-slate-800 break-all hover:text-indigo-600 transition-colors">{organization.email}</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Phone className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                                            <p className="text-xs font-bold text-slate-800 font-mono">{organization.contactNumber || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group col-span-1 md:col-span-3 border-t border-slate-50 pt-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Globe className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Official Website</p>
                                            {organization.website ? (
                                                <a 
                                                    href={organization.website.toLowerCase().startsWith("http") ? organization.website : `https://${organization.website}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                                                >
                                                    {organization.website} <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <p className="text-xs font-bold text-slate-400">-</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* GEOGRAPHICAL COORDINATES */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Address Information</h3>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4 group col-span-1 md:col-span-2">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100 flex-shrink-0">
                                            <MapPin className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Physical Address</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.address || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <MapPin className="h-4.5 w-4.5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">City / State</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.city || "-"}, {organization.state || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-105 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                            <Globe className="h-4.5 w-4.5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Country / Postal code</p>
                                            <p className="text-xs font-bold text-slate-800">{organization.country || "-"} ({organization.postalCode || "-"})</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* UPLOADED DOCUMENTS */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Uploaded Verification Documents</h3>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                {organization.documentUrl ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-11 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-rose-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Audit Document File</p>
                                                <p className="text-xs font-bold text-slate-700 truncate max-w-[280px] sm:max-w-[320px]">
                                                    {organization.documentUrl.split("/").pop()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <a 
                                                href={docUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Button variant="outline" className="w-full h-9 border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider gap-2">
                                                    <ExternalLink className="h-3.5 w-3.5" /> View
                                                </Button>
                                            </a>
                                            <a 
                                                href={docUrl} 
                                                download
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Button className="w-full h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider gap-2">
                                                    <Download className="h-3.5 w-3.5" /> Download
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No verification document has been uploaded.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* STATUS AND AUDIT INFORMATION */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Audit Logs & Lifecycle</h3>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Audit Status</span>
                                            {getStatusBadge(organization.status)}
                                        </div>
                                        <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3">
                                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Onboarding Stage</span>
                                            <span className="font-black text-slate-800">Stage {organization.onboardingStage ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3.5 md:border-l md:border-slate-100 md:pl-6">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Sync Origin</span>
                                            <span className="font-semibold text-slate-700 flex items-center gap-1.5 font-mono text-[11px]">
                                                {organization.createdDate ? new Date(organization.createdDate).toLocaleDateString(undefined, { dateStyle: "medium" }) : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3">
                                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Last Modified</span>
                                            <span className="font-semibold text-slate-700 flex items-center gap-1.5 font-mono text-[11px]">
                                                {organization.lastModifiedDate ? new Date(organization.lastModifiedDate).toLocaleDateString(undefined, { dateStyle: "medium" }) : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default OrganizationView;
