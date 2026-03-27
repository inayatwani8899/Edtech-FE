import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft, ChevronRight, CheckCircle, Timer,
    Minimize, Maximize, BrainCircuit, Activity,
    ShieldCheck, LogOut, Target, Fingerprint
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Option {
    option_Id: number | string;
    question_Id: number | string;
    option_Text: string;
    score?: number;
    order_No?: number;
}

export interface Question {
    question_Id: number | string;
    question_Text: string;
    category?: string;
    theory?: string;
    tag?: string;
    options: Option[];
    [key: string]: any;
}

export interface TestInterfaceProps {
    testContainerRef: React.RefObject<HTMLDivElement>;
    questionsContainerRef: React.RefObject<HTMLDivElement>;
    currentCategory: string;
    testQuestions: Question[];
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    timeRemaining: number | null;
    isFullScreen: boolean;
    isSubmitting: boolean;
    testId: string;
    getCurrentAnswer: (questionId: string) => string | undefined;
    setAnswerLocally: (questionId: string, answer: string) => void;
    handlePreviousQuestion: () => void;
    handleNextQuestion: () => void;
    handleSubmitTest: () => void;
    handleExitTest: () => void;
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    formatTime: (seconds: number) => string;
    testTakingLoading?: boolean;
}

export const TestInterface = ({
    testContainerRef,
    questionsContainerRef,
    currentCategory,
    testQuestions,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    timeRemaining,
    isFullScreen,
    isSubmitting,
    testId,
    getCurrentAnswer,
    setAnswerLocally,
    handlePreviousQuestion,
    handleNextQuestion,
    handleSubmitTest,
    handleExitTest,
    enterFullScreen,
    exitFullScreen,
    formatTime,
    testTakingLoading,
}: TestInterfaceProps) => {

    const [focusScore, setFocusScore] = useState(100);
    const [isHoveringQuestions, setIsHoveringQuestions] = useState(true);
    const [digitalSig, setDigitalSig] = useState("SECURE_0x");
    const [isSigning, setIsSigning] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFocusScore((prev) => {
                if (!isHoveringQuestions && prev > 10) return prev - 2;
                if (isHoveringQuestions && prev < 100) return prev + 1;
                return prev;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [isHoveringQuestions]);

    const triggerSignature = () => {
        setIsSigning(true);
        const chars = "0123456789ABCDEF";
        let newHash = "";
        for (let i = 0; i < 4; i++) newHash += chars.charAt(Math.floor(Math.random() * chars.length));
        setDigitalSig(`NODE_${newHash}`);
        setTimeout(() => setIsSigning(false), 500);
    };

    return (
        <div ref={testContainerRef} className="h-[100dvh] overflow-hidden flex flex-col bg-[#f8fafc] font-sans selection:bg-blue-100 relative">

            <style>{`
                @keyframes ai-sweep {
                    0% { transform: translateX(-110%); }
                    100% { transform: translateX(300%); }
                }
                @keyframes grid-drift {
                    from { background-position: 0 0; }
                    to { background-position: 40px 40px; }
                }
                /* Higher Visibility Laser Scan */
                .ai-scan-line {
                    position: absolute;
                    inset: 0;
                    width: 150px;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(59, 130, 246, 0.08) 30%, 
                        rgba(59, 130, 246, 0.2) 50%, 
                        rgba(59, 130, 246, 0.08) 70%, 
                        transparent 100%);
                    animation: ai-sweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    pointer-events: none;
                    z-index: 5;
                }
                /* Higher Visibility Blueprint Grid */
                .neural-grid {
                    background-image: 
                        linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: grid-drift 20s linear infinite;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* AI Top Bar */}
            <div className="flex-none bg-slate-900 text-white z-20 shadow-xl border-b border-blue-500/20">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                            <BrainCircuit className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-[0.2em] leading-none text-blue-50">Neural Assessment</h1>
                            <p className="text-[10px] text-blue-400 font-bold opacity-90 leading-none mt-1 uppercase tracking-widest">
                                {currentCategory} <span className="text-slate-600 mx-1">/</span> PHASE {currentPage}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-r border-white/10">
                            <div className="flex items-center gap-2">
                                <Target className={`w-3 h-3 ${focusScore < 50 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Focus Index</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-700 ${focusScore < 40 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${focusScore}%` }} />
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">AI PROCTOR ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area with VISIBLE Neural Grid */}
            <main
                className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full p-2 md:p-4 neural-grid"
                onMouseEnter={() => setIsHoveringQuestions(true)}
                onMouseLeave={() => setIsHoveringQuestions(false)}
            >
                <div className="flex-1 min-h-0 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
                    {/* Themed Loader Overlay */}
                    {testTakingLoading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                                    <div className="absolute inset-2 border-4 border-t-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
                                    <div className="absolute inset-4 border-4 border-t-amber-500 rounded-full animate-[spin_2s_linear_infinite]" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Neural Syncing</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fetching Next Matrix Data</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-none grid grid-cols-[1fr_repeat(5,85px)] md:grid-cols-[1fr_repeat(5,110px)] bg-slate-900 text-white sticky top-0 z-30 shadow-md">
                        <div className="p-3 text-[10px] font-black uppercase tracking-widest pl-6 self-center text-blue-200">Matrix Parameter</div>
                        {testQuestions.length > 0 && testQuestions[0].options.map((option) => (
                            <div key={option.option_Id} className="p-3 text-center font-black text-[8px] uppercase tracking-tighter border-l border-white/5 flex items-center justify-center opacity-80">
                                {option.option_Text}
                            </div>
                        ))}
                    </div>

                    <div ref={questionsContainerRef} className="flex-1 overflow-y-auto w-full no-scrollbar scroll-smooth">
                        <div className="min-w-[700px]">
                            {testQuestions.map((question, qIdx) => (
                                <div
                                    key={question.question_Id}
                                    className={`grid grid-cols-[1fr_repeat(5,85px)] md:grid-cols-[1fr_repeat(5,110px)] items-center border-b border-slate-100 transition-all hover:bg-blue-50/60 group relative ${qIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}
                                >
                                    {/* VISIBLE Scan Sweep */}
                                    <div className="ai-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="p-3 md:p-4 text-[12px] font-bold text-slate-700 pl-6 flex gap-3 relative z-10">
                                        <span className="text-blue-300 font-mono text-[10px]">{(currentPage - 1) * 10 + (qIdx + 1)}</span>
                                        <span className="group-hover:text-blue-700 transition-colors duration-200">{question.question_Text}</span>
                                    </div>

                                    {question.options.map((option) => {
                                        const optionIdStr = String(option.option_Id);
                                        const isSelected = getCurrentAnswer(question.question_Id.toString()) === optionIdStr;
                                        return (
                                            <div key={option.option_Id} className="p-2 flex justify-center border-l border-slate-50 relative z-10">
                                                <button
                                                    className={`relative h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-400/30 scale-110' : 'bg-white border-slate-300 hover:border-blue-400 rotate-45 scale-90'}`}
                                                    onClick={() => {
                                                        setAnswerLocally(question.question_Id.toString(), optionIdStr);
                                                        triggerSignature();
                                                    }}
                                                >
                                                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white animate-in zoom-in duration-300" />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Section */}
            <div className="flex-none bg-white border-t border-slate-200 z-40 pb-12">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <Button variant="ghost" onClick={handlePreviousQuestion} disabled={!hasPrevious} className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-400 disabled:opacity-5">
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === currentPage ? 'w-10 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'w-2 bg-slate-200'}`} />
                        ))}
                    </div>

                    <Button onClick={hasNext ? handleNextQuestion : () => setShowSubmitModal(true)} className={`h-9 px-8 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl transition-all active:scale-95 ${hasNext ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-blue-200'}`}>
                        {hasNext ? "Next Set" : "Complete"} {hasNext && <ChevronRight className="h-3 w-3 ml-1" />}
                    </Button>
                </div>
            </div>

            {/* AI Footer Status */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white px-6 py-2.5 z-50 flex justify-between items-center border-t border-blue-500/20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Timer className={`h-3.5 w-3.5 ${timeRemaining && timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                        <span className="text-[11px] font-mono font-black tracking-widest text-blue-100">
                            {timeRemaining ? formatTime(timeRemaining) : '--:--'}
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-3 border-l border-white/10 pl-6">
                        <Fingerprint className={`h-4 w-4 transition-colors ${isSigning ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Secure Uplink</span>
                            <span className={`text-[10px] font-mono font-black tracking-widest transition-all ${isSigning ? 'text-blue-400 scale-105' : 'text-slate-400'}`}>
                                {digitalSig}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={isFullScreen ? exitFullScreen : enterFullScreen} className="p-1.5 hover:bg-blue-500/20 rounded transition-colors text-slate-400 hover:text-blue-400">
                        {isFullScreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
                    </button>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">S_ID: {testId}</span>
                    <button onClick={() => setShowExitModal(true)} className="flex items-center gap-1.5 text-red-500/80 hover:text-red-400 text-[9px] font-black uppercase ml-2">
                        <LogOut className="w-3 h-3" /> Terminate
                    </button>
                </div>
            </div>


            <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            All responses will be submitted and you won’t be able to resume.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowExitModal(false);
                            handleExitTest();
                        }}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit your test?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowSubmitModal(false);
                            handleSubmitTest();
                        }}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
};