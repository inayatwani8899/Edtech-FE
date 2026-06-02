import React, { useState } from "react";
import { 
    School, 
    Mail, 
    Phone, 
    Globe, 
    MapPin, 
    Camera, 
    Edit3, 
    Building2, 
    CheckCircle2, 
    Save,
    ExternalLink,
    Award,
    ShieldCheck,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export const SchoolProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    
    const handleSave = () => {
        Swal.fire({
            title: 'Updating Profile',
            text: 'Saving institutional changes...',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Profile Header */}
            <div className="relative group">
                <div className="h-48 w-full rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <button className="absolute bottom-4 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/20">
                        <Camera className="h-4 w-4" />
                        Change Banner
                    </button>
                </div>
                
                <div className="px-8 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group/avatar">
                        <div className="h-32 w-32 rounded-3xl bg-white p-1 shadow-2xl">
                            <div className="h-full w-full rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-50 relative overflow-hidden">
                                <School className="h-12 w-12 text-slate-400" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">St. Xavier's International</h1>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 px-2 py-0 font-black text-[10px] uppercase tracking-widest">
                                        Verified Inst.
                                    </Badge>
                                </div>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4" />
                                    Phase 2, Education Hub, New Delhi, India
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant={isEditing ? "outline" : "default"}
                                    onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                                    className={cn(
                                        "h-11 rounded-xl px-6 font-bold text-xs uppercase tracking-wider transition-all",
                                        !isEditing && "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    )}
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </Button>
                                {isEditing && (
                                    <Button onClick={handleSave} className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-100 dark:border-white/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Institutional HUD</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { icon: Mail, label: "Official Email", value: "contact@stxaviers.edu" },
                                { icon: Phone, label: "Helpdesk", value: "+91 98765 43210" },
                                { icon: Globe, label: "Website", value: "www.stxaviers.edu", link: true },
                                { icon: Building2, label: "Founded", value: "1994 (30 Years)" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                                        {isEditing ? (
                                            <Input defaultValue={item.value} className="h-8 text-sm font-bold bg-slate-50 border-none px-0" />
                                        ) : (
                                            <p className={cn("text-sm font-bold text-slate-900 dark:text-white truncate", item.link && "text-blue-600 cursor-pointer flex items-center gap-1 hover:underline")}>
                                                {item.value}
                                                {item.link && <ExternalLink className="h-3 w-3" />}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-black text-white rounded-[2rem] overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Award className="h-6 w-6 text-amber-500" />
                                <h3 className="font-black text-lg uppercase tracking-tight">Accreditations</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "CBSE Board", status: "Active", year: "2030" },
                                    { name: "ISO 9001:2015", status: "Certified", year: "2026" },
                                    { name: "Global Excellence", status: "Gold Tier", year: "2025" },
                                ].map((acc, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                                        <div>
                                            <p className="text-sm font-bold">{acc.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Valid until {acc.year}</p>
                                        </div>
                                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Info & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organization Profile</CardTitle>
                                <p className="text-sm font-medium text-slate-500">Manage institutional biographic data and vision statements.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About the Institution</label>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full min-h-[160px] p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        defaultValue="St. Xavier's International has been a pioneer in quality education since 1994. Our mission is to nurture future leaders through holistic development and cutting-edge academic methodologies. With a focus on both traditional values and modern technology, we provide an environment where every student can excel."
                                    />
                                ) : (
                                    <div className="p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <p className="text-slate-700 dark:text-white leading-relaxed font-medium">
                                            St. Xavier's International has been a pioneer in quality education since 1994. Our mission is to nurture future leaders through holistic development and cutting-edge academic methodologies. With a focus on both traditional values and modern technology, we provide an environment where every student can excel.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Institutional Stats</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-blue-600">3.4k</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Alumni</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-indigo-600">120+</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Classrooms</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Reach Index</h4>
                                    </div>
                                    <div className="bg-blue-600/5 dark:bg-blue-600/10 p-4 rounded-2xl flex items-center justify-between border border-blue-600/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Global Rank</p>
                                                <p className="font-black text-slate-900 dark:text-white">#12 in Region</p>
                                            </div>
                                        </div>
                                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="px-8 py-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Profile completeness: 95%</p>
                            <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full w-[95%] bg-emerald-500" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("bg-white rounded-lg border", className)}>{children}</div>
);

const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("p-4", className)}>{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("p-4", className)}>{children}</div>
);

const TrendingUp = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);
