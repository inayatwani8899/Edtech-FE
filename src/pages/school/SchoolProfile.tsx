import React, { useEffect, useState } from "react";
import { 
    School, 
    Mail, 
    Phone, 
    Globe, 
    MapPin, 
    ExternalLink,
    Building2,
    Users,
    Download,
    FileText,
    AlertCircle,
    Calendar,
    Shield,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "@/lib/utils";

interface OrganizationProfile {
    id: number;
    instituteName: string;
    tenantDb: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
    contactNumber: string;
    website: string;
    organizationType: string;
    approxStudentCount: number;
    documentUrl: string | null;
    status: string;
    onboardingStage: number;
    isVerified: boolean;
    isActive: boolean;
    directStudentAllow: boolean;
    logoPath: string | null;
    siteMessage: string | null;
    createdDate: string;
    lastModifiedDate: string;
}

export const SchoolProfile = () => {
    const [profile, setProfile] = useState<OrganizationProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getOrganizationId = () => {
        const orgIdFromStorage = localStorage.getItem("organizationId");
        if (orgIdFromStorage) return orgIdFromStorage;

        const tenantData = useAuthStore.getState().tenantData;
        if (tenantData?.id) return String(tenantData.id);

        const user = useAuthStore.getState().user as any;
        if (user?.organizationId) return String(user.organizationId);
        if (user?.tenantId) return String(user.tenantId);

        try {
            const orgData = localStorage.getItem("organizationData");
            if (orgData) {
                const org = JSON.parse(orgData);
                if (org?.id) return String(org.id);
            }
        } catch {}

        return null;
    };

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        
        const orgId = getOrganizationId();
        if (!orgId) {
            setError("No organization ID associated with your session.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.get<any>(`/Organization/${orgId}`);
            if (response.data && response.data.success) {
                setProfile(response.data.data);
            } else {
                setError("Failed to fetch organization details.");
            }
        } catch (err: any) {
            console.error("Failed to load school profile:", err);
            setError(err.response?.data?.message || "Failed to load organization profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    const getFullUrl = (path: string | null) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        
        const baseHost = import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/";
        let domain = baseHost;
        if (domain.endsWith("/api/")) {
            domain = domain.substring(0, domain.length - 5);
        } else if (domain.endsWith("/api")) {
            domain = domain.substring(0, domain.length - 4);
        }
        
        if (domain.endsWith("/")) {
            domain = domain.slice(0, -1);
        }
        
        let cleanPath = path;
        if (!cleanPath.startsWith("/")) {
            cleanPath = "/" + cleanPath;
        }
        return domain + cleanPath;
    };

    const getDocumentName = (url: string | null) => {
        if (!url) return "";
        const parts = url.split("/");
        const filenameWithUuid = parts[parts.length - 1];
        const underscoreIndex = filenameWithUuid.indexOf("_");
        if (underscoreIndex !== -1) {
            return filenameWithUuid.substring(underscoreIndex + 1);
        }
        return filenameWithUuid;
    };

    const handleDownloadDoc = async (url: string) => {
        const toastId = toast.loading("Downloading document...");
        try {
            const response = await api.get(url, {
                responseType: "blob",
                headers: { "x-skip-toast": "true" }
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = getDocumentName(url) || "Document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
            toast.dismiss(toastId);
            toast.success("Document downloaded successfully.");
        } catch (err) {
            console.error(err);
            toast.dismiss(toastId);
            toast.error("Failed to download document.");
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "CT";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-1.5">
                {/* Hero Skeleton */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                    {/* Logo Skeleton */}
                    <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 animate-pulse"></div>
                    <div className="flex-1 space-y-4 w-full mt-2">
                        <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-850 rounded animate-pulse"></div>
                        <div className="flex gap-2">
                            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                        </div>
                        <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl w-full animate-pulse"></div>
                    </div>
                </div>

                {/* Information & Document Skeleton Grid */}
                <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Left Column (Contact & Location) */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="h-4 w-36 bg-slate-250 dark:bg-slate-800 rounded"></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg sm:col-span-2"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-slate-250 dark:bg-slate-800 rounded"></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg sm:col-span-2"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Info & Document) */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="h-4 w-36 bg-slate-250 dark:bg-slate-800 rounded"></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                    <div className="h-12 bg-slate-100 dark:bg-slate-850 rounded-lg"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-36 bg-slate-250 dark:bg-slate-800 rounded"></div>
                                <div className="h-16 bg-slate-100 dark:bg-slate-850 rounded-2xl w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4 p-1.5">
                <div className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-elegant bg-white dark:bg-slate-900 rounded-2xl p-8 text-center flex flex-col items-center">
                    <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-955/20 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/30 text-rose-500">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Unable to load organization profile.</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
                        Please try again.
                    </p>
                    <Button 
                        onClick={fetchProfile} 
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-9.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const initials = getInitials(profile.instituteName);
    const logoUrl = getFullUrl(profile.logoPath);

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-5 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Organization Console</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            School <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Profile</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage your institute details, logo, timeline status, and databases.
                        </p>
                    </div>
                </div>

                {/* Hero Profile Card */}
                <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-550/5 dark:via-indigo-550/2 dark:to-purple-550/5 bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-elegant overflow-hidden relative group transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-600 z-10" />
                <div className="p-5 sm:p-6 flex flex-col md:flex-row items-center md:items-start gap-5 relative z-0">
                    
                    {/* Left: Organization Logo */}
                    <div className="relative group/avatar shrink-0">
                        <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden">
                            {logoUrl ? (
                                <img src={logoUrl} alt={profile.instituteName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info Strip */}
                    <div className="flex-1 text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {profile.instituteName}
                                </h1>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 flex items-center justify-center md:justify-start gap-1">
                                    <School className="h-3.5 w-3.5" />
                                    {profile.organizationType} Organization
                                </p>
                            </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors",
                                profile.isVerified
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-750 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40"
                            )}>
                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                                {profile.isVerified ? "✓ Verified" : "Pending Verification"}
                            </span>

                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors",
                                profile.isActive
                                    ? "bg-blue-50 dark:bg-blue-955/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40"
                                    : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                            )}>
                                {profile.isActive ? "✓ Active" : "Inactive"}
                            </span>

                            {profile.status && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors bg-purple-50 dark:bg-purple-950/30 text-purple-750 dark:text-purple-400 border-purple-100 dark:border-purple-900/40">
                                    {profile.status}
                                </span>
                            )}

                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors",
                                profile.directStudentAllow
                                    ? "bg-cyan-50 dark:bg-cyan-955/30 text-cyan-700 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/40"
                                    : "bg-rose-50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-455 border-rose-100 dark:border-rose-900/40"
                            )}>
                                {profile.directStudentAllow ? "Direct Registration Enabled" : "Direct Registration Disabled"}
                            </span>
                        </div>

                        {/* Metadata strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 border-t border-slate-150/60 dark:border-slate-800/80 pt-4 mt-5 text-xs font-semibold text-slate-550 dark:text-slate-400">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Tenant Database</span>
                                <span className="text-slate-800 dark:text-slate-250 font-extrabold">{profile.tenantDb}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Organization ID</span>
                                <span className="text-slate-800 dark:text-slate-250 font-extrabold">#{profile.id}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Created On</span>
                                <span className="text-slate-800 dark:text-slate-250 font-extrabold">{formatDate(profile.createdDate)}</span>
                            </div>
                        </div>

                        {/* Site Message */}
                        {profile.siteMessage && (
                            <div className="mt-5 p-4 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl">
                                <span className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 block tracking-widest mb-1">Organization Message</span>
                                <p className="text-sm font-semibold italic text-slate-750 dark:text-slate-350">
                                    "{profile.siteMessage}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Information Grid Container */}
            <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-elegant overflow-hidden p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">Contact Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Email</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">{profile.email || "-"}</span>
                                    </div>
                                </div>
                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 text-indigo-650 dark:text-indigo-400">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Phone</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.contactNumber || "-"}</span>
                                    </div>
                                </div>
                                {/* Website */}
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Website</span>
                                        {profile.website ? (
                                            <a 
                                                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                                            >
                                                {profile.website}
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">Location</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Address */}
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-450">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Address</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.address || "-"}</span>
                                    </div>
                                </div>
                                {/* City */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-450">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">City</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.city || "-"}</span>
                                    </div>
                                </div>
                                {/* State */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-450">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">State</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.state || "-"}</span>
                                    </div>
                                </div>
                                {/* Country */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-450">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Country</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.country || "-"}</span>
                                    </div>
                                </div>
                                {/* Postal Code */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-450">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Postal Code</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.postalCode || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Organization Info */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">Organization Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Type */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-500">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Type</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.organizationType || "-"}</span>
                                    </div>
                                </div>
                                {/* Approx Students */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Approx Students</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.approxStudentCount ?? 0}</span>
                                    </div>
                                </div>
                                {/* Direct Student Registration */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center shrink-0 text-pink-650 dark:text-pink-400">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Direct Student Registration</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {profile.directStudentAllow ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                </div>
                                {/* Onboarding Stage */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center shrink-0 text-yellow-605 dark:text-yellow-500">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Onboarding Stage</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.onboardingStage ?? 0}</span>
                                    </div>
                                </div>
                                {/* Last Updated */}
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-455">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Last Updated</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatDate(profile.lastModifiedDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">Uploaded Documents</h3>
                            </div>
                            
                            {!profile.documentUrl ? (
                                <div className="flex flex-col items-center justify-center py-4 text-center bg-slate-50/30 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-4">
                                    <span className="text-xl mb-1">📄</span>
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-450">
                                        No documents uploaded.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-150/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/10 rounded-2xl gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center border border-red-100 dark:border-red-900/40 text-red-500 shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                                {getDocumentName(profile.documentUrl)}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">PDF Document</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => window.open(getFullUrl(profile.documentUrl), "_blank")}
                                            className="h-8 px-2.5 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1 dark:text-slate-350"
                                            title="View in new tab"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownloadDoc(profile.documentUrl!)}
                                            className="h-8 px-3 rounded-lg border-slate-250 dark:border-slate-850 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 shadow-sm"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};
