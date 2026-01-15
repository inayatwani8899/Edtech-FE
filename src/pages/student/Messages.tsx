import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Send,
    Search,
    MoreHorizontal,
    Paperclip,
    Smile,
    CheckCheck,
    User,
    MessageSquare,
    Sparkles,
    Phone,
    Video
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Messages: React.FC = () => {
    const threads = [
        { name: "Sarah Jenkins", role: "Career Counselor", lastMsg: "The logic assessment results look promising...", time: "10:45 AM", online: true, active: true },
        { name: "Dr. Alan Grant", role: "Lead Instructor", lastMsg: "Please review the workshop materials.", time: "Yesterday", online: false, active: false },
        { name: "Admin Support", role: "Portal Help", lastMsg: "Your scholarship application has been received.", time: "Tue", online: true, active: false }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-warning/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 h-[calc(100vh-120px)] flex flex-col">
                {/* Header Section */}
                <div className="mb-8 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-warning/30"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-warning">Communication Hub</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                        Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-orange-600">Center</span>
                    </h1>
                </div>

                <Card className="glass-card border-none shadow-elegant flex-1 flex overflow-hidden rounded-[2.5rem]">
                    {/* Threads Sidebar */}
                    <div className="w-full md:w-80 border-r border-slate-100/50 flex flex-col bg-white/20 backdrop-blur-md">
                        <div className="p-6 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search threads..."
                                    className="h-11 pl-11 bg-slate-50/50 border-none rounded-2xl focus:ring-warning/20 font-medium text-xs"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
                            {threads.map((thread, i) => (
                                <div key={i} className={`p-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${thread.active ? 'bg-white shadow-soft ring-1 ring-slate-100' : 'hover:bg-white/40'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="h-6 w-6 text-slate-400" />
                                            </div>
                                            {thread.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-black text-slate-800 truncate">{thread.name}</h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{thread.time}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 truncate tracking-tight">{thread.lastMsg}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Chat Area */}
                    <div className="hidden md:flex flex-1 flex-col">
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-100/50 flex items-center justify-between bg-white/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 leading-none mb-1">Sarah Jenkins</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career Counselor</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/50 border border-slate-100 transition-all hover:bg-white hover:shadow-soft">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/50 border border-slate-100 transition-all hover:bg-white hover:shadow-soft">
                                    <Video className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/50 border border-slate-100 transition-all hover:bg-white hover:shadow-soft">
                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
                            {/* Received */}
                            <div className="flex items-start gap-4 max-w-[80%]">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    <div className="p-5 rounded-[2rem] rounded-tl-none bg-white shadow-soft border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed">
                                        Hello! I've analyzed your logic assessment scores. They are exceptionally high in the pattern recognition module. Have you considered a career in high-frequency data strategy?
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">10:42 AM</span>
                                </div>
                            </div>

                            {/* Sent */}
                            <div className="flex items-start gap-4 max-w-[80%] ml-auto flex-row-reverse">
                                <div className="space-y-2">
                                    <div className="p-5 rounded-[2rem] rounded-tr-none bg-slate-900 text-white shadow-lg shadow-slate-200 text-sm font-medium leading-relaxed">
                                        That sounds fascinating! I always enjoyed puzzles and patterns, but I didn't know it could lead to that specific career path. What would be my next step in the learning roadmap?
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">10:44 AM</span>
                                        <CheckCheck className="h-3 w-3 text-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* System Alert Overlay */}
                            <div className="flex justify-center my-4">
                                <Badge variant="secondary" className="bg-warning/10 text-warning border-none text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                    Dossier Strategy Session Scheduled - Oct 28
                                </Badge>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 bg-white/20 border-t border-slate-100/50 shrink-0">
                            <div className="flex items-center gap-3 bg-white shadow-soft rounded-[2rem] p-2 border border-slate-100">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-slate-50">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Input
                                    placeholder="Type a secure message..."
                                    className="flex-1 border-none focus:ring-0 text-sm font-medium bg-transparent"
                                />
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-slate-50">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Button className="h-10 w-10 rounded-full bg-warning text-white shadow-lg shadow-warning/20 hover:scale-105 transition-transform shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Messages;
