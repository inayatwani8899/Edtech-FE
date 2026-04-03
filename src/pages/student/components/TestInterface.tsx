import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft, ChevronRight, CheckCircle, Timer,
    Minimize, Maximize, BrainCircuit, Activity,
    ShieldCheck, LogOut, Target, Fingerprint, Brain
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
    hasAnswers: boolean;
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
    hasAnswers,
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(59, 130, 246, 0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(59, 130, 246, 0.3); 
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
            `}</style>


            {/* AI Top Bar - Compact on Mobile */}
            <div className="flex-none bg-slate-900 text-white z-20 shadow-xl border-b border-blue-500/20">
                <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-6 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 font-sans">
                            <div className="flex h-8 w-8 md:h-[38px] md:w-[38px] flex-shrink-0 items-center justify-center rounded-lg md:rounded-[12px] border bg-white/5 border-white/10">
                                <Brain className="h-4 w-4 md:h-6 md:w-6 text-blue-500 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-baseline font-black tracking-tight text-sm md:text-lg leading-none font-sans">
                                    <span className="text-white">Cognify</span>
                                    <span className="text-blue-500 ml-0.5 italic">IQ</span>
                                </div>
                            </div>
                        </div>

                        {/* Timer - Compact on mobile */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 border-l border-white/10">
                            <Timer className={`h-3.5 w-3.5 md:h-4 md:w-4 ${timeRemaining && timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                            <span className="text-xs md:text-sm font-mono font-black tracking-widest text-blue-100">
                                {timeRemaining ? formatTime(timeRemaining) : '--:--'}
                            </span>
                        </div>
                    </div>

                    {/* Restored Focus Indicator to Top Right */}
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden lg:flex flex-col items-end gap-1 px-6 border-r border-white/10 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <Target className={`w-3 h-3 ${focusScore < 50 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Focus Index</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-700 ${focusScore < 40 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`} style={{ width: `${focusScore}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={isFullScreen ? exitFullScreen : enterFullScreen} className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white hidden sm:block" title="Toggle Fullscreen">
                                {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                            </button>

                            <div className="h-5 w-px bg-white/10 hidden sm:block" />

                            <button onClick={() => setShowExitModal(true)} className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase transition-all border border-red-600/20">
                                <LogOut className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                <span className="hidden xs:inline">Terminate</span>
                                <span className="xs:hidden">End</span>
                            </button>
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

                    <div className="flex-none grid grid-cols-[1fr_repeat(5,65px)] sm:grid-cols-[1fr_repeat(5,85px)] md:grid-cols-[1fr_repeat(5,110px)] bg-slate-900 border-b border-white/5 text-white sticky top-0 z-30 shadow-md min-w-[500px] sm:min-w-[700px] md:min-w-0">
                        <div className="p-3 md:p-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] pl-6 md:pl-10 self-center text-blue-400 truncate">
                            {currentCategory}
                        </div>
                        {testQuestions.length > 0 && testQuestions[0].options.map((option) => (
                            <div key={option.option_Id} className="p-1 px-1.5 md:p-2.5 text-center font-black text-[7px] md:text-[9px] uppercase tracking-wider border-l border-white/5 flex items-center justify-center text-slate-100 font-sans">
                                {option.option_Text}
                            </div>
                        ))}
                    </div>




                    <div ref={questionsContainerRef} className="flex-1 overflow-y-auto w-full custom-scrollbar scroll-smooth">

                        <div className={`min-w-[500px] sm:min-w-[700px] md:min-w-0 ${isFullScreen ? 'h-full flex flex-col' : ''}`}>
                            {testQuestions.map((question, qIdx) => (
                                <div
                                    key={question.question_Id}
                                    className={`grid grid-cols-[1fr_repeat(5,65px)] sm:grid-cols-[1fr_repeat(5,85px)] md:grid-cols-[1fr_repeat(5,110px)] items-center border-b border-slate-100 transition-all hover:bg-blue-50/60 group relative ${qIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'} ${isFullScreen ? 'flex-1' : ''}`}
                                >
                                    {/* VISIBLE Scan Sweep */}
                                    <div className="ai-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className={`text-[13px] font-bold text-slate-700 pl-6 flex gap-3 relative z-10 ${isFullScreen ? 'py-4' : 'p-1 md:p-2'}`}>
                                        <span className="text-blue-300 font-mono text-[9px]">{(currentPage - 1) * 10 + (qIdx + 1)}</span>
                                        <span className="group-hover:text-blue-700 transition-colors duration-200">{question.question_Text}</span>
                                    </div>

                                    {question.options.map((option) => {
                                        const optionIdStr = String(option.option_Id);
                                        const isSelected = getCurrentAnswer(question.question_Id.toString()) === optionIdStr;
                                        return (
                                            <div key={option.option_Id} className={`flex justify-center border-l border-slate-50 relative z-10 ${isFullScreen ? 'h-full items-center' : 'p-1'}`}>
                                                <button
                                                    className={`relative h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-400/20 scale-105' : 'bg-white border-slate-300 hover:border-blue-400 rotate-45 scale-90'}`}
                                                    onClick={() => {
                                                        setAnswerLocally(question.question_Id.toString(), optionIdStr);
                                                        triggerSignature();
                                                    }}
                                                >
                                                    {isSelected && <CheckCircle className="w-3 h-3 text-white animate-in zoom-in duration-300" />}
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

            {/* Bottom Section - Responsive Footer */}
            <div className="flex-none bg-white border-t border-slate-100 z-40 pb-2 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex justify-between items-center gap-2">
                    <Button variant="ghost" onClick={handlePreviousQuestion} disabled={!hasPrevious} className="h-8 px-2 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                        <ChevronLeft className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden xs:inline">Previous Analysis</span>
                    </Button>

                    <div className="hidden xs:flex items-center gap-1.5 md:gap-2 mt-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i + 1 === currentPage ? 'w-4 md:w-8 bg-blue-600' : 'w-1 md:w-1.5 bg-slate-200'}`} />
                        ))}
                    </div>

                    <Button onClick={hasNext ? handleNextQuestion : () => setShowSubmitModal(true)} className={`h-8 md:h-9 px-4 md:px-6 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-md ${hasNext ? 'bg-slate-900 text-white hover:bg-black' : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'}`}>
                        {hasNext ? (<><span className="hidden xs:inline">Next Page</span><span className="xs:hidden">Next</span></>) : "Submit"} {hasNext && <ChevronRight className="h-3.5 w-3.5 ml-1" />}
                    </Button>
                </div>
            </div>




            <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {hasAnswers ? "Are you sure you want to exit and submit?" : "Are you sure you want to leave?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {hasAnswers
                                ? "All current responses will be submitted as your final assessment. You won't be able to resume later."
                                : "You haven't answered any questions yet. Do you really want to go back to the dashboard?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, Stay</AlertDialogCancel>
                        <AlertDialogAction className={hasAnswers ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"} onClick={() => {
                            setShowExitModal(false);
                            handleExitTest();
                        }}>{hasAnswers ? "Yes, Submit" : "Yes, Leave"}</AlertDialogAction>

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