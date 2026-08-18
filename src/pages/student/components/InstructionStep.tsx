import React from "react";
import { Button } from "@/components/ui/button";
import {
    Clock,
    FileText,
    Shield,
    Globe,
    Monitor,
    Save,
    VolumeX,
    Camera,
    ChevronRight,
    ArrowLeft
} from "lucide-react";

interface TestData {
    title: string;
    timeDuration: number;
    questionCount?: number | string;
    totalQuestions?: number | string;
    description?: string;
    category?: string;
}

interface InstructionStepProps {
    currentTest: TestData | null;
    onContinue: () => void;
    onBack: () => void;
    stepNumber: number;
}

export const InstructionStep = ({ currentTest, onContinue, onBack }: InstructionStepProps) => {
    const duration = currentTest?.timeDuration || 30;
    const questions = currentTest?.questionCount || currentTest?.totalQuestions || 80;

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-between p-4 md:p-6 font-sans transition-colors duration-200">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1">
                
                {/* 1. Top Header Card (Max height 120px) */}
                <div className="bg-white dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800 p-4 md:p-6 flex items-center justify-between md:h-[120px] shrink-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-[20px] md:text-[24px] font-bold text-[#111827] dark:text-white tracking-tight leading-tight">
                                {currentTest?.title || "Psychometric Assessment"}
                            </h1>
                        </div>
                        <p className="text-[13px] text-[#6B7280] dark:text-slate-400 font-medium">
                            {currentTest?.category || "MCQ Assessment"} • {duration} mins | {questions} Questions | Auto Save
                        </p>
                    </div>

                    <span className="bg-[#DCFCE7] dark:bg-emerald-950/30 text-[#166534] dark:text-emerald-450 border border-[#BBF7D0] dark:border-emerald-900/30 text-[12px] font-semibold px-3 py-1 rounded-full shrink-0">
                        Available
                    </span>
                </div>

                {/* 2. Content Area */}
                <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-6">
                    
                    {/* Information Grid (2 x 2) */}
                    <div>
                        <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider mb-3">
                            Assessment Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoGridCard
                                label="Duration"
                                value={`${duration} Minutes`}
                                desc="Total allocated time"
                            />
                            <InfoGridCard
                                label="Questions"
                                value={`${questions} Items`}
                                desc="Multiple choice format"
                            />
                            <InfoGridCard
                                label="Type"
                                value="Adaptive Index"
                                desc="Adjusts to skill level"
                            />
                            <InfoGridCard
                                label="Save Mode"
                                value="Auto Save Enabled"
                                desc="Progress logged instantly"
                            />
                        </div>
                    </div>

                    {/* Instructions Section (2 Columns, 56px card height) */}
                    <div>
                        <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider mb-3">
                            Assessment Guidelines
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InstructionCard
                                icon={<Globe className="w-4 h-4 text-[#4F46E5]" />}
                                title="Stable Internet"
                                desc="Required to sync responses"
                            />
                            <InstructionCard
                                icon={<Monitor className="w-4 h-4 text-[#4F46E5]" />}
                                title="No Tab Switching"
                                desc="Keep focus on the screen"
                            />
                            <InstructionCard
                                icon={<Save className="w-4 h-4 text-[#4F46E5]" />}
                                title="Auto Save Enabled"
                                desc="Progress saved in real-time"
                            />
                            <InstructionCard
                                icon={<VolumeX className="w-4 h-4 text-[#4F46E5]" />}
                                title="Quiet Environment"
                                desc="Minimize background noises"
                            />
                            <InstructionCard
                                icon={<Shield className="w-4 h-4 text-[#4F46E5]" />}
                                title="Auto Submit"
                                desc="Submits automatically on timeout"
                            />
                            <InstructionCard
                                icon={<Camera className="w-4 h-4 text-[#4F46E5]" />}
                                title="Proctor Scan"
                                desc="Camera monitoring validated"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Sticky Footer Actions */}
                <div className="border-t border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/80 p-4 flex items-center justify-between shrink-0">
                    <Button 
                        onClick={onBack} 
                        variant="ghost" 
                        className="text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-[13px] font-semibold h-[42px] px-4 rounded-[12px] flex items-center gap-1.5 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to List
                    </Button>
                    
                    <Button 
                        onClick={onContinue} 
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 h-[42px] text-[13px] font-semibold rounded-[12px] transition-all flex items-center gap-1.5 active:scale-[0.98]"
                    >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

            </div>
        </div>
    );
};

const InfoGridCard = ({ label, value, desc }: { label: string; value: string; desc: string }) => (
    <div className="bg-[#F8FAFC] dark:bg-slate-950/50 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] p-3.5 flex flex-col justify-between transition-all hover:shadow-sm">
        <span className="text-[12px] font-medium text-[#6B7280] dark:text-slate-400">{label}</span>
        <div className="mt-1">
            <span className="text-[14px] font-bold text-[#111827] dark:text-white">{value}</span>
            <p className="text-[12px] text-[#6B7280] dark:text-slate-500 mt-0.5 leading-none">{desc}</p>
        </div>
    </div>
);

const InstructionCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
    <div className="flex items-center gap-3 p-3 h-[56px] rounded-[12px] border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#4F46E5] dark:hover:border-indigo-500 transition-all">
        <div className="w-8 h-8 rounded-[8px] bg-indigo-55/10 flex items-center justify-center shrink-0 border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/80">
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-bold text-[#111827] dark:text-white leading-tight truncate">{title}</h4>
            <p className="text-[12px] text-[#6B7280] dark:text-slate-400 leading-none truncate mt-0.5">{desc}</p>
        </div>
    </div>
);