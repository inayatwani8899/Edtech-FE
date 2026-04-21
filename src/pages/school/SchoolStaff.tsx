import React, { useState } from "react";
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    MoreVertical, 
    Mail, 
    Phone, 
    ShieldCheck, 
    Calendar,
    Award,
    Clock,
    UserCheck,
    Briefcase
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

    const filteredStaff = dummyStaff.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Staff Registry</h1>
                        <p className="text-sm font-medium text-slate-500">Manage your organization's academic and administrative team.</p>
                    </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 gap-2 px-6 h-11">
                    <UserPlus className="h-4 w-4" />
                    Add Staff Member
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm backdrop-blur-md">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search staff by name or role..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2 font-bold text-xs uppercase">
                        <Filter className="h-4 w-4" />
                        Department
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2 font-bold text-xs uppercase">
                        <ShieldCheck className="h-4 w-4" />
                        Permissions
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((member) => (
                    <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-700">
                            <Briefcase className="h-32 w-32" />
                        </div>
                        
                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <Badge className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-2.5 py-1",
                                member.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                            )}>
                                {member.status}
                            </Badge>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{member.name}</h3>
                            <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">{member.role}</p>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{member.department}</p>
                        </div>

                        <div className="mt-6 space-y-3 relative z-10">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <Mail className="h-4 w-4" />
                                <span className="text-xs font-medium truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <Phone className="h-4 w-4" />
                                <span className="text-xs font-medium">{member.phone}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter leading-none mb-1">Exp.</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{member.experience}</span>
                                </div>
                                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter leading-none mb-1">Rating</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">4.9/5</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <Award className="h-4 w-4 text-amber-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
