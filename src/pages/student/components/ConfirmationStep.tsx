import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Play, BrainCircuit, Eye, Sparkles,
    Fingerprint, ArrowLeft, Loader2, ShieldCheck, CameraOff,
    Focus, MessageSquare, Zap, ArrowRight
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

    useEffect(() => {
        async function enableCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 160, height: 160, facingMode: "user" }
                });
                if (mediaStreamRef) mediaStreamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                setStreamError(true);
            }
        }
        enableCamera();
        return () => {
            // We NO LONGER stop tracks here because the parent (useTestLogic) 
            // manages the stream lifecycle and will stop it when the test completes
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [mediaStreamRef]);

    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">

            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">


                {/* Header - Minimal height to ensure visibility of footer */}
                {/* Header - Stacks camera on mobile if needed or keeps it compact */}
                <div className="bg-slate-900 px-5 md:px-6 py-4 text-white flex flex-row items-center justify-between shrink-0 gap-4">
                    <div className="flex flex-col min-w-0">
                        <span className="text-blue-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest font-sans opacity-70">Module 03 // Biometric Setup</span>
                        <h1 className="text-lg md:text-2xl font-black tracking-tight font-sans leading-tight">
                            Psychometric <br className="block md:hidden" /> Validation
                        </h1>
                    </div>
-
                    {/* Camera Preview - Compact */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl border border-white/10 overflow-hidden bg-slate-800 relative flex items-center justify-center">
                            {streamError ? (
                                <CameraOff className="w-4 h-4 md:w-5 md:h-5 text-red-500/50" />
                            ) : (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                    <div className="absolute inset-0 w-full h-0.5 bg-emerald-400/20 opacity-30 animate-[scan_2.5s_linear_infinite]" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content - Compacted for visibility */}
                <div className="p-5 flex-1 space-y-5 flex flex-col justify-center overflow-hidden">

                    {/* Status Grid */}
                    {/* Status Grid - Partial wrap on mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <FeatureBadge icon={<Eye className="w-4 h-4" />} label="Gaze" data="Live Sync" />
                        <FeatureBadge icon={<MessageSquare className="w-4 h-4" />} label="Sentiment" data="Calibrated" />
                        <FeatureBadge icon={<Sparkles className="w-4 h-4 md:hidden lg:block" />} label="Logic" data="Monitoring" className="col-span-2 md:col-span-1" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Essential Protocol */}
                        <div className="space-y-2">
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                Validation Checks
                            </h3>
                            <div className="space-y-2">
                                <ProtocolItem title="Maintain Gaze" desc="Focus on the interface." icon={<Focus className="w-3.5 h-3.5" />} />
                                <ProtocolItem title="Environmental Link" desc="Active background scan." icon={<Zap className="w-3.5 h-3.5" />} />
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center text-center">
                            <BrainCircuit className="w-5 h-5 text-blue-600 mb-2 mx-auto opacity-50" />
                            <h4 className="text-[10px] font-black text-slate-800 mb-0.5">Note</h4>
                            <p className="text-[10px] text-slate-500 leading-tight">
                                "Minimum movement recommended for calibration."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer - Crucial Buttons */}
                {/* Footer - Crucial Buttons */}
                <div className="px-5 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 gap-3 font-sans">
                    <Button onClick={onBack} variant="ghost" className="text-slate-500 text-[10px] h-10 px-4 font-black hover:bg-slate-200 transition-all rounded-lg">
                        <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                        PREV
                    </Button>

                    <Button
                        onClick={onStart}
                        disabled={isLoading || streamError}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 h-11 text-[10px] font-black rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        START TEST
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>




            <style>{`
                @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
            `}</style>
        </div>
    );
};


const FeatureBadge = ({ icon, label, data }: any) => (

    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center group hover:bg-slate-100 transition-colors">
        <div className="flex justify-center mb-2 text-blue-600 group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-slate-800">{data}</p>
    </div>
);




const ProtocolItem = ({ title, desc, icon }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all group">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 mb-0.5">{title}</span>
            <span className="text-[11px] text-slate-500 leading-tight font-medium">{desc}</span>
        </div>
    </div>
);


