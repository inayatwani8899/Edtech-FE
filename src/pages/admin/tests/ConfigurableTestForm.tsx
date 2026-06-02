import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { 
    Save, 
    X, 
    FileText, 
    Clock, 
    Globe, 
    Lock, 
    Loader2, 
    BookOpenCheck,
    ArrowLeft,
    Sparkles,
    Shield,
    Activity,
    Settings2,
    CheckCircle2,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const defaultFormData = {
    title: "",
    description: "",
    timeDuration: 0,
    isPublished: false,
};

export const ConfigurableTestForm: React.FC<{ testId?: string }> = ({ testId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualTestId = testId || paramId;

    const {
        createConfigurableTest,
        fetchTestById,
        updateTest,
        currentTest,
        loading,
        clearCurrentTest,
    } = useTestStore();

    useEffect(() => {
        if (actualTestId) {
            fetchTestById(actualTestId);
            setIsEditMode(true);
        } else {
            clearCurrentTest();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualTestId, fetchTestById, clearCurrentTest]);

    useEffect(() => {
        if (currentTest && isEditMode) {
            setFormData({
                title: currentTest.title,
                description: currentTest.description,
                timeDuration: currentTest.timeDuration,
                isPublished: currentTest.isPublished,
            });
        }
    }, [currentTest, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value =
            target.type === "checkbox"
                ? target.checked
                : target.type === "number"
                    ? parseFloat(target.value)
                    : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const validateForm = () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Assessment title and description are required");
            return false;
        }
        if (formData.timeDuration <= 0) {
            toast.error("Temporal limit must be greater than zero");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditMode && actualTestId) {
                await updateTest(actualTestId, formData);
                toast.success("Assessment definition synchronized");
            } else {
                await createConfigurableTest(formData);
                toast.success("New assessment engine initialized");
            }
            setTimeout(() => navigate("/manage/tests"), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Protocol synchronization failed");
        }
    };

    if (loading && isEditMode && !currentTest) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-orange-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Engine Definition...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/tests")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {isEditMode ? "Update Definition" : "Initialize Engine"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Configuration & Deployment</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/tests")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            Abort
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {isEditMode ? "Sync Definition" : "Initialize"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: STATUS & QUICK CONFIG */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Layers className="h-8 w-8 text-orange-300" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.title || "Engine Def"}
                                </h2>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                                    Assessment Engine
                                </Badge>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${formData.isPublished ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center font-black">Availability</span>
                                        <div className="flex items-center justify-center gap-2">
                                            {formData.isPublished ? <Globe className="h-3 w-3 text-emerald-500" /> : <Lock className="h-3 w-3 text-slate-300" />}
                                            <span className={`text-[10px] font-black uppercase ${formData.isPublished ? "text-emerald-600" : "text-slate-400"}`}>
                                                {formData.isPublished ? "Public Stream" : "Private Draft"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Quick Toggle</Label>
                                    <div 
                                        onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                        className={`h-9 w-full rounded-xl flex items-center justify-between px-3 cursor-pointer transition-all ${formData.isPublished ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">{formData.isPublished ? "Enabled" : "Disabled"}</span>
                                        {formData.isPublished ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: CORE CONFIGURATION */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Settings2 className="h-4 w-4 text-orange-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Engine Parameters & Metadata</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telemetry Active</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* PRIMARY CONFIG GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5 col-span-full">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Assessment Designation (Title)</Label>
                                        <div className="relative group">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                            <Input 
                                                name="title"
                                                value={formData.title} 
                                                onChange={handleChange} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl font-bold text-sm transition-all shadow-sm" 
                                                placeholder="e.g. Cognitive Aptitude Phase I" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[10px] font-bold text-orange-600 uppercase tracking-tight ml-1">Temporal Constraint (Minutes)</Label>
                                        <div className="relative group">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-orange-300 group-focus-within:text-orange-600 transition-colors" />
                                            <Input
                                                type="number"
                                                name="timeDuration"
                                                value={formData.timeDuration}
                                                onChange={handleChange}
                                                className="h-10 pl-9 bg-orange-50/30 border-orange-100/50 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl font-bold text-sm transition-all"
                                                placeholder="60"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Engine Draft Protection</Label>
                                        <div className="h-10 bg-slate-50/50 border border-slate-200/50 rounded-xl flex items-center justify-between px-4">
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">System Locked</span>
                                            <Shield className="h-3.5 w-3.5 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 col-span-full pt-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Contextual Protocol (Description)</Label>
                                        <div className="relative">
                                            <BookOpenCheck className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                                            <Textarea 
                                                name="description" 
                                                value={formData.description} 
                                                onChange={handleChange} 
                                                className="w-full min-h-[140px] pl-10 bg-slate-50/50 border-slate-200/50 rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-orange-100 shadow-sm" 
                                                placeholder="Outline the core objectives and scope of this assessment module..." 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SYNC STRIP */}
                        {isEditMode && (
                            <div className="mt-6 p-4 rounded-3xl bg-orange-600 text-white flex items-center justify-between shadow-xl shadow-orange-600/20 group animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5 text-orange-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Configuration Sync Active</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Definition valid for global deployment</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} className="bg-white text-orange-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                                    Push Definition
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};

