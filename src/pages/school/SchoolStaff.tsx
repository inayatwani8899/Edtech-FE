import React, { useState, useMemo } from "react";
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    MoreHorizontal,
    Mail, 
    Phone, 
    ShieldCheck, 
    Award,
    UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const dummyStaff = [
    { id: 1, name: "Dr. Robert Wilson", role: "Principal", department: "Administration", email: "principal@school.edu", phone: "+1 234 567 890", status: "Active", experience: "15 years" },
    { id: 2, name: "Sarah Jenkins", role: "Head of Science", department: "Science", email: "sarah.j@school.edu", phone: "+1 234 567 891", status: "Active", experience: "8 years" },
    { id: 3, name: "Michael Chen", role: "Mathematics Teacher", department: "Mathematics", email: "m.chen@school.edu", phone: "+1 234 567 892", status: "Active", experience: "5 years" },
    { id: 4, name: "Jessica Alba", role: "Art Coordinator", department: "Arts", email: "jessica.a@school.edu", phone: "+1 234 567 893", status: "On Leave", experience: "12 years" },
];

export const SchoolStaff = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStaff = useMemo(() => {
        return dummyStaff.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

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
                            Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Directory</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Manage your organization's academic and administrative team.
                        </p>
                    </div>

                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-slate-900/20 gap-2 px-4 h-8 hover:scale-105 active:scale-95 transition-all">
                        <UserPlus className="h-4 w-4" />
                        Add Staff Member
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-2 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm backdrop-blur-md">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input 
                            placeholder="Search staff by name or role..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-8 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-[11px]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 rounded-lg border-slate-200 dark:border-slate-800 gap-1.5 font-bold text-[10px] uppercase">
                            <Filter className="h-3.5 w-3.5" />
                            Department
                        </Button>
                        <Button variant="outline" className="h-8 rounded-lg border-slate-200 dark:border-slate-800 gap-1.5 font-bold text-[10px] uppercase">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Permissions
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStaff.map((member) => (
                        <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
                            {/* Subtle gradient accent */}
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/60 via-teal-500/40 to-transparent rounded-t-2xl" />

                            <div className="flex items-start justify-between mb-3.5 relative z-10">
                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20 shrink-0">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <Badge className={cn(
                                    "rounded-md text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-none",
                                    member.status === "Active"
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                        : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                )}>
                                    {member.status}
                                </Badge>
                            </div>

                            <div className="space-y-0.5 relative z-10">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{member.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">{member.role}</p>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{member.department}</p>
                            </div>

                            <div className="mt-3.5 space-y-1.5 relative z-10">
                                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                    <Mail className="h-3.5 w-3.5 shrink-0" />
                                    <span className="text-[11px] font-medium truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                    <span className="text-[11px] font-medium">{member.phone}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter leading-none mb-0.5">Exp.</span>
                                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{member.experience}</span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-100 dark:bg-slate-800" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter leading-none mb-0.5">Rating</span>
                                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">4.9/5</span>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10">
                                        <Award className="h-3.5 w-3.5 text-amber-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
