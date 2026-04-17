import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Plus, 
    Trash2, 
    Clock, 
    FileText, 
    List, 
    Sparkles, 
    Wand2, 
    Loader2, 
    ArrowLeft, 
    Activity, 
    CheckCircle2, 
    Shield, 
    Zap, 
    LayoutDashboard,
    Hash,
    Layers,
    Type,
    BrainCircuit,
    Settings2,
    Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTestStore } from '@/store/testStore';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const CreateTestPage: React.FC = () => {
    const navigate = useNavigate();
    const { createTest, createAITest, loading } = useTestStore();

    const [creationMethod, setCreationMethod] = useState<"manual" | "ai">("manual");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [questions, setQuestions] = useState([{
        text: "",
        options: ["", ""],
        correctAnswer: ""
    }]);

    // AI Generation Fields
    const [generation_count, setGenerationCount] = useState("5");
    const [grade, setGrade] = useState("");
    const [stream, setStream] = useState("");
    const [include_reverse_scored, setIncludeReverseScored] = useState(false);
    const [similarity_threshold, setSimilarityThreshold] = useState(0.8);

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex: number) => {
        if (questions[qIndex].options.length < 5) {
            const newQuestions = [...questions];
            newQuestions[qIndex].options.push("");
            setQuestions(newQuestions);
        }
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        if (questions[qIndex].options.length > 2) {
            const newQuestions = [...questions];
            newQuestions[qIndex].options.splice(oIndex, 1);
            if (newQuestions[qIndex].correctAnswer === oIndex.toString()) {
                newQuestions[qIndex].correctAnswer = "";
            } else if (newQuestions[qIndex].correctAnswer && parseInt(newQuestions[qIndex].correctAnswer) > oIndex) {
                newQuestions[qIndex].correctAnswer = (parseInt(newQuestions[qIndex].correctAnswer) - 1).toString();
            }
            setQuestions(newQuestions);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            text: "",
            options: ["", ""],
            correctAnswer: ""
        }]);
    };

    const removeQuestion = (qIndex: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, index) => index !== qIndex));
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            toast.error("Test designation (title) is required");
            return false;
        }

        if (creationMethod === "manual") {
            const isValid = questions.every(q => 
                q.text.trim() && 
                q.options.filter(opt => opt.trim()).length >= 2 && 
                q.correctAnswer !== ""
            );
            if (!isValid) {
                toast.error("All questions require text, 2+ options, and a correct key");
                return false;
            }
        } else {
            if (!grade) {
                toast.error("Neural targeting (grade) required for AI generation");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (creationMethod === "manual") {
                const manualPayload = {
                    title,
                    description,
                    duration: duration ? Number(duration) : null,
                    questions: questions.map(q => ({ ...q, correctAnswer: q.correctAnswer })),
                    creationMethod: "manual" as const
                };
                await createTest(manualPayload as any);
                toast.success("Strategic assessment published");
            } else {
                const aiPayload = {
                    title,
                    description,
                    creationMethod: "ai" as const,
                    duration: duration ? Number(duration) : null,
                    generation_count,
                    grade,
                    stream: stream || null,
                    include_reverse_scored,
                    similarity_threshold
                };
                await createAITest(aiPayload as any);
                toast.success("AI Synthesis complete: Test initialized");
            }
            setTimeout(() => navigate("/manage/tests"), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Deployment rejection: System error");
        }
    };

    const gradeOptions = ["7", "8", "9", "10", "11", "12"];
    const streamOptions = ["Science", "Commerce", "Arts", "General"];

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/tests")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                Assessment Orchestrator
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Creation & Distribution Protocol</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => navigate("/manage/tests")} className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-8 px-4 rounded-lg uppercase tracking-wider">
                            Abort
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white font-bold text-[10px] h-8 px-5 rounded-lg shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-wider">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {creationMethod === "manual" ? "Publish Assessment" : "Initialize Neural Sync"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                    {/* LEFT COLUMN: REGISTRY & STRATEGY */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-20 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
                            </div>
                            <CardContent className="px-5 pb-6 -mt-10 relative z-10 text-center">
                                <div className="h-20 w-20 rounded-[2rem] bg-white p-1.5 shadow-xl border border-slate-50 mx-auto mb-4 group-hover:scale-105 transition-transform">
                                    <div className="h-full w-full rounded-2xl bg-slate-50 flex items-center justify-center">
                                        {creationMethod === "manual" ? <FileText className="h-10 w-10 text-cyan-400" /> : <BrainCircuit className="h-10 w-10 text-purple-400" />}
                                    </div>
                                </div>
                                <h2 className="text-lg font-black text-slate-900 truncate px-2 mb-1">
                                    {title || "New Assessment"}
                                </h2>
                                <Badge variant="secondary" className={`font-black uppercase tracking-widest text-[8px] mb-6 border-none ${creationMethod === 'manual' ? 'bg-cyan-50 text-cyan-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {creationMethod === 'manual' ? "Structural Creation" : "Neural Synthesis"}
                                </Badge>

                                <div className="space-y-3 pt-6 border-t border-slate-50 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Strategy Registry</Label>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Time Logic</span>
                                                <span className="text-xs font-black text-slate-700">{duration ? `${duration}m` : "Unlimited"}</span>
                                            </div>
                                            <Clock className="h-4 w-4 text-slate-300" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Question Pool</span>
                                                <span className="text-xs font-black text-slate-700">{creationMethod === 'manual' ? questions.length : generation_count} Units</span>
                                            </div>
                                            <Layers className="h-4 w-4 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CREATION METHOD SWITCHER */}
                        <Card className="border-none shadow-elegant bg-slate-900 rounded-3xl p-5 border border-slate-100/10 text-white">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Initialization Logic</Label>
                            <RadioGroup
                                value={creationMethod}
                                onValueChange={(value: "manual" | "ai") => setCreationMethod(value)}
                                className="grid grid-cols-1 gap-3"
                            >
                                <div className="relative group">
                                    <RadioGroupItem value="manual" id="reg-manual" className="sr-only" />
                                    <Label
                                        htmlFor="reg-manual"
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${creationMethod === 'manual' ? 'bg-white/10 border-cyan-500/50' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className={`p-2 rounded-xl backdrop-blur-md ${creationMethod === 'manual' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black leading-none">Manual</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Granular Build</p>
                                        </div>
                                        {creationMethod === 'manual' && <CheckCircle2 className="h-3 w-3 text-cyan-400 ml-auto" />}
                                    </Label>
                                </div>

                                <div className="relative group">
                                    <RadioGroupItem value="ai" id="reg-ai" className="sr-only" />
                                    <Label
                                        htmlFor="reg-ai"
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${creationMethod === 'ai' ? 'bg-white/10 border-purple-500/50' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className={`p-2 rounded-xl backdrop-blur-md ${creationMethod === 'ai' ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black leading-none">Neural</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">AI Synthesis</p>
                                        </div>
                                        {creationMethod === 'ai' && <CheckCircle2 className="h-3 w-3 text-purple-400 ml-auto" />}
                                    </Label>
                                </div>
                            </RadioGroup>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: OPERATIONAL SURFACE */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* CORE IDENTITY */}
                        <Card className="border-none shadow-elegant bg-white rounded-[2.5rem] border border-slate-100/50 overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-slate-800" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Base Assessment Manifest</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Standby</span>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-8 space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Strategic Title (Designation)</Label>
                                        <div className="relative group">
                                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                            <Input 
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="h-12 pl-12 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-cyan-100 rounded-[1.25rem] font-bold text-base transition-all shadow-sm"
                                                placeholder="e.g. Cognitive Dynamics Assessment"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Temporal Constraint (Mins)</Label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                            <Input 
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                className="h-12 pl-12 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-cyan-100 rounded-[1.25rem] font-black text-base transition-all shadow-sm"
                                                placeholder="Unlimited"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Operational Context (Description)</Label>
                                        <div className="relative group">
                                            <Activity className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                            <Textarea 
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full min-h-[120px] pl-12 bg-slate-50/50 border-slate-200/50 rounded-[1.5rem] p-4 text-sm font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-cyan-100 shadow-sm"
                                                placeholder="Describe the assessment objectives and candidate expectations..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI NEURAL SETUP */}
                        {creationMethod === "ai" && (
                            <Card className="border-none shadow-premium bg-slate-900 rounded-[2.5rem] overflow-hidden text-white relative animate-in zoom-in-95 duration-500 mb-12">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"></div>
                                
                                <CardContent className="p-10 relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <BrainCircuit className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight">Neural Synthesis Configuration</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">AI-Powered Question Generation Matrix</p>
                                        </div>
                                        <div className="ml-auto px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                                            <div className="flex items-center gap-3">
                                                <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-black tracking-widest text-white uppercase">V4.0 Engine</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Synthesis Count</Label>
                                            <div className="relative group">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-purple-400" />
                                                <Input 
                                                    type="number"
                                                    value={generation_count}
                                                    onChange={(e) => setGenerationCount(e.target.value)}
                                                    className="h-12 pl-12 bg-white/5 border-white/10 focus:bg-white/10 focus:border-purple-500 transition-all rounded-[1.25rem] text-lg font-black text-white"
                                                    min="1" max="500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-slate-900">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Neural Target (Grade)</Label>
                                            <Select value={grade} onValueChange={setGrade}>
                                                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-[1.25rem] px-5 text-white font-black text-sm hover:bg-white/10 transition-colors">
                                                    <SelectValue placeholder="Select Target..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    {gradeOptions.map((g) => (
                                                        <SelectItem key={g} value={g} className="font-bold">Grade {g}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 text-slate-900">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Discipline Stream</Label>
                                            <Select value={stream} onValueChange={setStream}>
                                                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-[1.25rem] px-5 text-white font-black text-sm hover:bg-white/10 transition-colors">
                                                    <SelectValue placeholder="Neural Stream..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    {streamOptions.map((s) => (
                                                        <SelectItem key={s} value={s} className="font-bold">{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Similarity Control Matrix</Label>
                                            <Badge className="bg-purple-500/20 text-purple-300 border-none font-bold text-[9px] uppercase tracking-widest px-3">Precision: {similarity_threshold}</Badge>
                                        </div>
                                        <div className="space-y-4">
                                            <Input
                                                type="range"
                                                min="0.1"
                                                max="1"
                                                step="0.1"
                                                value={similarity_threshold}
                                                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                                                className="w-full accent-purple-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                <span>Broad Synthesis</span>
                                                <span>Precision Duplication Guard</span>
                                                <span>Identical Lock</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIncludeReverseScored(!include_reverse_scored)}>
                                            <div className={`h-6 w-11 rounded-full transition-all duration-300 relative ${include_reverse_scored ? 'bg-purple-500' : 'bg-slate-700'}`}>
                                                <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-all duration-300 ${include_reverse_scored ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight leading-none">Reverse Scored Protocol</p>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Injected contrast logic</p>
                                            </div>
                                        </div>
                                        <Button onClick={handleSubmit} disabled={loading} className="bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest h-10 px-8 rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-white/5">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />}
                                            Run Synthesis
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* MANUAL QUESTION ENGINE */}
                        {creationMethod === "manual" && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                                            {questions.length}
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Question Repository</h3>
                                    </div>
                                    <Button onClick={addQuestion} className="bg-white text-slate-900 border border-slate-200 shadow-sm font-black text-[9px] uppercase tracking-widest h-8 px-4 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
                                        <Plus className="h-3.5 w-3.5 mr-2 text-cyan-500" /> New Unit
                                    </Button>
                                </div>

                                {questions.map((q, qIndex) => (
                                    <Card key={qIndex} className="border-none shadow-premium bg-white rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-100/50">
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 font-black text-base">
                                                        {qIndex + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-slate-800 tracking-tight leading-none">Unit {qIndex + 1}</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assessment Segment</p>
                                                    </div>
                                                </div>
                                                {questions.length > 1 && (
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => removeQuestion(qIndex)}
                                                        className="h-10 w-10 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Question Content</Label>
                                                    <div className="relative group">
                                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-cyan-500" />
                                                        <Input 
                                                            value={q.text}
                                                            onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                                                            className="h-12 pl-12 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-cyan-100 rounded-[1.25rem] font-bold text-sm"
                                                            placeholder="Enter question text..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Response Options (Min 2)</Label>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">Target Key Required</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className={`relative flex items-center gap-3 p-1.5 rounded-2xl border transition-all duration-300 ${q.correctAnswer === oIndex.toString() ? 'bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-500/5' : 'bg-slate-50/50 border-slate-200/50 hover:bg-white hover:border-slate-200 hover:shadow-md'}`}>
                                                                <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-xs ${q.correctAnswer === oIndex.toString() ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-400 font-mono'}`}>
                                                                    {String.fromCharCode(65 + oIndex)}
                                                                </div>
                                                                <Input 
                                                                    value={opt}
                                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                    className="flex-grow h-10 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-sm text-slate-700"
                                                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}...`}
                                                                />
                                                                <div className="flex items-center gap-1.5 pr-2">
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleQuestionChange(qIndex, "correctAnswer", oIndex.toString())}
                                                                        className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${q.correctAnswer === oIndex.toString() ? 'bg-emerald-200 text-emerald-700' : 'bg-white/50 text-slate-300 hover:text-emerald-500'}`}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                    </button>
                                                                    {q.options.length > 2 && (
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 transition-all hover:bg-white"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        
                                                        {q.options.length < 5 && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => addOption(qIndex)}
                                                                className="h-full min-h-[52px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all bg-slate-50/30 hover:bg-white group"
                                                            >
                                                                <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Add Segment</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <Button 
                                    onClick={addQuestion} 
                                    className="w-full h-20 border-2 border-dashed border-slate-200/60 rounded-[2.5rem] bg-white text-slate-400 hover:border-cyan-300 hover:text-cyan-600 transition-all group flex flex-col items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 group-hover:scale-110 transition-all">
                                        <Plus className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Insert Strategic Unit</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* STICKY BOTTOM SYNC STRIP */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 duration-700">
                <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-slate-900/40">
                    <div className="flex items-center gap-4 pl-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${creationMethod === 'manual' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                            <Activity className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white tracking-tight leading-none mb-1">Deployment Readiness</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol validated for execution</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate("/manage/tests")} className="text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-2xl">
                            Abort
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className={`h-12 px-10 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-cyan-500/20 transition-all active:scale-95 ${creationMethod === 'manual' ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Publish Global
                        </Button>
                    </div>
                </div>
            </div>

            <div className="h-32"></div>
        </div>
    );
};

export default CreateTestPage;