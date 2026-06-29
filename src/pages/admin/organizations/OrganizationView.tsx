import React, { useEffect, useState } from "react";
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
    Users,
    HardDrive,
    FileText,
    Download,
    ExternalLink,
    CheckCircle,
    XCircle,
    Database,
    RefreshCw,
    ShieldAlert,
    Clock,
    Lock,
    Sparkles,
    Check,
    Eye,
    Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { TenantSetupModal } from "./components/TenantSetupModal";

const OrganizationView: React.FC = () => {
    const navigate = useNavigate();
    const [setupModalOpen, setSetupModalOpen] = useState(false);
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

    const getLogoAbsoluteUrl = (logoPath?: string) => {
        if (!logoPath) return "";
        if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) return logoPath;
        
        const base = import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/";
        const origin = base.replace("/api/", "");
        return `${origin}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;
    };

    const getStatusBadge = (status?: string) => {
        const s = (status || "Pending").toLowerCase();
        switch (s) {
            case "completed":
            case "fully activated":
                return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-250 border-emerald-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Fully Activated</Badge>;
            case "verified":
            case "server verified":
                return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Server Verified</Badge>;
            case "registered":
                return <Badge className="bg-sky-50 text-sky-700 border border-sky-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Registered</Badge>;
            case "database created":
                return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Database Created</Badge>;
            case "data synced":
                return <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Data Synced</Badge>;
            case "email sent":
                return <Badge className="bg-teal-50 text-teal-700 border border-teal-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Email Sent</Badge>;
            case "pending":
            case "pending setup":
                return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Pending Setup</Badge>;
            case "rejected":
            case "failed setup":
                return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">Failed Setup</Badge>;
            default:
                return <Badge className="bg-slate-50 text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 pointer-events-none">{status || "Pending"}</Badge>;
        }
    };

    // Calculate onboarding timeline checked states
    const getTimelineStatus = () => {
        const s = (organization?.status || "").toLowerCase();
        const isVerified = organization?.isVerified === true;
        
        return {
            registered: true, // Always true once fetched
            verified: isVerified,
            dbCreated: ["database created", "data synced", "email sent", "fully activated", "completed"].includes(s),
            synced: ["data synced", "email sent", "fully activated", "completed"].includes(s),
            emailSent: ["email sent", "fully activated", "completed"].includes(s),
            activated: ["fully activated", "completed"].includes(s)
        };
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
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
                            <ShieldAlert className="h-10 w-10 text-rose-500" />
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
    const timeline = getTimelineStatus();

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 pb-16 overflow-x-hidden relative font-sans">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 pt-4">
                
                {/* Back Link Row */}
                <div className="flex items-center gap-2 mb-4">
                    <div 
                        onClick={() => navigate("/manage/organizations")}
                        className="p-1.5 bg-white border border-slate-200/60 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all text-slate-500 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft className="h-3 w-3" /> Back to Registry
                    </div>
                </div>

                {/* Profile Header Dashboard Banner */}
                <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden mb-6 border border-slate-100/50">
                    <div className="h-28 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-transparent"></div>
                    </div>
                    
                    <CardContent className="px-6 pb-6 pt-0 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10">
                        {/* Left: Organization Avatar, Name, Badges */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                            <div className="h-24 w-24 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 flex-shrink-0 flex items-center justify-center">
                                <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden">
                                    {organization.logoPath ? (
                                        <img 
                                            src={getLogoAbsoluteUrl(organization.logoPath)} 
                                            alt={`${organization.instituteName} logo`} 
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Building className="h-10 w-10 text-slate-400" />
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate max-w-[320px] md:max-w-[480px]">
                                    {organization.instituteName}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-650 font-bold uppercase tracking-wider text-[8px] border-none py-0.5">
                                        {organization.organizationType || "Institute"}
                                    </Badge>
                                    <span className="text-slate-350 text-xs hidden xs:inline">•</span>
                                    {organization.isVerified ? (
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[8px] uppercase tracking-wider py-0.5">
                                            <Check className="h-2 w-2 mr-0.5 inline" /> Verified
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[8px] uppercase tracking-wider py-0.5">
                                            <Lock className="h-2 w-2 mr-0.5 inline" /> Pending Approval
                                        </Badge>
                                    )}
                                    <span className="text-slate-350 text-xs hidden xs:inline">•</span>
                                    {getStatusBadge(organization.status)}
                                </div>
                            </div>
                        </div>

                        {/* Right: Dynamic Quick Actions */}
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 shrink-0">
                            {/* Clearance Approval Action */}
                            <Button
                                onClick={handleVerifyToggle}
                                className={`text-[10px] font-black uppercase tracking-wider h-9 px-4 rounded-xl border transition-all ${
                                    organization.isVerified
                                        ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                        : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                }`}
                            >
                                {organization.isVerified ? "Revoke Approval" : "Approve Profile"}
                            </Button>

                            {/* Database Setup (Only visible once verified) */}
                            {organization.isVerified && (
                                <Button 
                                    onClick={() => setSetupModalOpen(true)} 
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] h-9 px-4 rounded-xl shadow-md transition-all gap-1.5"
                                >
                                    <Database className="h-3.5 w-3.5" /> Configure Tenant
                                </Button>
                            )}

                            {/* Edit Action */}
                            <Button 
                                onClick={() => navigate(`/organizations/edit/${organization.id}`)} 
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] h-9 px-4 rounded-xl shadow-md shadow-indigo-500/10 transition-all gap-1.5"
                            >
                                <Edit className="h-3.5 w-3.5" /> Edit details
                            </Button>

                            {/* Download Onboarding Document Action */}
                            {organization.documentUrl && (
                                <a href={docUrl} download className="block">
                                    <Button 
                                        variant="outline"
                                        className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[10px] h-9 px-4 rounded-xl gap-1.5"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Download Docs
                                    </Button>
                                </a>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Dashboard Metrics Statistics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Student Capacity", value: organization.approxStudentCount || "Not set", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Onboarding Stage", value: organization.status || "Pending Setup", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Clearance Level", value: organization.isVerified ? "Clearance Verified" : "Verification Locked", icon: Shield, color: organization.isVerified ? "text-emerald-600" : "text-slate-400", bg: organization.isVerified ? "bg-emerald-50" : "bg-slate-50" },
                        { label: "Onboarding Date", value: formatDate(organization.createdDate), icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" }
                    ].map((metric, i) => (
                        <Card key={i} className="border-none shadow-elegant bg-white rounded-2xl overflow-hidden border border-slate-100/50 hover:scale-[1.01] transition-transform duration-300">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                                    <metric.icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{metric.label}</p>
                                    <p className="text-xs font-black text-slate-800 truncate leading-none">{metric.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Two-Column Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (spans 8 on lg viewports) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Platform Welcome Message */}
                        {organization.siteMessage && (
                            <Card className="border-none shadow-elegant bg-gradient-to-br from-indigo-50 to-white rounded-3xl overflow-hidden border border-indigo-150/30 p-5 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm shrink-0">
                                        <Sparkles className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none mb-1.5">Platform Message</h3>
                                        <p className="text-xs font-bold text-slate-800 italic leading-relaxed">
                                            "{organization.siteMessage}"
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Profile Information Card */}
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                
                                {/* Section 1: Institution Details */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                                        <Building className="h-3.5 w-3.5 text-indigo-500" /> Section 1: Organization Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Institute Name</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.instituteName}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Institution Type</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.organizationType || "Not configured"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Student capacity</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.approxStudentCount || 0} students</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Official Website</span>
                                            {organization.website ? (
                                                <a 
                                                    href={organization.website.toLowerCase().startsWith("http") ? organization.website : `https://${organization.website}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-xs font-bold text-indigo-650 hover:underline inline-flex items-center gap-1 leading-none"
                                                >
                                                    {organization.website} <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">Not configured</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Contact Records */}
                                <div className="space-y-4 border-t border-slate-100 pt-5">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-indigo-500" /> Section 2: Contact Directory
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Primary Contact Person</span>
                                            <span className="text-xs font-bold text-slate-800">System Administrator</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Administrative Email</span>
                                            <a href={`mailto:${organization.email}`} className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors break-all leading-none">{organization.email}</a>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Contact Phone Number</span>
                                            <span className="text-xs font-bold text-slate-800 font-mono">{organization.contactNumber || "Not configured"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Geographics address details */}
                                <div className="space-y-4 border-t border-slate-100 pt-5">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-indigo-500" /> Section 3: Location Registry
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                                        <div className="space-y-0.5 sm:col-span-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Street Address</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.address || "Not configured"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">City</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.city || "Not configured"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">State / Province</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.state || "Not configured"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Country</span>
                                            <span className="text-xs font-bold text-slate-800">{organization.country || "Not configured"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Postal / Zip Code</span>
                                            <span className="text-xs font-bold text-slate-800 font-mono">{organization.postalCode || "Not configured"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Platform Infrastructure Config */}
                                <div className="space-y-4 border-t border-slate-100 pt-5">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                                        <HardDrive className="h-3.5 w-3.5 text-indigo-500" /> Section 4: Platform Infrastructure Setup
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Tenant Database Name</span>
                                            <span className="text-xs font-black text-indigo-700 font-mono">{organization.tenantDb || "Not Provisioned"}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Onboarding Stage</span>
                                            <span className="text-xs font-bold text-slate-800">Stage {organization.onboardingStage ?? 0}</span>
                                        </div>
                                        <div className="space-y-0.5 flex flex-col justify-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Infrastructure Status</span>
                                            {organization.isActive ? (
                                                <Badge className="bg-emerald-50 text-emerald-705 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider text-[8px] py-0.5 w-fit">Active Link</Badge>
                                            ) : (
                                                <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-bold uppercase tracking-wider text-[8px] py-0.5 w-fit">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="space-y-0.5 flex flex-col justify-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Clearance Approval</span>
                                            {organization.isVerified ? (
                                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider text-[8px] py-0.5 w-fit">Approved</Badge>
                                            ) : (
                                                <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-bold uppercase tracking-wider text-[8px] py-0.5 w-fit">Under Review</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        {/* UPLOADED DOCUMENTS REDESIGN */}
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Uploaded Onboarding Verification Files</h3>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                {organization.documentUrl ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-slate-100/40">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="h-10 w-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <FileText className="h-5 w-5 text-rose-500" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 leading-none">Verification Cert</p>
                                                    <p className="text-xs font-bold text-slate-700 truncate" title={organization.documentUrl.split("/").pop()}>
                                                        {organization.documentUrl.split("/").pop()}
                                                    </p>
                                                    <span className="text-[9px] text-slate-450 text-slate-400 font-medium block mt-1">Uploaded On: {formatDate(organization.createdDate)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-200/50 pt-3 mt-3">
                                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold py-0.5">Audited</Badge>
                                                <div className="flex items-center gap-1.5">
                                                    <a href={docUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-indigo-50 border border-transparent hover:border-indigo-150 transition-all flex items-center justify-center">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </a>
                                                    <a href={docUrl} download>
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-indigo-50 border border-transparent hover:border-indigo-150 transition-all flex items-center justify-center">
                                                            <Download className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-250 border-slate-200">
                                        <ShieldAlert className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No compliance certificates uploaded.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (spans 4 on lg viewports) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Onboarding Timeline Card */}
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4.5 w-4.5 text-slate-800" />
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Onboarding Pipeline</h3>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none ml-1">Lifecycle Stages</p>
                                <div className="relative pl-3 space-y-6">
                                    {/* Timeline line visual connector */}
                                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 pointer-events-none -z-10" />

                                    {[
                                        { key: "registered", name: "Organization Registered", desc: "Dossier initialized", checked: timeline.registered },
                                        { key: "verified", name: "Organization Verified", desc: "Compliance clearance audit", checked: timeline.verified },
                                        { key: "dbCreated", name: "Database Created", desc: "Private environment built", checked: timeline.dbCreated },
                                        { key: "synced", name: "Primary Data Synced", desc: "Sync system definitions", checked: timeline.synced },
                                        { key: "emailSent", name: "Activation Email Sent", desc: "Onboarding keys delivered", checked: timeline.emailSent },
                                        { key: "activated", name: "Fully Activated", desc: "Active & running tenant cluster", checked: timeline.activated }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-4 relative">
                                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-300 border shadow-sm ${
                                                step.checked 
                                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10" 
                                                    : "bg-white border-slate-200 text-slate-400"
                                            }`}>
                                                {step.checked ? (
                                                    <Check className="h-3.5 w-3.5" />
                                                ) : (
                                                    <span className="text-[9px] font-black">{idx + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-bold leading-tight ${step.checked ? "text-slate-800" : "text-slate-405 text-slate-400"}`}>
                                                    {step.name}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-semibold truncate mt-0.5">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendation Action Assistant */}
                        <Card className="border-none shadow-elegant bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-indigo-300">
                                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Setup Assistant</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">
                                        {organization.status?.toLowerCase() === "fully activated" || organization.status?.toLowerCase() === "completed"
                                            ? "Setup Complete" 
                                            : "Recommended Action"
                                        }
                                    </p>
                                    <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">
                                        {!organization.isVerified && "Grant security clearance first to enable tenant database provisioning."}
                                        {organization.isVerified && !timeline.dbCreated && "Click 'Configure Tenant' in headers to build the isolate database."}
                                        {organization.isVerified && timeline.dbCreated && !timeline.synced && "Synchronize system matrices inside the Tenant setup console."}
                                        {organization.isVerified && timeline.synced && !timeline.emailSent && "Deliver the onboarding admin key configuration email."}
                                        {timeline.activated && "This institution's cloud cluster is deployed, activated, and running normally."}
                                    </p>
                                </div>
                                {organization.isVerified && !timeline.activated && (
                                    <Button 
                                        onClick={() => setSetupModalOpen(true)}
                                        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-[9px] h-8 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                                    >
                                        <RefreshCw className="h-3 w-3 animate-spin-slow" /> Continue setup
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                    </div>

                </div>

            </div>

            <TenantSetupModal
                open={setupModalOpen}
                onOpenChange={setSetupModalOpen}
                organization={organization}
            />
        </div>
    );
};

export default OrganizationView;
