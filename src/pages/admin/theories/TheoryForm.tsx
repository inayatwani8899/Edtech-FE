import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePsychometricTheoryStore } from "@/store/psychometricTheoryStore";
import { useCategoryStore } from "@/store/categoryStore";
import { 
    Save, 
    X, 
    BookOpen, 
    AlertCircle, 
    Loader2, 
    Sparkles, 
    Tag, 
    Layers,
    ArrowLeft,
    Shield,
    CheckCircle2,
    Activity,
    Settings2,
    Brain,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface TheoryFormProps {
    theoryId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    isModal?: boolean;
}

const defaultFormData = {
    theoryName: "",
    description: "",
    categoryId: "",
    isActive: true,
};

export const TheoryForm: React.FC<TheoryFormProps> = ({ theoryId, onSuccess, onCancel, isModal = false }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState<{ theoryName?: string; description?: string; categoryId?: string }>({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualTheoryId = theoryId || paramId;

    const isViewMode = window.location.pathname.includes("/view/");

    const {
        loading,
        currentTheory,
        fetchTheoryById,
        createTheory,
        updateTheory,
        clearCurrentTheory,
    } = usePsychometricTheoryStore();

    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        if (!categories || categories.length === 0) {
            fetchCategories();
        }
    }, [fetchCategories, categories]);

    useEffect(() => {
        if (actualTheoryId) {
            fetchTheoryById(actualTheoryId);
            setIsEditMode(true);
        } else {
            clearCurrentTheory();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualTheoryId, fetchTheoryById, clearCurrentTheory]);

    useEffect(() => {
        if (currentTheory && isEditMode) {
            setFormData({
                theoryName: currentTheory.theoryName || currentTheory.name || "",
                description: currentTheory.description || "",
                categoryId: currentTheory.categoryId ? String(currentTheory.categoryId) : "",
                isActive: currentTheory.isActive !== false,
            });
        }
    }, [currentTheory, isEditMode]);

    const handleChange = (name: string, value: any) => {
        if (isViewMode) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field-specific error on change
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: { theoryName?: string; description?: string; categoryId?: string } = {};

        const trimmedName = formData.theoryName.trim();
        if (!trimmedName) {
            newErrors.theoryName = "Theory name is required.";
        } else if (trimmedName.length < 2) {
            newErrors.theoryName = "Theory name must be at least 2 characters.";
        } else if (trimmedName.length > 100) {
            newErrors.theoryName = "Theory name cannot exceed 100 characters.";
        }

        const trimmedDesc = formData.description.trim();
        if (!trimmedDesc) {
            newErrors.description = "Theory description is required.";
        } else if (trimmedDesc.length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
        } else if (trimmedDesc.length > 2000) {
            newErrors.description = "Description cannot exceed 2000 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewMode || submitting) return;

        if (!validateForm()) {
            toast.error("Please resolve validation errors before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode && actualTheoryId) {
                await updateTheory(actualTheoryId, {
                    theoryName: formData.theoryName.trim(),
                    description: formData.description.trim(),
                    categoryId: formData.categoryId || undefined,
                    isActive: formData.isActive,
                });
                toast.success("Psychometric Theory updated successfully");
            } else {
                await createTheory({
                    theoryName: formData.theoryName.trim(),
                    description: formData.description.trim(),
                    categoryId: formData.categoryId || undefined,
                    isActive: formData.isActive,
                });
                toast.success("Psychometric Theory created successfully");
            }

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => navigate("/manage/theories"), 800);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to save Psychometric Theory";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/manage/theories");
        }
    };

    if (loading && isEditMode && !currentTheory) {
        return (
            <div className="min-h-[400px] w-full bg-[#FAFAFA] flex flex-col items-center justify-center py-16">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Psychometric Theory...</p>
            </div>
        );
    }

    return (
        <div className={isModal ? "w-full p-2" : "min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden"}>
            <div className={isModal ? "w-full" : "max-w-5xl mx-auto relative z-10 py-6"}>
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        {!isModal && (
                            <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={handleBack}>
                                <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {isViewMode ? "Theory Specification Details" : isEditMode ? "Edit Psychometric Theory" : "Create Psychometric Theory"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Psychometric Framework & Model Definition</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            {isViewMode ? "Back" : "Cancel"}
                        </Button>
                        {!isViewMode && (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || submitting}
                                className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                            >
                                {submitting || loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                {isEditMode ? "Update Theory" : "Save Theory"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: THEORY METADATA & STATUS */}
                    <div className="lg:col-span-4 space-y-4">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Brain className="h-8 w-8 text-indigo-600" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2" title={formData.theoryName}>
                                    {formData.theoryName || "Untitled Theory"}
                                </h2>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                                    Psychometric Module
                                </Badge>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${formData.isActive ? 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-500/5' : 'bg-slate-50 border-slate-100'}`}>
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Theory Status</span>
                                        <div className="flex items-center justify-center gap-2">
                                            {formData.isActive ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Activity className="h-3 w-3 text-slate-300" />}
                                            <span className={`text-[10px] font-black uppercase ${formData.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                {formData.isActive ? "Active in Assessments" : "Inactive / Draft"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Live Status Toggle</Label>
                                    <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => !isViewMode && handleChange("isActive", !formData.isActive)}>
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Assessment Visibility</span>
                                        <Switch 
                                            disabled={isViewMode}
                                            checked={formData.isActive} 
                                            onCheckedChange={(checked) => handleChange("isActive", checked)} 
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: THEORY FORM PARAMETERS */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden h-full">
                            <div className="px-4 py-2.5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Settings2 className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Theory Definition & Parameters</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validated Schema</span>
                                </div>
                            </div>
                            <CardContent className="p-4 space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    {/* Theory Name Field */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-1">
                                                Theory Name <span className="text-rose-500">*</span>
                                            </Label>
                                            <span className="text-[8px] text-slate-400 font-mono">
                                                {formData.theoryName.length}/100
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <Brain className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300 group-focus-within:text-indigo-650 transition-colors" />
                                            <Input 
                                                disabled={isViewMode}
                                                name="theoryName"
                                                value={formData.theoryName} 
                                                onChange={(e) => handleChange("theoryName", e.target.value)} 
                                                maxLength={100}
                                                className={`h-8 pl-8 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-lg font-bold text-xs transition-all shadow-sm ${errors.theoryName ? 'border-rose-400 bg-rose-50/20' : ''}`} 
                                                placeholder="e.g. Hollands theory (RIASEC)" 
                                            />
                                        </div>
                                        {errors.theoryName && (
                                            <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1 ml-1 mt-0.5">
                                                <AlertCircle className="h-3 w-3" /> {errors.theoryName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Associated Category Field */}
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-1">
                                            Category Mapping
                                        </Label>
                                        <Select
                                            disabled={isViewMode}
                                            value={formData.categoryId || "none"}
                                            onValueChange={(val) => handleChange("categoryId", val === "none" ? "" : val)}
                                        >
                                            <SelectTrigger className="h-8 bg-slate-50/50 border-slate-200/50 rounded-lg text-xs font-semibold text-slate-700 px-3">
                                                <SelectValue placeholder="Select Category (Optional)" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                                                <SelectItem value="none" className="text-xs">-- General / No Specific Category --</SelectItem>
                                                {categories?.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)} className="text-xs">
                                                        {cat.categoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.categoryId && (
                                            <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1 ml-1 mt-0.5">
                                                <AlertCircle className="h-3 w-3" /> {errors.categoryId}
                                            </p>
                                        )}
                                    </div>

                                    {/* Theory Description Field */}
                                    <div className="space-y-1 pt-0.5">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-1">
                                                Theory Description & Framework Details <span className="text-rose-500">*</span>
                                            </Label>
                                            <span className="text-[8px] text-slate-400 font-mono">
                                                {formData.description.length}/2000
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-650 transition-colors" />
                                            <Textarea 
                                                disabled={isViewMode}
                                                name="description" 
                                                value={formData.description} 
                                                onChange={(e) => handleChange("description", e.target.value)} 
                                                maxLength={2000}
                                                className={`w-full min-h-[90px] pl-9 bg-slate-50/50 border-slate-200/50 rounded-xl p-3 text-xs font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-sm ${errors.description ? 'border-rose-400 bg-rose-50/20' : ''}`} 
                                                placeholder="Provide detailed description of the theory (e.g. Hollands theory)..." 
                                            />
                                        </div>
                                        {errors.description && (
                                            <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1 ml-1 mt-0.5">
                                                <AlertCircle className="h-3 w-3" /> {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Footer Action */}
                                    {!isViewMode && (
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleBack}
                                                className="h-7 px-3 rounded-lg border-slate-200 text-[10px] font-semibold text-slate-650"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={loading || submitting}
                                                className="h-7 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-[10px] shadow-md transition-all flex items-center gap-1.5"
                                            >
                                                {submitting || loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                {isEditMode ? "Save Changes" : "Create Theory"}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheoryForm;
