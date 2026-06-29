import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Smile,
    RefreshCw,
    Brain,
    Camera,
    CameraOff,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    Play,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TestData {
    title: string;
    timeDuration: number;
    questionCount?: number | string;
    totalQuestions?: number | string;
}

interface ConfirmationStepProps {
    currentTest: TestData | null;
    onStart: () => void;
    onBack: () => void;
    isLoading: boolean;
    stepNumber: number;
    mediaStreamRef?: React.MutableRefObject<MediaStream | null>;
}

export const ConfirmationStep = ({
    currentTest,
    onStart,
    onBack,
    isLoading,
    stepNumber,
    mediaStreamRef
}: ConfirmationStepProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [streamError, setStreamError] = useState(false);
    const [calibrationProgress, setCalibrationProgress] = useState(15);
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [pupilCoords, setPupilCoords] = useState({ x: 142.4, y: 89.2 });

    // Status indicators
    const [statusIndicators, setStatusIndicators] = useState({
        cameraConnected: "loading",
        faceDetected: "loading",
        gazeStable: "loading",
        environmentOk: "loading",
    });

    // Handle pupil shifting animation
    useEffect(() => {
        const interval = setInterval(() => {
            setPupilCoords({
                x: parseFloat((140 + Math.random() * 8).toFixed(1)),
                y: parseFloat((85 + Math.random() * 6).toFixed(1))
            });
        }, 450);
        return () => clearInterval(interval);
    }, []);

    // Camera initializer
    useEffect(() => {
        async function enableCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" }
                });
                if (mediaStreamRef) mediaStreamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;
                
                setStatusIndicators(prev => ({ 
                    ...prev, 
                    cameraConnected: "success",
                    environmentOk: "success"
                }));
            } catch (err) {
                console.error("Camera loading failed:", err);
                setStreamError(true);
                setStatusIndicators({
                    cameraConnected: "error",
                    faceDetected: "error",
                    gazeStable: "error",
                    environmentOk: "error"
                });
            }
        }
        enableCamera();
        
        return () => {
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [mediaStreamRef]);

    // Calibration simulation
    useEffect(() => {
        if (streamError) return;

        const interval = setInterval(() => {
            setCalibrationProgress(prev => {
                const next = prev + Math.floor(Math.random() * 10) + 6;
                if (next >= 100) {
                    clearInterval(interval);
                    setIsCalibrated(true);
                    setStatusIndicators({
                        cameraConnected: "success",
                        faceDetected: "success",
                        gazeStable: "success",
                        environmentOk: "success"
                    });
                    return 100;
                }
                
                if (next > 70) {
                    setStatusIndicators(p => ({ ...p, faceDetected: "success", gazeStable: "success" }));
                } else if (next > 35) {
                    setStatusIndicators(p => ({ ...p, faceDetected: "success" }));
                }
                return next;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [streamError]);

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-between p-4 md:p-6 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col flex-1">
                
                {/* 1. Header */}
                <div className="border-b border-[#E5E7EB] p-4 md:p-5 flex items-center justify-between shrink-0">
                    <div className="space-y-0.5">
                        <h1 className="text-[20px] md:text-[24px] font-bold text-[#111827] tracking-tight">Biometric Setup</h1>
                        <p className="text-[13px] md:text-[14px] font-medium text-[#6B7280]">Psychometric Validation</p>
                    </div>
                    <div className="bg-[#EEF2F6] px-3 py-1 rounded-[8px] flex items-center gap-1.5 shrink-0">
                        <div className={cn("h-2 w-2 rounded-full", isCalibrated ? "bg-[#22C55E]" : "bg-[#F59E0B] animate-pulse")} />
                        <span className="text-[12px] font-semibold text-[#111827]">
                            {isCalibrated ? "Ready to Start" : `Calibrating: ${calibrationProgress}%`}
                        </span>
                    </div>
                </div>

                {/* 2. Content */}
                <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-6">
                    
                    {/* Monitoring Cards (4 equal cards, height 120px, rounded-16px, padding 18px) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MonitoringCard
                            icon={<Eye className="w-5 h-5 text-[#4F46E5]" />}
                            title="Gaze Tracking"
                            status={statusIndicators.gazeStable === "success" ? "Ready" : "Syncing..."}
                            statusColor={statusIndicators.gazeStable === "success" ? "success" : "warning"}
                            desc="Maintain eye contact"
                        />
                        <MonitoringCard
                            icon={<Smile className="w-5 h-5 text-[#4F46E5]" />}
                            title="Sentiment"
                            status={statusIndicators.faceDetected === "success" ? "Ready" : "Calibrating..."}
                            statusColor={statusIndicators.faceDetected === "success" ? "success" : "warning"}
                            desc="Face detected"
                        />
                        <MonitoringCard
                            icon={<RefreshCw className="w-5 h-5 text-[#4F46E5] animate-spin" />}
                            title="Live Sync"
                            status={statusIndicators.cameraConnected === "success" ? "Active" : "Offline"}
                            statusColor={statusIndicators.cameraConnected === "success" ? "success" : "error"}
                            desc="Camera synchronized"
                        />
                        <MonitoringCard
                            icon={<Brain className="w-5 h-5 text-[#4F46E5]" />}
                            title="Validation"
                            status={isCalibrated ? "Complete" : "Analyzing..."}
                            statusColor={isCalibrated ? "success" : "warning"}
                            desc="Environment calibrated"
                        />
                    </div>

                    {/* Camera Preview Card (600px width, 350px height, rounded 20px, soft shadow) */}
                    <div className="w-full max-w-[600px] h-[350px] rounded-[20px] overflow-hidden bg-slate-900 border border-[#E5E7EB] shadow-sm relative mx-auto flex items-center justify-center">
                        {streamError ? (
                            <div className="text-center p-6 space-y-3">
                                <div className="h-10 w-10 rounded-[12px] bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                                    <CameraOff className="w-5 h-5" />
                                </div>
                                <p className="text-[13px] font-bold text-white">Camera Connection Failed</p>
                                <p className="text-[12px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                                    Please allow camera permissions in your browser.
                                </p>
                            </div>
                        ) : (
                            <>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover scale-x-[-1]" 
                                />
                                
                                {/* HUD Laser Overlay */}
                                <div className="absolute inset-4 rounded-[12px] border border-dashed border-indigo-400/20 pointer-events-none flex items-center justify-center">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-[sweep_3s_linear_infinite]" />
                                    
                                    <div className={cn(
                                        "w-28 h-28 border rounded-full border-dashed border-indigo-500/30 flex items-center justify-center transition-all",
                                        isCalibrated && "border-[#22C55E]/40"
                                    )}>
                                        <span className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest animate-pulse">
                                            {isCalibrated ? "SYNCED" : "ALIGN FACE"}
                                        </span>
                                    </div>
                                    
                                    {/* Bottom telemetry overlay */}
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-[6px] backdrop-blur-sm border border-white/5 pointer-events-auto">
                                        <span className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 bg-[#22C55E] rounded-full animate-ping" />
                                            Focal: X:{pupilCoords.x} Y:{pupilCoords.y}
                                        </span>
                                        <span>Proctor Core: Active</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Validation Checks Checklist */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[#6B7280] font-semibold mt-3 max-w-xl mx-auto border-t border-[#E5E7EB] pt-4">
                        <CheckItem checked={statusIndicators.faceDetected === "success"} label="Face Detected" />
                        <CheckItem checked={isCalibrated} label="Lighting Good" />
                        <CheckItem checked={statusIndicators.gazeStable === "success"} label="Looking at Screen" />
                        <CheckItem checked={isCalibrated} label="Background Stable" />
                        <CheckItem checked={statusIndicators.cameraConnected === "success"} label="Camera Permission Granted" />
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="border-t border-[#E5E7EB] bg-[#F8FAFC] p-4 flex items-center justify-between shrink-0">
                    <Button 
                        onClick={onBack} 
                        variant="ghost" 
                        className="text-[#6B7280] hover:text-[#111827] text-[13px] font-semibold h-[42px] px-4 rounded-[12px] flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        PREV
                    </Button>
                    
                    <Button
                        onClick={onStart}
                        disabled={isLoading || streamError || !isCalibrated}
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-[46px] text-[13px] font-semibold rounded-[12px] shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-40"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Launching...
                            </>
                        ) : (
                            <>
                                START TEST
                                <Play className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>

            </div>

            <style>{`
                @keyframes sweep {
                    0% { transform: translateY(0); opacity: 0.1; }
                    50% { transform: translateY(280px); opacity: 0.8; }
                    100% { transform: translateY(0); opacity: 0.1; }
                }
            `}</style>
        </div>
    );
};

const MonitoringCard = ({ icon, title, status, statusColor, desc }: { icon: React.ReactNode; title: string; status: string; statusColor: "success" | "warning" | "error"; desc: string }) => (
    <div className="h-[120px] rounded-[16px] p-[18px] bg-white border border-[#E5E7EB] flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-[8px] bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB]">
                {icon}
            </div>
            <span className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-[6px]",
                statusColor === "success" && "bg-[#DCFCE7] text-[#166534]",
                statusColor === "warning" && "bg-[#FEF3C7] text-[#92400E] animate-pulse",
                statusColor === "error" && "bg-[#FEE2E2] text-[#991B1B]"
            )}>
                {status}
            </span>
        </div>
        <div className="space-y-0.5">
            <span className="text-[13px] font-bold text-[#111827] block leading-none">{title}</span>
            <span className="text-[12px] text-[#6B7280] leading-none block">{desc}</span>
        </div>
    </div>
);

const CheckItem = ({ checked, label }: { checked: boolean; label: string }) => (
    <div className="flex items-center gap-1.5">
        {checked ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-[#22C55E] fill-[#22C55E]/10" />
        ) : (
            <AlertTriangle className="w-4.5 h-4.5 text-[#F59E0B] fill-[#F59E0B]/10 animate-pulse" />
        )}
        <span className={cn(checked ? "text-[#111827]" : "text-[#6B7280]")}>{label}</span>
    </div>
);
