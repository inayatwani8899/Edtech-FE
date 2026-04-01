import React from "react";
import { Button } from "@/components/ui/button";
import {
    Clock, FileText, ShieldCheck, Zap,
    ArrowRight, LayoutDashboard, AlertCircle
} from "lucide-react";

interface TestData {
    title: string;
    timeDuration: number;
    questionCount?: number | string;
    totalQuestions?: number | string;
}

interface InstructionStepProps {
    currentTest: TestData | null;
    onContinue: () => void;
    onBack: () => void;
    stepNumber: number;
}

export const InstructionStep = ({ currentTest, onContinue, onBack, stepNumber }: InstructionStepProps) => {
    return (
        // Fixed screen height, no scrolling allowed on the body
        <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
            {/* Main Container - max-h set to leave room for padding/progress */}
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">



                {/* Header - Stacks on mobile */}
                <div className="bg-slate-900 px-6 md:px-8 py-5 md:py-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-4">
                    <div className="flex flex-col min-w-0">
                        <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Assessment Module</span>
                        <h1 className="text-xl md:text-2xl font-black truncate w-full">
                            {currentTest?.title || "Technical Evaluation"}
                        </h1>
                    </div>
                    <div className="flex gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 w-full md:w-auto shrink-0">
                        <div className="flex-1 md:text-right">
                            <p className="text-slate-400 text-[9px] uppercase font-black tracking-tighter">TOTAL TIME</p>
                            <p className="text-lg md:text-xl font-black">{currentTest?.timeDuration || 60}m</p>
                        </div>
                        <div className="flex-1 md:text-right">
                            <p className="text-slate-400 text-[9px] uppercase font-black tracking-tighter">TOTAL ITEMS</p>
                            <p className="text-lg md:text-xl font-black">{currentTest?.questionCount || currentTest?.totalQuestions || "N/A"}</p>
                        </div>
                    </div>
                </div>


                {/* Scrollable Content Area - ONLY this part scrolls if screen is tiny */}
                <div className="p-8 flex-1 overflow-y-auto min-h-0 custom-scrollbar">

                    {/* Quick Specs Grid - Stacks on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
                        <SmallSpecCard icon={<Clock className="w-5 h-5 text-blue-600" />} label="Limit" value={`${currentTest?.timeDuration || 60}m`} />
                        <SmallSpecCard icon={<Zap className="w-5 h-5 text-amber-500" />} label="Save" value="Auto" />
                        <SmallSpecCard icon={<FileText className="w-5 h-5 text-emerald-500" />} label="Type" value="MCQ" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Requirements Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-600" /> System Requirements
                            </h3>
                            <div className="grid grid-cols-1 gap-2.5">
                                {["Stable Connection", "No Pause Option", "Auto-Submit", "Fullscreen Only"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 px-4 rounded-xl border border-slate-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Conduct Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600" /> Testing Conduct
                            </h3>
                            <div className="grid grid-cols-1 gap-2.5">
                                {["No External Aids", "Responses Saved", "Quiet Room", "No Tab Switch"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 px-4 rounded-xl border border-slate-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Warning Message - Slimmer */}
                    <div className="mt-8 bg-amber-50/60 border border-amber-100 p-4 rounded-2xl flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Switching tabs or minimizing the window will trigger an automated security flag and potential submission.
                        </p>
                    </div>
                </div>


                {/* Footer - Fixed Height */}
                <div className="px-6 md:px-8 py-5 md:py-5 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between shrink-0 gap-3">
                    <Button onClick={onBack} variant="ghost" className="text-slate-500 text-xs h-10 px-4 hover:bg-slate-100 rounded-xl transition-all order-2 md:order-1 w-full md:w-auto">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                    
                    <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 order-1 md:order-2 w-full md:w-auto">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

            </div>
        </div>
    );
};

const SmallSpecCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="shrink-0 scale-110">{icon}</div>
        <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1 tracking-wider">{label}</p>
            <p className="text-sm font-black text-slate-700 truncate">{value}</p>
        </div>
    </div>
);