import React, { useState } from "react";
import { 
    Settings, 
    Palette, 
    Shield, 
    Bell, 
    Cloud, 
    Database, 
    Globe, 
    Smartphone,
    UserCircle,
    Lock,
    Key,
    Eye,
    EyeOff,
    CheckCircle2,
    ToggleLeft,
    ToggleRight,
    Moon,
    Sun,
    Monitor,
    Languages,
    Download,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export const SchoolSettings = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [theme, setTheme] = useState("system");
    const [twoFactor, setTwoFactor] = useState(false);
    
    const handleUpdate = (section: string) => {
        Swal.fire({
            title: 'System Update',
            text: `${section} settings have been synchronized across all nodes.`,
            icon: 'success',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Acknowledged'
        });
    };

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Alerts", icon: Bell },
        { id: "data", label: "Data Hub", icon: Database },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* Minimal Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Portal Configurations</h1>
                <p className="text-slate-500 font-medium mt-1">Fine-tune your organization's digital workspace and security parameters.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                                activeTab === tab.id 
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25" 
                                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className={cn(
                                    "h-5 w-5 transition-transform group-hover:scale-110",
                                    activeTab === tab.id ? "text-white" : "text-slate-400"
                                )} />
                                <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </button>
                    ))}
                </div>

                {/* Settings Content Area */}
                <div className="flex-1">
                    <Card className="border-none shadow-2xl bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden min-h-[600px]">
                        <div className="p-10">
                            {activeTab === "general" && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Global Settings</h3>
                                        <p className="text-sm font-medium text-slate-500">Language, timezone, and primary contact preferences.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Portal Language</label>
                                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-2 flex items-center gap-2">
                                                <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm text-blue-600">
                                                    <Languages className="h-5 w-5" />
                                                </div>
                                                <select className="flex-1 bg-transparent border-none outline-none text-sm font-bold p-2 text-slate-700 dark:text-slate-200">
                                                    <option>English (United States)</option>
                                                    <option>Hindi (India)</option>
                                                    <option>Spanish (International)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Timezone</label>
                                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-2 flex items-center gap-2">
                                                <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm text-blue-600">
                                                    <Globe className="h-5 w-5" />
                                                </div>
                                                <select className="flex-1 bg-transparent border-none outline-none text-sm font-bold p-2 text-slate-700 dark:text-slate-200">
                                                    <option>(GMT+05:30) New Delhi, India</option>
                                                    <option>(GMT+00:00) London, UK</option>
                                                    <option>(GMT-05:00) New York, USA</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100 dark:bg-white/5" />

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                    <Smartphone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Mobile Access App</p>
                                                    <p className="text-xs font-medium text-slate-500">Allow parents/students to sync with the mobile companion app.</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                    <Cloud className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Auto-Cloud Backup</p>
                                                    <p className="text-xs font-medium text-slate-500">Hourly synchronization of all administrative and student records.</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Button onClick={() => handleUpdate("General")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">
                                            Synchronize Settings
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "appearance" && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Visual Identity</h3>
                                        <p className="text-sm font-medium text-slate-500">Customize the portal's aesthetic to match your institutional branding.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'light', label: 'Classic Light', icon: Sun, color: 'bg-white border-slate-200' },
                                            { id: 'dark', label: 'Pro Dark', icon: Moon, color: 'bg-slate-900 border-slate-700' },
                                            { id: 'system', label: 'Adaptive', icon: Monitor, color: 'bg-gradient-to-br from-white to-slate-900 border-slate-300' },
                                        ].map((t) => (
                                            <button 
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={cn(
                                                    "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group",
                                                    theme === t.id ? "border-blue-600 bg-blue-50/50 dark:bg-blue-500/10" : "border-transparent bg-slate-50 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/10"
                                                )}
                                            >
                                                <div className={cn("h-24 w-full rounded-2xl flex items-center justify-center p-4", t.color)}>
                                                    <t.icon className={cn("h-10 w-10", t.id === 'light' ? 'text-blue-500' : 'text-white')} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Brand Accent</label>
                                        <div className="flex gap-4">
                                            {['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'].map((color) => (
                                                <button 
                                                    key={color}
                                                    className="h-10 w-10 rounded-full border-4 border-white dark:border-slate-800 shadow-lg hover:scale-110 transition-transform active:scale-95"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Hardening</h3>
                                        <p className="text-sm font-medium text-slate-500">Manage institutional keys, encryption, and administrative access.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                            <Shield className="absolute top-0 right-0 h-32 w-32 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000" />
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                                        <Key className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Two-Factor Authentication (2FA)</p>
                                                        <p className="text-sm font-medium text-slate-500">Additional layer of verification for all admin logins via mobile app.</p>
                                                    </div>
                                                </div>
                                                <Switch 
                                                    checked={twoFactor}
                                                    onCheckedChange={(val) => {
                                                        setTwoFactor(val);
                                                        if(val) handleUpdate("Two-Factor Integrity");
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                                <div className="relative">
                                                    <Input type="password" placeholder="••••••••••••" className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none px-6 font-bold" />
                                                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-right flex flex-col justify-end pb-1">
                                                <button className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] transition-colors">Request Admin Key Reset</button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100 dark:bg-white/5" />

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600">
                                                <History className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Global Audit Log</span>
                                        </div>
                                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Download Session Reports</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "data" && (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    <div className="space-y-1 text-center">
                                        <div className="h-20 w-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl mx-auto mb-6">
                                            <Database className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Data Hub</h3>
                                        <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Export, audit, or reset your entire organization's data infrastructure.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="bg-slate-50 dark:bg-white/5 border-none p-8 rounded-[2rem] hover:shadow-xl transition-all group">
                                            <Download className="h-8 w-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Export Academic Records</h4>
                                            <p className="text-xs font-medium text-slate-500 mt-2 mb-6">Comprehensive CSV/JSON export including students, staff, and results.</p>
                                            <Button className="w-full bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 border border-slate-200 dark:border-white/10">Generate Link</Button>
                                        </Card>

                                        <Card className="bg-slate-50 dark:bg-white/5 border-none p-8 rounded-[2rem] hover:shadow-xl transition-all group">
                                            <Cloud className="h-8 w-8 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Legacy Archives</h4>
                                            <p className="text-xs font-medium text-slate-500 mt-2 mb-6">Access archived data from previous academic sessions (2020-2024).</p>
                                            <Button className="w-full bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 border border-slate-200 dark:border-white/10">Browse Archive</Button>
                                        </Card>
                                    </div>
                                </div>
                            )}
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
