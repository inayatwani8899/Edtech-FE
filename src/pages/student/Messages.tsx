import React, { useState } from "react";
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
    Phone,
    Video,
    ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Messages: React.FC = () => {
    const [selectedThread, setSelectedThread] = useState<number | null>(0);
    const [showChatArea, setShowChatArea] = useState(false);

    const threads = [
        { id: 0, name: "Sarah Jenkins", role: "Career Counselor", lastMsg: "The logic assessment results look promising...", time: "10:45 AM", online: true },
        { id: 1, name: "Dr. Alan Grant", role: "Lead Instructor", lastMsg: "Please review the workshop materials.", time: "Yesterday", online: false },
        { id: 2, name: "Admin Support", role: "Portal Help", lastMsg: "Your scholarship application has been received.", time: "Tue", online: true }
    ];

    const handleThreadClick = (id: number) => {
        setSelectedThread(id);
        setShowChatArea(true);
    };

    const activeThread = threads.find(t => t.id === selectedThread) || threads[0];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 flex flex-col w-full h-[calc(100vh-80px)] md:h-[calc(100vh-120px)]">
                
                {/* Compact Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB] shrink-0">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-[#4F46E5]/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Communication Hub</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                            Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Center</span>
                        </h1>
                        <p className="text-[13px] font-medium text-[#6B7280]">Connect with your career counselors and instructors</p>
                    </div>
                </div>

                <Card className="bg-white border border-[#E5E7EB] flex-1 flex overflow-hidden rounded-[12px] shadow-sm">
                    {/* Threads Sidebar */}
                    <div className={cn(
                        "w-full md:w-80 border-r border-[#E5E7EB] flex flex-col bg-slate-50/50 transition-all duration-300",
                        showChatArea ? "hidden md:flex" : "flex"
                    )}>
                        <div className="p-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                                <Input
                                    placeholder="Search threads..."
                                    className="h-[38px] pl-9 pr-3 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-[#111827] placeholder:text-[#6B7280] focus-visible:ring-[#4F46E5]"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
                            {threads.map((thread) => (
                                <div
                                    key={thread.id}
                                    onClick={() => handleThreadClick(thread.id)}
                                    className={cn(
                                        "p-3 rounded-lg cursor-pointer transition-all duration-200",
                                        selectedThread === thread.id ? 'bg-white border border-[#E5E7EB] shadow-sm' : 'hover:bg-slate-100/50 border border-transparent'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-slate-150 bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            {thread.online && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></div>}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-[13px] font-bold text-slate-800 truncate">{thread.name}</h4>
                                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{thread.time}</span>
                                            </div>
                                            <p className="text-[11px] font-semibold text-slate-400 truncate tracking-tight">{thread.lastMsg}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Chat Area */}
                    <div className={cn(
                        "flex-1 flex flex-col bg-white",
                        !showChatArea ? "hidden md:flex" : "flex"
                    )}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-8 w-8 rounded-full"
                                    onClick={() => setShowChatArea(false)}
                                >
                                    <ChevronLeft className="h-5 w-5 text-slate-500" />
                                </Button>
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[14px] font-bold text-slate-850 leading-none mb-1.5 truncate">{activeThread.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded uppercase tracking-wider">Online</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{activeThread.role}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="hidden sm:flex h-9 w-9 rounded-lg border-[#E5E7EB] bg-white transition-all hover:bg-slate-50">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button variant="outline" size="icon" className="hidden sm:flex h-9 w-9 rounded-lg border-[#E5E7EB] bg-white transition-all hover:bg-slate-50">
                                    <Video className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-[#E5E7EB] bg-white transition-all hover:bg-slate-50">
                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/20">
                            {/* Received */}
                            <div className="flex items-start gap-3 max-w-[85%]">
                                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-1">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="space-y-1">
                                    <div className="p-3.5 rounded-xl rounded-tl-none bg-white border border-[#E5E7EB] shadow-sm text-[13px] font-medium text-slate-700 leading-relaxed">
                                        Hello! I've analyzed your logic assessment scores. They are exceptionally high in the pattern recognition module. Have you considered a career in high-frequency data strategy?
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">10:42 AM</span>
                                </div>
                            </div>

                            {/* Sent */}
                            <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                                <div className="space-y-1">
                                    <div className="p-3.5 rounded-xl rounded-tr-none bg-[#4F46E5] text-white shadow-sm text-[13px] font-medium leading-relaxed">
                                        That sounds fascinating! I always enjoyed puzzles and patterns, but I didn't know it could lead to that specific career path. What would be my next step in the learning roadmap?
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">10:44 AM</span>
                                        <CheckCheck className="h-3.5 w-3.5 text-[#4F46E5]" />
                                    </div>
                                </div>
                            </div>

                            {/* System Alert Overlay */}
                            <div className="flex justify-center my-3">
                                <Badge className="bg-indigo-50 text-[#4F46E5] border-none text-[8.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-center">
                                    Dossier Strategy Session Scheduled - Oct 28
                                </Badge>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-slate-50/30 border-t border-[#E5E7EB] shrink-0">
                            <div className="flex items-center gap-2 bg-white shadow-sm rounded-xl p-1.5 border border-[#E5E7EB]">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-450 text-slate-550 text-slate-500 hover:bg-slate-50">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Input
                                    placeholder="Type a message..."
                                    className="flex-1 border-none focus:ring-0 text-[13px] font-medium bg-transparent h-8 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Button variant="ghost" size="icon" className="hidden xs:flex h-8 w-8 rounded-lg text-slate-450 text-slate-550 text-slate-500 hover:bg-slate-50">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Button className="h-8 w-8 rounded-lg bg-[#4F46E5] text-white shadow-md hover:bg-[#4338CA] hover:scale-105 transition-all shrink-0 p-0 flex items-center justify-center">
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
