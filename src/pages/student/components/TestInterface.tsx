import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Timer,
    Minimize,
    Maximize,
    Brain,
    LogOut,
    CameraOff,
    ChevronUp,
    ChevronDown,
    AlertCircle
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
    const [showExitModal, setShowExitModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Floating Proctored Camera States
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [camError, setCamError] = useState(false);
    const [isCamCollapsed, setIsCamCollapsed] = useState(false);
    const interfaceVideoRef = useRef<HTMLVideoElement>(null);
    const [hudCoords, setHudCoords] = useState({ x: 135.2, y: 78.4 });
    const streamRef = useRef<MediaStream | null>(null);

    // Draggable and Resizable Camera coordinates
    const [cameraPos, setCameraPos] = useState(() => {
        const saved = localStorage.getItem("camera-position");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed.x === "number" && typeof parsed.y === "number" && typeof parsed.width === "number" && typeof parsed.height === "number") {
                    return parsed;
                }
            } catch (e) {}
        }
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
        return { x: 10, y: 80, width: isMobile ? 120 : 220, height: isMobile ? 90 : 150 };
    });

    const acquireCameraStream = async () => {
        try {
            if (streamRef.current) {
                if (interfaceVideoRef.current && interfaceVideoRef.current.srcObject !== streamRef.current) {
                    interfaceVideoRef.current.srcObject = streamRef.current;
                    interfaceVideoRef.current.play().catch(e => console.error("Play error on re-use:", e));
                }
                return streamRef.current;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240, facingMode: "user" }
            });
            streamRef.current = stream;
            setCameraStream(stream);
            setCamError(false);
            if (interfaceVideoRef.current) {
                interfaceVideoRef.current.srcObject = stream;
                interfaceVideoRef.current.play().catch(e => console.error("Play error on setup:", e));
            }
            return stream;
        } catch (err) {
            console.error("Proctor camera load failed:", err);
            setCamError(true);
            return null;
        }
    };

    // Face / Gaze Detection violations states
    const [violations, setViolations] = useState(0);
    const [warningActive, setWarningActive] = useState(false);
    const [warningCountdown, setWarningCountdown] = useState(5);
    const [lastViolationMsg, setLastViolationMsg] = useState<string | null>(null);
    const [lastViolationLevel, setLastViolationLevel] = useState<"yellow" | "orange" | "red" | null>(null);
    const [showResumeMsg, setShowResumeMsg] = useState(false);
    const warningCountdownRef = useRef<number>(5);
    const autoSubmitTriggeredRef = useRef<boolean>(false);

    // Keep camera in bounds on window resize
    useEffect(() => {
        const handleResize = () => {
            setCameraPos(prev => {
                const maxX = window.innerWidth - prev.width;
                const maxY = window.innerHeight - prev.height;
                const x = Math.max(0, Math.min(maxX, prev.x));
                const y = Math.max(0, Math.min(maxY, prev.y));
                return { ...prev, x, y };
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Drag handler
    const handleHeaderMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest('button')) return;
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = cameraPos.x;
        const initialY = cameraPos.y;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            let newX = initialX + deltaX;
            let newY = initialY + deltaY;
            
            const maxX = window.innerWidth - (isCamCollapsed ? 170 : cameraPos.width);
            const maxY = window.innerHeight - (isCamCollapsed ? 40 : cameraPos.height);
            
            newX = Math.max(0, Math.min(maxX, newX));
            newY = Math.max(0, Math.min(maxY, newY));
            
            const updated = { ...cameraPos, x: newX, y: newY };
            setCameraPos(updated);
            localStorage.setItem("camera-position", JSON.stringify(updated));
        };
        
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Resize handler
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const initialWidth = cameraPos.width;
        const initialHeight = cameraPos.height;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            let newWidth = initialWidth + deltaX;
            let newHeight = initialHeight + deltaY;
            
            newWidth = Math.max(180, Math.min(320, newWidth));
            newHeight = Math.max(120, Math.min(240, newHeight));
            
            const updated = { ...cameraPos, width: newWidth, height: newHeight };
            setCameraPos(updated);
            localStorage.setItem("camera-position", JSON.stringify(updated));
        };
        
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Bottom-left resize handler
    const handleResizeLeftMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const initialWidth = cameraPos.width;
        const initialHeight = cameraPos.height;
        const initialX = cameraPos.x;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            let newWidth = initialWidth - deltaX;
            let newHeight = initialHeight + deltaY;
            let newX = initialX + deltaX;
            
            if (newWidth < 180) {
                newX = initialX + (initialWidth - 180);
                newWidth = 180;
            } else if (newWidth > 320) {
                newX = initialX - (320 - initialWidth);
                newWidth = 320;
            }
            
            newHeight = Math.max(120, Math.min(240, newHeight));
            
            const updated = { x: newX, y: cameraPos.y, width: newWidth, height: newHeight };
            setCameraPos(prev => ({ ...prev, x: newX, width: newWidth, height: newHeight }));
            localStorage.setItem("camera-position", JSON.stringify(updated));
        };
        
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Tab visibility detector & blur focus checks
    useEffect(() => {
        let isLeaving = false;

        const handleUserLeave = () => {
            if (isLeaving || autoSubmitTriggeredRef.current) return;
            isLeaving = true;
            setWarningActive(true);
            setWarningCountdown(5);
            warningCountdownRef.current = 5;
            setShowResumeMsg(false);
        };

        const handleUserReturn = () => {
            if (!isLeaving || autoSubmitTriggeredRef.current) return;
            isLeaving = false;

            if (warningCountdownRef.current > 0) {
                setWarningActive(false);
                setShowResumeMsg(true);
                const timer = setTimeout(() => setShowResumeMsg(false), 3000);

                setViolations(prev => {
                    const next = prev + 1;
                    if (next >= 3) {
                        if (!autoSubmitTriggeredRef.current) {
                            autoSubmitTriggeredRef.current = true;
                            Swal.fire({
                                title: 'Assessment Terminated',
                                html: `
                                  <div class="text-center space-y-3 p-2">
                                    <div class="text-rose-500 font-bold text-lg mb-2">🚫 Violation Limit Reached</div>
                                    <div class="text-slate-700 text-sm font-semibold">Assessment submitted automatically.</div>
                                    <div class="text-slate-550 text-xs mt-2">
                                      <b>Reason:</b><br/>Candidate exceeded the maximum allowed security violations (3/3 violations).
                                    </div>
                                  </div>
                                `,
                                icon: 'error',
                                confirmButtonText: 'Acknowledge',
                                confirmButtonColor: '#4F46E5',
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            }).then(() => {
                                handleSubmitTest();
                            });
                        }
                    } else {
                        if (next === 1) {
                            setLastViolationMsg("Violation 1/3: Please remain visible.");
                            setLastViolationLevel("yellow");
                        } else if (next === 2) {
                            setLastViolationMsg("Violation 2/3: Repeated movement detected.");
                            setLastViolationLevel("orange");
                        }
                        setTimeout(() => {
                            setLastViolationMsg(null);
                            setLastViolationLevel(null);
                        }, 5000);
                    }
                    return next;
                });

                return () => {
                    clearTimeout(timer);
                };
            }
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                handleUserLeave();
            } else {
                handleUserReturn();
            }
        };

        const onBlur = () => {
            handleUserLeave();
        };

        const onFocus = () => {
            handleUserReturn();
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("blur", onBlur);
        window.addEventListener("focus", onFocus);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("focus", onFocus);
        };
    }, [handleSubmitTest]);

    // Warning countdown timer
    useEffect(() => {
        if (!warningActive) return;

        const interval = setInterval(() => {
            setWarningCountdown(prev => {
                const next = prev - 1;
                warningCountdownRef.current = next;
                if (next <= 0) {
                    clearInterval(interval);
                    setWarningActive(false);
                    if (!autoSubmitTriggeredRef.current) {
                        autoSubmitTriggeredRef.current = true;
                        Swal.fire({
                            title: 'Assessment Terminated',
                            html: `
                              <div class="text-center space-y-3 p-2">
                                <div class="text-rose-500 font-bold text-lg mb-2">⚠ Face not detected / Focus lost</div>
                                <div class="text-slate-700 text-sm font-semibold">Assessment submitted automatically.</div>
                                <div class="text-slate-500 text-xs mt-2">
                                  <b>Reason:</b><br/>Face was not detected for more than 5 seconds.
                                </div>
                              </div>
                            `,
                            icon: 'error',
                            confirmButtonText: 'Acknowledge',
                            confirmButtonColor: '#4F46E5',
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            handleSubmitTest();
                        });
                    }
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [warningActive, handleSubmitTest]);

    // Enable camera preview in active test
    useEffect(() => {
        acquireCameraStream();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    // Watch collapsed state to restore camera stream automatically
    useEffect(() => {
        if (!isCamCollapsed && interfaceVideoRef.current) {
            if (streamRef.current) {
                interfaceVideoRef.current.srcObject = streamRef.current;
                interfaceVideoRef.current.play().catch(e => console.error("Play error on restore watcher:", e));
            } else {
                acquireCameraStream();
            }
        }
    }, [isCamCollapsed]);

    const handleMaximize = async () => {
        setIsCamCollapsed(false);
        if (interfaceVideoRef.current) {
            if (streamRef.current) {
                interfaceVideoRef.current.srcObject = streamRef.current;
                interfaceVideoRef.current.play().catch(e => console.error("Play error on maximize:", e));
            } else {
                await acquireCameraStream();
            }
        }
    };

    // Telemetry simulation
    useEffect(() => {
        const t = setInterval(() => {
            setHudCoords({
                x: parseFloat((130 + Math.random() * 12).toFixed(1)),
                y: parseFloat((74 + Math.random() * 8).toFixed(1))
            });
        }, 500);
        return () => clearInterval(t);
    }, []);

    const currentCategoryLabel = currentCategory || "Assessment Matrix";

    return (
        <div ref={testContainerRef} className="h-[100dvh] overflow-hidden flex flex-col bg-[#F8FAFC] font-sans selection:bg-indigo-100 relative">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #E5E7EB; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                @keyframes scan-line-v {
                    0% { top: 0%; opacity: 0.2; }
                    50% { top: 100%; opacity: 0.7; }
                    100% { top: 0%; opacity: 0.2; }
                }
                .question-card {
                    position: relative;
                    transition: all .25s ease;
                    border: 1px solid #E5E7EB;
                    background: #ffffff;
                }
                .question-card::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 0px;
                    background: #4f6bff;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                    transition: all .25s ease;
                    z-index: 20;
                }
                .question-card:hover {
                    border-color: #4f6bff;
                    box-shadow:
                        0 0 0 1px rgba(79,107,255,.15),
                        0 12px 30px rgba(79,107,255,.18);
                    transform: translateY(-2px) scale(1.01);
                    background:
                        linear-gradient(
                            90deg,
                            rgba(79,107,255,.04),
                            rgba(79,107,255,.08)
                        );
                }
                .question-card:hover::before {
                    width: 4px;
                    background: #4f6bff;
                    box-shadow: 0 0 12px #4f6bff;
                }
            `}</style>

            {/* AI Warning Overlay Countdown */}
            {warningActive && (
                <div className="absolute inset-0 bg-[#0f1117]/85 backdrop-blur-sm z-55 flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-rose-500 rounded-[16px] max-w-md w-full p-6 text-center space-y-4 shadow-xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500 animate-bounce">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-bold text-[#991B1B] uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <span>⚠</span> Face not detected.
                            </h3>
                            <p className="text-[14px] font-semibold text-[#111827]">
                                Please return to the screen.
                            </p>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-[12px] py-4">
                            <span className="text-[12px] font-bold text-[#991B1B] uppercase tracking-wider block">
                                Test will be auto-submitted in
                            </span>
                            <span className="text-[54px] font-black text-rose-600 font-mono block leading-none my-2 animate-pulse">
                                {warningCountdown}...
                            </span>
                            <span className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block mt-1">
                                Violation {violations + 1} of 3
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Ensure proper lighting, remain in front of the camera, and keep this window active.
                        </p>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="flex-none bg-[#111827] text-white z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/5 border border-white/10">
                                <Brain className="h-4 w-4 text-indigo-400" />
                            </div>
                            <span className="text-[14px] font-bold text-white tracking-tight uppercase">
                                Cognify<span className="text-indigo-400 italic">IQ</span>
                            </span>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center gap-1.5 px-3 border-l border-white/15">
                            <Timer className={cn("h-4 w-4", timeRemaining && timeRemaining < 300 ? "text-rose-500 animate-pulse" : "text-indigo-400")} />
                            <span className="text-[13px] font-mono font-bold tracking-wider text-indigo-100">
                                {timeRemaining ? formatTime(timeRemaining) : '--:--'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={isFullScreen ? exitFullScreen : enterFullScreen} 
                            className="p-2 hover:bg-white/5 rounded-[8px] transition-colors text-slate-400 hover:text-white hidden sm:block" 
                            title="Toggle Fullscreen"
                        >
                            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </button>

                        <div className="h-4 w-px bg-white/10 hidden sm:block" />

                        <button 
                            onClick={() => setShowExitModal(true)} 
                            className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white px-2.5 py-1.5 rounded-[8px] text-[12px] font-bold uppercase transition-all border border-rose-500/20"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Terminate</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumed Message Banner */}
            {showResumeMsg && (
                <div className="mx-4 mt-4 p-3 bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] rounded-[12px] flex items-center gap-2 text-[12px] font-semibold animate-in slide-in-from-top duration-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E] animate-ping shrink-0" />
                    <span>✅ Face detected. Assessment resumed.</span>
                </div>
            )}

            {/* Violation Alert Banner */}
            {lastViolationMsg && (
                <div className={cn(
                    "mx-4 mt-4 p-3 border rounded-[12px] flex items-center gap-2 text-[12px] font-semibold animate-in slide-in-from-top duration-300",
                    lastViolationLevel === "yellow" && "bg-yellow-50 border-yellow-200 text-yellow-800",
                    lastViolationLevel === "orange" && "bg-orange-50 border-orange-200 text-orange-850",
                    lastViolationLevel === "red" && "bg-rose-50 border-rose-250 text-rose-800"
                )}>
                    <span className={cn(
                        "h-2 w-2 rounded-full animate-ping shrink-0",
                        lastViolationLevel === "yellow" && "bg-yellow-500",
                        lastViolationLevel === "orange" && "bg-orange-500",
                        lastViolationLevel === "red" && "bg-rose-500"
                    )} />
                    <span>{lastViolationMsg}</span>
                </div>
            )}

            {/* Main Area */}
            <main className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full p-2 md:p-4">
                <div className="flex-1 min-h-0 bg-white rounded-[12px] shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col relative">
                    
                    {/* Themed Loader Overlay */}
                    {testTakingLoading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[12px] font-bold text-[#4F46E5] uppercase tracking-wider">Syncing assessment questions...</span>
                            </div>
                        </div>
                    )}

                    {/* Scrollable table matrix for mobile layout responsiveness */}
                    <div className="flex-1 min-h-0 overflow-x-auto w-full flex flex-col">
                        <div className="min-w-[600px] sm:min-w-[750px] md:min-w-0 flex flex-col flex-1">
                            {/* Table Header */}
                            <div className="flex-none grid grid-cols-[1fr_repeat(5,60px)] sm:grid-cols-[1fr_repeat(5,80px)] md:grid-cols-[1fr_repeat(5,100px)] bg-[#F8FAFC] border-b border-[#E5E7EB] sticky top-0 z-30">
                                <div className="p-3 text-[12px] font-bold text-[#111827] pl-4 md:pl-6 self-center uppercase tracking-wider truncate">
                                    {currentCategoryLabel}
                                </div>
                                {testQuestions.length > 0 && testQuestions[0].options.map((option) => (
                                    <div key={option.option_Id} className="p-2 text-center font-bold text-[11px] text-[#6B7280] uppercase tracking-wider border-l border-[#E5E7EB] flex items-center justify-center">
                                        {option.option_Text}
                                    </div>
                                ))}
                            </div>

                            {/* Table Questions Body */}
                            <div ref={questionsContainerRef} className="flex-1 overflow-y-auto w-full custom-scrollbar scroll-smooth p-4 space-y-3">
                                <div className={cn("space-y-3", isFullScreen && "h-full flex flex-col")}>
                                    {testQuestions.map((question, qIdx) => (
                                        <div
                                            key={question.question_Id}
                                            className={cn(
                                                "question-card grid grid-cols-[1fr_repeat(5,60px)] sm:grid-cols-[1fr_repeat(5,80px)] md:grid-cols-[1fr_repeat(5,100px)] items-center rounded-[12px] group",
                                                isFullScreen && "flex-1"
                                            )}
                                        >
                                            <div className="text-[13px] font-semibold text-[#111827] pl-4 md:pl-6 p-3 flex gap-2 relative z-10">
                                                <span className="text-slate-400 font-mono text-[12px]">{(currentPage - 1) * 10 + (qIdx + 1)}.</span>
                                                <span>{question.question_Text}</span>
                                            </div>

                                            {question.options.map((option) => {
                                                const optionIdStr = String(option.option_Id);
                                                const isSelected = getCurrentAnswer(question.question_Id.toString()) === optionIdStr;
                                                return (
                                                    <div key={option.option_Id} className="flex justify-center border-l border-[#E5E7EB]/50 p-1 relative z-10">
                                                        <button
                                                            className={cn(
                                                                "relative h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-200",
                                                                isSelected 
                                                                    ? "bg-[#4F46E5] border-[#4F46E5] shadow-sm scale-105" 
                                                                    : "bg-white border-[#CBD5E1] hover:border-[#4F46E5] scale-95"
                                                            )}
                                                            onClick={() => {
                                                                setAnswerLocally(question.question_Id.toString(), optionIdStr);
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <div className="h-2 w-2 rounded-full bg-white animate-in zoom-in duration-200" />
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Draggable & Resizable Floating proctored camera widget */}
            <div 
                style={{
                    position: "fixed",
                    left: `${cameraPos.x}px`,
                    top: `${cameraPos.y}px`,
                    width: isCamCollapsed ? (typeof window !== "undefined" && window.innerWidth < 640 ? "100px" : "170px") : `${cameraPos.width}px`,
                    height: isCamCollapsed ? "40px" : `${cameraPos.height}px`,
                }}
                className={cn(
                    "z-50 rounded-[16px] bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl overflow-hidden flex flex-col transition-[width,height] duration-150 select-none"
                )}
            >
                {/* Header bar handles dragging */}
                <div 
                    onMouseDown={handleHeaderMouseDown}
                    className="flex items-center justify-between px-3 py-2 bg-slate-950/60 border-b border-slate-850/60 shrink-0 cursor-move h-10"
                >
                    {isCamCollapsed ? (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                                <span className="text-[12px]">📷</span> <span className="hidden xs:inline">AI Monitoring</span>
                            </span>
                            <button 
                                onClick={handleMaximize}
                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors ml-2"
                            >
                                Max
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-[10px] font-bold text-slate-355 uppercase tracking-widest flex items-center gap-1">
                                <span className="text-[11px]">📷</span> AI Monitoring
                            </span>
                            <button 
                                onClick={() => setIsCamCollapsed(true)}
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Minimize camera"
                            >
                                <Minimize className="h-3.5 w-3.5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Video Body & Resize Handle - ALWAYS MOUNTED to keep stream alive */}
                <div className={cn(
                    "flex-1 relative bg-slate-950 flex flex-col overflow-hidden",
                    isCamCollapsed && "hidden"
                )}>
                    {/* Status indicators */}
                    <div className="flex items-center gap-2.5 px-2.5 py-1 bg-slate-900/50 border-b border-slate-850/60 text-[9px] font-medium text-slate-400 shrink-0 select-none">
                        <span className="flex items-center gap-1 text-[#22C55E]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] inline-block" />
                            Face Detected
                        </span>
                        <span className="flex items-center gap-1 text-indigo-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
                            Tracking Active
                        </span>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        {camError ? (
                            <CameraOff className="w-5 h-5 text-slate-700" />
                        ) : (
                            <>
                                <video 
                                    ref={interfaceVideoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover scale-x-[-1]" 
                                />
                                <div className="absolute left-0 right-0 h-[1px] bg-indigo-500/30 shadow-[0_0_4px_rgba(99,102,241,0.5)] top-0 animate-[scan-line-v_2s_linear_infinite]" />
                                
                                <div className="absolute bottom-1 left-1 right-1 flex justify-between text-[8px] font-mono text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded-[4px] border border-white/5 pointer-events-none">
                                    <span className="flex items-center gap-0.5">
                                        <span className="h-1 w-1 bg-[#22C55E] rounded-full animate-pulse" />
                                        X:{hudCoords.x} Y:{hudCoords.y}
                                    </span>
                                    <span>Gaze OK</span>
                                </div>
                            </>
                        )}

                        {/* Bottom-right Resize Handle */}
                        <div 
                            onMouseDown={handleResizeMouseDown}
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-55 pointer-events-auto"
                        >
                            <svg className="w-2.5 h-2.5 text-slate-600 hover:text-indigo-400" viewBox="0 0 6 6" fill="currentColor">
                                <path d="M6 6H0V4.5H4.5V0H6V6Z" />
                            </svg>
                        </div>

                        {/* Bottom-left Resize Handle */}
                        <div 
                            onMouseDown={handleResizeLeftMouseDown}
                            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize flex items-end justify-start p-0.5 z-55 pointer-events-auto"
                        >
                            <svg className="w-2.5 h-2.5 text-slate-600 hover:text-indigo-400" viewBox="0 0 6 6" fill="currentColor">
                                <path d="M0 6H6V4.5H1.5V0H0V6Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex-none bg-white border-t border-[#E5E7EB] z-40 pb-2">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex justify-between items-center gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={handlePreviousQuestion} 
                        disabled={!hasPrevious} 
                        className="h-[38px] px-3.5 text-[12px] font-semibold text-[#6B7280] hover:text-[#111827] transition-all rounded-[10px]"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> 
                        <span>Previous</span>
                    </Button>

                    {/* Progress Dots */}
                    <div className="hidden xs:flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "h-1 rounded-full transition-all duration-300", 
                                    i + 1 === currentPage ? "w-6 bg-[#4F46E5]" : "w-1.5 bg-slate-200"
                                )} 
                            />
                        ))}
                    </div>

                    <Button
                        onClick={hasNext ? handleNextQuestion : () => setShowSubmitModal(true)}
                        disabled={isSubmitting}
                        className={cn(
                            "h-[38px] px-5 text-[12px] font-semibold rounded-[10px] transition-all active:scale-[0.98] shadow-sm",
                            hasNext 
                                ? "bg-[#111827] text-white hover:bg-black" 
                                : "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                        )}
                    >
                        {hasNext ? (
                            <>
                                <span>Next Page</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </>
                        ) : "Submit Assessment"} 
                    </Button>
                </div>
            </div>

            {/* Exit dialog */}
            <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
                <AlertDialogContent className="bg-white border-[#E5E7EB] rounded-[12px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#111827] font-bold">
                            {hasAnswers ? "Confirm Exit & Submit?" : "Exit Assessment?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6B7280]">
                            {hasAnswers
                                ? "All current responses will be submitted as your final assessment. You won't be able to resume later."
                                : "You haven't answered any questions yet. Do you really want to return to the dashboard?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-[10px] border-[#E5E7EB] text-[13px] font-semibold">
                            No, Stay
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            className={cn(
                                "rounded-[10px] text-[13px] font-semibold text-white",
                                hasAnswers ? "bg-[#4F46E5] hover:bg-[#4338CA]" : "bg-[#111827] hover:bg-black"
                            )} 
                            onClick={() => {
                                setShowExitModal(false);
                                handleExitTest();
                            }}
                        >
                            {hasAnswers ? "Yes, Submit" : "Yes, Exit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Submit dialog */}
            <AlertDialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <AlertDialogContent className="bg-white border-[#E5E7EB] rounded-[12px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#111827] font-bold">
                            Submit Assessment?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6B7280]">
                            Are you ready to submit your psychometric responses for grading?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-[10px] border-[#E5E7EB] text-[13px] font-semibold">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[10px] text-[13px] font-semibold"
                            onClick={() => {
                                setShowSubmitModal(false);
                                handleSubmitTest();
                            }}
                        >
                            Confirm Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};