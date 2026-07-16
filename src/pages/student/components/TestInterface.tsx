import React, { useState, useEffect, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Timer,
    Minimize,
    Maximize,
    Brain,
    LogOut,
    CameraOff,
    AlertCircle,
    BookOpen,
    CheckCircle2,
    BarChart3,
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
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export interface Option {
    option_Id: number | string;
    question_Id: number | string;
    option_Text: string;
    score?: number;
    order_No?: number;
}

export interface TheoryInfo {
    name: string;
    description: string;
}

export interface Question {
    question_Id: number | string;
    question_Text: string;
    category?: string;
    theory?: string | TheoryInfo;
    tag?: string;
    options: Option[];
    [key: string]: any;
}

export interface TestInterfaceProps {
    testContainerRef: React.RefObject<HTMLDivElement>;
    questionsContainerRef: React.RefObject<HTMLDivElement>;
    currentCategory: string;
    testQuestions: Question[];
    allTestQuestions?: Question[];
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
    theories?: TheoryInfo[];
    perCategory?: Record<string, number>;
    testName?: string;
    totalQuestions?: number;
}

// --- Helpers ---
const getTheoryName = (theoryField: any): string => {
    if (!theoryField) return "";
    if (typeof theoryField === "object") return theoryField.name || theoryField.theoryName || "";
    return String(theoryField);
};

// Build a map: theory name → TheoryInfo (description)
const buildTheoryMap = (theories: TheoryInfo[]): Map<string, TheoryInfo> => {
    const map = new Map<string, TheoryInfo>();
    theories.forEach(t => {
        if (t.name) map.set(t.name.trim().toLowerCase(), t);
    });
    return map;
};

// Category-to-emoji mapping (dynamic fallback)
const getCategoryEmoji = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("interest")) return "🎯";
    if (lower.includes("work") || lower.includes("personality") || lower.includes("style")) return "🧩";
    if (lower.includes("ability")) return "⚡";
    if (lower.includes("knowledge")) return "📚";
    if (lower.includes("creative")) return "🎨";
    if (lower.includes("social")) return "👥";
    return "🧠";
};

const categoryColors: Record<string, { bg: string; border: string; accent: string; badge: string }> = {};
const colorPalette = [
    { bg: "from-indigo-50 to-violet-50", border: "border-indigo-100", accent: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700" },
    { bg: "from-emerald-50 to-teal-50", border: "border-emerald-100", accent: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
    { bg: "from-amber-50 to-orange-50", border: "border-amber-100", accent: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
    { bg: "from-rose-50 to-pink-50", border: "border-rose-100", accent: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
    { bg: "from-sky-50 to-blue-50", border: "border-sky-100", accent: "text-sky-600", badge: "bg-sky-100 text-sky-700" },
    { bg: "from-purple-50 to-fuchsia-50", border: "border-purple-100", accent: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
];
let colorIndex = 0;
const getCategoryColor = (cat: string) => {
    if (!categoryColors[cat]) {
        categoryColors[cat] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
    }
    return categoryColors[cat];
};

// Skeleton Loading
const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-xl p-3 animate-pulse shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 h-3.5 bg-slate-100 rounded-full w-1/2" />
            <div className="flex gap-2 flex-1">
                {[1,2,3,4,5].map(i => <div key={i} className="flex-1 h-8 bg-slate-50 border border-slate-100 rounded-lg" />)}
            </div>
        </div>
    </div>
);

const SkeletonTheoryCard = () => (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-100 rounded-xl p-3 animate-pulse mb-2">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded-full w-2/3" />
            </div>
        </div>
    </div>
);

// --- Main Component ---
export const TestInterface = ({
    testContainerRef,
    questionsContainerRef,
    currentCategory,
    testQuestions,
    allTestQuestions = [],
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
    theories = [],
    perCategory = {},
    testName,
    totalQuestions,
}: TestInterfaceProps) => {

    const theoryMap = buildTheoryMap(theories);

    // Group current page questions by category
    const groupedByCategory = testQuestions.reduce((acc, q) => {
        const cat = q.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(q);
        return acc;
    }, {} as Record<string, Question[]>);

    // Answered count across ALL questions
    const answeredCount = allTestQuestions.filter(q =>
        !!getCurrentAnswer(q.question_Id.toString())
    ).length;

    const effectiveTotalQuestions = totalQuestions || allTestQuestions.length || testQuestions.length;

    // Modal states
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // ── CAMERA & PROCTOR STATES ── (temporarily disabled – re-enable when needed)
    // const [camError, setCamError] = useState(false);
    // const [isCamCollapsed, setIsCamCollapsed] = useState(false);
    // const interfaceVideoRef = useRef<HTMLVideoElement>(null);
    // const [hudCoords, setHudCoords] = useState({ x: 135.2, y: 78.4 });
    // const streamRef = useRef<MediaStream | null>(null);

    // const [cameraPos, setCameraPos] = useState(() => {
    //     const saved = localStorage.getItem("camera-position");
    //     if (saved) {
    //         try {
    //             const parsed = JSON.parse(saved);
    //             if (typeof parsed.x === "number" && typeof parsed.y === "number" && typeof parsed.width === "number" && typeof parsed.height === "number") {
    //                 return parsed;
    //             }
    //         } catch (e) {}
    //     }
    //     const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    //     return { x: 10, y: 80, width: isMobile ? 120 : 220, height: isMobile ? 90 : 150 };
    // });

    // ── PROCTOR VIOLATION STATES ── (temporarily disabled)
    // const [violations, setViolations] = useState(0);
    // const [warningActive, setWarningActive] = useState(false);
    // const [warningCountdown, setWarningCountdown] = useState(5);
    // const [lastViolationMsg, setLastViolationMsg] = useState<string | null>(null);
    // const [lastViolationLevel, setLastViolationLevel] = useState<"yellow" | "orange" | "red" | null>(null);
    // const [showResumeMsg, setShowResumeMsg] = useState(false);
    // const warningCountdownRef = useRef<number>(5);
    // const autoSubmitTriggeredRef = useRef<boolean>(false);

    // ── CAMERA RESIZE LISTENER ── (temporarily disabled)
    // useEffect(() => {
    //     const handleResize = () => {
    //         setCameraPos((prev: typeof cameraPos) => {
    //             const maxX = window.innerWidth - prev.width;
    //             const maxY = window.innerHeight - prev.height;
    //             return { ...prev, x: Math.max(0, Math.min(maxX, prev.x)), y: Math.max(0, Math.min(maxY, prev.y)) };
    //         });
    //     };
    //     window.addEventListener("resize", handleResize);
    //     return () => window.removeEventListener("resize", handleResize);
    // }, []);

    // ── CAMERA DRAG HANDLER ── (temporarily disabled)
    // const handleHeaderMouseDown = (e: React.MouseEvent) => { ... };

    // ── CAMERA RESIZE HANDLE HANDLER ── (temporarily disabled)
    // const handleResizeMouseDown = (e: React.MouseEvent) => { ... };

    // ── TAB/FOCUS VISIBILITY PROCTOR ── (temporarily disabled – auto-submission on tab switch)
    // useEffect(() => {
    //     let isLeaving = false;
    //     const handleUserLeave = () => {
    //         if (isLeaving || autoSubmitTriggeredRef.current) return;
    //         isLeaving = true;
    //         setWarningActive(true);
    //         setWarningCountdown(5);
    //         warningCountdownRef.current = 5;
    //         setShowResumeMsg(false);
    //     };
    //     const handleUserReturn = () => {
    //         if (!isLeaving || autoSubmitTriggeredRef.current) return;
    //         isLeaving = false;
    //         if (warningCountdownRef.current > 0) {
    //             setWarningActive(false);
    //             setShowResumeMsg(true);
    //             const timer = setTimeout(() => setShowResumeMsg(false), 3000);
    //             setViolations(prev => {
    //                 const next = prev + 1;
    //                 if (next >= 3 && !autoSubmitTriggeredRef.current) {
    //                     autoSubmitTriggeredRef.current = true;
    //                     Swal.fire({ ... }).then(() => handleSubmitTest());
    //                 }
    //                 return next;
    //             });
    //             return () => clearTimeout(timer);
    //         }
    //     };
    //     const onVisibilityChange = () => document.hidden ? handleUserLeave() : handleUserReturn();
    //     document.addEventListener("visibilitychange", onVisibilityChange);
    //     window.addEventListener("blur", handleUserLeave);
    //     window.addEventListener("focus", handleUserReturn);
    //     return () => {
    //         document.removeEventListener("visibilitychange", onVisibilityChange);
    //         window.removeEventListener("blur", handleUserLeave);
    //         window.removeEventListener("focus", handleUserReturn);
    //     };
    // }, [handleSubmitTest]);

    // ── WARNING COUNTDOWN AUTO-SUBMIT ── (temporarily disabled)
    // useEffect(() => {
    //     if (!warningActive) return;
    //     const interval = setInterval(() => {
    //         setWarningCountdown(prev => {
    //             const next = prev - 1;
    //             warningCountdownRef.current = next;
    //             if (next <= 0) {
    //                 clearInterval(interval);
    //                 setWarningActive(false);
    //                 if (!autoSubmitTriggeredRef.current) {
    //                     autoSubmitTriggeredRef.current = true;
    //                     Swal.fire({ ... }).then(() => handleSubmitTest());
    //                 }
    //             }
    //             return next;
    //         });
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, [warningActive, handleSubmitTest]);

    // ── CAMERA INIT & CLEANUP ── (temporarily disabled)
    // useEffect(() => {
    //     acquireCameraStream();
    //     return () => {
    //         if (streamRef.current) {
    //             streamRef.current.getTracks().forEach(t => t.stop());
    //             streamRef.current = null;
    //         }
    //     };
    // }, []);

    // ── CAMERA COLLAPSED RESTORE ── (temporarily disabled)
    // useEffect(() => {
    //     if (!isCamCollapsed && interfaceVideoRef.current) {
    //         if (streamRef.current) {
    //             interfaceVideoRef.current.srcObject = streamRef.current;
    //             interfaceVideoRef.current.play().catch(() => {});
    //         } else acquireCameraStream();
    //     }
    // }, [isCamCollapsed]);

    // ── CAMERA MAXIMIZE ── (temporarily disabled)
    // const handleMaximize = async () => {
    //     setIsCamCollapsed(false);
    //     if (interfaceVideoRef.current) {
    //         if (streamRef.current) {
    //             interfaceVideoRef.current.srcObject = streamRef.current;
    //             interfaceVideoRef.current.play().catch(() => {});
    //         } else await acquireCameraStream();
    //     }
    // };

    // ── HUD COORDINATES INTERVAL ── (temporarily disabled)
    // useEffect(() => {
    //     const t = setInterval(() => {
    //         setHudCoords({
    //             x: parseFloat((130 + Math.random() * 12).toFixed(1)),
    //             y: parseFloat((74 + Math.random() * 8).toFixed(1))
    //         });
    //     }, 500);
    //     return () => clearInterval(t);
    // }, []);

    const handleOptionKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        questionId: string,
        options: Option[],
        currentIndex: number
    ) => {
        let nextIndex = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % options.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            nextIndex = (currentIndex - 1 + options.length) % options.length;
        }

        if (nextIndex !== -1) {
            e.preventDefault();
            const nextOption = options[nextIndex];
            setAnswerLocally(questionId, String(nextOption.option_Id));

            const rowElement = e.currentTarget.closest('[role="radiogroup"]');
            if (rowElement) {
                const buttons = rowElement.querySelectorAll('button[role="radio"]');
                const targetButton = buttons[nextIndex] as HTMLButtonElement | undefined;
                targetButton?.focus();
            }
        }
    };

    const progressPercent = effectiveTotalQuestions > 0 ? Math.round((answeredCount / effectiveTotalQuestions) * 100) : 0;
    const isLastPage = !hasNext;

    return (
        <div
            ref={testContainerRef}
            className="h-[100dvh] overflow-hidden flex flex-col font-sans selection:bg-indigo-100 relative"
            style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #EBF0F5 100%)" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;950&display=swap');
                * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

                @keyframes slide-up-fade {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .theory-card {
                    animation: slide-up-fade 0.3s ease both;
                }
                .category-section {
                    animation: slide-up-fade 0.25s ease both;
                }
                .progress-bar-fill {
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .next-btn {
                    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
                    border: none;
                    color: white;
                    font-weight: 700;
                    font-size: 12px;
                    padding: 8px 18px;
                    border-radius: 8px;
                    display: flex; align-items: center; gap: 4px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    box-shadow: 0 2px 10px rgba(99,102,241,0.25);
                }
                .next-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4338CA 0%, #6D28D9 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
                }
                .next-btn:active:not(:disabled) { transform: translateY(0); }
                .next-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .submit-btn {
                    background: linear-gradient(135deg, #059669 0%, #0D9488 100%);
                    box-shadow: 0 2px 10px rgba(5,150,105,0.25);
                }
                .submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #047857 0%, #0F766E 100%);
                    box-shadow: 0 4px 14px rgba(5,150,105,0.35);
                }

                /* Premium Row Styling */
                .question-row {
                    transition: background-color 150ms ease;
                }
                .question-row:hover {
                    background-color: rgba(99, 102, 241, 0.035) !important;
                }

                /* Circular Radio Styles */
                .custom-radio {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    border: 2.2px solid #CBD5E1;
                    background: white;
                    transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    outline: none;
                }
                .custom-radio:hover {
                    border-color: #6366F1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                .custom-radio.selected {
                    border-color: #6366F1;
                    background: #6366F1;
                }
                .custom-radio.selected::after {
                    content: '';
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: white;
                }
                .custom-radio:focus-visible {
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
                }

                /* Mobile Option Pill */
                .mobile-option-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 8px;
                    background: #FAFAFA;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    color: #475569;
                    transition: all 150ms ease;
                    text-align: left;
                    width: 100%;
                }
                .mobile-option-pill:hover {
                    border-color: #CBD5E1;
                    background: #F8FAFC;
                }
                .mobile-option-pill.selected {
                    border-color: #6366F1;
                    background: #EEF2FF;
                    color: #4338CA;
                    font-weight: 600;
                }
            `}</style>

            {/* ── Proctor Warning Overlay ── (temporarily disabled) */}
            {/* {warningActive && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-rose-500 rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl">
                        ...
                    </div>
                </div>
            )} */}

            {/* ── Top Navigation Bar ── */}
            <header className="flex-none z-20 shadow-sm" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)" }}>
                <div className="max-w-[98%] mx-auto px-4 py-2 flex items-center justify-between gap-4">

                    {/* Left: Brand + Timer */}
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                                <Brain className="h-3.5 w-3.5 text-indigo-400" />
                            </div>
                            <span className="text-[13px] font-black text-white tracking-tight hidden sm:block">
                                Cognify<span className="text-indigo-400 italic">IQ</span>
                            </span>
                        </div>

                        {/* Test name */}
                        {testName && (
                            <div className="hidden md:flex items-center gap-2 px-3 border-l border-white/10">
                                <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[250px]">{testName}</span>
                            </div>
                        )}

                        {/* Timer */}
                        <div className="flex items-center gap-1.5 px-3 border-l border-white/15">
                            <Timer className={cn("h-3.5 w-3.5", timeRemaining && timeRemaining < 300 ? "text-rose-400 animate-pulse" : "text-indigo-400")} />
                            <span className={cn("text-[12px] font-mono font-bold tracking-wider", timeRemaining && timeRemaining < 300 ? "text-rose-300" : "text-indigo-100")}>
                                {timeRemaining ? formatTime(timeRemaining) : "--:--"}
                            </span>
                        </div>
                    </div>

                    {/* Center: Overall Progress (desktop) */}
                    <div className="hidden lg:flex flex-col items-center gap-0.5 flex-1 max-w-xs">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                            <BarChart3 className="w-3 h-3 text-indigo-400" />
                            <span className="text-white font-bold">{answeredCount}</span>
                            <span>/ {effectiveTotalQuestions} Answered</span>
                            <span className="text-indigo-300 font-bold ml-1">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="progress-bar-fill h-full rounded-full"
                                style={{
                                    width: `${progressPercent}%`,
                                    background: "linear-gradient(90deg, #6366F1, #8B5CF6)"
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white hidden sm:flex items-center"
                            title="Toggle Fullscreen"
                        >
                            {isFullScreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
                        </button>
                        <div className="h-3.5 w-px bg-white/10 hidden sm:block" />
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all border border-rose-500/25"
                        >
                            <LogOut className="w-3 h-3" />
                            <span className="hidden xs:inline">Terminate</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Violation/Resume Banners ── (temporarily disabled) */}
            {/* {showResumeMsg && (
                <div className="...">✅ Face detected. Assessment resumed.</div>
            )}
            {lastViolationMsg && (
                <div className="...">Violation message</div>
            )} */}

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-hidden flex flex-col w-[98%] mx-auto px-2 md:px-4 pt-2.5 pb-1.5">

                {/* Mobile progress bar */}
                <div className="lg:hidden flex items-center gap-3 mb-2">
                    <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden border border-indigo-100">
                        <div
                            className="progress-bar-fill h-full rounded-full"
                            style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, #6366F1, #8B5CF6)" }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 shrink-0 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {answeredCount} / {effectiveTotalQuestions}
                    </span>
                </div>

                <div className="flex-1 min-h-0 rounded-xl overflow-hidden flex flex-col relative bg-white border border-slate-200/80 shadow-md">

                    {/* Loading skeleton overlay */}
                    {testTakingLoading && (
                        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto p-3 space-y-2">
                            <SkeletonTheoryCard />
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* Questions scroll area */}
                    <div ref={questionsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">

                        {Object.entries(groupedByCategory).map(([category, catQuestions], catIdx) => {
                            const color = getCategoryColor(category);
                            const emoji = getCategoryEmoji(category);
                            const catTotal = perCategory[category] ?? catQuestions.length;
                            const catAnswered = allTestQuestions.filter(q =>
                                (q.category || "General") === category && !!getCurrentAnswer(q.question_Id.toString())
                            ).length;

                            // Resolve theory for this category
                            const theoryName = catQuestions[0] ? getTheoryName(catQuestions[0].theory) : "";
                            const theoryInfo = theoryName ? (theoryMap.get(theoryName.trim().toLowerCase()) ?? { name: theoryName, description: "" }) : null;

                            // Dynamic options extraction from first question
                            const firstQuestionOptions = catQuestions[0]?.options || [];
                            const hasOptions = firstQuestionOptions.length > 0;

                            return (
                                <div key={category} className="category-section space-y-2.5" style={{ animationDelay: `${catIdx * 40}ms` }}>

                                    {/* ── Compact Category Header ── */}
                                    <div className={cn("rounded-xl border px-3.5 py-1.5 shadow-sm", `bg-gradient-to-r ${color.bg}`, color.border)}>
                                        <div className="flex items-center justify-between gap-3 flex-wrap">
                                            {/* Left: Category name + Total Questions */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] leading-none">{emoji}</span>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className={cn("text-[13px] font-black tracking-tight", color.accent)}>
                                                        {category.replace(/_/g, " / ")} Assessment
                                                    </h2>
                                                    <span className={cn("text-[9.5px] font-bold px-2 py-0.5 rounded-full border bg-white/90", color.badge, color.border)}>
                                                        {catTotal} Questions
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right: Answered Progress */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-550">
                                                    <span>Answered:</span>
                                                    <span className="font-bold text-slate-800">{catAnswered}</span>
                                                    <span className="text-slate-300">/</span>
                                                    <span className="text-slate-650">{catTotal}</span>
                                                    <span className={cn("font-bold ml-1 text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-100", color.accent)}>
                                                        {catTotal > 0 ? Math.round((catAnswered / catTotal) * 100) : 0}%
                                                    </span>
                                                </div>
                                                <div className="w-7 h-7 flex-shrink-0">
                                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="4" />
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="4"
                                                            strokeDasharray={`${catTotal > 0 ? (catAnswered / catTotal) * 88 : 0} 88`}
                                                            strokeLinecap="round" className={color.accent} />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Compact Theory Card ── */}
                                    {theoryInfo && (
                                        <div className="theory-card bg-slate-50/70 border-l-3 border-indigo-500 rounded-r-lg px-3.5 py-2 space-y-0.5 my-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-650">Theory</span>
                                                <span className="text-[11px] font-bold text-slate-850">{theoryInfo.name}</span>
                                            </div>
                                            {theoryInfo.description && (
                                                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                                                    {theoryInfo.description}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ── Question Grid Container ── */}
                                    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                                        
                                        {/* Sticky Response Header (Desktop Only) */}
                                        {hasOptions && (
                                            <div className="hidden md:grid grid-cols-[45px_1fr_repeat(5,minmax(90px,130px))] gap-1 px-4 py-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[10.5px] font-bold text-slate-500 text-center uppercase tracking-wider items-center">
                                                <div className="text-center font-bold text-[9px] text-slate-400">#</div>
                                                <div className="text-left pl-2 font-bold text-slate-600">Question Text</div>
                                                {firstQuestionOptions.map((option, idx) => (
                                                    <div key={option.option_Id} className="truncate px-0.5 text-slate-500" title={option.option_Text}>
                                                        {option.option_Text}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Question Rows */}
                                        <div className="divide-y divide-slate-100">
                                            {catQuestions.map((question, qIdx) => {
                                                const globalIdx = allTestQuestions.indexOf(question);
                                                const displayNum = globalIdx >= 0 ? globalIdx + 1 : qIdx + 1;
                                                const currentAnswer = getCurrentAnswer(question.question_Id.toString());
                                                const answered = !!currentAnswer;

                                                const isEven = qIdx % 2 === 1;

                                                return (
                                                    <div key={question.question_Id} className="w-full">
                                                        {/* Desktop Layout: Clean horizontal row */}
                                                        <div 
                                                            role="radiogroup" 
                                                            aria-label={question.question_Text}
                                                            className={cn(
                                                                "question-row hidden md:grid grid-cols-[45px_1fr_repeat(5,minmax(90px,130px))] gap-1 px-4 py-1.5 items-center",
                                                                isEven ? "bg-slate-50/30" : "bg-white"
                                                            )}
                                                        >
                                                            {/* Circle Badge Number */}
                                                            <div className="flex justify-center">
                                                                <span className={cn(
                                                                    "w-[19px] h-[19px] rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-150",
                                                                    answered ? "bg-indigo-600 text-white" : "bg-slate-150 text-slate-500 bg-slate-100"
                                                                )}>
                                                                    {displayNum}
                                                                </span>
                                                            </div>

                                                            {/* Question Text */}
                                                            <div className="text-[12.5px] font-medium text-slate-700 pl-2 pr-4 leading-snug truncate" title={question.question_Text}>
                                                                {question.question_Text}
                                                            </div>

                                                            {/* Options columns */}
                                                            {question.options.map((option, oIdx) => {
                                                                const optionIdStr = String(option.option_Id);
                                                                const isSelected = currentAnswer === optionIdStr;

                                                                return (
                                                                    <div 
                                                                        key={option.option_Id} 
                                                                        className={cn(
                                                                            "flex justify-center items-center py-1.5 transition-colors duration-150 rounded", 
                                                                            isSelected && "bg-indigo-50/20"
                                                                        )}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            role="radio"
                                                                            aria-checked={isSelected}
                                                                            tabIndex={isSelected || (!answered && oIdx === 0) ? 0 : -1}
                                                                            onClick={() => setAnswerLocally(question.question_Id.toString(), optionIdStr)}
                                                                            onKeyDown={(e) => handleOptionKeyDown(e, question.question_Id.toString(), question.options, oIdx)}
                                                                            className={cn("custom-radio", isSelected && "selected")}
                                                                            title={option.option_Text}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Mobile/Tablet Layout: Stacked options vertically */}
                                                        <div 
                                                            role="radiogroup"
                                                            aria-label={question.question_Text}
                                                            className={cn(
                                                                "md:hidden p-4 space-y-3",
                                                                isEven ? "bg-slate-50/30" : "bg-white"
                                                            )}
                                                        >
                                                            <div className="flex gap-2.5 items-start">
                                                                <span className={cn(
                                                                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                                                                    answered ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                                                )}>
                                                                    {displayNum}
                                                                </span>
                                                                <p className="text-[13px] font-medium text-slate-800 leading-snug">
                                                                    {question.question_Text}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1.5 pl-7">
                                                                {question.options.map((option, oIdx) => {
                                                                    const optionIdStr = String(option.option_Id);
                                                                    const isSelected = currentAnswer === optionIdStr;
                                                                    return (
                                                                        <button
                                                                            key={option.option_Id}
                                                                            type="button"
                                                                            role="radio"
                                                                            aria-checked={isSelected}
                                                                            tabIndex={isSelected || (!answered && oIdx === 0) ? 0 : -1}
                                                                            onClick={() => setAnswerLocally(question.question_Id.toString(), optionIdStr)}
                                                                            onKeyDown={(e) => handleOptionKeyDown(e, question.question_Id.toString(), question.options, oIdx)}
                                                                            className={cn("mobile-option-pill", isSelected && "selected")}
                                                                        >
                                                                            <span className={cn("custom-radio shrink-0 pointer-events-none", isSelected && "selected")} />
                                                                            <span>{option.option_Text}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty state */}
                        {!testTakingLoading && testQuestions.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center animate-in fade-in duration-200">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                                    <BookOpen className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700">No questions on this page</h3>
                                <p className="text-[12px] text-slate-400 mt-0.5">Navigate using the controls below.</p>
                            </div>
                        )}

                        {/* Spacer so last question doesn't hide behind footer */}
                        <div className="h-4" />
                    </div>
                </div>
            </main>

            {/* ── Footer Navigation ── */}
            <footer className="flex-none bg-white/90 backdrop-blur-sm border-t border-slate-200 z-20 px-4 py-2.5">
                <div className="max-w-[98%] mx-auto flex items-center justify-between gap-3">

                    {/* Previous */}
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={!hasPrevious}
                        className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                            hasPrevious
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-750"
                                : "bg-slate-50 text-slate-300 cursor-not-allowed"
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </button>

                    {/* Page dots / progress */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        {totalPages <= 12 ? (
                            Array.from({ length: totalPages }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "rounded-full transition-all duration-300",
                                        i + 1 === currentPage
                                            ? "w-5 h-1.5 bg-indigo-650"
                                            : "w-1.5 h-1.5 bg-slate-200 hover:bg-slate-350"
                                    )}
                                />
                            ))
                        ) : (
                            <span className="text-[11px] font-semibold text-slate-550">
                                Page {currentPage} / {totalPages}
                            </span>
                        )}
                    </div>

                    {/* Next / Submit */}
                    <button
                        className={cn("next-btn", isLastPage && "submit-btn")}
                        onClick={isLastPage ? () => setShowSubmitModal(true) : handleNextQuestion}
                        disabled={isSubmitting}
                    >
                        {isLastPage ? (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Submit Assessment</span>
                            </>
                        ) : (
                            <>
                                <span>Next Page</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </footer>

            {/* ── Floating Proctored Camera Widget ── (temporarily disabled – re-enable when needed) */}
            {/* <div
                style={{
                    position: "fixed",
                    left: `${cameraPos.x}px`,
                    top: `${cameraPos.y}px`,
                    width: isCamCollapsed ? ... : `${cameraPos.width}px`,
                    height: isCamCollapsed ? "40px" : `${cameraPos.height}px`,
                }}
                className="z-50 rounded-2xl bg-slate-900/70 ..."
            >
                ... camera widget contents ...
            </div> */}

            {/* ── Exit Dialog ── */}
            <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
                <AlertDialogContent className="bg-white border-slate-200 rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 font-black text-lg">
                            {hasAnswers ? "Submit & Exit Assessment?" : "Exit Assessment?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            {hasAnswers
                                ? "All current responses will be submitted as your final assessment. You won't be able to resume later."
                                : "You haven't answered any questions yet. Do you really want to return to the dashboard?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-slate-200 text-[13px] font-semibold">No, Stay</AlertDialogCancel>
                        <AlertDialogAction
                            className={cn("rounded-xl text-[13px] font-semibold text-white", hasAnswers ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-black")}
                            onClick={() => { setShowExitModal(false); handleExitTest(); }}
                        >
                            {hasAnswers ? "Yes, Submit & Exit" : "Yes, Exit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Submit Dialog ── */}
            <AlertDialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <AlertDialogContent className="bg-white border-slate-200 rounded-2xl">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <AlertDialogTitle className="text-slate-900 font-black text-lg">Submit Assessment?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            You have answered <span className="font-bold text-indigo-600">{answeredCount}</span> of <span className="font-bold">{effectiveTotalQuestions}</span> questions.
                            {answeredCount < effectiveTotalQuestions && (
                                <span className="block mt-1 text-amber-600 font-medium">
                                    ⚠ {effectiveTotalQuestions - answeredCount} question(s) are unanswered.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-slate-200 text-[13px] font-semibold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-semibold"
                            onClick={() => { setShowSubmitModal(false); handleSubmitTest(); }}
                        >
                            Confirm Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};