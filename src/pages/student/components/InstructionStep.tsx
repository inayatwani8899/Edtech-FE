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
        <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">

            {/* Progress Indicator - Minimal margin */}
            <div className="mb-2 flex justify-center gap-1.5 shrink-0">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1 rounded-full transition-all ${s === stepNumber ? "w-8 bg-blue-600" : "w-4 bg-slate-200"}`} />
                ))}
            </div>

            {/* Main Container - max-h set to leave room for padding/progress */}
            <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header - Fixed Height */}
                <div className="bg-slate-900 px-5 py-3 text-white flex flex-row items-center justify-between shrink-0">
                    <div className="flex flex-col">
                        <span className="text-blue-400 text-[9px] font-bold uppercase">Assessment Module</span>
                        <h1 className="text-base font-bold truncate max-w-[200px] md:max-w-none">
                            {currentTest?.title || "Technical Evaluation"}
                        </h1>
                    </div>
                    <div className="flex gap-4 border-l border-white/10 pl-4 shrink-0">
                        <div className="text-right">
                            <p className="text-slate-400 text-[8px] uppercase font-bold">Time</p>
                            <p className="text-xs font-bold">{currentTest?.timeDuration || 60}m</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-[8px] uppercase font-bold">Items</p>
                            <p className="text-xs font-bold">{currentTest?.questionCount || currentTest?.totalQuestions || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area - ONLY this part scrolls if screen is tiny */}
                <div className="p-4 flex-1 overflow-y-auto min-h-0">

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <SmallSpecCard icon={<Clock className="w-3.5 h-3.5 text-blue-600" />} label="Limit" value={`${currentTest?.timeDuration || 60}m`} />
                        <SmallSpecCard icon={<Zap className="w-3.5 h-3.5 text-amber-500" />} label="Save" value="Auto" />
                        <SmallSpecCard icon={<FileText className="w-3.5 h-3.5 text-emerald-500" />} label="Type" value="MCQ" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Requirements Section */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-blue-600" /> System Requirements
                            </h3>
                            <div className="grid grid-cols-1 gap-1.5">
                                {["Stable Connection", "No Pause Option", "Auto-Submit", "Fullscreen Only"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50/50 p-1.5 px-2 rounded border border-slate-100">
                                        <div className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conduct Section */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3 text-blue-600" /> Testing Conduct
                            </h3>
                            <div className="grid grid-cols-1 gap-1.5">
                                {["No External Aids", "Responses Saved", "Quiet Room", "No Tab Switch"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50/50 p-1.5 px-2 rounded border border-slate-100">
                                        <div className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Warning Message - Slimmer */}
                    <div className="mt-4 bg-amber-50/40 border border-amber-100 p-2.5 rounded-lg flex gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <p className="text-[10px] text-amber-800 leading-tight">
                            Switching tabs or minimizing the window will trigger an automated security flag and potential submission.
                        </p>
                    </div>
                </div>

                {/* Footer - Fixed Height */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <Button onClick={onBack} variant="ghost" className="text-slate-500 text-[11px] h-7 px-2 hover:bg-slate-100">
                        <LayoutDashboard className="w-3 h-3 mr-1" />
                        Back
                    </Button>

                    <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-8 text-[11px] rounded shadow-sm">
                        Continue to Test
                        <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SmallSpecCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center gap-2 p-2 rounded border border-slate-100 bg-white">
        <div className="shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-[8px] uppercase font-bold text-slate-400 leading-none mb-0.5">{label}</p>
            <p className="text-[11px] font-bold text-slate-700 truncate">{value}</p>
        </div>
    </div>
);