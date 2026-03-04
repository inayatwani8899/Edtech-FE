import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Play, BrainCircuit, Eye, Sparkles,
    Fingerprint, ArrowLeft, Loader2, ShieldCheck, CameraOff,
    Focus, MessageSquare
} from "lucide-react";

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
}

export const ConfirmationStep = ({
    currentTest,
    onStart,
    onBack,
    isLoading,
    stepNumber
}: ConfirmationStepProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [streamError, setStreamError] = useState(false);

    useEffect(() => {
        async function enableCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 160, height: 160, facingMode: "user" }
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                setStreamError(true);
            }
        }
        enableCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="h-[100dvh] w-full bg-slate-50 flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden font-sans">

            {/* Progress Line */}
            <div className="mb-3 flex justify-center gap-2 shrink-0">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1 rounded-full transition-all duration-500 ${s <= stepNumber ? "w-10 bg-blue-600" : "w-4 bg-slate-200"}`} />
                ))}
            </div>

            <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
                        <div className="relative mb-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <BrainCircuit className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 tracking-tight">Syncing Neural Models...</p>
                    </div>
                )}

                {/* Header with Camera & AI Persona */}
                <div className="bg-slate-900 px-6 py-5 text-white flex flex-col items-center shrink-0 relative overflow-hidden">

                    {/* AI Persona Bubble */}
                    <div className="absolute top-4 right-4 animate-bounce duration-[3000ms]">
                        <div className="relative bg-blue-600 text-[9px] font-bold px-3 py-1.5 rounded-full rounded-tr-none shadow-lg border border-blue-400/30">
                            I'm ready when you are!
                            <div className="absolute -bottom-1 right-0 w-2 h-2 bg-blue-600 rotate-45" />
                        </div>
                    </div>

                    <div className="relative z-10 mb-3">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-blue-500/50 overflow-hidden bg-slate-800 relative flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                            {streamError ? (
                                <CameraOff className="w-6 h-6 text-red-400" />
                            ) : (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                    <div className="absolute inset-0 w-full h-0.5 bg-emerald-400/40 opacity-60 animate-[scan_2.5s_linear_infinite]" />
                                    <div className="absolute inset-0 m-auto w-16 h-16 border border-emerald-400/30 rounded-full animate-ping" />
                                </>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 px-2 py-0.5 rounded-full border border-slate-900 shadow-lg">
                            <span className="text-[7px] font-black tracking-tighter text-white">AI ACTIVE</span>
                        </div>
                    </div>

                    <h1 className="text-lg font-bold tracking-tight">Psychometric Validation</h1>
                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-80 flex items-center gap-1.5">
                        <Focus className="w-3 h-3" /> Secure Behavioral Link
                    </p>
                </div>

                {/* Content Body */}
                <div className="p-4 md:p-6 flex-1 overflow-y-auto min-h-0 space-y-5 custom-scrollbar">

                    <div className="grid grid-cols-3 gap-2">
                        <FeatureBadge icon={<Eye className="w-3.5 h-3.5" />} label="Gaze" value="Live" />
                        <FeatureBadge icon={<MessageSquare className="w-3.5 h-3.5" />} label="Sentiment" value="Enabled" />
                        <FeatureBadge icon={<Sparkles className="w-3.5 h-3.5" />} label="Logic" value="Tracking" />
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <BrainCircuit className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-slate-800 mb-0.5">A Note from your AI Proctor</h4>
                            <p className="text-[10px] text-slate-600 leading-relaxed italic">
                                "I'll be observing your decision-making patterns. There are no wrong answers—simply be yourself and maintain focus on the screen."
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Session Protocol</h3>
                        <div className="grid grid-cols-1 gap-1.5">
                            <ProtocolItem title="Cognitive Sync" desc="Avoid looking away from the camera during tasks." />
                            <ProtocolItem title="Environmental Integrity" desc="Background noise may affect your analysis score." />
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <Button onClick={onBack} variant="ghost" className="text-slate-500 text-[11px] h-8 px-4 font-medium hover:bg-slate-200/50 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Back
                    </Button>

                    <Button
                        onClick={onStart}
                        disabled={isLoading || streamError}
                        className="bg-slate-900 hover:bg-black text-white px-8 h-10 text-[11px] font-extrabold rounded-xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
                    >
                        CONFIRM & START
                    </Button>
                </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-4 text-center max-w-[240px] leading-tight">
                Your biometric data is encrypted and used solely for this psychometric evaluation.
            </p>

            <style>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
        </div>
    );
};

const FeatureBadge = ({ icon, label, value }: any) => (
    <div className="bg-white border border-slate-100 p-2 rounded-xl shadow-sm text-center">
        <div className="flex justify-center mb-1 text-blue-600">{icon}</div>
        <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-[10px] font-extrabold text-slate-800">{value}</p>
    </div>
);

const ProtocolItem = ({ title, desc }: any) => (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-800 leading-none mb-1">{title}</span>
            <span className="text-[9px] text-slate-500 italic">{desc}</span>
        </div>
    </div>
);