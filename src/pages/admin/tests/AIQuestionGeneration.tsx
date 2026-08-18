import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Sparkles, 
    Loader2, 
    ArrowLeft, 
    BrainCircuit, 
    Zap, 
    Activity, 
    CheckCircle2, 
    Shield, 
    Hash,
    Layers,
    Type,
    Save,
    Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTestStore } from "@/store/testStore";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const AIQuestionGeneration: React.FC = () => {
    const navigate = useNavigate();
    const { createAITest, loading } = useTestStore();

    const [questionType, setQuestionType] = useState("");
    const [grade, setGrade] = useState("");
    const [stream, setStream] = useState("");
    const [generation_count, setGenerationCount] = useState("5");

    const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "undergraduate", "graduate", "postgraduate", "phd", "postdoc"];
    const streamOptions = ["Science", "Commerce", "Arts", "General"];
    const questionTypeOptions = ["Aptitude", "Cognitive Ability", "Psychometric", "Reasoning"];

    const validateForm = () => {
        if (!questionType || !grade || !stream) {
            toast.error("All synthesis parameters must be defined");
            return false;
        }
        if (parseInt(generation_count, 10) < 1) {
            toast.error("Generation volume must be positive");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const aiPayload = {
            questionType,
            grade,
            stream,
            generation_count: parseInt(generation_count, 10),
        };

        try {
            await createAITest(aiPayload as any);
            toast.success("Neural matrix synthesis complete");
            setTimeout(() => navigate("/manage/tests"), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Synthesis rejection: System error");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/tests")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                Neural Synthesis
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI Question Generation Protocol</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => navigate("/manage/tests")} className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-8 px-4 rounded-lg uppercase tracking-wider">
                            Abort
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white font-bold text-[10px] h-8 px-5 rounded-lg shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-wider">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                            Run Synthesis
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                    {/* LEFT COLUMN: SYNTHESIS SUMMARY */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-20 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                            </div>
                            <CardContent className="px-5 pb-6 -mt-10 relative z-10 text-center">
                                <div className="h-20 w-20 rounded-[2rem] bg-white p-1.5 shadow-xl border border-slate-50 mx-auto mb-4">
                                    <div className="h-full w-full rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <BrainCircuit className="h-10 w-10 text-indigo-400" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-black text-slate-900 truncate px-2 mb-1">
                                    {questionType || "Unit Stream"}
                                </h2>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[8px] mb-6 border-none">
                                    Neural Matrix Initialization
                                </Badge>

                                <div className="space-y-3 pt-6 border-t border-slate-50 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Protocol Registry</Label>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Grade Logic</span>
                                                <span className="text-xs font-black text-slate-700">{grade || "Pending"}</span>
                                            </div>
                                            <CheckCircle2 className={`h-4 w-4 ${grade ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Network Stream</span>
                                                <span className="text-xs font-black text-slate-700">{stream || "Pending"}</span>
                                            </div>
                                            <Layers className={`h-4 w-4 ${stream ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-5 bg-indigo-900 rounded-[2rem] text-white shadow-xl shadow-indigo-900/20 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-xs font-black tracking-tight leading-none uppercase">Neural Guard</h4>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                                System validation ensures all synthesized units adhere to educational standards and difficulty curves mapped to the target registry.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SYNTHESIS MATRIX */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-slate-900 rounded-[2.5rem] overflow-hidden text-white relative h-full">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                            
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                                            <Settings2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight">Synthesis Configuration Matrix</h3>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Define neural targeting parameters</p>
                                        </div>
                                    </div>
                                    <div className="sm:ml-auto px-3 py-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl self-start sm:self-auto">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] font-black tracking-widest text-white uppercase">Protocol V4</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-slate-900">
                                        <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Question Archetype</Label>
                                        <Select value={questionType} onValueChange={setQuestionType}>
                                            <SelectTrigger className="h-9 bg-white/5 border-white/10 rounded-xl px-4 text-white font-bold text-xs hover:bg-white/10 transition-colors">
                                                <SelectValue placeholder="Identify Archetype..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {questionTypeOptions.map((type) => (
                                                    <SelectItem key={type} value={type} className="font-bold">{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Generation Volume</Label>
                                        <div className="relative group">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <Input 
                                                type="number"
                                                value={generation_count}
                                                onChange={(e) => setGenerationCount(e.target.value)}
                                                className="h-9 pl-9 bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500 transition-all rounded-xl text-xs font-black text-white"
                                                min="1" max="500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-slate-900">
                                        <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Target (Grade)</Label>
                                        <Select value={grade} onValueChange={setGrade}>
                                            <SelectTrigger className="h-9 bg-white/5 border-white/10 rounded-xl px-4 text-white font-bold text-xs hover:bg-white/10 transition-colors">
                                                <SelectValue placeholder="Academic Stratum..." />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999] max-h-[220px] overflow-y-auto rounded-xl">
                                                {gradeOptions.map((g) => (
                                                    <SelectItem key={g} value={g} className="font-bold">
                                                        Grade {g}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5 text-slate-900">
                                        <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Discipline Network (Stream)</Label>
                                        <Select value={stream} onValueChange={setStream}>
                                            <SelectTrigger className="h-9 bg-white/5 border-white/10 rounded-xl px-4 text-white font-bold text-xs hover:bg-white/10 transition-colors">
                                                <SelectValue placeholder="Focus Network..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {streamOptions.map((s) => (
                                                    <SelectItem key={s} value={s} className="font-bold">{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                                                <Activity className="h-5 w-5 text-indigo-400 animate-pulse" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight leading-none text-white mb-1">Synthesis Readiness</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural weights mapped for generation</p>
                                            </div>
                                        </div>
                                        <Button onClick={handleSubmit} disabled={loading} className="w-full md:w-auto h-8 px-6 rounded-lg bg-white text-slate-900 font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Zap className="h-3.5 w-3.5 mr-2 text-yellow-500 fill-yellow-500" />}
                                            Run Synthesis
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};
