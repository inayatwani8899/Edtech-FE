import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGradeStore } from "@/store/gradeStore";
import {
    Save,
    Loader2,
    Sparkles,
    GraduationCap,
    Layers,
    ArrowLeft,
    CheckCircle2,
    Activity,
    Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const defaultFormData = {
    gradeName: "",
    description: "",
    isActive: true,
};

export const GradeForm: React.FC<{ gradeId?: string }> = ({ gradeId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualGradeId = gradeId || paramId;

    const isViewMode = window.location.pathname.includes("/view/");

    const {
        loading,
        currentGrade,
        fetchGradeById,
        createGrade,
        updateGrade,
        clearCurrentGrade,
    } = useGradeStore();

    useEffect(() => {
        if (actualGradeId) {
            fetchGradeById(actualGradeId);
            setIsEditMode(true);
        } else {
            clearCurrentGrade();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualGradeId, fetchGradeById, clearCurrentGrade]);

    useEffect(() => {
        if (currentGrade && isEditMode) {
            setFormData({
                gradeName: currentGrade.gradeName,
                description: currentGrade.description ?? "",
                isActive: currentGrade.isActive !== false,
            });
        }
    }, [currentGrade, isEditMode]);

    const handleChange = (name: string, value: unknown) => {
        if (isViewMode) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.gradeName.trim() || formData.gradeName.length < 2) {
            toast.error("Grade name must be at least 2 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewMode) return;
        if (!validateForm()) return;

        try {
            if (isEditMode && actualGradeId) {
                await updateGrade(actualGradeId, formData);
                toast.success("Grade updated successfully.");
            } else {
                await createGrade(formData);
                toast.success("Grade created successfully.");
            }
            setTimeout(() => navigate("/manage/grades"), 800);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(msg || "Failed to save grade. Please try again.");
        }
    };

    if (loading && isEditMode && !currentGrade) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse" />
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Grade...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3 pt-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/manage/grades")}
                            className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-slate-50 border border-slate-100 transition-colors"
                            aria-label="Back to grades list"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {isViewMode ? "Grade Details" : isEditMode ? "Edit Grade" : "New Grade"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Academic Structure Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/manage/grades")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            {isViewMode ? "Back" : "Cancel"}
                        </Button>
                        {!isViewMode && (
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                            >
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                {isEditMode ? "Save Changes" : "Create Grade"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT — Status card */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-400 to-violet-600" />
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <GraduationCap className="h-8 w-8 text-indigo-400" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.gradeName || "Unnamed Grade"}
                                </h2>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                                    Academic Grade
                                </Badge>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${formData.isActive ? "bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-500/5" : "bg-slate-50 border-slate-100"}`}>
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Status</span>
                                        <div className="flex items-center justify-center gap-2">
                                            {formData.isActive
                                                ? <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                : <Activity className="h-3 w-3 text-slate-300" />}
                                            <span className={`text-[10px] font-black uppercase ${formData.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                {formData.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Visibility</Label>
                                    <div
                                        className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer"
                                        onClick={() => !isViewMode && handleChange("isActive", !formData.isActive)}
                                    >
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Active</span>
                                        <Switch
                                            disabled={isViewMode}
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => handleChange("isActive", checked)}
                                            className="data-[state=checked]:bg-indigo-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT — Form fields */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden h-full">
                            <div className="px-4 py-2.5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Settings2 className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Grade Information</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ready</span>
                                </div>
                            </div>
                            <CardContent className="p-4 space-y-4">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-3.5">
                                    {/* Grade Name */}
                                    <div className="space-y-1">
                                        <Label htmlFor="gradeName" className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-1">
                                            Grade Name <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="relative group">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input
                                                disabled={isViewMode}
                                                id="gradeName"
                                                name="gradeName"
                                                value={formData.gradeName}
                                                onChange={(e) => handleChange("gradeName", e.target.value)}
                                                className="h-8 pl-8 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-lg font-bold text-xs transition-all shadow-sm"
                                                placeholder="e.g. Grade 10, Class XII, Foundation Level"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <Label htmlFor="gradeDescription" className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                                            Description <span className="text-slate-300 text-[8px] font-medium normal-case">(optional)</span>
                                        </Label>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-4 top-3.5 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <Textarea
                                                disabled={isViewMode}
                                                id="gradeDescription"
                                                name="description"
                                                value={formData.description}
                                                onChange={(e) => handleChange("description", e.target.value)}
                                                className="w-full min-h-[90px] pl-10 bg-slate-50/50 border-slate-200/50 rounded-xl p-3 text-xs font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-sm"
                                                placeholder="Describe the academic level, expected competencies, or any notes..."
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Save strip for edit mode */}
                        {isEditMode && !isViewMode && (
                            <div className="mt-6 p-4 rounded-3xl bg-indigo-600 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20 group animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Layers className="h-5 w-5 text-indigo-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Save Grade Changes</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Changes will apply globally</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                                >
                                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Update Grade"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16" />
        </div>
    );
};

export default GradeForm;
